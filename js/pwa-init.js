/* ══════════════════════════════════════════════════════════
 *  Sabana Farma — PWA Init v1.0
 * ══════════════════════════════════════════════════════════ */
(function() {
  'use strict';

  /* ── Registro del Service Worker ── */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then(function(reg) {
          console.log('[PWA] SW registrado. Scope:', reg.scope);
          /* Notificar actualización disponible */
          reg.addEventListener('updatefound', function() {
            var newWorker = reg.installing;
            newWorker.addEventListener('statechange', function() {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                mostrarBannerActualizacion();
              }
            });
          });
        })
        .catch(function(err) {
          console.warn('[PWA] Error al registrar SW:', err);
        });
    });
  }

  /* ── Banner "Instalar aplicación" ── */
  var deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    deferredPrompt = e;
    mostrarBannerInstalar();
  });

  window.addEventListener('appinstalled', function() {
    ocultarBannerInstalar();
    deferredPrompt = null;
  });

  function mostrarBannerInstalar() {
    if (document.getElementById('pwa-install-banner')) return;
    var banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.setAttribute('role', 'complementary');
    banner.setAttribute('aria-label', 'Instalar aplicación');
    banner.innerHTML =
      '<div style="display:flex;align-items:center;gap:.75rem;flex:1">' +
        '<span style="font-size:1.4rem" aria-hidden="true">📲</span>' +
        '<div>' +
          '<strong style="display:block;font-size:.88rem">Instalar DE Farma</strong>' +
          '<span style="font-size:.75rem;opacity:.85">Accede sin internet y más rápido</span>' +
        '</div>' +
      '</div>' +
      '<div style="display:flex;gap:.5rem;flex-shrink:0">' +
        '<button id="pwa-install-btn" style="background:#fff;color:#1565C0;border:none;border-radius:8px;padding:.45rem 1rem;font-weight:800;font-size:.82rem;cursor:pointer">Instalar</button>' +
        '<button id="pwa-dismiss-btn" style="background:rgba(255,255,255,.15);color:#fff;border:1px solid rgba(255,255,255,.4);border-radius:8px;padding:.45rem .75rem;font-size:.82rem;cursor:pointer" aria-label="Cerrar">✕</button>' +
      '</div>';
    banner.style.cssText = [
      'position:fixed', 'bottom:0', 'left:0', 'right:0',
      'background:linear-gradient(90deg,#0d47a1,#1565C0)',
      'color:#fff', 'padding:.85rem 1.25rem',
      'display:flex', 'align-items:center', 'justify-content:space-between',
      'gap:1rem', 'z-index:10001',
      'box-shadow:0 -4px 20px rgba(0,0,0,.2)',
      'font-family:inherit', 'flex-wrap:wrap',
    ].join(';');
    document.body.appendChild(banner);

    document.getElementById('pwa-install-btn').addEventListener('click', function() {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function() {
        deferredPrompt = null;
        ocultarBannerInstalar();
      });
    });
    document.getElementById('pwa-dismiss-btn').addEventListener('click', function() {
      ocultarBannerInstalar();
      /* No volver a mostrar por 7 días */
      try { localStorage.setItem('de_pwa_dismiss', Date.now()); } catch(e) {}
    });
  }

  function ocultarBannerInstalar() {
    var b = document.getElementById('pwa-install-banner');
    if (b) b.remove();
  }

  function mostrarBannerActualizacion() {
    var b = document.getElementById('pwa-update-banner');
    if (b) return;
    var el = document.createElement('div');
    el.id = 'pwa-update-banner';
    el.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#1B5E20;color:#fff;padding:.65rem 1.2rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;z-index:10002;font-family:inherit;font-size:.85rem;font-weight:700';
    el.innerHTML =
      '<span>🆕 Hay una versión nueva disponible</span>' +
      '<button onclick="window.location.reload()" style="background:#fff;color:#1B5E20;border:none;border-radius:7px;padding:.35rem .9rem;font-weight:800;font-size:.8rem;cursor:pointer">Actualizar</button>';
    document.body.prepend(el);
  }

  /* ── Verificar si ya se descartó el banner ── */
  try {
    var dismissed = localStorage.getItem('de_pwa_dismiss');
    if (dismissed && Date.now() - parseInt(dismissed) < 7 * 86400000) {
      window.addEventListener('beforeinstallprompt', function(e) { e.preventDefault(); });
    }
  } catch(e) {}

})();