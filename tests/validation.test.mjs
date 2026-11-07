import test from 'node:test';
import assert from 'node:assert/strict';

import {
  birthDateMessage,
  calculateAge,
  cleanText,
  countWords,
  getMinimumYear,
  inChargeMessage,
  isValidCUIL,
  isValidDNI,
  isValidEmail,
  isValidFullName,
  isValidPhone,
  parseIsoDate,
  validateForm,
  yearMessage,
} from '../assets/js/validation.js';

// Fecha de referencia fija: 7 de noviembre de 2026.
const REFERENCE = new Date(2026, 10, 7);

const completeStudent = {
  fullName: 'Gómez, María de los Ángeles',
  cuil: '27123456789',
  dni: '45123456',
  birthDate: '2008-03-14',
  birthPlace: 'Río Grande',
  nationality: 'Argentina',
  address: 'Av. San Martín 1234',
  locality: 'Río Grande',
  province: 'Tierra del Fuego, Antártida e Islas del Atlántico Sur',
  country: 'Argentina',
  email: 'maria.gomez@example.com',
  phone: '+54 9 2964 412345',
  year: '2027',
  division: 'A',
};

const completeTutor = {
  fullName: 'Gómez, Carlos Alberto',
  dni: '20123456',
  address: 'Av. San Martín 1234',
  locality: 'Río Grande',
  phone: '+54 9 2964 555555',
  email: 'carlos.gomez@example.com',
  relationship: 'Padre',
  inCharge: 'si',
  maritalStatus: 'Casado',
  nationality: 'Argentino',
};

const completeFather = {
  include: true,
  fullName: 'Gómez, Carlos Alberto',
  dni: '20123456',
  phone: '+54 9 2964 555555',
  inCharge: 'si',
  maritalStatus: 'Casado',
  nationality: 'Argentino',
};

const completeMother = {
  include: true,
  fullName: 'Pérez, Ana María',
  dni: '27123456',
  phone: '+54 9 2964 666666',
  inCharge: 'no',
  maritalStatus: 'Casada',
  nationality: 'Argentina',
};

function buildData(overrides = {}) {
  return {
    student: { ...completeStudent, ...(overrides.student ?? {}) },
    tutor: { ...completeTutor, ...(overrides.tutor ?? {}) },
    father: { include: false, ...(overrides.father ?? {}) },
    mother: { include: false, ...(overrides.mother ?? {}) },
  };
}

test('cleanText normaliza espacios y conserva tildes', () => {
  assert.equal(cleanText('  María   de   los Ángeles  '), 'María de los Ángeles');
  assert.equal(cleanText('Río Grande'), 'Río Grande');
  assert.equal(cleanText(''), '');
  assert.equal(cleanText(null), '');
});

test('cuenta palabras reales', () => {
  assert.equal(countWords('Gómez, María de los Ángeles'), 5);
  assert.equal(countWords('  '), 0);
});

test('apellido y nombres exige al menos dos palabras y rechaza números', () => {
  assert.equal(isValidFullName('Gómez, María de los Ángeles'), true);
  assert.equal(isValidFullName('O’Connor Ana'), true);
  assert.equal(isValidFullName('Pérez'), false);
  assert.equal(isValidFullName('123 456'), false);
  assert.equal(isValidFullName('   '), false);
  assert.equal(isValidFullName('María 2'), false);
});

test('DNI exige solo dígitos y un mínimo de 7', () => {
  assert.equal(isValidDNI('1234567'), true);
  assert.equal(isValidDNI('12345678'), true);
  assert.equal(isValidDNI('123456'), false);
  assert.equal(isValidDNI('12.345.678'), false);
  assert.equal(isValidDNI(''), false);
});

test('CUIL exige exactamente 11 dígitos', () => {
  assert.equal(isValidCUIL('27123456789'), true);
  assert.equal(isValidCUIL('2712345678'), false);
  assert.equal(isValidCUIL('27-12345678-9'), false);
  assert.equal(isValidCUIL(''), false);
});

test('teléfono admite dígitos, espacios, guiones y prefijo internacional', () => {
  assert.equal(isValidPhone('+54 9 2964 412345'), true);
  assert.equal(isValidPhone('2964-412345'), true);
  assert.equal(isValidPhone('12345'), false);
  assert.equal(isValidPhone('llamar 123456'), false);
  assert.equal(isValidPhone(''), false);
});

test('correo electrónico aplica validación básica', () => {
  assert.equal(isValidEmail('maria.gomez@example.com'), true);
  assert.equal(isValidEmail('a@b.com'), true);
  assert.equal(isValidEmail('a@b'), false);
  assert.equal(isValidEmail('a b@example.com'), false);
  assert.equal(isValidEmail(''), false);
});

test('parseIsoDate rechaza fechas imposibles', () => {
  assert.ok(parseIsoDate('2014-11-07') instanceof Date);
  assert.equal(parseIsoDate('2014-02-30'), null);
  assert.equal(parseIsoDate('07/11/2014'), null);
  assert.equal(parseIsoDate(''), null);
});

test('la edad se calcula contemplando el cumpleaños', () => {
  assert.equal(calculateAge(new Date(2014, 10, 7), REFERENCE), 12);
  assert.equal(calculateAge(new Date(2014, 10, 8), REFERENCE), 11);
  assert.equal(calculateAge(new Date(2014, 10, 6), REFERENCE), 12);
});

test('fecha de nacimiento: no futura y edad mínima de 12', () => {
  assert.equal(birthDateMessage('2014-11-07', REFERENCE), '');
  assert.equal(birthDateMessage('2014-11-08', REFERENCE), 'La edad mínima para la preinscripción es de 12 años.');
  assert.equal(
    birthDateMessage('2030-01-01', REFERENCE),
    'La fecha de nacimiento no puede ser posterior a hoy.',
  );
  assert.equal(birthDateMessage('2014-02-30', REFERENCE), 'Ingresá una fecha de nacimiento válida.');
  assert.equal(birthDateMessage('', REFERENCE), 'Ingresá la fecha de nacimiento.');
});

test('el año mínimo se calcula dinámicamente', () => {
  assert.equal(getMinimumYear(REFERENCE), 2027);
  assert.equal(getMinimumYear(new Date(2030, 0, 1)), 2031);
  assert.equal(yearMessage('2027', REFERENCE), '');
  assert.equal(
    yearMessage('2026', REFERENCE),
    'El año de preinscripción debe ser 2027 o posterior.',
  );
  assert.equal(yearMessage('27', REFERENCE), 'Ingresá un año válido de cuatro dígitos.');
  assert.equal(yearMessage('', REFERENCE), 'Ingresá el año de preinscripción.');
});

test('A cargo solo admite Sí o No', () => {
  assert.equal(inChargeMessage('si'), '');
  assert.equal(inChargeMessage('no'), '');
  assert.equal(inChargeMessage(''), 'Seleccioná Sí o No.');
  assert.equal(inChargeMessage('sin-especificar'), 'Seleccioná Sí o No.');
});

test('un formulario completo sin secciones opcionales es válido', () => {
  const result = validateForm(buildData(), REFERENCE);
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
});

test('las secciones del padre y de la madre se omiten cuando no están incluidas', () => {
  const data = buildData({
    father: { include: false, fullName: 'texto inválido 123', dni: 'x', phone: 'x', inCharge: '', maritalStatus: '', nationality: '' },
    mother: { include: false, fullName: '', dni: '', phone: '', inCharge: '', maritalStatus: '', nationality: '' },
  });
  const result = validateForm(data, REFERENCE);
  assert.equal(result.valid, true);
  assert.equal(result.errors['father.fullName'], undefined);
  assert.equal(result.errors['mother.fullName'], undefined);
});

test('el padre incluido exige todos sus campos', () => {
  const data = buildData({
    father: {
      include: true,
      fullName: '',
      dni: '',
      phone: '',
      inCharge: '',
      maritalStatus: '',
      nationality: '',
    },
  });
  const result = validateForm(data, REFERENCE);
  assert.equal(result.valid, false);
  assert.ok(result.errors['father.fullName']);
  assert.ok(result.errors['father.dni']);
  assert.ok(result.errors['father.phone']);
  assert.ok(result.errors['father.inCharge']);
  assert.ok(result.errors['father.maritalStatus']);
  assert.ok(result.errors['father.nationality']);
});

test('la madre incluida y completa es válida', () => {
  const result = validateForm(buildData({ mother: completeMother }), REFERENCE);
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
});

test('los errores del alumno se identifican por campo', () => {
  const data = buildData({
    student: {
      fullName: '',
      cuil: '123',
      dni: '12',
      birthDate: '2016-01-01',
      birthPlace: '   ',
      nationality: '',
      address: '',
      locality: '',
      province: '',
      country: '',
      email: 'correo',
      phone: '12',
      year: '2020',
      division: '',
    },
  });
  const result = validateForm(data, REFERENCE);
  assert.equal(result.valid, false);
  assert.ok(result.errors['student.fullName']);
  assert.ok(result.errors['student.cuil']);
  assert.ok(result.errors['student.dni']);
  assert.ok(result.errors['student.birthDate']);
  assert.ok(result.errors['student.birthPlace']);
  assert.ok(result.errors['student.email']);
  assert.ok(result.errors['student.phone']);
  assert.ok(result.errors['student.year']);
  assert.ok(result.errors['student.division']);
});

test('el tutor exige A cargo y el resto de sus campos', () => {
  const data = buildData({
    tutor: {
      fullName: 'Gómez, Carlos',
      dni: '20123456',
      address: 'Av. San Martín 1234',
      locality: 'Río Grande',
      phone: '2964 555555',
      email: 'carlos@example.com',
      relationship: '',
      inCharge: '',
      maritalStatus: '',
      nationality: '',
    },
  });
  const result = validateForm(data, REFERENCE);
  assert.equal(result.valid, false);
  assert.ok(result.errors['tutor.relationship']);
  assert.ok(result.errors['tutor.inCharge']);
  assert.ok(result.errors['tutor.maritalStatus']);
  assert.ok(result.errors['tutor.nationality']);
});
