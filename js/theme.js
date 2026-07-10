/* ════════════════════════════════════════════════════════════════
   theme.js v4 — Sistema de temas definitivo
   Sabana Farma

   Estrategia:
   - Anti-FOUC script en <head> aplica data-theme al <html>
   - theme.js aplica TAMBIÉN class="oscuro" al <body>
   - CSS usa [data-theme="dark"] (html level) + body.oscuro (body level)
   - localStorage guarda preferencia y se respeta en TODAS las páginas
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Leer tema guardado ── */
  function leerTema() {
    try {
      var guardado = localStorage.getItem('tema');
      if (guardado === 'dark' || guardado === 'light') return guardado;
    } catch (e) {}
    /* Preferencia del sistema operativo como fallback */
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  /* ── Aplicar tema en html + body ── */
  function aplicarTema(tema) {
    var html = document.documentElement;
    var body = document.body;

    if (tema === 'dark') {
      html.setAttribute('data-theme', 'dark');
      if (body) body.classList.add('oscuro');
    } else {
      html.removeAttribute('data-theme');
      if (body) body.classList.remove('oscuro');
    }

    /* Actualizar iconos de TODOS los botones de tema de la página */
    var botones = document.querySelectorAll('.btn-tema, .btn-dark-mode, #btnTema, #btnDarkMode');
    for (var i = 0; i < botones.length; i++) {
      var icon = botones[i].querySelector('i');
      if (icon) {
        icon.className = tema === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
    }

    /* Guardar preferencia */
    try { localStorage.setItem('tema', tema); } catch (e) {}
  }

  /* ── Toggle público ── */
  window.toggleTema = function () {
    var actual = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    aplicarTema(actual === 'dark' ? 'light' : 'dark');
  };

  /* ── Sincronizar botones con tema actual ── */
  function sincronizarBotones() {
    var tema = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    aplicarTema(tema); /* re-aplica sin cambiar el tema, solo sincroniza iconos y clases */
  }

  /* ── Inicialización ── */
  document.addEventListener('DOMContentLoaded', function () {
    /* Asegurar que el body también tiene la clase correcta */
    var tema = leerTema();
    aplicarTema(tema);

    /* Conectar TODOS los botones de tema que no usen onclick */
    var botones = document.querySelectorAll('.btn-tema, .btn-dark-mode, #btnTema, #btnDarkMode');
    for (var i = 0; i < botones.length; i++) {
      (function (btn) {
        if (!btn.getAttribute('onclick')) {
          btn.addEventListener('click', window.toggleTema);
        }
      })(botones[i]);
    }
  });

  /* ── Sincronizar inmediatamente (el script carga al final del body) ── */
  sincronizarBotones();
})();
