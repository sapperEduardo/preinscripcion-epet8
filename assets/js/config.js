/**
 * Configuración central de la aplicación.
 *
 * INSTITUTIONAL_URL queda vacía hasta que se defina la dirección definitiva
 * del sitio institucional. Mientras esté vacía, el enlace del pie no se muestra.
 */
export const INSTITUTIONAL_URL = '';

/** Plantilla institucional original. Es un recurso estático del mismo origen. */
export const PDF_TEMPLATE_URL = 'documents/Solicitud_de_Preinscripcion_EPET_8_Digital.pdf';

/** Nombre del archivo descargado. No incluye datos personales. */
export const PDF_FILENAME = 'Solicitud_Preinscripcion_EPET8.pdf';

/** Reglas de validación compartidas. */
export const MIN_AGE = 12;
export const MIN_NAME_WORDS = 2;
export const MIN_DNI_DIGITS = 7;
export const CUIL_DIGITS = 11;
export const MIN_PHONE_DIGITS = 6;

/** Tipografía del documento PDF. */
export const PDF_FONT_SIZE = 10;
export const PDF_MIN_FONT_SIZE = 6.5;
