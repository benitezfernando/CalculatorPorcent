(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.PorcentCalc = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function parseNumeroLocal(str) {
    if (typeof str !== 'string') return NaN;
    var normalizado = str.trim().replace(',', '.');
    if (normalizado === '') return NaN;
    return Number(normalizado);
  }

  function formatNumeroLocal(num) {
    if (typeof num !== 'number' || !Number.isFinite(num)) return '';
    var redondeado = Math.round((num + Number.EPSILON) * 100) / 100;
    var texto = redondeado.toFixed(2).replace(/\.?0+$/, '');
    return texto.replace('.', ',');
  }

  function calcularCantidad(porcentaje, total) {
    return (total * porcentaje) / 100;
  }

  function calcularTotal(cantidad, porcentaje) {
    return (cantidad * 100) / porcentaje;
  }

  function calcularPorcentaje(cantidad, total) {
    return (cantidad * 100) / total;
  }

  return {
    parseNumeroLocal: parseNumeroLocal,
    formatNumeroLocal: formatNumeroLocal,
    calcularCantidad: calcularCantidad,
    calcularTotal: calcularTotal,
    calcularPorcentaje: calcularPorcentaje
  };
});
