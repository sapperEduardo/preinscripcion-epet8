import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

import {
  PDFDocument,
  StandardFonts,
  decodePDFRawStream,
} from '../assets/vendor/pdf-lib.esm.min.js';
import {
  fitFontSize,
  generatePdf,
  normalizePdfText,
  PdfGenerationError,
} from '../assets/js/pdf-generator.js';

const templateUrl = new URL(
  '../documents/Solicitud_de_Preinscripcion_EPET_8_Digital.pdf',
  import.meta.url,
);
const templateBytes = readFileSync(templateUrl);

// Huella de la plantilla institucional original. Si este valor cambia, el
// archivo de `documents/` fue reemplazado y debe revisarse el mapeo de campos.
const TEMPLATE_SHA256 =
  'DB12FBD50665EABF7682A3DFCAF78D2E4935047C9D55F788560632CA9C23EAA0';

function fakeFetch() {
  return Promise.resolve(
    new Response(templateBytes, {
      status: 200,
      headers: { 'content-type': 'application/pdf' },
    }),
  );
}

function completeData() {
  return {
    student: {
      fullName: 'Alumno Ejemplo',
      cuil: '27123456789',
      dni: '45123456',
      birthDate: '2008-03-14',
      birthPlace: 'Rio Grande',
      nationality: 'Argentina',
      address: 'Av. San Martin 1234',
      locality: 'Rio Grande',
      province: 'Tierra del Fuego',
      country: 'Argentina',
      email: 'alumno@example.com',
      phone: '+54 9 2964 412345',
      year: '2027',
      division: 'A',
    },
    tutor: {
      fullName: 'Tutor Ejemplo',
      dni: '20123456',
      address: 'Av. San Martin 1234',
      locality: 'Rio Grande',
      phone: '+54 9 2964 555555',
      email: 'tutor@example.com',
      relationship: 'Padre',
      inCharge: 'si',
      maritalStatus: 'Casado',
      nationality: 'Argentino',
    },
    father: {
      include: true,
      fullName: 'Padre Unico',
      dni: '20123456',
      phone: '+54 9 2964 555555',
      inCharge: 'no',
      maritalStatus: 'Casado',
      nationality: 'Argentino',
    },
    mother: {
      include: true,
      fullName: 'Madre Unica',
      dni: '27123456',
      phone: '+54 9 2964 666666',
      inCharge: 'si',
      maritalStatus: 'Casada',
      nationality: 'Argentina',
    },
  };
}

/** Concatena el contenido decodificado de todas las páginas del PDF. */
async function decodedContent(bytes) {
  const pdf = await PDFDocument.load(bytes, { updateMetadata: false });
  let content = '';

  for (const page of pdf.getPages()) {
    const contents = page.node.Contents();
    const streams = contents.asArray ? contents.asArray() : [contents];

    for (const reference of streams) {
      const stream = pdf.context.lookup(reference);
      if (!stream) continue;
      try {
        content += Buffer.from(decodePDFRawStream(stream).decode()).toString('latin1');
      } catch {
        // Algunos streams auxiliares no son contenido de página; se omiten.
      }
    }
  }

  return content;
}

/** PDF-lib escribe el texto de la fuente estándar como cadenas hexadecimales. */
function hexText(value) {
  return Buffer.from(value, 'latin1').toString('hex').toUpperCase();
}

test('la copia de la plantilla conserva la huella original', () => {
  const hash = createHash('sha256').update(templateBytes).digest('hex').toUpperCase();
  assert.equal(hash, TEMPLATE_SHA256);
});

test('el PDF completo conserva dos páginas A4 y contiene los datos', async () => {
  const bytes = await generatePdf(completeData(), { fetchImpl: fakeFetch });
  assert.equal(Buffer.from(bytes.slice(0, 5)).toString('latin1'), '%PDF-');

  const pdf = await PDFDocument.load(bytes);
  assert.equal(pdf.getPageCount(), 2);

  for (const page of pdf.getPages()) {
    const { width, height } = page.getSize();
    assert.ok(Math.abs(width - 595.32) <= 1, `ancho inesperado: ${width}`);
    assert.ok(Math.abs(height - 841.92) <= 1, `alto inesperado: ${height}`);
  }

  const content = await decodedContent(bytes);
  for (const value of ['Alumno Ejemplo', 'Tutor Ejemplo', 'Padre Unico', 'Madre Unica']) {
    assert.ok(content.includes(hexText(value)), `falta el texto: ${value}`);
  }
});

test('las secciones opcionales apagadas no escriben datos en el PDF', async () => {
  const data = completeData();
  data.father.include = false;
  data.mother.include = false;

  const bytes = await generatePdf(data, { fetchImpl: fakeFetch });
  const content = await decodedContent(bytes);

  assert.ok(content.includes(hexText('Alumno Ejemplo')));
  assert.ok(content.includes(hexText('Tutor Ejemplo')));
  assert.equal(content.includes(hexText('Padre Unico')), false);
  assert.equal(content.includes(hexText('Madre Unica')), false);
});

test('un valor que no entra ni al tamaño mínimo bloquea la generación', async () => {
  const data = completeData();
  data.father.include = false;
  data.mother.include = false;
  data.tutor.email = `${'a'.repeat(150)}@example.com`;

  await assert.rejects(
    () => generatePdf(data, { fetchImpl: fakeFetch }),
    (error) => {
      assert.ok(error instanceof PdfGenerationError);
      assert.equal(error.fieldPath, 'tutor.email');
      assert.match(error.message, /demasiado largo/);
      return true;
    },
  );
});

test('normalizePdfText adapta comillas y guiones a la fuente estándar', () => {
  assert.equal(
    normalizePdfText('“Río” — O’Connor…'),
    '"Río" - O\'Connor...',
  );
});

test('fitFontSize reduce el tamaño y devuelve null si no hay solución', async () => {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  assert.equal(fitFontSize('Texto corto', font, 1000), 10);

  const shrunk = fitFontSize('a'.repeat(20), font, 100);
  assert.ok(shrunk !== null && shrunk < 10 && shrunk >= 6.5);

  assert.equal(fitFontSize('a'.repeat(200), font, 10), null);
});
