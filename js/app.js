/* ══════════════════════════════════════════════════════════
   Sabana Farma — app.js  v1.0
   Script de producción: registra SW, banner cookies, 
   scroll animations, lazy loading, protección XSS,
   correcciones bugs globales.
   
   INCLUIR en TODOS los HTML al final del <body>:
   <script src="js/app.js"></script>
   ══════════════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════════════════════════
   1. REGISTRO DEL SERVICE WORKER (PWA)
   ══════════════════════════════════════════════════════════ */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js')
      .then(function (reg) {
        console.log('[SW] Registrado. Scope:', reg.scope);
      })
      .catch(function (err) {
        console.warn('[SW] Error de registro:', err);
      });
  });
}

/* ══════════════════════════════════════════════════════════
   2. BANNER DE COOKIES
   ══════════════════════════════════════════════════════════ */
(function initCookieBanner() {
  if (localStorage.getItem('de_cookies_ok')) return;

  var banner = document.createElement('div');
  banner.id = 'cookieBanner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Aviso de cookies');
  banner.style.cssText = [
    'position:fixed',
    'bottom:0',
    'left:0',
    'right:0',
    'z-index:99999',
    'background:#1a1a2e',
    'color:#fff',
    'padding:1rem 1.5rem',
    'display:flex',
    'align-items:center',
    'justify-content:space-between',
    'gap:1rem',
    'flex-wrap:wrap',
    'font-family:inherit',
    'font-size:.82rem',
    'box-shadow:0 -4px 20px rgba(0,0,0,.3)',
    'transition:transform .4s ease',
    'transform:translateY(100%)',
  ].join(';');

  banner.innerHTML = [
    '<span style="flex:1;min-width:220px;line-height:1.5">',
      '🍪 Usamos <strong>cookies técnicas</strong> para el carrito de compras.',
      ' <a href="politica-cookies.html" style="color:#FFD54F;text-decoration:underline">Más info</a>',
    '</span>',
    '<div style="display:flex;gap:.6rem;flex-shrink:0">',
      '<button id="cookieAccept" style="padding:.55rem 1.3rem;background:#1565C0;color:#fff;border:none;border-radius:8px;font-weight:800;font-size:.82rem;cursor:pointer;font-family:inherit">Aceptar</button>',
      '<a href="politica-cookies.html" style="padding:.55rem 1.3rem;background:transparent;color:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.2);border-radius:8px;font-weight:700;font-size:.82rem;text-decoration:none;display:inline-flex;align-items:center">Más info</a>',
    '</div>',
  ].join('');

  document.body.appendChild(banner);

  /* Animar entrada */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      banner.style.transform = 'translateY(0)';
    });
  });

  /* Añadir padding al body si hay bottom-nav */
  var hasBottomNav = document.querySelector('.bottom-nav');
  if (hasBottomNav) banner.style.bottom = '68px';

  document.getElementById('cookieAccept').addEventListener('click', function () {
    localStorage.setItem('de_cookies_ok', '1');
    banner.style.transform = 'translateY(120%)';
    setTimeout(function () { banner.remove(); }, 500);
  });
})();

/* ══════════════════════════════════════════════════════════
   3. SCROLL ANIMATIONS (Intersection Observer)
   ══════════════════════════════════════════════════════════ */
(function initScrollAnimations() {
  /* Estilo base para los elementos animables */
  var style = document.createElement('style');
  style.textContent = [
    '.anim-fade-up{opacity:0;transform:translateY(28px);transition:opacity .55s ease,transform .55s ease}',
    '.anim-fade-up.visible{opacity:1;transform:translateY(0)}',
    '.anim-fade-in{opacity:0;transition:opacity .55s ease}',
    '.anim-fade-in.visible{opacity:1}',
    '.anim-scale{opacity:0;transform:scale(.93);transition:opacity .5s ease,transform .5s ease}',
    '.anim-scale.visible{opacity:1;transform:scale(1)}',
    '@media(prefers-reduced-motion:reduce){.anim-fade-up,.anim-fade-in,.anim-scale{opacity:1!important;transform:none!important;transition:none!important}}',
  ].join('');
  document.head.appendChild(style);

  /* Marcar elementos para animar */
  var selectors = [
    '.servicio-card', '.promo-card', '.promo-card-full',
    '.testimonio-card', '.garantia-card', '.beneficio-card',
    '.nosotros-item', '.producto-card', '.resena-card',
    '.titulo-seccion', '.paso-card', '.promo-exclusiva-card',
  ];

  selectors.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el, i) {
      if (!el.classList.contains('skeleton-card')) {
        el.classList.add('anim-fade-up');
        el.style.transitionDelay = (i * 0.06) + 's';
      }
    });
  });

  /* Observer */
  if (!('IntersectionObserver' in window)) {
    /* Fallback: mostrar todo */
    document.querySelectorAll('.anim-fade-up,.anim-fade-in,.anim-scale').forEach(function (el) {
      el.classList.add('visible');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.anim-fade-up,.anim-fade-in,.anim-scale').forEach(function (el) {
    observer.observe(el);
  });
})();

/* ══════════════════════════════════════════════════════════
   4. LAZY LOADING NATIVO + FALLBACK
   ══════════════════════════════════════════════════════════ */
(function initLazyLoad() {
  /* Añadir loading="lazy" a todas las imágenes que no lo tengan */
  document.querySelectorAll('img:not([loading])').forEach(function (img) {
    img.setAttribute('loading', 'lazy');
  });

  /* Añadir decoding="async" */
  document.querySelectorAll('img:not([decoding])').forEach(function (img) {
    img.setAttribute('decoding', 'async');
  });
})();

/* ══════════════════════════════════════════════════════════
   5. PROTECCIÓN XSS BÁSICA — sanitizar inputs
   ══════════════════════════════════════════════════════════ */
window.sanitize = function (str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
};

/* ══════════════════════════════════════════════════════════
   6. CORRECCIÓN BUG: links externos con rel="noopener noreferrer"
   ══════════════════════════════════════════════════════════ */
(function fixExternalLinks() {
  document.querySelectorAll('a[target="_blank"]').forEach(function (a) {
    var rel = a.getAttribute('rel') || '';
    if (!rel.includes('noopener')) {
      a.setAttribute('rel', (rel + ' noopener noreferrer').trim());
    }
  });
})();

/* ══════════════════════════════════════════════════════════
   7. CORRECCIÓN BUG: actualizarContadorCarrito no definida
   Algunos HTML la llaman pero no existe en carrito.js
   ══════════════════════════════════════════════════════════ */
if (typeof window.actualizarContadorCarrito === 'undefined') {
  window.actualizarContadorCarrito = function () {
    if (typeof actualizarUI === 'function') actualizarUI();
  };
}

/* ══════════════════════════════════════════════════════════
   8. CORRECCIÓN BUG: suscribirWhatsapp en promociones.html
   usa template literal sin backticks
   ══════════════════════════════════════════════════════════ */
window.suscribirWhatsapp = function () {
  var input = document.getElementById('waInput');
  if (!input) return;
  var num = input.value.trim().replace(/\D/g, '');
  if (num.length < 7) {
    alert('Por favor ingresa un número de WhatsApp válido.');
    return;
  }
  var msg = encodeURIComponent(
    'Hola, quiero recibir las promociones de Sabana Farma. Mi número es ' + num
  );
  window.open('https://wa.me/573118719476?text=' + msg, '_blank', 'noopener');
};

/* ══════════════════════════════════════════════════════════
   9. HELPER GLOBAL cop() para archivos que lo necesiten
   ══════════════════════════════════════════════════════════ */
if (typeof window._cop === 'undefined') {
  window._cop = function (n) {
    return '$' + Number(n).toLocaleString('es-CO');
  };
}

/* ══════════════════════════════════════════════════════════
   10. NAVBAR SCROLL — sombra al hacer scroll
   ══════════════════════════════════════════════════════════ */
(function initNavbarScroll() {
  var navbar = document.querySelector('.navbar');
  if (!navbar) return;
  var scrolled = false;
  window.addEventListener('scroll', function () {
    var now = window.scrollY > 10;
    if (now !== scrolled) {
      scrolled = now;
      navbar.style.boxShadow = scrolled
        ? '0 2px 20px rgba(0,0,0,.12)'
        : '0 1px 0 rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.06)';
    }
  }, { passive: true });
})();

/* ══════════════════════════════════════════════════════════
   11. BACK TO TOP BUTTON
   ══════════════════════════════════════════════════════════ */
(function initBackToTop() {
  var btn = document.createElement('button');
  btn.id = 'backToTop';
  btn.setAttribute('aria-label', 'Volver arriba');
  btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
  btn.style.cssText = [
    'position:fixed',
    'bottom:5.5rem',
    'left:1.5rem',
    'width:40px',
    'height:40px',
    'background:#1565C0',
    'color:#fff',
    'border:none',
    'border-radius:50%',
    'cursor:pointer',
    'font-size:.9rem',
    'display:none',
    'align-items:center',
    'justify-content:center',
    'z-index:990',
    'box-shadow:0 4px 14px rgba(21,101,192,.35)',
    'transition:opacity .3s,transform .3s',
    'opacity:0',
    'font-family:inherit',
  ].join(';');
  document.body.appendChild(btn);

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      btn.style.display = 'flex';
      setTimeout(function () { btn.style.opacity = '1'; btn.style.transform = 'scale(1)'; }, 10);
    } else {
      btn.style.opacity = '0';
      btn.style.transform = 'scale(0.8)';
      setTimeout(function () { btn.style.display = 'none'; }, 300);
    }
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ══════════════════════════════════════════════════════════
   12. PROTECCIÓN GLOBAL CONTRA ERRORES JS NO CAPTURADOS
   ══════════════════════════════════════════════════════════ */
window.addEventListener('error', function (e) {
  /* Solo loguear, no bloquear la UX */
  console.warn('[DE Error]', e.message, 'en', e.filename, 'línea', e.lineno);
});

window.addEventListener('unhandledrejection', function (e) {
  console.warn('[DE Promise Error]', e.reason);
  e.preventDefault();
});

/* ══════════════════════════════════════════════════════════
   13. FORMATEO TELÉFONO EN INPUTS
   ══════════════════════════════════════════════════════════ */
document.querySelectorAll('input[type="tel"]').forEach(function (input) {
  input.addEventListener('input', function () {
    this.value = this.value.replace(/[^\d\s\-+()]/g, '').substring(0, 15);
  });
});

/* ══════════════════════════════════════════════════════════
   14. MEJORA ACCESIBILIDAD: skip-to-content link
   ══════════════════════════════════════════════════════════ */
(function initSkipLink() {
  if (document.getElementById('skip-link')) return;
  var skip = document.createElement('a');
  skip.id = 'skip-link';
  skip.href = '#productos';
  skip.textContent = 'Saltar al contenido principal';
  skip.style.cssText = [
    'position:absolute',
    'top:-100px',
    'left:1rem',
    'z-index:100000',
    'background:#1565C0',
    'color:#fff',
    'padding:.5rem 1rem',
    'border-radius:0 0 8px 8px',
    'font-weight:800',
    'font-size:.85rem',
    'text-decoration:none',
    'transition:top .2s',
  ].join(';');
  skip.addEventListener('focus', function () { this.style.top = '0'; });
  skip.addEventListener('blur', function () { this.style.top = '-100px'; });
  document.body.insertBefore(skip, document.body.firstChild);
})();

/* ══════════════════════════════════════════════════════════
   15. PRECONNECT DINÁMICO — mejorar tiempo de carga
   ══════════════════════════════════════════════════════════ */
(function addPreconnects() {
  var origins = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://cdnjs.cloudflare.com',
    'https://picsum.photos',
  ];
  origins.forEach(function (origin) {
    if (!document.querySelector('link[href="' + origin + '"]')) {
      var link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = origin;
      if (origin.includes('gstatic')) link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
  });
})();

/* ══════════════════════════════════════════════════════════
   16. CONTADOR ANIMADO (para stats en hero)
   ══════════════════════════════════════════════════════════ */
(function initCounters() {
  var counters = document.querySelectorAll('.stat-num, .promo-stat-num');
  if (!counters.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var text = el.textContent.trim();
      /* Solo animar si es número puro */
      var num = parseInt(text.replace(/\D/g, ''), 10);
      if (isNaN(num) || num === 0) return;
      var suffix = text.replace(/[0-9]/g, '');
      var start = 0;
      var duration = 1200;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
        el.textContent = Math.floor(eased * num) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(function (c) { observer.observe(c); });
})();

console.info('[DE] app.js v1.0 cargado ✅');