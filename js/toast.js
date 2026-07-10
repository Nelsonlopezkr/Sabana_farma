/* ══════════════════════════════════════════════════════════
 *  Sabana Farma — toast.js v1.0
 *  Notificaciones tipo Toast con tipos: success, error,
 *  info, warning. Reemplaza el toast simple de carrito.js
 *  retrocompatible: sobreescribe window.mostrarToast
 *  IIIFE — no modifica ningún archivo existente.
 * ══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Cola de toasts ── */
  var cola = [];
  var visible = 0;
  var MAX_VISIBLE = 3;
  var DURACION = 3400;   /* ms visibles */
  var OFFSET_BASE = 16;  /* px desde el borde */
  var OFFSET_STEP = 72;  /* px entre toasts */

  /* ── Contenedor ── */
  function getContenedor() {
    var c = document.getElementById('de-toast-container');
    if (!c) {
      c = document.createElement('div');
      c.id = 'de-toast-container';
      c.setAttribute('role', 'region');
      c.setAttribute('aria-live', 'polite');
      c.setAttribute('aria-label', 'Notificaciones');
      c.style.cssText = [
        'position:fixed',
        'bottom:80px',
        'right:16px',
        'z-index:999999',
        'display:flex',
        'flex-direction:column-reverse',
        'gap:8px',
        'pointer-events:none',
        'max-width:340px',
        'width:calc(100% - 32px)'
      ].join(';');
      document.body.appendChild(c);
    }
    return c;
  }

  /* ── Íconos por tipo ── */
  var ICONOS = {
    success: '<i class="fas fa-check-circle" aria-hidden="true"></i>',
    error:   '<i class="fas fa-times-circle" aria-hidden="true"></i>',
    warning: '<i class="fas fa-exclamation-triangle" aria-hidden="true"></i>',
    info:    '<i class="fas fa-info-circle" aria-hidden="true"></i>'
  };

  /* ── Colores por tipo ── */
  var COLORES = {
    success: { bg: '#1B5E20', border: '#2E7D32', icon: '#69F0AE' },
    error:   { bg: '#B71C1C', border: '#C62828', icon: '#FF8A80' },
    warning: { bg: '#E65100', border: '#F57C00', icon: '#FFD180' },
    info:    { bg: '#0D47A1', border: '#1565C0', icon: '#82B1FF' }
  };

  /* ── Mostrar un toast ── */
  function mostrar(mensaje, tipo) {
    tipo = tipo || 'success';
    if (!COLORES[tipo]) tipo = 'info';

    var color = COLORES[tipo];
    var contenedor = getContenedor();

    var el = document.createElement('div');
    el.className = 'de-toast de-toast-' + tipo;
    el.setAttribute('role', 'alert');
    el.setAttribute('aria-atomic', 'true');
    el.style.cssText = [
      'display:flex',
      'align-items:center',
      'gap:10px',
      'background:' + color.bg,
      'border:1.5px solid ' + color.border,
      'border-radius:14px',
      'padding:11px 15px',
      'font-size:.86rem',
      'font-weight:700',
      'color:#fff',
      'box-shadow:0 4px 20px rgba(0,0,0,.35)',
      'pointer-events:all',
      'cursor:pointer',
      'transform:translateX(110%)',
      'transition:transform .32s cubic-bezier(.34,1.56,.64,1),opacity .25s ease',
      'opacity:0',
      'will-change:transform,opacity',
      'max-width:340px',
      'word-break:break-word',
      'line-height:1.4',
      'user-select:none',
      '-webkit-user-select:none'
    ].join(';');

    el.innerHTML =
      '<span style="font-size:1.15rem;flex-shrink:0;color:' + color.icon + '">' + (ICONOS[tipo] || '') + '</span>' +
      '<span style="flex:1">' + mensaje + '</span>' +
      '<button style="background:none;border:none;color:rgba(255,255,255,.6);font-size:1rem;cursor:pointer;padding:0;line-height:1;flex-shrink:0" aria-label="Cerrar notificación">&#x2715;</button>';

    /* Cerrar al hacer click */
    el.addEventListener('click', function () { cerrarToast(el); });

    contenedor.appendChild(el);
    visible++;

    /* Animar entrada */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.style.transform = 'translateX(0)';
        el.style.opacity = '1';
      });
    });

    /* Auto-cerrar */
    var timer = setTimeout(function () { cerrarToast(el); }, DURACION);
    el._deTimer = timer;

    /* Pausa al hacer hover */
    el.addEventListener('mouseenter', function () { clearTimeout(el._deTimer); });
    el.addEventListener('mouseleave', function () {
      el._deTimer = setTimeout(function () { cerrarToast(el); }, 1500);
    });
  }

  /* ── Cerrar toast ── */
  function cerrarToast(el) {
    if (!el || el._deClosed) return;
    el._deClosed = true;
    clearTimeout(el._deTimer);
    el.style.transform = 'translateX(110%)';
    el.style.opacity = '0';
    visible = Math.max(0, visible - 1);
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 320);
  }

  /* ── API pública ── */
  var DE_Toast = {
    show:    mostrar,
    success: function (msg) { mostrar(msg, 'success'); },
    error:   function (msg) { mostrar(msg, 'error'); },
    warning: function (msg) { mostrar(msg, 'warning'); },
    info:    function (msg) { mostrar(msg, 'info'); }
  };

  window.DE_Toast = DE_Toast;

  /* ── Retrocompatibilidad: sobreescribir mostrarToast de carrito.js ── */
  window.mostrarToast = function (msg) {
    /* Detectar tipo por emoji/contenido del mensaje */
    var tipo = 'success';
    if (/eliminado|vaciado|quitado/i.test(msg)) tipo = 'info';
    if (/error|no se pudo|falló/i.test(msg)) tipo = 'error';
    if (/atención|advertencia/i.test(msg)) tipo = 'warning';
    mostrar(msg, tipo);
  };

  /* ── Ocultar el #toast nativo de carrito.js si existe ── */
  function ocultarToastNativo() {
    var t = document.getElementById('toast');
    if (t) {
      t.style.display = 'none';
      t.setAttribute('aria-hidden', 'true');
    }
  }

  if (document.readyState !== 'loading') {
    ocultarToastNativo();
  } else {
    document.addEventListener('DOMContentLoaded', ocultarToastNativo);
  }

})();
