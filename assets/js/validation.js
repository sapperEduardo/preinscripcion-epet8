import {
  CUIL_DIGITS,
  MIN_AGE,
  MIN_DNI_DIGITS,
  MIN_NAME_WORDS,
  MIN_PHONE_DIGITS,
} from './config.js';

/** Normaliza espacios y unicode sin alterar el contenido ingresado. */
export function cleanText(value) {
  return String(value ?? '')
    .normalize('NFC')
    .replace(/\s+/gu, ' ')
    .trim();
}

/** Cuenta palabras reales (con al menos una letra). */
export function countWords(value) {
  return cleanText(value)
    .split(/\s+/u)
    .filter((word) => /\p{L}/u.test(word)).length;
}

/**
 * Apellido y nombres: al menos un apellido y un nombre, sin dígitos
 * ni caracteres inválidos. Se admiten tildes, ñ, apóstrofes, guiones,
 * puntos y comas.
 */
export function isValidFullName(value) {
  const text = cleanText(value);
  if (!text) return false;
  if (!/^[\p{L}\p{M}\s'’\-.,]+$/u.test(text)) return false;
  return countWords(text) >= MIN_NAME_WORDS;
}

/** DNI: solo dígitos, con un mínimo de 7. */
export function isValidDNI(value) {
  const text = cleanText(value);
  return /^\d+$/.test(text) && text.length >= MIN_DNI_DIGITS;
}

/** CUIL: exactamente 11 dígitos numéricos. */
export function isValidCUIL(value) {
  const text = cleanText(value);
  return new RegExp(`^\\d{${CUIL_DIGITS}}$`).test(text);
}

/** Teléfono: dígitos, espacios, guiones y prefijo +. */
export function isValidPhone(value) {
  const text = cleanText(value);
  if (!/^\+?\d[\d\s-]*$/.test(text)) return false;
  const digits = text.replace(/\D/g, '');
  return digits.length >= MIN_PHONE_DIGITS;
}

/** Correo electrónico con validación básica de formato. */
export function isValidEmail(value) {
  const text = cleanText(value);
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(text);
}

/** Convierte una fecha ISO (YYYY-MM-DD) en Date local, o null si no es válida. */
export function parseIsoDate(value) {
  const text = cleanText(value);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

/** Edad cumplida a la fecha de referencia. */
export function calculateAge(birthDate, reference = new Date()) {
  let age = reference.getFullYear() - birthDate.getFullYear();
  const monthDiff = reference.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && reference.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age;
}

/** Fecha de hoy a las 00:00, para comparaciones por día. */
export function startOfToday(reference = new Date()) {
  return new Date(reference.getFullYear(), reference.getMonth(), reference.getDate());
}

/**
 * Fecha de nacimiento: válida, no futura y con edad mínima cumplida.
 * Devuelve un mensaje de error o cadena vacía.
 */
export function birthDateMessage(value, reference = new Date()) {
  const text = cleanText(value);
  if (!text) return 'Ingresá la fecha de nacimiento.';

  const date = parseIsoDate(text);
  if (!date) return 'Ingresá una fecha de nacimiento válida.';

  const today = startOfToday(reference);
  if (date.getTime() > today.getTime()) {
    return 'La fecha de nacimiento no puede ser posterior a hoy.';
  }
  if (calculateAge(date, reference) < MIN_AGE) {
    return `La edad mínima para la preinscripción es de ${MIN_AGE} años.`;
  }
  return '';
}

/** Año mínimo permitido: año calendario actual más uno. */
export function getMinimumYear(reference = new Date()) {
  return reference.getFullYear() + 1;
}

/** Año de preinscripción: entero de cuatro dígitos, no anterior al mínimo. */
export function yearMessage(value, reference = new Date()) {
  const text = cleanText(value);
  if (!text) return 'Ingresá el año de preinscripción.';
  if (!/^\d{4}$/.test(text)) return 'Ingresá un año válido de cuatro dígitos.';

  const minimum = getMinimumYear(reference);
  if (Number(text) < minimum) {
    return `El año de preinscripción debe ser ${minimum} o posterior.`;
  }
  return '';
}

/** Mensaje para un campo de texto obligatorio (domicilio, localidad, etc.). */
export function requiredTextMessage(value) {
  return cleanText(value) ? '' : 'Este campo es obligatorio.';
}

/** Mensaje para un campo de nombre completo obligatorio. */
export function fullNameMessage(value) {
  if (!cleanText(value)) return 'Ingresá el apellido y nombres.';
  if (!isValidFullName(value)) {
    return 'Ingresá al menos un apellido y un nombre, sin números ni símbolos inválidos.';
  }
  return '';
}

/** Mensaje para un DNI obligatorio. */
export function dniMessage(value) {
  if (!cleanText(value)) return 'Ingresá el DNI.';
  if (!isValidDNI(value)) {
    return `El DNI debe contener solo números, con un mínimo de ${MIN_DNI_DIGITS} dígitos.`;
  }
  return '';
}

/** Mensaje para un CUIL obligatorio. */
export function cuilMessage(value) {
  if (!cleanText(value)) return 'Ingresá el CUIL.';
  if (!isValidCUIL(value)) {
    return `El CUIL debe contener exactamente ${CUIL_DIGITS} dígitos numéricos.`;
  }
  return '';
}

/** Mensaje para un correo obligatorio. */
export function emailMessage(value) {
  if (!cleanText(value)) return 'Ingresá el correo electrónico.';
  if (!isValidEmail(value)) return 'Ingresá un correo electrónico válido.';
  return '';
}

/** Mensaje para un teléfono obligatorio. */
export function phoneMessage(value) {
  if (!cleanText(value)) return 'Ingresá el número de teléfono.';
  if (!isValidPhone(value)) {
    return 'Ingresá un teléfono válido. Podés usar números, espacios, guiones y el prefijo +.';
  }
  return '';
}

/** Mensaje para una selección Sí/No obligatoria. */
export function inChargeMessage(value) {
  return value === 'si' || value === 'no' ? '' : 'Seleccioná Sí o No.';
}

const OPTIONAL_SECTIONS = ['father', 'mother'];

/**
 * Valida el formulario completo.
 * Las secciones del padre y de la madre se omiten por completo cuando
 * su interruptor de inclusión está apagado.
 */
export function validateForm(data, reference = new Date()) {
  const errors = {};
  const add = (key, message) => {
    if (message) errors[key] = message;
  };

  const student = data?.student ?? {};
  add('student.fullName', fullNameMessage(student.fullName));
  add('student.cuil', cuilMessage(student.cuil));
  add('student.dni', dniMessage(student.dni));
  add('student.birthDate', birthDateMessage(student.birthDate, reference));
  add('student.birthPlace', requiredTextMessage(student.birthPlace));
  add('student.nationality', requiredTextMessage(student.nationality));
  add('student.address', requiredTextMessage(student.address));
  add('student.locality', requiredTextMessage(student.locality));
  add('student.province', requiredTextMessage(student.province));
  add('student.country', requiredTextMessage(student.country));
  add('student.email', emailMessage(student.email));
  add('student.phone', phoneMessage(student.phone));
  add('student.year', yearMessage(student.year, reference));
  add('student.division', requiredTextMessage(student.division));

  const tutor = data?.tutor ?? {};
  add('tutor.fullName', fullNameMessage(tutor.fullName));
  add('tutor.dni', dniMessage(tutor.dni));
  add('tutor.address', requiredTextMessage(tutor.address));
  add('tutor.locality', requiredTextMessage(tutor.locality));
  add('tutor.phone', phoneMessage(tutor.phone));
  add('tutor.email', emailMessage(tutor.email));
  add('tutor.relationship', requiredTextMessage(tutor.relationship));
  add('tutor.inCharge', inChargeMessage(tutor.inCharge));
  add('tutor.maritalStatus', requiredTextMessage(tutor.maritalStatus));
  add('tutor.nationality', requiredTextMessage(tutor.nationality));

  for (const section of OPTIONAL_SECTIONS) {
    const block = data?.[section] ?? {};
    if (!block.include) continue;

    add(`${section}.fullName`, fullNameMessage(block.fullName));
    add(`${section}.dni`, dniMessage(block.dni));
    add(`${section}.phone`, phoneMessage(block.phone));
    add(`${section}.inCharge`, inChargeMessage(block.inCharge));
    add(`${section}.maritalStatus`, requiredTextMessage(block.maritalStatus));
    add(`${section}.nationality`, requiredTextMessage(block.nationality));
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
