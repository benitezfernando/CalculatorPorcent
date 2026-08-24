(function () {
  'use strict';

  var calc = window.PorcentCalc;

  var modos = {
    cantidad: {
      campos: ['porcentaje', 'total'],
      calcular: function (valores) {
        return calc.calcularCantidad(valores.porcentaje, valores.total);
      }
    },
    total: {
      campos: ['cantidad', 'porcentaje'],
      calcular: function (valores) {
        return calc.calcularTotal(valores.cantidad, valores.porcentaje);
      }
    },
    porcentaje: {
      campos: ['cantidad', 'total'],
      calcular: function (valores) {
        return calc.calcularPorcentaje(valores.cantidad, valores.total);
      }
    }
  };

  var tabs = document.querySelectorAll('.tab');
  var paneles = document.querySelectorAll('.mode-panel');

  function activarModo(modo) {
    tabs.forEach(function (tab) {
      var activo = tab.dataset.mode === modo;
      tab.classList.toggle('active', activo);
      tab.setAttribute('aria-selected', String(activo));
    });
    paneles.forEach(function (panel) {
      panel.hidden = panel.dataset.modePanel !== modo;
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      activarModo(tab.dataset.mode);
    });
  });

  function leerValores(panel, campos) {
    var valores = {};
    campos.forEach(function (campo) {
      var input = panel.querySelector('[data-field="' + campo + '"]');
      valores[campo] = calc.parseNumeroLocal(input.value);
    });
    return valores;
  }

  function actualizarResultado(panel, modo) {
    var config = modos[modo];
    var valores = leerValores(panel, config.campos);
    var resultadoEl = panel.querySelector('[data-result]');

    var faltaValor = config.campos.some(function (campo) {
      return Number.isNaN(valores[campo]);
    });

    if (faltaValor) {
      resultadoEl.textContent = '—';
      resultadoEl.classList.remove('error');
      return;
    }

    var resultado = config.calcular(valores);

    if (!Number.isFinite(resultado)) {
      resultadoEl.textContent = 'Error';
      resultadoEl.classList.add('error');
      return;
    }

    resultadoEl.classList.remove('error');
    resultadoEl.textContent = calc.formatNumeroLocal(resultado);
  }

  paneles.forEach(function (panel) {
    var modo = panel.dataset.modePanel;
    panel.querySelectorAll('.input').forEach(function (input) {
      input.addEventListener('input', function () {
        actualizarResultado(panel, modo);
      });
    });
  });
})();
