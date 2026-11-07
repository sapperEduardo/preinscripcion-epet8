import { PDFDocument, StandardFonts, rgb } from '../vendor/pdf-lib.esm.min.js';
import {
  PDF_FONT_SIZE,
  PDF_MIN_FONT_SIZE,
  PDF_TEMPLATE_URL,
} from './config.js';
import {
  BIRTH_DATE_FIELDS,
  CHECKBOXES,
  TEMPLATE_HEIGHT,
  TEMPLATE_PAGE_COUNT,
  TEMPLATE_SIZE_TOLERANCE,
  TEMPLATE_WIDTH,
  TEXT_FIELDS,
} from './pdf-field-map.js';
import { cleanText, parseIsoDate } from './validation.js';

const BLACK = rgb(0, 0, 0);

const TEXT_REPLACEMENTS = new Map([
  ['\u2018', "'"],
  ['\u2019', "'"],
  ['\u201A', "'"],
  ['\u201B', "'"],
  ['\u201C', '"'],
  ['\u201D', '"'],
  ['\u201E', '"'],
  ['\u2013', '-'],
  ['\u2014', '-'],
  ['\u2212', '-'],
  ['\u2026', '...'],
]);

export class PdfGenerationError extends Error {
  constructor(message, { fieldPath = null, cause = null } = {}) {
    super(message);
    this.name = 'PdfGenerationError';
    this.fieldPath = fieldPath;
    if (cause) this.cause = cause;
  }
}

/** Normaliza el texto para la fuente estándar del PDF (WinAnsi). */
export function normalizePdfText(value) {
  let text = cleanText(value);
  for (const [from, to] of TEXT_REPLACEMENTS) {
    text = text.split(from).join(to);
  }
  return text;
}

function getValue(data, path) {
  return path.split('.').reduce((current, key) => current?.[key], data);
}

function sectionFromPath(path) {
  return String(path).split('.')[0];
}

function isOptionalSectionIncluded(data, section) {
  if (section !== 'father' && section !== 'mother') return true;
  return Boolean(data?.[section]?.include);
}

/**
 * Reduce el tamaño de fuente hasta que el texto entre en el ancho disponible.
 * Devuelve null si no entra ni siquiera en el tamaño mínimo.
 */
export function fitFontSize(text, font, maxWidth, startSize = PDF_FONT_SIZE, minSize = PDF_MIN_FONT_SIZE) {
  let size = startSize;
  while (size > minSize) {
    if (font.widthOfTextAtSize(text, size) <= maxWidth) return size;
    size = Math.max(minSize, Math.round((size - 0.25) * 100) / 100);
  }
  return font.widthOfTextAtSize(text, size) <= maxWidth ? size : null;
}

function drawFieldText(page, field, text, font) {
  const size = fitFontSize(text, font, field.maxWidth);
  if (size === null) {
    throw new PdfGenerationError(
      `El texto del campo "${field.label}" es demasiado largo para el espacio disponible. Acortalo para poder generar el documento.`,
      { fieldPath: field.path },
    );
  }

  try {
    page.drawText(text, {
      x: field.x,
      y: field.y,
      size,
      font,
      color: BLACK,
    });
  } catch (error) {
    throw new PdfGenerationError(
      `No se pudo escribir el campo "${field.label}" porque contiene caracteres no admitidos por el documento.`,
      { fieldPath: field.path, cause: error },
    );
  }
}

function drawCenteredText(page, text, segment, y, font) {
  const size = fitFontSize(text, font, segment.maxWidth);
  if (size === null) {
    throw new PdfGenerationError(
      'La fecha de nacimiento no se pudo ubicar dentro de la plantilla.',
      { fieldPath: 'student.birthDate' },
    );
  }
  const width = font.widthOfTextAtSize(text, size);
  page.drawText(text, {
    x: segment.x + (segment.maxWidth - width) / 2,
    y,
    size,
    font,
    color: BLACK,
  });
}

function drawCheckboxMark(page, box) {
  const inset = 1.1;
  const thickness = 0.8;
  page.drawLine({
    start: { x: box.x0 + inset, y: box.y0 + inset },
    end: { x: box.x1 - inset, y: box.y1 - inset },
    thickness,
    color: BLACK,
  });
  page.drawLine({
    start: { x: box.x0 + inset, y: box.y1 - inset },
    end: { x: box.x1 - inset, y: box.y0 + inset },
    thickness,
    color: BLACK,
  });
}

function assertTemplateIntegrity(pdf) {
  if (pdf.getPageCount() !== TEMPLATE_PAGE_COUNT) {
    throw new PdfGenerationError(
      'La plantilla del documento no tiene la cantidad de páginas esperada. No se generó el archivo.',
    );
  }

  for (const page of pdf.getPages()) {
    const { width, height } = page.getSize();
    if (
      Math.abs(width - TEMPLATE_WIDTH) > TEMPLATE_SIZE_TOLERANCE ||
      Math.abs(height - TEMPLATE_HEIGHT) > TEMPLATE_SIZE_TOLERANCE
    ) {
      throw new PdfGenerationError(
        'La plantilla del documento no tiene el tamaño A4 esperado. No se generó el archivo.',
      );
    }
  }
}

/**
 * Carga la plantilla original desde el sitio y superpone los datos.
 * Cada llamada parte de los bytes originales; nunca de un PDF ya generado.
 */
export async function generatePdf(data, { fetchImpl = globalThis.fetch } = {}) {
  if (typeof fetchImpl !== 'function') {
    throw new PdfGenerationError('El navegador no permite cargar la plantilla del documento.');
  }

  let response;
  try {
    response = await fetchImpl(PDF_TEMPLATE_URL, { cache: 'no-cache' });
  } catch (error) {
    throw new PdfGenerationError(
      'No se pudo cargar la plantilla del documento. Verificá tu conexión e intentá nuevamente.',
      { cause: error },
    );
  }

  if (!response.ok) {
    throw new PdfGenerationError(
      'No se pudo cargar la plantilla del documento. Verificá tu conexión e intentá nuevamente.',
    );
  }

  let pdf;
  try {
    const templateBytes = new Uint8Array(await response.arrayBuffer());
    pdf = await PDFDocument.load(templateBytes, { updateMetadata: false });
  } catch (error) {
    throw new PdfGenerationError(
      'La plantilla del documento no se pudo abrir. No se generó el archivo.',
      { cause: error },
    );
  }

  assertTemplateIntegrity(pdf);

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const pages = pdf.getPages();

  for (const field of TEXT_FIELDS) {
    const section = sectionFromPath(field.path);
    if (!isOptionalSectionIncluded(data, section)) continue;

    const text = normalizePdfText(getValue(data, field.path));
    if (!text) continue;

    drawFieldText(pages[field.page], field, text, font);
  }

  const birthDate = parseIsoDate(data?.student?.birthDate);
  if (birthDate) {
    const segments = {
      day: String(birthDate.getDate()).padStart(2, '0'),
      month: String(birthDate.getMonth() + 1).padStart(2, '0'),
      year: String(birthDate.getFullYear()),
    };
    const page = pages[BIRTH_DATE_FIELDS.page];
    drawCenteredText(page, segments.day, BIRTH_DATE_FIELDS.day, BIRTH_DATE_FIELDS.y, font);
    drawCenteredText(page, segments.month, BIRTH_DATE_FIELDS.month, BIRTH_DATE_FIELDS.y, font);
    drawCenteredText(page, segments.year, BIRTH_DATE_FIELDS.year, BIRTH_DATE_FIELDS.y, font);
  }

  for (const [section, boxes] of Object.entries(CHECKBOXES)) {
    if (!isOptionalSectionIncluded(data, section)) continue;
    const choice = data?.[section]?.inCharge;
    if (choice !== 'si' && choice !== 'no') continue;
    drawCheckboxMark(pages[boxes.page], boxes[choice]);
  }

  try {
    return await pdf.save();
  } catch (error) {
    throw new PdfGenerationError(
      'No se pudo generar el archivo PDF. Intentá nuevamente.',
      { cause: error },
    );
  }
}

/** Crea el enlace de descarga y libera el objeto URL al terminar. */
export function downloadPdf(bytes, filename) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
