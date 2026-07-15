/* ══════════════════════════════════════════════════════════
 *  Sabana Farma — navbar-search.js  v2.0
 *  Buscador global sticky en el navbar — funciona en TODAS
 *  las páginas del sitio sin romper ninguna funcionalidad.
 *
 *  Estrategia:
 *  - Inyecta .navbar-search-wrap dentro del <nav.navbar>
 *  - En productos.html filtra directamente el catalogo
 *  - En otras páginas redirige a productos.html?buscar=...
 *  - Autocompletado con CATALOGO si está cargado
 *  - Navegación teclado: ↑ ↓ Enter Esc
 *  - Versión móvil inyectada debajo del navbar
 * ══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var WA_NUM = '573118719476';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  /* ── HTML del buscador ── */
  function buildSearchHTML(idSuffix) {
    idSuffix = idSuffix || '';
    return [
      '<div class="navbar-search-wrap" id="navSearchWrap' + idSuffix + '" role="search" aria-label="Buscar producto">',
        '<div class="navbar-search-inner">',
          '<i class="fas fa-search nav-search-icon" aria-hidden="true"></i>',
          '<input',
            ' type="search"',
            ' id="navSearchInput' + idSuffix + '"',
            ' class="nav-search-input"',
            ' placeholder="¿Qué medicamento buscas?"',
            ' autocomplete="off" autocorrect="off" spellcheck="false"',
            ' aria-label="Buscar producto en el catálogo"',
            ' aria-autocomplete="list"',
            ' aria-controls="navSearchDropdown' + idSuffix + '"',
            ' aria-expanded="false"',
          '>',
          '<button class="nav-search-btn" id="navSearchBtn' + idSuffix + '" aria-label="Buscar">',
            '<i class="fas fa-arrow-right"></i>',
          '</button>',
        '</div>',
        '<div class="nav-search-dropdown" id="navSearchDropdown' + idSuffix + '" role="listbox"></div>',
      '</div>'
    ].join('');
  }

  /* ── Escapar RegExp ── */
  function esc(s) { return s.replace(/[-.*+?^${}()|[\]\\]/g, '\\$&'); }

  /* ── Escapar HTML (previene XSS al reflejar la búsqueda) ── */
  function escHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* ── Precio de producto (compatible con labs{} y variantes[]) ── */
  function precioProducto(p) {
    if (p.laboratorios) {
      var lk = Object.keys(p.laboratorios)[0];
      var lab = p.laboratorios[lk];
      if (lab && lab.precios) {
        var pk = Object.keys(lab.precios)[0];
        if (lab.precios[pk]) return lab.precios[pk].precio;
      }
    }
    if (p.variantes && p.variantes[0]) return p.variantes[0].precio || 0;
    return p.precio || 0;
  }

  /* ── Imagen de producto ── */
  function imagenProducto(p) {
    if (p.laboratorios) {
      var lk = Object.keys(p.laboratorios)[0];
      var lab = p.laboratorios[lk];
      if (lab && lab.imagen) return lab.imagen;
    }
    if (p.variantes && p.variantes[0] && p.variantes[0].imagen) return p.variantes[0].imagen;
    return p.imagen || '';
  }

  /* ── Formatear COP ── */
  function cop(n) { return n ? ('$' + Math.round(n).toLocaleString('es-CO')) : ''; }

  /* ── Estado del buscador activo ── */
  var _timer = null;
  var _activeIdx = -1;
  var _activeId = null; /* sufijo del input activo */

  /* ── Buscar y renderizar ── */
  function buscar(q, idSuffix) {
    var dd = document.getElementById('navSearchDropdown' + idSuffix);
    var inp = document.getElementById('navSearchInput' + idSuffix);
    if (!dd || !inp) return;
    _activeIdx = -1;
    _activeId = idSuffix;

    if (!q || q.length < 2) { cerrarDropdown(idSuffix); return; }

    var catalogo = window.CATALOGO || [];
    var ql = q.toLowerCase().trim();

    var resultados = catalogo.filter(function (p) {
      return (p.nombre       && p.nombre.toLowerCase().includes(ql))
          || (p.categoria    && p.categoria.toLowerCase().includes(ql))
          || (p.marca        && p.marca.toLowerCase().includes(ql))
          || (p.descripcion  && p.descripcion.toLowerCase().includes(ql))
          || (p.codigoBarras && p.codigoBarras.includes(ql));
    }).slice(0, 8);

    if (!resultados.length) {
      dd.innerHTML = [
        '<div class="nav-ac-empty">',
          '<i class="fas fa-search-minus"></i>',
          '<span>Sin resultados para <strong>«' + escHtml(q) + '»</strong></span>',
          '<a class="nav-ac-wa" href="https://wa.me/' + WA_NUM +
            '?text=' + encodeURIComponent('Hola, ¿tienen ' + q + '?') +
            '" target="_blank" rel="noopener">',
            '<i class="fab fa-whatsapp"></i> Preguntar por WhatsApp',
          '</a>',
        '</div>'
      ].join('');
      abrirDropdown(idSuffix);
      return;
    }

    var re = new RegExp('(' + esc(q) + ')', 'gi');

    var html = resultados.map(function (p, i) {
      var precio  = precioProducto(p);
      var imagen  = imagenProducto(p);
      var nombre  = p.nombre.replace(re, '<mark>$1</mark>');
      var destino = encodeURIComponent(p.nombre);
      var imgFallback = 'https://picsum.photos/seed/' + p.id + '/48/48';
      var imgSrc = imagen || imgFallback;

      return [
        '<button class="nav-ac-item"',
          ' role="option" data-idx="' + i + '"',
          ' data-nombre="' + escHtml(p.nombre) + '"',
          '>',
          '<img src="' + imgSrc + '" alt="" loading="lazy"',
            ' onerror="this.src=\'' + imgFallback + '\'">',
          '<span class="nav-ac-info">',
            '<span class="nav-ac-nombre">' + nombre + '</span>',
            '<span class="nav-ac-meta">',
              (p.marca ? p.marca + ' · ' : '') + (p.categoria || '') +
              (precio ? ' · <strong>' + cop(precio) + '</strong>' : ''),
            '</span>',
          '</span>',
          '<i class="fas fa-chevron-right nav-ac-arrow"></i>',
        '</button>'
      ].join('');
    }).join('');

    html += [
      '<div class="nav-ac-footer">',
        '<button class="nav-ac-ver-todos" onclick="navSearchIrACatalogo(\'' + idSuffix + '\')">',
          '<i class="fas fa-th-large"></i> Ver todos los resultados para «' + escHtml(q) + '»',
          '<i class="fas fa-arrow-right"></i>',
        '</button>',
      '</div>'
    ].join('');

    dd.innerHTML = html;

    /* Clic en cada resultado (listener directo — evita bugs de comillas en onclick) */
    var items = dd.querySelectorAll('.nav-ac-item');
    for (var k = 0; k < items.length; k++) {
      (function (btn) {
        btn.addEventListener('click', function () {
          navSearchIrA(btn.getAttribute('data-nombre'), idSuffix);
        });
      })(items[k]);
    }

    abrirDropdown(idSuffix);
  }

  /* ── Navegación ── */
  window.navSearchIrA = function (nombre, idSuffix) {
    idSuffix = idSuffix || '';
    var q = nombre || (document.getElementById('navSearchInput' + idSuffix) || {}).value || '';
    if (!q.trim()) return;
    /* Si estamos en productos.html → filtrar directo */
    var busqInput = document.getElementById('busquedaInput');
    if (busqInput && window.location.pathname.includes('productos')) {
      busqInput.value = q;
      busqInput.dispatchEvent(new Event('input', { bubbles: true }));
      cerrarDropdown(idSuffix);
      busqInput.focus();
    } else {
      window.location.href = 'productos.html?buscar=' + encodeURIComponent(q.trim());
    }
  };

  window.navSearchIrACatalogo = function (idSuffix) {
    idSuffix = idSuffix || '';
    var inp = document.getElementById('navSearchInput' + idSuffix);
    var q = inp ? inp.value.trim() : '';
    window.navSearchIrA(q, idSuffix);
  };

  /* ── Abrir/cerrar ── */
  function abrirDropdown(idSuffix) {
    var dd  = document.getElementById('navSearchDropdown' + idSuffix);
    var inp = document.getElementById('navSearchInput' + idSuffix);
    if (dd) dd.classList.add('activo');
    if (inp) inp.setAttribute('aria-expanded', 'true');
  }

  function cerrarDropdown(idSuffix) {
    var dd  = document.getElementById('navSearchDropdown' + idSuffix);
    var inp = document.getElementById('navSearchInput' + idSuffix);
    if (dd) { dd.innerHTML = ''; dd.classList.remove('activo'); }
    if (inp) inp.setAttribute('aria-expanded', 'false');
    _activeIdx = -1;
  }

  /* ── Navegación teclado ── */
  function navegarItems(dir, idSuffix) {
    var dd = document.getElementById('navSearchDropdown' + idSuffix);
    if (!dd) return;
    var items = dd.querySelectorAll('.nav-ac-item');
    if (!items.length) return;
    items.forEach(function (el) { el.classList.remove('nav-ac-item-focus'); });
    _activeIdx += dir;
    if (_activeIdx < 0) _activeIdx = items.length - 1;
    if (_activeIdx >= items.length) _activeIdx = 0;
    items[_activeIdx].classList.add('nav-ac-item-focus');
    items[_activeIdx].scrollIntoView({ block: 'nearest' });
  }

  /* ── Inicializar un input ── */
  function initInput(idSuffix) {
    var inp = document.getElementById('navSearchInput' + idSuffix);
    var btn = document.getElementById('navSearchBtn' + idSuffix);
    if (!inp) return;

    inp.addEventListener('input', function () {
      clearTimeout(_timer);
      var q = inp.value.trim();
      _timer = setTimeout(function () { buscar(q, idSuffix); }, 200);
    });

    inp.addEventListener('keydown', function (e) {
      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          if (_activeIdx >= 0 && _activeId === idSuffix) {
            var items = document.querySelectorAll('#navSearchDropdown' + idSuffix + ' .nav-ac-item');
            if (items[_activeIdx]) { items[_activeIdx].click(); return; }
          }
          window.navSearchIrACatalogo(idSuffix);
          break;
        case 'Escape':
          cerrarDropdown(idSuffix);
          inp.blur();
          break;
        case 'ArrowDown':
          e.preventDefault();
          navegarItems(1, idSuffix);
          break;
        case 'ArrowUp':
          e.preventDefault();
          navegarItems(-1, idSuffix);
          break;
      }
    });

    if (btn) {
      btn.addEventListener('click', function () { window.navSearchIrACatalogo(idSuffix); });
    }
  }

  /* ── Cerrar al click fuera ── */
  function cerrarAlClickFuera(e) {
    ['', 'M'].forEach(function (sfx) {
      var wrap = document.getElementById('navSearchWrap' + sfx);
      if (wrap && !wrap.contains(e.target)) cerrarDropdown(sfx);
    });
  }

  /* ── Inyectar buscador en navbar desktop ── */
  function inyectarDesktop() {
    var navbar = document.querySelector('nav.navbar');
    if (!navbar || document.getElementById('navSearchWrap')) return;
    var html = buildSearchHTML('');
    var div = document.createElement('div');
    div.innerHTML = html.trim();
    var el = div.firstChild;
    var actions = navbar.querySelector('.navbar-actions');
    var toggle  = navbar.querySelector('.navbar-toggle');
    var ref = actions || toggle;
    if (ref) navbar.insertBefore(el, ref);
    else navbar.appendChild(el);
    initInput('');
  }

  /* ── Inyectar buscador móvil (debajo del header/navbar) ── */
  function inyectarMovil() {
    if (document.getElementById('navSearchWrapM')) return;
    var header = document.querySelector('header.header, nav.navbar');
    if (!header) return;

    var mobileDiv = document.createElement('div');
    mobileDiv.className = 'navbar-search-mobile';
    mobileDiv.id = 'navSearchMobileWrap';
    mobileDiv.setAttribute('role', 'search');
    mobileDiv.innerHTML = buildSearchHTML('M');
    header.parentNode.insertBefore(mobileDiv, header.nextSibling);
    initInput('M');
  }

  /* ── Leer ?buscar= en productos.html ── */
  function leerParamBuscar() {
    if (!window.location.pathname.includes('productos')) return;
    try {
      var params = new URLSearchParams(window.location.search);
      var q = params.get('buscar');
      if (!q) return;
      /* Rellenar inputs del navbar */
      ['', 'M'].forEach(function (sfx) {
        var inp = document.getElementById('navSearchInput' + sfx);
        if (inp) inp.value = q;
      });
      /* Esperar a que el input del catálogo esté disponible */
      var intentos = 0;
      var intv = setInterval(function () {
        intentos++;
        var busqInput = document.getElementById('busquedaInput');
        if (busqInput) {
          busqInput.value = q;
          busqInput.dispatchEvent(new Event('input', { bubbles: true }));
          clearInterval(intv);
        } else if (intentos > 40) {
          clearInterval(intv);
        }
      }, 150);
    } catch (ex) {}
  }

  /* ── Init ── */
  ready(function () {
    inyectarDesktop();
    inyectarMovil();
    document.addEventListener('click', cerrarAlClickFuera);
    leerParamBuscar();
  });

})();
