'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  parseNumeroLocal,
  formatNumeroLocal,
  calcularCantidad,
  calcularTotal,
  calcularPorcentaje
} = require('./calc.js');

test('parseNumeroLocal - coma decimal', () => {
  assert.equal(parseNumeroLocal('12,5'), 12.5);
});

test('parseNumeroLocal - punto decimal', () => {
  assert.equal(parseNumeroLocal('12.5'), 12.5);
});

test('parseNumeroLocal - vacio devuelve NaN', () => {
  assert.ok(Number.isNaN(parseNumeroLocal('')));
});

test('parseNumeroLocal - no numerico devuelve NaN', () => {
  assert.ok(Number.isNaN(parseNumeroLocal('abc')));
});

test('parseNumeroLocal - con espacios', () => {
  assert.equal(parseNumeroLocal('  7,5  '), 7.5);
});

test('parseNumeroLocal - punto como separador de miles', () => {
  assert.equal(parseNumeroLocal('1.500'), 1500);
});

test('parseNumeroLocal - miles con coma decimal', () => {
  assert.equal(parseNumeroLocal('1.234,56'), 1234.56);
});

test('parseNumeroLocal - punto decimal simple sigue funcionando', () => {
  assert.equal(parseNumeroLocal('12.5'), 12.5);
});

test('formatNumeroLocal - entero sin decimales', () => {
  assert.equal(formatNumeroLocal(7), '7');
});

test('formatNumeroLocal - decimal con coma', () => {
  assert.equal(formatNumeroLocal(12.5), '12,5');
});

test('formatNumeroLocal - redondea a 2 decimales', () => {
  assert.equal(formatNumeroLocal(1 / 3), '0,33');
});

test('formatNumeroLocal - sin ceros de mas', () => {
  assert.equal(formatNumeroLocal(100), '100');
  assert.equal(formatNumeroLocal(0), '0');
});

test('formatNumeroLocal - no finito devuelve vacio', () => {
  assert.equal(formatNumeroLocal(Infinity), '');
  assert.equal(formatNumeroLocal(NaN), '');
});

test('calcularCantidad - caso base (70% de 10 es 7)', () => {
  assert.equal(calcularCantidad(70, 10), 7);
});

test('calcularCantidad - porcentaje negativo', () => {
  assert.equal(calcularCantidad(-10, 50), -5);
});

test('calcularTotal - caso base (4 es 40% de 10)', () => {
  assert.equal(calcularTotal(4, 40), 10);
});

test('calcularTotal - division por cero da Infinity', () => {
  assert.equal(calcularTotal(4, 0), Infinity);
});

test('calcularPorcentaje - caso base (3 es 30% de 10)', () => {
  assert.equal(calcularPorcentaje(3, 10), 30);
});

test('calcularPorcentaje - division por cero no es finito', () => {
  assert.ok(!Number.isFinite(calcularPorcentaje(3, 0)));
});
