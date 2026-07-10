/* ══════════════════════════════════════════════════════════
 *  Sabana Farma — newsletter.js v1.0
 *  Sección de newsletter auto-inyectable antes del footer.
 *  Guarda suscripción en localStorage para no molestar 2 veces.
 *  IIIFE — no modifica ningún archivo existente.
 * ══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var LS_KEY     = 'de_newsletter_ok';
  var WA_NUM     = '573118719476';
  var WA_MSG_ENC = encodeURIComponent(
    'Hola Sabana Farma, quiero recibir promociones y novedades por WhatsApp 🎉'
  );

  /* ── ¿Ya suscrito? ── */
  function yaSuscrito() {
    try { return !!localStorage.getItem(LS_KEY); } catch (e) { return false; }
  }

  function marcarSuscrito() {
    try { localStorage.setItem(LS_KEY, '1'); } catch (e) {}
  }

  /* ── HTML del bloque ── */
  var HTML =
    '<section class="nl-section" id="newsletterSection" aria-label="Suscríbete a nuestras promociones">' +
      '<div class="nl-inner container">' +

        /* Columna izquierda: texto */
        '<div class="nl-texto">' +
          '<div class="nl-badge">📬 Novedades y Ofertas</div>' +
          '<h2 class="nl-titulo">¿Quieres conocer nuestras<br><span class="nl-titulo-dest">promociones antes que nadie?</span></h2>' +
          '<p class="nl-desc">Recibe en tu WhatsApp las mejores ofertas semanales, descuentos exclusivos y avisos de nuevos productos. ¡Totalmente gratis!</p>' +
          '<ul class="nl-beneficios">' +
            '<li><i class="fas fa-check-circle" aria-hidden="true"></i> Ofertas y descuentos exclusivos</li>' +
            '<li><i class="fas fa-check-circle" aria-hidden="true"></i> Avisos de nuevos productos</li>' +
            '<li><i class="fas fa-check-circle" aria-hidden="true"></i> Promociones especiales de temporada</li>' +
            '<li><i class="fas fa-check-circle" aria-hidden="true"></i> Sin spam — solo lo que importa</li>' +
          '</ul>' +
        '</div>' +

        /* Columna derecha: formulario */
        '<div class="nl-form-wrap">' +
          '<div class="nl-card" id="nlCard">' +
            '<div class="nl-card-icono"><i class="fab fa-whatsapp" aria-hidden="true"></i></div>' +
            '<h3 class="nl-card-titulo">Únete por WhatsApp</h3>' +
            '<p class="nl-card-desc">Escribe tu nombre y recibe promociones directamente en tu WhatsApp. Sin registro complicado.</p>' +
            '<div class="nl-form" id="nlForm">' +
              '<div class="nl-field">' +
                '<label for="nlNombre" class="nl-label">Tu nombre</label>' +
                '<input type="text" id="nlNombre" name="nombre" class="nl-input"' +
                  ' placeholder="Ej: María García"' +
                  ' autocomplete="given-name"' +
                  ' maxlength="60"' +
                  ' aria-required="true">' +
              '</div>' +
              '<button type="button" class="nl-btn" id="nlBtnSuscribir">' +
                '<i class="fab fa-whatsapp" aria-hidden="true"></i>' +
                ' Quiero recibir ofertas' +
              '</button>' +
              '<p class="nl-aviso">Al hacer clic serás redirigido a WhatsApp. Puedes cancelar cuando quieras.</p>' +
            '</div>' +
          '</div>' +
        '</div>' +

      '</div>' +
    '</section>';

  /* ── Estado de éxito ── */
  var HTML_EXITO =
    '<div class="nl-exito" id="nlExito" role="status" aria-live="polite">' +
      '<div class="nl-exito-icono"><i class="fas fa-heart" aria-hidden="true"></i></div>' +
      '<h3>¡Gracias por suscribirte!</h3>' +
      '<p>Pronto recibirás nuestras mejores ofertas por WhatsApp. ¡Bienvenido a la familia Sabana Farma! 🎉</p>' +
    '</div>';

  /* ── Inyectar antes del footer ── */
  function inyectar() {
    if (document.getElementById('newsletterSection')) return;

    var footer = document.querySelector('footer');
    if (!footer) return;

    footer.insertAdjacentHTML('beforebegin', HTML);

    /* Si ya está suscrito, mostrar mensaje de éxito directamente */
    if (yaSuscrito()) {
      var card = document.getElementById('nlCard');
      if (card) card.innerHTML = HTML_EXITO;
      return;
    }

    /* Evento del botón */
    var btn = document.getElementById('nlBtnSuscribir');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var nombreEl = document.getElementById('nlNombre');
      var nombre   = nombreEl ? nombreEl.value.trim() : '';

      var msgBase = 'Hola Sabana Farma, quiero recibir sus promociones y novedades por WhatsApp 🎉';
      var msgFull = nombre
        ? 'Hola, soy *' + nombre + '*. ' + msgBase
        : msgBase;

      var url = 'https://wa.me/' + WA_NUM + '?text=' + encodeURIComponent(msgFull);
      window.open(url, '_blank', 'noopener,noreferrer');

      marcarSuscrito();

      /* Mostrar estado de éxito */
      var card = document.getElementById('nlCard');
      if (card) {
        card.style.transition = 'opacity .3s ease, transform .3s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(.96)';
        setTimeout(function () {
          card.innerHTML = HTML_EXITO;
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 320);
      }

      /* Toast de confirmación */
      if (typeof DE_Toast !== 'undefined') {
        DE_Toast.success('🎉 ¡Gracias! Redirigiendo a WhatsApp...');
      } else if (typeof mostrarToast !== 'undefined') {
        mostrarToast('🎉 ¡Gracias por suscribirte!');
      }
    });

    /* Enter en el input → click botón */
    var inputNombre = document.getElementById('nlNombre');
    if (inputNombre) {
      inputNombre.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') btn.click();
      });
    }
  }

  /* ── Init ── */
  if (document.readyState !== 'loading') {
    inyectar();
  } else {
    document.addEventListener('DOMContentLoaded', inyectar);
  }

})();
