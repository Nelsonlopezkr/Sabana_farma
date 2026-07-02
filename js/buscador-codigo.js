/* ════════════════════════════════════════════════════════════════
   Droguerías Económicas — buscador-codigo.js
   ────────────────────────────────────────────────────────────────
   Herramienta interna: el funcionario escanea o digita el código de
   barras y obtiene el precio al instante.

   RENDIMIENTO (pensado para 10.000+ productos):
   El índice de códigos de barras se construye UNA sola vez al cargar
   la página (Map = búsqueda O(1)), nunca se recorre el catálogo
   completo en cada búsqueda.

   COMPATIBILIDAD DE DATOS:
   - Producto con un solo código (99% del catálogo actual): usa
     "codigoBarras" a nivel de producto. Cero cambios requeridos.
   - Producto con sabores/variantes que en la vida real tienen cada
     uno su propio código de barras físico: agrega opcionalmente
     "codigoBarras" DENTRO del objeto de la variante y este script lo
     detecta automáticamente, sin romper los productos que no lo usan.

     Ejemplo (100% opcional, no obligatorio):
     "variantes": [
       { "tipo": "Fresa", "precio": 10600, "imagen": "...",
         "codigoBarras": "7702057011111" },
       { "tipo": "Mora",  "precio": 10600, "imagen": "...",
         "codigoBarras": "7702057012222" }
     ]
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var inputEl     = document.getElementById('inputCodigo');
  var formEl      = document.getElementById('formBuscar');
  var resultadoEl = document.getElementById('resultado');
  var historialEl = document.getElementById('historial');

  var HIST_KEY = 'de_historial_codigos';
  var HIST_MAX = 8;

  /* ── 1. ÍNDICE — se construye una sola vez ── */
  var indiceBarras = new Map(); // codigo -> [{producto, variante|null}, ...]

  function construirIndice() {
    if (typeof CATALOGO === 'undefined') {
      console.error('CATALOGO no está cargado. Verifica que productos-data.js se cargue antes que este script.');
      return;
    }

    CATALOGO.forEach(function (p) {
      // Código a nivel de producto (comportamiento actual, sin cambios)
      if (p.codigoBarras) {
        agregarAlIndice(p.codigoBarras, p, null);
      }

      // Código a nivel de variante (opcional, nuevo — para sabores/aromas
      // que en la vida real traen un código distinto por presentación)
      if (Array.isArray(p.variantes)) {
        p.variantes.forEach(function (v) {
          if (v.codigoBarras) {
            agregarAlIndice(v.codigoBarras, p, v);
          }
        });
      }
    });

    console.log('[buscador-codigo] Índice listo:', indiceBarras.size, 'códigos únicos —', CATALOGO.length, 'productos.');
  }

  function agregarAlIndice(codigo, producto, variante) {
    var key = String(codigo).trim();
    if (!key) return;
    if (!indiceBarras.has(key)) indiceBarras.set(key, []);
    indiceBarras.get(key).push({ producto: producto, variante: variante });
  }

  /* ── 2. FORMATEO ── */
  function cop(n) {
    return '$' + Math.round(n).toLocaleString('es-CO');
  }

  function estadoStock(existencias) {
    if (existencias === undefined || existencias === null) return { clase: 'ok', texto: 'Disponible' };
    if (existencias <= 0) return { clase: 'agotado', texto: 'Agotado' };
    if (existencias <= 5) return { clase: 'bajo', texto: existencias + ' und. — bajo' };
    return { clase: 'ok', texto: 'Disponible' };
  }

  /* ── 3. FEEDBACK (vibración + beep, sin archivos externos) ── */
  function feedback(exito) {
    if (navigator.vibrate) navigator.vibrate(exito ? 60 : [40, 60, 40]);
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.frequency.value = exito ? 880 : 220;
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + (exito ? 0.09 : 0.16));
    } catch (e) { /* silencioso si el navegador bloquea audio sin interacción previa */ }
  }

  /* ── 4. RENDER DE RESULTADO ── */
  function renderProducto(producto, varianteForzada) {
    var meta = CAT_VISUAL_LOCAL(producto.categoria);
    var vari = varianteForzada || (producto.variantes && producto.variantes[0]) || null;

    var imgSrc = (vari && vari.imagen) || '';
    var precio = vari ? vari.precio : 0;
    var precioLabel = vari ? vari.tipo : '';
    var stock = estadoStock(producto.existencias);

    var variantesHTML = '';
    if (producto.variantes && producto.variantes.length > 1) {
      var tituloSel = (producto.selector && producto.selector.titulo) || 'Referencias disponibles';
      variantesHTML = '<div class="cp-variantes"><div class="cp-variantes-titulo">' + tituloSel + '</div>';
      producto.variantes.forEach(function (v) {
        var activo = vari && v.tipo === vari.tipo;
        variantesHTML +=
          '<button type="button" class="cp-var-btn' + (activo ? ' activo' : '') + '" data-tipo="' + escapeHtml(v.tipo) + '">' +
            '<span>' + escapeHtml(v.tipo) + '</span>' +
            '<span class="cvb-precio">' + cop(v.precio) + '</span>' +
          '</button>';
      });
      variantesHTML += '</div>';
    }

    var recetaHTML = producto.requiereReceta
      ? '<div class="cp-receta"><i class="fas fa-exclamation-triangle"></i> Requiere fórmula médica</div>'
      : '';

    resultadoEl.innerHTML =
      '<div class="card-producto">' +
        '<div class="cp-top">' +
          '<div class="cp-img">' + (imgSrc ? '<img src="' + imgSrc + '" alt="' + escapeHtml(producto.nombre) + '">' : '<i class="fas fa-pills" style="font-size:1.6rem;color:#c8d0dc"></i>') + '</div>' +
          '<div class="cp-info">' +
            '<span class="cp-cat">' + meta.emoji + ' ' + escapeHtml(producto.categoria) + '</span>' +
            '<div class="cp-marca">' + escapeHtml(producto.marca || '') + '</div>' +
            '<div class="cp-nombre">' + escapeHtml(producto.nombre) + '</div>' +
            '<div class="cp-codigo"><i class="fas fa-barcode"></i> ' + escapeHtml(vari && vari.codigoBarras ? vari.codigoBarras : producto.codigoBarras || '—') + '</div>' +
          '</div>' +
        '</div>' +
        recetaHTML +
        '<div class="cp-precio-bloque">' +
          '<div>' +
            '<div class="cp-precio">' + cop(precio) + '</div>' +
            '<div class="cp-precio-label">' + escapeHtml(precioLabel) + '</div>' +
          '</div>' +
          '<div class="cp-stock ' + stock.clase + '">' + stock.texto + '</div>' +
        '</div>' +
        variantesHTML +
      '</div>';

    // Cambiar de variante sin re-escanear
    resultadoEl.querySelectorAll('.cp-var-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tipo = btn.dataset.tipo;
        var nueva = producto.variantes.find(function (v) { return v.tipo === tipo; });
        if (nueva) renderProducto(producto, nueva);
      });
    });
  }

  function renderAmbiguo(coincidencias) {
    var html = '<div class="ambiguo-lista"><div class="ambiguo-titulo"><i class="fas fa-triangle-exclamation"></i> Este código aparece en ' + coincidencias.length + ' productos — selecciona el correcto</div>';
    coincidencias.forEach(function (c, i) {
      var v = c.variante || (c.producto.variantes && c.producto.variantes[0]);
      html += '<div class="ambiguo-item" data-idx="' + i + '"><span>' + escapeHtml(c.producto.nombre) + (c.variante ? ' — ' + escapeHtml(c.variante.tipo) : '') + '</span><span>' + cop(v ? v.precio : 0) + '</span></div>';
    });
    html += '</div>';
    resultadoEl.innerHTML = html;
    resultadoEl.querySelectorAll('.ambiguo-item').forEach(function (el) {
      el.addEventListener('click', function () {
        var c = coincidencias[parseInt(el.dataset.idx, 10)];
        renderProducto(c.producto, c.variante);
      });
    });
  }

  function renderNoEncontrado(codigo) {
    resultadoEl.innerHTML =
      '<div class="no-encontrado">' +
        '<i class="fas fa-barcode"></i>' +
        '<h3>Código no encontrado</h3>' +
        '<p>"' + escapeHtml(codigo) + '" no está registrado en el catálogo.</p>' +
        '<a href="productos.html?buscar=' + encodeURIComponent(codigo) + '" target="_blank"><i class="fas fa-search"></i> Buscar por nombre</a>' +
      '</div>';
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Mini mapa de categorías -> emoji (independiente del sitio principal,
  // para que esta herramienta no dependa de catalogo.js)
  function CAT_VISUAL_LOCAL(categoria) {
    var mapa = {
      'Medicamentos': { emoji: '💊' },
      'Cuidado Personal y Belleza': { emoji: '💅' },
      'Bebé y Mamá': { emoji: '🍼' },
      'Mercado y Hogar': { emoji: '🏠' }
    };
    return mapa[categoria] || { emoji: '📦' };
  }

  /* ── 5. HISTORIAL DE ESCANEOS (localStorage, solo en este dispositivo) ── */
  function leerHistorial() {
    try { return JSON.parse(localStorage.getItem(HIST_KEY) || '[]'); } catch (e) { return []; }
  }

  function guardarHistorial(producto, vari) {
    var hist = leerHistorial();
    hist.unshift({
      nombre: producto.nombre,
      tipo: vari ? vari.tipo : '',
      precio: vari ? vari.precio : (producto.variantes && producto.variantes[0].precio) || 0,
      codigo: (vari && vari.codigoBarras) || producto.codigoBarras || ''
    });
    hist = hist.slice(0, HIST_MAX);
    try { localStorage.setItem(HIST_KEY, JSON.stringify(hist)); } catch (e) {}
    renderHistorial();
  }

  function renderHistorial() {
    var hist = leerHistorial();
    if (!hist.length) { historialEl.innerHTML = ''; return; }
    var html = '<h4><i class="fas fa-clock-rotate-left"></i> Últimos escaneados</h4>';
    hist.forEach(function (h) {
      html += '<div class="hist-item" data-codigo="' + escapeHtml(h.codigo) + '">' +
        '<span>' + escapeHtml(h.nombre) + (h.tipo ? ' — ' + escapeHtml(h.tipo) : '') + '</span>' +
        '<strong>' + cop(h.precio) + '</strong>' +
      '</div>';
    });
    historialEl.innerHTML = html;
    historialEl.querySelectorAll('.hist-item').forEach(function (el) {
      el.addEventListener('click', function () {
        inputEl.value = el.dataset.codigo;
        buscar(el.dataset.codigo);
      });
    });
  }

  /* ── 6. BÚSQUEDA PRINCIPAL ── */
  function buscar(codigoRaw) {
    var codigo = String(codigoRaw || '').trim();
    if (!codigo) return;

    var coincidencias = indiceBarras.get(codigo);

    if (!coincidencias || coincidencias.length === 0) {
      feedback(false);
      renderNoEncontrado(codigo);
      return;
    }

    feedback(true);

    if (coincidencias.length === 1) {
      var c = coincidencias[0];
      renderProducto(c.producto, c.variante);
      guardarHistorial(c.producto, c.variante);
    } else {
      // Mismo código en más de un producto/variante -> desambiguar
      // (esto normalmente indica un dato duplicado en productos-data.js,
      // pero no debe romper la herramienta, solo pedir confirmación).
      renderAmbiguo(coincidencias);
    }

    inputEl.value = '';
    inputEl.focus();
  }

  /* ── 7. EVENTOS ── */
  formEl.addEventListener('submit', function (e) {
    e.preventDefault();
    buscar(inputEl.value);
  });

  // Mantener el foco siempre en el input (para lectores de código de barras)
  document.addEventListener('click', function (e) {
    if (e.target.closest('.cp-var-btn, .ambiguo-item, .hist-item, a')) return;
    inputEl.focus();
  });

  /* ── INICIO ── */
  construirIndice();
  renderHistorial();
  inputEl.focus();
})();
