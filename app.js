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

  var HISTORY_KEY = 'porcent-historial';
  var HISTORY_MAX = 10;

  var etiquetasModo = {
    cantidad: 'Cantidad',
    total: 'Total',
    porcentaje: 'Porcentaje'
  };

  function leerHistorial() {
    try {
      var raw = localStorage.getItem(HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function guardarHistorial(historial) {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(historial));
    } catch (e) {
      // localStorage no disponible (modo privado, cuota llena): se ignora
    }
  }

  function construirResumen(modo, valores, textoResultado) {
    if (modo === 'cantidad') {
      return calc.formatNumeroLocal(valores.porcentaje) + '% de ' + calc.formatNumeroLocal(valores.total) + ' es ' + textoResultado;
    }
    if (modo === 'total') {
      return calc.formatNumeroLocal(valores.cantidad) + ' es el ' + calc.formatNumeroLocal(valores.porcentaje) + '% de ' + textoResultado;
    }
    return calc.formatNumeroLocal(valores.cantidad) + ' es el ' + textoResultado + '% de ' + calc.formatNumeroLocal(valores.total);
  }

  var historyList = document.querySelector('[data-history-list]');
  var historyToggle = document.querySelector('[data-history-toggle]');
  var historyBody = document.querySelector('[data-history-body]');
  var historyClear = document.querySelector('[data-history-clear]');

  function renderizarHistorial() {
    var historial = leerHistorial();
    historyList.innerHTML = '';
    historial.forEach(function (entrada, indice) {
      var li = document.createElement('li');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'history-item';
      btn.dataset.historyIndex = String(indice);
      btn.textContent = etiquetasModo[entrada.modo] + ': ' + entrada.resumen;
      li.appendChild(btn);
      historyList.appendChild(li);
    });
  }

  function agregarAlHistorial(entrada) {
    var historial = leerHistorial();
    historial.unshift(entrada);
    if (historial.length > HISTORY_MAX) {
      historial = historial.slice(0, HISTORY_MAX);
    }
    guardarHistorial(historial);
    renderizarHistorial();
  }

  function confirmarCalculo(panel, modo) {
    var config = modos[modo];
    var valores = leerValores(panel, config.campos);
    var hayValor = config.campos.every(function (campo) {
      return !Number.isNaN(valores[campo]);
    });
    if (!hayValor) return;
    var resultado = config.calcular(valores);
    if (!Number.isFinite(resultado)) return;
    var textoResultado = calc.formatNumeroLocal(resultado);
    agregarAlHistorial({
      modo: modo,
      valores: valores,
      resumen: construirResumen(modo, valores, textoResultado)
    });
  }

  paneles.forEach(function (panel) {
    var modo = panel.dataset.modePanel;
    panel.querySelectorAll('.input').forEach(function (input) {
      input.addEventListener('blur', function () {
        confirmarCalculo(panel, modo);
      });
    });
  });

  historyToggle.addEventListener('click', function () {
    var expandido = historyToggle.getAttribute('aria-expanded') === 'true';
    historyToggle.setAttribute('aria-expanded', String(!expandido));
    historyBody.hidden = expandido;
  });

  historyClear.addEventListener('click', function () {
    guardarHistorial([]);
    renderizarHistorial();
  });

  historyList.addEventListener('click', function (evento) {
    var btn = evento.target.closest('[data-history-index]');
    if (!btn) return;
    var historial = leerHistorial();
    var entrada = historial[Number(btn.dataset.historyIndex)];
    if (!entrada) return;
    activarModo(entrada.modo);
    var panelDestino = document.querySelector('[data-mode-panel="' + entrada.modo + '"]');
    modos[entrada.modo].campos.forEach(function (campo) {
      var input = panelDestino.querySelector('[data-field="' + campo + '"]');
      input.value = calc.formatNumeroLocal(entrada.valores[campo]);
    });
    actualizarResultado(panelDestino, entrada.modo);
  });

  renderizarHistorial();
})();
