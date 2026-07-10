/**
 * Sabana Farma — assets/js/app.js  v5.0
 *
 * Archivo JS principal consolidado.
 * Agrega: dark mode, navbar scroll, scroll reveal,
 *          partículas hero, mejoras UX.
 *
 * CARGA al final del <body>, después de todos los demás scripts.
 */

'use strict';

/* ══════════════════════════════════════════════════════════
   1. DARK MODE TOGGLE
   ══════════════════════════════════════════════════════════ */
(function darkModeModule() {
  const STORAGE_KEY = 'de-theme';
  const html        = document.documentElement;

  // Aplicar tema guardado inmediatamente (evita flash)
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  if (savedTheme === 'dark') {
    html.setAttribute('data-theme', 'dark');
  }

  function getTheme()    { return html.getAttribute('data-theme') || 'light'; }
  function isDark()      { return getTheme() === 'dark'; }

  function setTheme(theme) {
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
    }
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggleIcon();
  }

  function updateToggleIcon() {
    const btns = document.querySelectorAll('.btn-dark-mode');
    btns.forEach(btn => {
      const icon = btn.querySelector('i');
      if (!icon) return;
      if (isDark()) {
        icon.className = 'fas fa-sun';
        btn.setAttribute('aria-label', 'Activar modo claro');
        btn.title = 'Modo claro';
      } else {
        icon.className = 'fas fa-moon';
        btn.setAttribute('aria-label', 'Activar modo oscuro');
        btn.title = 'Modo oscuro';
      }
    });
  }

  function toggle() {
    setTheme(isDark() ? 'light' : 'dark');
  }

  // Inicializar cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', function () {
    updateToggleIcon();

    // Vincular todos los botones de dark mode
    document.querySelectorAll('.btn-dark-mode').forEach(btn => {
      btn.addEventListener('click', toggle);
    });
  });

  // Exponer globalmente por si se necesita desde otro script
  window.DEApp = window.DEApp || {};
  window.DEApp.setTheme = setTheme;
  window.DEApp.toggleTheme = toggle;
  window.DEApp.isDark = isDark;
})();


/* ══════════════════════════════════════════════════════════
   2. NAVBAR — Efecto sombra al hacer scroll
   ══════════════════════════════════════════════════════════ */
(function navbarScrollEffect() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        navbar.classList.toggle('scrolled', window.scrollY > 10);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ══════════════════════════════════════════════════════════
   3. NAVBAR TOGGLE — Menú hamburguesa (backup/unificado)
   ══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('activo');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Cerrar menú al hacer clic en un enlace
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('activo');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
});


/* ══════════════════════════════════════════════════════════
   4. SCROLL REVEAL — Animación suave al entrar en vista
   ══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {
  // Agregar clase reveal a secciones relevantes
  const revealTargets = document.querySelectorAll(
    'section, .servicio-card, .garantia-card, .testimonio-card, .cat-hero-card'
  );

  if (!('IntersectionObserver' in window)) {
    // Fallback: mostrar todo si no hay soporte
    revealTargets.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Solo animar una vez
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealTargets.forEach(function (el) {
    el.classList.add('reveal');
    observer.observe(el);
  });
});


/* ══════════════════════════════════════════════════════════
   5. BOTTOM NAV — Sincronizar badge con carrito
   ══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {
  // Sincronizar badge del carrito en bottom nav
  function syncBnBadge() {
    const mainBadge = document.querySelector('.carrito-badge');
    const bnCount   = document.getElementById('bnCount');
    if (!mainBadge || !bnCount) return;

    const n      = mainBadge.textContent.trim();
    const oculto = mainBadge.classList.contains('oculto');
    bnCount.textContent = n;
    bnCount.classList.toggle('oculto', oculto);
  }

  const mainBadge = document.querySelector('.carrito-badge');
  if (mainBadge) {
    new MutationObserver(syncBnBadge).observe(mainBadge, {
      childList: true,
      attributes: true
    });
  }

  // Botón abrir carrito en bottom nav
  const btnMobile = document.getElementById('btnAbrirCarritoMobile');
  if (btnMobile) {
    btnMobile.addEventListener('click', function () {
      const modal = document.getElementById('carritoModal');
      if (modal) modal.classList.add('activo');
    });
  }
});


/* ══════════════════════════════════════════════════════════
   6. CARRITO — Mensaje dinámico envío gratis
   ══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {
  const subtotalEl = document.getElementById('carritoSubtotal');
  const msgEl      = document.getElementById('carritoEnvioMsg');
  if (!subtotalEl || !msgEl) return;

  function actualizarMensajeEnvio() {
    const raw      = subtotalEl.textContent.replace(/[^0-9]/g, '');
    const subtotal = parseInt(raw, 10) || 0;
    const umbral   = 50000;

    if (subtotal === 0) {
      msgEl.textContent = '✅ Envío gratis en compras mayores a $50.000';
      msgEl.style.color = 'var(--verde)';
    } else if (subtotal >= umbral) {
      msgEl.textContent = '🎉 ¡Envío gratis aplicado!';
      msgEl.style.color = 'var(--verde)';
    } else {
      const falta = (umbral - subtotal).toLocaleString('es-CO');
      msgEl.textContent = `🎁 ¡Solo te faltan $${falta} para envío gratis!`;
      msgEl.style.color = 'var(--naranja)';
    }
  }

  new MutationObserver(actualizarMensajeEnvio).observe(subtotalEl, {
    childList: true
  });
});


/* ══════════════════════════════════════════════════════════
   7. PROMO DEL DÍA — Rotación por día de la semana
   ══════════════════════════════════════════════════════════ */
(function promoDia() {
  const bar = document.getElementById('promoDiaBar');
  if (!bar) return;

  const promos = [
    '🌟 HOY DOMINGO — Electrolit 625 ml a <strong>$8.500</strong> · ¡Todos los sabores!',
    '🌟 HOY LUNES — Acetaminofén MK 100 tab a <strong>$16.000</strong> (normal $18.000)',
    '🌟 HOY MARTES — Loratadina 10mg a <strong>$2.000</strong> · ¡Anti-alergia!',
    '🌟 HOY MIÉRCOLES — Vitamina C efervescente x10 a <strong>$4.500</strong>',
    '🌟 HOY JUEVES — Omeprazol 20mg x30 cáps a <strong>$9.800</strong>',
    '🌟 HOY VIERNES — Crema Bepanthen 30g a <strong>$15.000</strong> (normal $18.000)',
    '🌟 HOY SÁBADO — Pañales Pampers talla 2 x40 a <strong>$24.500</strong>',
  ];

  bar.innerHTML = promos[new Date().getDay()];
})();


/* ══════════════════════════════════════════════════════════
   8. TELÉFONO EN NAVBAR MÓVIL
   ══════════════════════════════════════════════════════════ */
(function telNavMovil() {
  function mostrar() {
    const btn = document.getElementById('btnTelNav');
    if (btn) btn.style.display = window.innerWidth < 600 ? 'flex' : 'none';
  }

  document.addEventListener('DOMContentLoaded', mostrar);
  window.addEventListener('resize', mostrar, { passive: true });
})();


/* ══════════════════════════════════════════════════════════
   9. HERO — Partículas flotantes decorativas
   ══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  // No generar en móviles pequeños (rendimiento)
  if (window.innerWidth < 480) return;

  const sizes    = [20, 30, 40, 55, 70, 90];
  const count    = 8;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'hero-particle';
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    Object.assign(p.style, {
      width:            size + 'px',
      height:           size + 'px',
      left:             Math.random() * 100 + '%',
      top:              Math.random() * 100 + '%',
      animationDuration: (8 + Math.random() * 12) + 's',
      animationDelay:    (Math.random() * 5) + 's',
    });
    hero.appendChild(p);
  }
});


/* ══════════════════════════════════════════════════════════
   10. CATEGORÍAS HERO — Contar productos por categoría
   ══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {
  // Requiere que CATALOGO esté definido (productos-data.js)
  if (typeof CATALOGO === 'undefined') return;

  const counts = {};
  CATALOGO.forEach(function (p) {
    counts[p.categoria] = (counts[p.categoria] || 0) + 1;
  });

  // Actualizar los contadores en las cat-hero-cards
  document.querySelectorAll('.cat-hero-card').forEach(function (card) {
    const cat     = card.getAttribute('data-cat');
    const countEl = card.querySelector('.cat-hero-count');
    if (cat && countEl && counts[cat]) {
      countEl.textContent = counts[cat] + ' productos';
    }
  });
});


/* ══════════════════════════════════════════════════════════
   11. LAZY LOADING IMÁGENES — Para mejor rendimiento
   ══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {
  if (!('IntersectionObserver' in window)) return;

  const imgObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.classList.add('lazy-loaded');
        imgObserver.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  document.querySelectorAll('img[data-src]').forEach(function (img) {
    imgObserver.observe(img);
  });
});
