/**
 * Mapa de campos de la plantilla institucional.
 *
 * Coordenadas en puntos PDF (1 pt = 1/72 de pulgada), origen en la esquina
 * inferior izquierda. `page` es el índice de página base cero.
 *
 * Los valores de `y` corresponden a la línea base del texto que se dibuja
 * sobre la línea de guiones bajos original. Para los campos cuya etiqueta
 * está arriba de la línea, la línea base se elevó 1,60 pt respecto de la
 * línea de la plantilla para que los descendentes no la toquen.
 *
 * Este mapeo surge de la inspección real del PDF: matrices de texto de
 * pdf.js y análisis de píxeles del documento renderizado a 3x.
 */

export const TEMPLATE_PAGE_COUNT = 2;
export const TEMPLATE_WIDTH = 595.32;
export const TEMPLATE_HEIGHT = 841.92;
export const TEMPLATE_SIZE_TOLERANCE = 1;

export const TEXT_FIELDS = [
  {
    path: 'student.fullName',
    page: 0,
    x: 56.04,
    y: 600.82,
    maxWidth: 200.36,
    label: 'Apellido y nombres del/de la alumno/a',
  },
  {
    path: 'student.cuil',
    page: 0,
    x: 331.0,
    y: 605.88,
    maxWidth: 189.0,
    label: 'CUIL del/de la alumno/a',
  },
  {
    path: 'student.dni',
    page: 0,
    x: 56.04,
    y: 564.64,
    maxWidth: 233.73,
    label: 'DNI del/de la alumno/a',
  },
  {
    path: 'student.birthPlace',
    page: 0,
    x: 56.04,
    y: 515.2,
    maxWidth: 205.94,
    label: 'Lugar de nacimiento del/de la alumno/a',
  },
  {
    path: 'student.nationality',
    page: 0,
    x: 366.0,
    y: 520.26,
    maxWidth: 150.0,
    label: 'Nacionalidad del/de la alumno/a',
  },
  {
    path: 'student.address',
    page: 0,
    x: 56.04,
    y: 479.02,
    maxWidth: 172.52,
    label: 'Domicilio del/de la alumno/a',
  },
  {
    path: 'student.locality',
    page: 0,
    x: 351.0,
    y: 484.02,
    maxWidth: 166.67,
    label: 'Localidad del/de la alumno/a',
  },
  {
    path: 'student.province',
    page: 0,
    x: 56.04,
    y: 442.84,
    maxWidth: 233.73,
    label: 'Provincia del/de la alumno/a',
  },
  {
    path: 'student.country',
    page: 0,
    x: 328.0,
    y: 441.24,
    maxWidth: 194.67,
    label: 'País del/de la alumno/a',
  },
  {
    path: 'student.email',
    page: 0,
    x: 56.04,
    y: 393.4,
    maxWidth: 217.04,
    label: 'Correo electrónico del/de la alumno/a',
  },
  {
    path: 'student.phone',
    page: 0,
    x: 400.0,
    y: 398.4,
    maxWidth: 105.67,
    label: 'Teléfono móvil del/de la alumno/a',
  },
  {
    path: 'student.year',
    page: 0,
    x: 56.04,
    y: 357.22,
    maxWidth: 133.57,
    label: 'Año de preinscripción',
  },
  {
    path: 'student.division',
    page: 0,
    x: 343.0,
    y: 362.22,
    maxWidth: 172.33,
    label: 'División',
  },

  {
    path: 'tutor.fullName',
    page: 0,
    x: 56.04,
    y: 293.74,
    maxWidth: 200.36,
    label: 'Apellido y nombres del tutor o responsable legal',
  },
  {
    path: 'tutor.dni',
    page: 0,
    x: 350.0,
    y: 298.74,
    maxWidth: 167.0,
    label: 'DNI del tutor o responsable legal',
  },
  {
    path: 'tutor.address',
    page: 0,
    x: 56.04,
    y: 257.5,
    maxWidth: 172.52,
    label: 'Domicilio del tutor o responsable legal',
  },
  {
    path: 'tutor.locality',
    page: 0,
    x: 351.0,
    y: 262.56,
    maxWidth: 166.67,
    label: 'Localidad del tutor o responsable legal',
  },
  {
    path: 'tutor.phone',
    page: 0,
    x: 56.04,
    y: 221.32,
    maxWidth: 233.73,
    label: 'Teléfono del tutor o responsable legal',
  },
  {
    path: 'tutor.email',
    page: 0,
    x: 389.67,
    y: 219.72,
    maxWidth: 128.0,
    label: 'Correo electrónico del tutor o responsable legal',
  },
  {
    path: 'tutor.relationship',
    page: 0,
    x: 56.04,
    y: 171.88,
    maxWidth: 167.0,
    label: 'Relación con el/la alumno/a',
  },
  {
    path: 'tutor.maritalStatus',
    page: 0,
    x: 56.04,
    y: 135.7,
    maxWidth: 233.73,
    label: 'Estado civil del tutor o responsable legal',
  },
  {
    path: 'tutor.nationality',
    page: 0,
    x: 366.0,
    y: 134.1,
    maxWidth: 150.0,
    label: 'Nacionalidad del tutor o responsable legal',
  },

  {
    path: 'father.fullName',
    page: 0,
    x: 56.04,
    y: 58.96,
    maxWidth: 200.36,
    label: 'Apellido y nombres del padre',
  },
  {
    path: 'father.dni',
    page: 0,
    x: 350.0,
    y: 64.02,
    maxWidth: 167.0,
    label: 'DNI del padre',
  },
  {
    path: 'father.phone',
    page: 1,
    x: 56.04,
    y: 778.84,
    maxWidth: 233.73,
    label: 'Teléfono del padre',
  },
  {
    path: 'father.maritalStatus',
    page: 1,
    x: 56.04,
    y: 729.4,
    maxWidth: 233.73,
    label: 'Estado civil del padre',
  },
  {
    path: 'father.nationality',
    page: 1,
    x: 366.0,
    y: 727.8,
    maxWidth: 150.0,
    label: 'Nacionalidad del padre',
  },

  {
    path: 'mother.fullName',
    page: 1,
    x: 56.04,
    y: 652.72,
    maxWidth: 200.34,
    label: 'Apellido y nombres de la madre',
  },
  {
    path: 'mother.dni',
    page: 1,
    x: 350.0,
    y: 657.72,
    maxWidth: 167.0,
    label: 'DNI de la madre',
  },
  {
    path: 'mother.phone',
    page: 1,
    x: 56.04,
    y: 616.48,
    maxWidth: 233.73,
    label: 'Teléfono de la madre',
  },
  {
    path: 'mother.maritalStatus',
    page: 1,
    x: 56.04,
    y: 567.1,
    maxWidth: 233.73,
    label: 'Estado civil de la madre',
  },
  {
    path: 'mother.nationality',
    page: 1,
    x: 366.0,
    y: 565.5,
    maxWidth: 150.0,
    label: 'Nacionalidad de la madre',
  },
];

/**
 * La fecha de nacimiento se escribe en tres segmentos independientes.
 * Cada valor se centra en su segmento, respetando la línea original.
 */
export const BIRTH_DATE_FIELDS = {
  page: 0,
  y: 563.04,
  day: { x: 401.0, maxWidth: 22.33 },
  month: { x: 431.33, maxWidth: 22.67 },
  year: { x: 462.0, maxWidth: 33.67 },
};

/**
 * Casillas "A cargo". Cada casilla ocupa 7 x 7 pt. Se marcan con una X
 * vectorial, sin reemplazar ni tapar el cuadro original.
 */
export const CHECKBOXES = {
  tutor: {
    page: 0,
    si: { x0: 349.0, y0: 176.59, x1: 356.0, y1: 183.59 },
    no: { x0: 383.67, y0: 176.59, x1: 390.67, y1: 183.59 },
  },
  father: {
    page: 1,
    si: { x0: 349.0, y0: 776.92, x1: 356.0, y1: 783.92 },
    no: { x0: 383.67, y0: 776.92, x1: 390.67, y1: 783.92 },
  },
  mother: {
    page: 1,
    si: { x0: 349.0, y0: 614.59, x1: 356.0, y1: 621.59 },
    no: { x0: 383.67, y0: 614.59, x1: 390.67, y1: 621.59 },
  },
};

/** Devuelve el campo de texto asociado a una ruta de datos. */
export function getTextField(path) {
  return TEXT_FIELDS.find((field) => field.path === path) ?? null;
}
