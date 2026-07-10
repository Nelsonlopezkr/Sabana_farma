/* ══════════════════════════════════════════════════════════
 *  Sabana Farma — favoritos.js v1.0
 *  Lista de deseos con localStorage, ícono corazón animado,
 *  panel lateral y compatibilidad con productos-data.js
 *  IIIFE — no modifica ningún archivo existente.
 * ══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Clave localStorage ── */
  var LS_KEY = 'de_favoritos';

  /* ── Estado ── */
  var favoritos = [];

  /* ── Cargar desde localStorage ── */
  try {
    var raw = localStorage.getItem(LS_KEY);
    favoritos = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(favoritos)) favoritos = [];
  } catch (e) {
    favoritos = [];
  }

  /* ── Guardar ── */
  function guardar() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(favoritos)); } catch (e) {}
  }

  /* ── Verificar si un id está en favoritos ── */
  function esFavorito(id) {
    return favoritos.indexOf(Number(id)) !== -1;
  }

  /* ── Agregar / quitar favorito ── */
  function toggleFavorito(id) {
    id = Number(id);
    var idx = favoritos.indexOf(id);
    var agregado;
    if (idx === -1) {
      favoritos.push(id);
      agregado = true;
    } else {
      favoritos.splice(idx, 1);
      agregado = false;
    }
    guardar();
    actualizarBotonesCorazon(id);
    actualizarContadorFav();
    if (typeof DE_Toast !== 'undefined') {
      DE_Toast[agregado ? 'success' : 'info'](
        agregado ? '❤️ Agregado a favoritos' : '💔 Quitado de favoritos'
      );
    }
    return agregado;
  }

  /* ── Actualizar todos los botones de corazón para un producto ── */
  function actualizarBotonesCorazon(id) {
    document.querySelectorAll('.btn-favorito[data-id="' + id + '"]').forEach(function (btn) {
      var activo = esFavorito(id);
      btn.classList.toggle('activo', activo);
      btn.setAttribute('aria-label', activo ? 'Quitar de favoritos' : 'Agregar a favoritos');
      btn.setAttribute('aria-pressed', String(activo));
      btn.title = activo ? 'Quitar de favoritos' : 'Agregar a favoritos';
    });
  }

  /* ── Actualizar contador en navbar/panel ── */
  function actualizarContadorFav() {
    var n = favoritos.length;
    document.querySelectorAll('.fav-badge').forEach(function (b) {
      b.textContent = n;
      b.classList.toggle('oculto', n === 0);
    });
    var btnFav = document.getElementById('btnAbrirFavoritos');
    if (btnFav) {
      var sp = btnFav.querySelector('.fav-count-inline');
      if (sp) sp.textContent = n > 0 ? ' (' + n + ')' : '';
    }
    /* Actualizar panel si está abierto */
    var panelList = document.getElementById('favoritosLista');
    if (panelList && document.getElementById('favoritosPanel') &&
        document.getElementById('favoritosPanel').classList.contains('activo')) {
      renderPanelFavoritos();
    }
  }

  /* ── Crear botón corazón ── */
  function crearBotonCorazon(id) {
    var btn = document.createElement('button');
    btn.className = 'btn-favorito' + (esFavorito(id) ? ' activo' : '');
    btn.setAttribute('data-id', id);
    btn.setAttribute('aria-label', esFavorito(id) ? 'Quitar de favoritos' : 'Agregar a favoritos');
    btn.setAttribute('aria-pressed', String(esFavorito(id)));
    btn.title = esFavorito(id) ? 'Quitar de favoritos' : 'Agregar a favoritos';
    btn.innerHTML = '<i class="fas fa-heart" aria-hidden="true"></i>';
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      e.preventDefault();
      var idNum = Number(btn.getAttribute('data-id'));
      var ahora = toggleFavorito(idNum);
      /* Animación pulso */
      btn.classList.add('fav-pulse');
      setTimeout(function () { btn.classList.remove('fav-pulse'); }, 500);
    });
    return btn;
  }

  /* ── Inyectar botones en las tarjetas del catálogo ── */
  function inyectarCorazonesEnGrid() {
    document.querySelectorAll('.producto-card[data-id]').forEach(function (card) {
      var id = Number(card.getAttribute('data-id'));
      if (!id) return;
      if (card.querySelector('.btn-favorito')) return; /* ya tiene */
      var btn = crearBotonCorazon(id);
      btn.classList.add('btn-fav-card');
      card.style.position = 'relative';
      card.appendChild(btn);
    });
  }

  /* ── Obtener datos de producto desde CATALOGO ── */
  function getProducto(id) {
    if (typeof CATALOGO === 'undefined') return null;
    return CATALOGO.find(function (p) { return p.id === id; }) || null;
  }

  /* ── Precio mínimo de producto (compatible con labs{} y variantes[]) ── */
  function getPrecio(p) {
    if (!p) return 0;
    if (p.laboratorios) {
      var lk = Object.keys(p.laboratorios)[0];
      var lab = p.laboratorios[lk];
      if (lab && lab.precios) {
        var pk = Object.keys(lab.precios)[0];
        if (lab.precios[pk]) return lab.precios[pk].precio || 0;
      }
    }
    if (p.variantes && p.variantes[0]) return p.variantes[0].precio || 0;
    return p.precio || 0;
  }

  /* ── Imagen de producto ── */
  function getImagen(p) {
    if (!p) return '';
    if (p.laboratorios) {
      var lk = Object.keys(p.laboratorios)[0];
      var lab = p.laboratorios[lk];
      if (lab && lab.imagen) return lab.imagen;
    }
    if (p.variantes && p.variantes[0] && p.variantes[0].imagen) return p.variantes[0].imagen;
    return p.imagen || '';
  }

  /* ── Render del panel de favoritos ── */
  function renderPanelFavoritos() {
    var lista = document.getElementById('favoritosLista');
    if (!lista) return;

    if (!favoritos.length) {
      lista.innerHTML =
        '<div class="fav-vacio">' +
          '<i class="fas fa-heart-broken" aria-hidden="true"></i>' +
          '<p>Tu lista de favoritos está vacía</p>' +
          '<a href="productos.html" class="btn-ir-catalogo" onclick="cerrarFavoritos()">Explorar productos</a>' +
        '</div>';
      return;
    }

    var items = favoritos.map(function (id) {
      var p = getProducto(id);
      if (!p) return '';
      var precio  = getPrecio(p);
      var imagen  = getImagen(p);
      var inicial = (p.nombre || '?').charAt(0).toUpperCase();
      var imgTag  = imagen
        ? '<img src="' + imagen + '" alt="' + p.nombre + '" loading="lazy" ' +
          'onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
          '<span class="fav-img-placeholder" style="display:none">' + inicial + '</span>'
        : '<span class="fav-img-placeholder">' + inicial + '</span>';

      return '<div class="fav-item" data-id="' + id + '">' +
        '<div class="fav-item-img">' + imgTag + '</div>' +
        '<div class="fav-item-info">' +
          '<span class="fav-item-nombre">' + p.nombre + '</span>' +
          '<span class="fav-item-cat">' + (p.categoria || '') + '</span>' +
          '<span class="fav-item-precio">$' + precio.toLocaleString('es-CO') + '</span>' +
        '</div>' +
        '<div class="fav-item-acciones">' +
          '<button class="fav-btn-agregar" onclick="(function(){' +
            'var p=typeof CATALOGO!==\'undefined\'&&CATALOGO.find(function(x){return x.id===' + id + '});' +
            'if(p&&typeof agregarAlCarrito!==\'undefined\')agregarAlCarrito(p,0,null);' +
          '})()" aria-label="Agregar al carrito">' +
            '<i class="fas fa-cart-plus" aria-hidden="true"></i>' +
          '</button>' +
          '<button class="fav-btn-quitar" onclick="window.DEFavoritos.toggle(' + id + ')" aria-label="Quitar de favoritos">' +
            '<i class="fas fa-heart" aria-hidden="true"></i>' +
          '</button>' +
        '</div>' +
      '</div>';
    }).join('');

    lista.innerHTML = items || '<div class="fav-vacio"><p>No se encontraron productos</p></div>';
  }

  /* ── Abrir panel ── */
  function abrirFavoritos() {
    var panel = document.getElementById('favoritosPanel');
    if (!panel) return;
    renderPanelFavoritos();
    panel.classList.add('activo');
    document.body.style.overflow = 'hidden';
  }

  /* ── Cerrar panel ── */
  function cerrarFavoritos() {
    var panel = document.getElementById('favoritosPanel');
    if (!panel) return;
    panel.classList.remove('activo');
    document.body.style.overflow = '';
  }

  /* ── Inyectar panel de favoritos en DOM ── */
  function inyectarPanelFavoritos() {
    if (document.getElementById('favoritosPanel')) return;

    var html =
      '<div class="modal-overlay" id="favoritosPanel" role="dialog" aria-modal="true" aria-label="Mis favoritos">' +
        '<div class="fav-panel">' +
          '<div class="fav-header">' +
            '<h2><i class="fas fa-heart" aria-hidden="true"></i> Mis Favoritos</h2>' +
            '<button class="btn-cerrar-fav" id="btnCerrarFavoritos" aria-label="Cerrar favoritos">&#x2715;</button>' +
          '</div>' +
          '<div class="fav-lista" id="favoritosLista"></div>' +
        '</div>' +
      '</div>';

    document.body.insertAdjacentHTML('beforeend', html);

    document.getElementById('btnCerrarFavoritos').addEventListener('click', cerrarFavoritos);
    document.getElementById('favoritosPanel').addEventListener('click', function (e) {
      if (e.target === this) cerrarFavoritos();
    });
  }

  /* ── Inyectar botón de favoritos en navbar ── */
  function inyectarBtnNavbar() {
    /* Evitar duplicados */
    if (document.getElementById('btnAbrirFavoritos')) return;
    /* Buscar zona de acciones del navbar */
    var navActions = document.querySelector('.navbar-actions');
    if (!navActions) return;

    var btn = document.createElement('button');
    btn.id = 'btnAbrirFavoritos';
    btn.className = 'btn-fav-nav';
    btn.setAttribute('aria-label', 'Mis favoritos');
    btn.title = 'Mis favoritos';
    btn.innerHTML =
      '<i class="fas fa-heart" aria-hidden="true"></i>' +
      '<span class="fav-badge oculto" aria-live="polite" aria-label="Productos en favoritos">0</span>' +
      '<span class="fav-count-inline"></span>';
    btn.addEventListener('click', abrirFavoritos);

    /* Insertar antes del botón del carrito */
    var btnCarrito = document.getElementById('btnAbrirCarrito');
    if (btnCarrito) {
      navActions.insertBefore(btn, btnCarrito);
    } else {
      navActions.appendChild(btn);
    }
  }

  /* ── Observer para inyectar corazones cuando el grid se actualice ── */
  function observarGrid() {
    var grid = document.getElementById('productosGrid');
    if (!grid) return;
    var obs = new MutationObserver(function () {
      inyectarCorazonesEnGrid();
    });
    obs.observe(grid, { childList: true, subtree: false });
  }

  /* ── Init ── */
  function init() {
    inyectarPanelFavoritos();
    inyectarBtnNavbar();
    actualizarContadorFav();
    inyectarCorazonesEnGrid();
    observarGrid();

    /* Escuchar key Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') cerrarFavoritos();
    });
  }

  /* ── Esperar DOM ── */
  if (document.readyState !== 'loading') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }

  /* ── API pública ── */
  window.DEFavoritos = {
    toggle:       toggleFavorito,
    esFavorito:   esFavorito,
    abrir:        abrirFavoritos,
    cerrar:       cerrarFavoritos,
    getIds:       function () { return favoritos.slice(); },
    crearBoton:   crearBotonCorazon,
    refresh:      inyectarCorazonesEnGrid
  };

  /* Alias global usado en onclick del HTML generado por catalogo.js */
  window.cerrarFavoritos = cerrarFavoritos;

})();
