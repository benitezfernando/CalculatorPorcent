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
    var texto = str.trim();
    if (texto === '') return NaN;
    if (texto.indexOf(',') !== -1) {
      // hay coma: cualquier punto previo es separador de miles
      texto = texto.replace(/\./g, '').replace(',', '.');
    } else if (/^-?\d{1,3}(\.\d{3})+$/.test(texto)) {
      // solo puntos, agrupados de a 3 dígitos (ej "1.500", "1.234.567"): separador de miles
      texto = texto.replace(/\./g, '');
    }
    return Number(texto);
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
