/**
 * ══════════════════════════════════════════════════════════
 *  Sabana Farma — catalogo.js v8.0 DYNAMIC
 *
 *  ✔ 100% dinámico — lee directamente de productos-data.js
 *  ✔ Funciona automáticamente para TODOS los productos
 *  ✔ Sin hardcodeo de laboratorios, presentaciones ni precios
 *  ✔ Laboratorios auto-detectados desde variantes[].laboratorio
 *  ✔ Presentaciones auto-detectadas desde presentaciones[]
 *  ✔ Variantes sin laboratorio → mostrar tipo completo
 *  ✔ Carrito distingue: producto + variante + presentación
 *  ✔ Paginación correcta (sin duplicados)
 *  ✔ BUG FIX: función selPresentacionModal no duplicada
 * ══════════════════════════════════════════════════════════
 */

'use strict';

/* ─── WhatsApp ─── */
var WA_NUM = '573118719476';

var CFG = {
  DESTACADOS: 10,
  POR_PAGINA: 12,
  DEBOUNCE:   260,
};


/* ── Ordenamiento del catálogo ── */
var ESTADO_ORDEN = 'relevancia'; /* relevancia | precio-asc | precio-desc | nombre-asc */

function ordenarResultados(criterio) {
  ESTADO_ORDEN = criterio || 'relevancia';
  /* Actualizar botones activos */
  document.querySelectorAll('.sort-btn').forEach(function(b) {
    b.classList.toggle('activo', b.dataset.orden === ESTADO_ORDEN);
  });
  aplicarFiltros();
}
window.ordenarResultados = ordenarResultados;

function _aplicarOrden(lista) {
  if (ESTADO_ORDEN === 'precio-asc') {
    return lista.slice().sort(function(a, b) {
      return _precioCard(a, 0) - _precioCard(b, 0);
    });
  }
  if (ESTADO_ORDEN === 'precio-desc') {
    return lista.slice().sort(function(a, b) {
      return _precioCard(b, 0) - _precioCard(a, 0);
    });
  }
  if (ESTADO_ORDEN === 'nombre-asc') {
    return lista.slice().sort(function(a, b) {
      return a.nombre.localeCompare(b.nombre, 'es');
    });
  }
  /* relevancia: mantener orden original (índice en CATALOGO) */
  return lista;
}

var ESTADO = {
  filtros:    { categoria: null, busqueda: '', precioMax: 200000, tagsActivos: [] },
  pagina:     1,
  resultados: [],
};

/* ── Estado activo por producto — persiste en localStorage ── */
var variantesActivas      = {};
var presentacionesActivas = {};
var laboratoriosActivos   = {};   /* key: productoId → labKey activo */
var modalVarianteActiva   = 0;
var modalPresentacionActiva = 0;
var modalLabActivo        = null; /* labKey activo en el modal */
var ES_INDEX = false;

/* ID del producto actualmente abierto en el modal */
var modalProductoId = null;

/* ══════════════════════════════════════════════════════════════════
   SISTEMA DE IMÁGENES DEL CATÁLOGO
   ──────────────────────────────────────────────────────────────────
   Prioridad de resolución de imagen (de mayor a menor):
   1. laboratorio.imagen  (imagen específica del lab activo)
   2. variante.imagen     (imagen de la variante activa)
   3. producto.imagen     (imagen base del producto)
   4. /img/productos/{slug}.webp  (carpeta local, se agrega sin tocar datos)
   5. /img/productos/{slug}.jpg   (fallback jpg)
   6. /img/categorias/{categoria}.svg  (ícono de categoría)
   7. Placeholder SVG inline elegante (nunca Picsum)

   Para agregar la imagen de un producto:
   Basta con subir el archivo a /img/productos/ con el nombre slug del producto.
   Ejemplo: "Dolex Forte" → /img/productos/dolex-forte.webp
   ══════════════════════════════════════════════════════════════════ */

var IMG_BASE = 'img/productos/';
var IMG_CATS = {
  'Medicamentos':     'img/categorias/medicamentos.svg',
  'Cuidado Personal y Belleza': 'img/categorias/cuidado-personal.svg',
  'Bebé y Mamá':      'img/categorias/bebe-mama.svg',
  'Mercado y Hogar':  'img/categorias/mercado-hogar.svg',
  'Marcas Propias':   'img/categorias/marcas-propias.svg',
};

function slugProducto(nombre) {
  return nombre.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function resolverImagen(p, fallbackSeed) {
  /* Retorna la mejor URL de imagen disponible.
     El llamador debe añadir onerror para manejar 404. */
  if (p._imgResuelta) return p._imgResuelta;

  // Primero: imagen base del producto (si ya tiene una asignada en los datos)
  if (p.imagen && !p.imagen.includes('picsum')) return p.imagen;

  // Segundo: ruta local por slug
  var slug = slugProducto(p.nombre);
  p._slugImg = slug;
  return IMG_BASE + slug + '.webp';
}

function onImgError(img, p, size) {
  /* FIX IMAGENES: los onerror inline no tienen acceso a la variable
     local p del render. Si no llega, reconstruir el contexto desde
     los data-attributes del propio <img>. */
  if (!p && img && img.getAttribute) {
    p = {
      _slugImg:  img.getAttribute('data-slug') || '',
      nombre:    img.getAttribute('data-slug') || '',
      categoria: img.getAttribute('data-cat')  || ''
    };
  }
  // size: 0='md' (card), 1='lg' (modal), 2='sm' (autocomplete), o string
  if (size === 0) size = 'md';
  if (size === 1) size = 'lg';
  if (size === 2) size = 'sm';
  /* Cadena de fallback cuando la imagen no existe en disco.
     Orden: .webp → .jpg → icono de categoría SVG → placeholder inline */
  var src = img.src;
  var slug = p ? (p._slugImg || slugProducto(p.nombre)) : '';
  var cat = p ? (p.categoria || '') : '';

  if (src.includes('.webp') && slug) {
    img.src = IMG_BASE + slug + '.jpg';
  } else if (IMG_CATS[cat]) {
    img.src = IMG_CATS[cat];
    img.style.padding = size === 'sm' ? '8px' : '24px';
    img.style.objectFit = 'contain';
    img.style.background = 'var(--gris-50)';
    img.style.opacity = '.6';
  } else {
    img.src = _placeholderSVG(cat, size);
  }
  img.onerror = null; // evitar bucle infinito
}

function _placeholderSVG(cat, size) {
  var meta = CAT_VISUAL[cat] || { icon: 'fa-box', accent: '#1565C0' };
  var sz = size === 'sm' ? 24 : 48;
  // SVG simple con la inicial de la categoría como fallback ultimalinea
  var letter = (cat || '?')[0].toUpperCase();
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + sz*4 + '" height="' + sz*4 + '" viewBox="0 0 100 100">' +
    '<rect width="100" height="100" fill="#E3F2FD" rx="12"/>' +
    '<text x="50" y="62" text-anchor="middle" font-size="44" font-family="sans-serif" fill="#1565C0" opacity=".4">' + letter + '</text>' +
    '</svg>';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

window.slugProducto     = slugProducto;
window.resolverImagen   = resolverImagen;
window.onImgError       = onImgError;


try { variantesActivas      = JSON.parse(localStorage.getItem('de_variantes')      || '{}'); } catch(e) { variantesActivas      = {}; }
try { presentacionesActivas = JSON.parse(localStorage.getItem('de_presentaciones') || '{}'); } catch(e) { presentacionesActivas = {}; }
try { laboratoriosActivos   = JSON.parse(localStorage.getItem('de_laboratorios')   || '{}'); } catch(e) { laboratoriosActivos   = {}; }

function _guardarSelecciones() {
  try { localStorage.setItem('de_variantes',      JSON.stringify(variantesActivas));      } catch(e) {}
  try { localStorage.setItem('de_presentaciones', JSON.stringify(presentacionesActivas)); } catch(e) {}
  try { localStorage.setItem('de_laboratorios',   JSON.stringify(laboratoriosActivos));   } catch(e) {}
}

/* ─── Formato moneda COP ─── */
var cop = function(n) {
  return '$' + Number(n).toLocaleString('es-CO');
};

/* ─── Metadatos visuales de categoría ─── */
var CAT_VISUAL = {
  'Medicamentos':              { emoji: '💊', accent: '#1565C0', bg: 'linear-gradient(135deg,#E3F2FD,#BBDEFB)', icon: 'fas fa-pills',         desc: 'Analgésicos, antibióticos y más' },
  'Cuidado Personal y Belleza':{ emoji: '🧴', accent: '#880E4F', bg: 'linear-gradient(135deg,#FCE4EC,#E1BEE7)', icon: 'fas fa-spa',           desc: 'Higiene, belleza y bienestar diario' },
  'Bebé y Mamá':               { emoji: '👶', accent: '#E65100', bg: 'linear-gradient(135deg,#FFF8E1,#FFECB3)', icon: 'fas fa-baby',          desc: 'Pañales, leches y cuidado infantil' },
  'Mercado y Hogar':           { emoji: '🏠', accent: '#6A1B9A', bg: 'linear-gradient(135deg,#F3E5F5,#E1BEE7)', icon: 'fas fa-home',          desc: 'Alimentos, limpieza y más' },
  'Marcas Propias':            { emoji: '⭐', accent: '#1B5E20', bg: 'linear-gradient(135deg,#E8F5E9,#C8E6C9)', icon: 'fas fa-star',          desc: 'Calidad DE al mejor precio' },
  /* Mantener retrocompatibilidad — no mostrar como categoría separada */
  'Belleza':          { emoji: '💄', accent: '#880E4F', bg: 'linear-gradient(135deg,#FCE4EC,#F8BBD0)', icon: 'fas fa-spa',           desc: 'Maquillaje, cremas y cuidado facial' },
  'Cuidado Personal': { emoji: '🧴', accent: '#00695C', bg: 'linear-gradient(135deg,#E0F2F1,#B2DFDB)', icon: 'fas fa-hand-sparkles', desc: 'Higiene y bienestar diario' },
};

/* ════════════════════════════════════════════════════════
   HELPERS DINÁMICOS
   Toda la lógica lee directamente del objeto producto.
   No hay nada hardcodeado.
   ════════════════════════════════════════════════════════ */

/**
 * ¿El producto tiene campo 'laboratorio' en sus variantes?
 * Si al menos una variante lo tiene, mostramos el selector de labs.
 */
function tieneLabels(producto) {
  return producto.variantes && producto.variantes.some(function(v) { return v.laboratorio; });
}

/**
 * ¿El producto tiene el campo laboratorios con precios propios?
 */
function tieneLaboratorios(producto) {
  return producto.laboratorios && Object.keys(producto.laboratorios).length > 0;
}

/**
 * ¿El producto tiene presentaciones (Unidad / Blíster / Caja)?
 */
function tienePresentaciones(producto) {
  return producto.presentaciones && producto.presentaciones.length > 0;
}

/**
 * ¿Alguna variante se vende individualmente?
 */
function tieneVentaIndividual(producto) {
  if (!producto.variantes) return false;
  return producto.variantes.some(function(v) {
    var t = (v.tipo || '').toLowerCase();
    return t.includes('unidad') || t.includes('und') ||
           t === 'x1' || t.endsWith(' x1') ||
           t.includes('por unidad');
  });
}

/**
 * Precio a mostrar para una card.
 * Prioridad: laboratorio activo → presentación activa → variante activa.
 */
function _precioCard(p, vi) {
  /* 1. Si tiene laboratorios → usar el primer precio del lab activo */
  if (tieneLaboratorios(p)) {
    var labKeys  = Object.keys(p.laboratorios);
    var labKey   = laboratoriosActivos[p.id] || labKeys[0];
    var lab      = p.laboratorios[labKey] || p.laboratorios[labKeys[0]];
    if (lab && lab.precios) {
      /* precio activo dentro del lab */
      var precKeys = Object.keys(lab.precios);
      var precKey  = (presentacionesActivas[p.id + '_' + labKey]) || precKeys[0];
      var precObj  = lab.precios[precKey] || lab.precios[precKeys[0]];
      if (precObj) return precObj.precio;
    }
  }
  /* 2. Fallback: presentaciones generales */
  var vari = (p.variantes[vi] || p.variantes[0]);
  if (tienePresentaciones(p)) {
    var piActivo = presentacionesActivas[p.id];
    var pi = (piActivo !== undefined && p.presentaciones[piActivo]) ? piActivo : 0;
    return p.presentaciones[pi].precio;
  }
  /* CORRECCIÓN BUG #7: precio de la variante ya es el precio final.
     NO aplicar calcularPrecioLaboratorio() sobre él. */
  return vari.precio || 0;
}

/* ════════════════════════════════════════════════════════
   SKELETON LOADER
   ════════════════════════════════════════════════════════ */
function renderSkeletons(n) {
  var html = '';
  for (var i = 0; i < n; i++) {
    html += '<article class="producto-card skeleton-card" aria-hidden="true">' +
      '<div class="skel-img"></div>' +
      '<div class="prod-body">' +
        '<div class="skel-line skel-s"></div>' +
        '<div class="skel-line skel-m"></div>' +
        '<div class="skel-line skel-l"></div>' +
        '<div class="skel-footer">' +
          '<div class="skel-line skel-precio"></div>' +
          '<div class="skel-btn"></div>' +
        '</div>' +
      '</div>' +
    '</article>';
  }
  return html;
}

/* ════════════════════════════════════════════════════════
   RENDER TARJETA DE PRODUCTO (card en el grid)
   v9.0 — Presentaciones con precio individual, diseño limpio
   ════════════════════════════════════════════════════════ */
function renderTarjeta(p) {
  var vi   = variantesActivas[p.id] !== undefined ? variantesActivas[p.id] : 0;
  var vari = p.variantes[vi] || p.variantes[0];
  var meta = CAT_VISUAL[p.categoria] || { emoji: '📦', accent: '#1565C0', bg: '#f5f5f5', icon: 'fas fa-box' };
  var seed = encodeURIComponent(p.nombre);

  /* CORRECCIÓN: si el producto tiene laboratorios{}, la imagen inicial debe
     corresponder al laboratorio activo (buscado en variantes[] por nombre).
     Si no, usar la variante activa o el fallback del producto. */
  var imagenSrc;
  if (tieneLaboratorios(p)) {
    var _labKeys0  = Object.keys(p.laboratorios);
    var _labKey0   = laboratoriosActivos[p.id] || _labKeys0[0];
    if (!p.laboratorios[_labKey0]) _labKey0 = _labKeys0[0];
    imagenSrc = _imagenParaLab(p, _labKey0);
    if (!imagenSrc) imagenSrc = resolverImagen(p, seed);
  } else {
    imagenSrc = vari.imagen || resolverImagen(p, seed);
  }

  /* Tags */
  var tagsHTML = '';
  if (p.tags && p.tags.length) {
    p.tags.slice(0, 2).forEach(function(t) {
      tagsHTML += '<span class="prod-tag" style="background:' + t.color + '">' + t.label + '</span>';
    });
  }

  /* ══════════════════════════════════════════════════════
     SECCIÓN "VENDER POR" — usa laboratorios si existen,
     de lo contrario usa presentaciones[] como antes.
  ══════════════════════════════════════════════════════ */
  var presHTML = '';

  if (tieneLaboratorios(p)) {
    /* ─── NUEVO: selector por laboratorio con precios propios ─── */
    var labEntries = Object.entries(p.laboratorios);
    var labKeyActivo = laboratoriosActivos[p.id] || labEntries[0][0];
    /* Sanity: si el labKey guardado ya no existe, caer al primero */
    if (!p.laboratorios[labKeyActivo]) labKeyActivo = labEntries[0][0];
    laboratoriosActivos[p.id] = labKeyActivo;

    var labActivo = p.laboratorios[labKeyActivo];
    var precEntries = Object.entries(labActivo.precios);
    var precKeyGuardado = presentacionesActivas[p.id + '_' + labKeyActivo];
    var precKeyActivo = (precKeyGuardado && labActivo.precios[precKeyGuardado])
      ? precKeyGuardado : precEntries[0][0];
    presentacionesActivas[p.id + '_' + labKeyActivo] = precKeyActivo;

    /* Botones de laboratorio */
    var labBtns = labEntries.map(function(entry) {
      var lk = entry[0];
      var lb = entry[1];
      var nombre = lb.nombre.split(' ')[0]; /* "GENFAR S.A." → "GENFAR" */
      /* Primer precio del lab para preview */
      var primerPrecio = Object.values(lb.precios)[0].precio;
      var isAct = lk === labKeyActivo;
      return '<button class="btn-lab-card' + (isAct ? ' activo' : '') + '"' +
        ' onclick="event.stopPropagation();selLaboratorio(' + p.id + ',\'' + lk + '\')"' +
        ' title="' + lb.nombre + ' — ' + lb.nombreProducto + '">' +
        '<span class="blc-lab">' + nombre + '</span>' +
        '</button>';
    }).join('');

    /* Botones de presentación del lab activo */
    var precBtns = precEntries.map(function(entry) {
      var pk = entry[0];
      var pv = entry[1];
      var isAct = pk === precKeyActivo;
      return '<button class="btn-pres-precio' + (isAct ? ' activo' : '') + '"' +
        ' onclick="event.stopPropagation();selPrecioLab(' + p.id + ',\'' + labKeyActivo + '\',\'' + pk + '\')"' +
        ' title="' + pv.label + '">' +
        '<span class="bpp-tipo">' + pv.label + '</span>' +
        '<span class="bpp-precio">' + cop(pv.precio) + '</span>' +
        '</button>';
    }).join('');

    var precioActivo = labActivo.precios[precKeyActivo].precio;

    presHTML =
      '<div class="pres-selector lab-selector" onclick="event.stopPropagation()">' +
        '<span class="pres-label"><i class="fas fa-flask"></i> LABORATORIO:</span>' +
        '<div class="lab-btns" id="lab-btns-' + p.id + '">' + labBtns + '</div>' +
        '<div class="lab-nombre-prod" id="lab-nombre-' + p.id + '" title="' + labActivo.nombreProducto + '">' +
          labActivo.nombreProducto +
        '</div>' +
        '<span class="pres-label" style="margin-top:.35rem"><i class="fas fa-cubes"></i> VENDER POR:</span>' +
        '<div class="pres-btns" id="pres-btns-' + p.id + '">' + precBtns + '</div>' +
        '<div class="pres-precio-seleccionado" id="pres-sel-' + p.id + '">' +
          '<span class="pps-label">Precio seleccionado:</span>' +
          '<span class="pps-valor" id="precio-pres-' + p.id + '">' + cop(precioActivo) + '</span>' +
        '</div>' +
      '</div>';

    /* Con laboratorios, no mostramos el bloque de variantes separado */
    var varHTML = '';

  } else if (tienePresentaciones(p)) {
    /* ─── PRESENTACIONES GENERALES (comportamiento original) ─── */
    if (presentacionesActivas[p.id] === undefined) {
      presentacionesActivas[p.id] = 0;
    }
    var piCard = presentacionesActivas[p.id];
    var prActiva = p.presentaciones[piCard] || p.presentaciones[0];

    presHTML = '<div class="pres-selector" onclick="event.stopPropagation()">' +
      '<span class="pres-label"><i class="fas fa-cubes"></i> VENDER POR:</span>' +
      '<div class="pres-btns">';
    p.presentaciones.forEach(function(pr, pi) {
      var esActivo = (pi === piCard);
      presHTML += '<button class="btn-pres-precio' + (esActivo ? ' activo' : '') + '"' +
        ' onclick="event.stopPropagation();selPresentacion(' + p.id + ',' + pi + ')"' +
        ' title="Seleccionar ' + pr.tipo + '">' +
        '<span class="bpp-tipo">' + pr.tipo + '</span>' +
        '<span class="bpp-precio">' + cop(pr.precio) + '</span>' +
        '</button>';
    });
    presHTML += '</div>' +
      '<div class="pres-precio-seleccionado" id="pres-sel-' + p.id + '">' +
        '<span class="pps-label">Precio seleccionado:</span>' +
        '<span class="pps-valor" id="precio-pres-' + p.id + '">' + cop(prActiva.precio) + '</span>' +
      '</div>' +
    '</div>';

    /* Selector de variantes (laboratorio) — solo si el producto las tiene */
    var varHTML = '';
    if (tieneLabels(p) && p.variantes.length > 1) {
      if (p.variantes.length <= 5) {
        varHTML = '<div class="variantes-btns variantes-labs">';
        p.variantes.forEach(function(v, idx) {
          var label = v.laboratorio || (v.tipo || '').split(' ').slice(0, 2).join(' ');
          varHTML += '<button class="btn-variante' + (idx === vi ? ' activo' : '') + '"' +
            ' onclick="event.stopPropagation();selVariante(' + p.id + ',' + idx + ')"' +
            ' title="' + (v.tipo || '') + '">' +
            '<span class="vb-tipo">' + label + '</span>' +
            '</button>';
        });
        varHTML += '</div>';
      } else {
        varHTML = '<select class="variante-select"' +
          ' onclick="event.stopPropagation()"' +
          ' onchange="event.stopPropagation();selVariante(' + p.id + ',this.value)">';
        p.variantes.forEach(function(v, idx) {
          varHTML += '<option value="' + idx + '"' + (idx === vi ? ' selected' : '') + '>' +
            (v.laboratorio ? v.laboratorio : v.tipo) + '</option>';
        });
        varHTML += '</select>';
      }
    }

    } else {
      /* ─── SIN LABORATORIOS NI PRESENTACIONES: solo variantes ─── */
      var varHTML = '';
      if (tieneLabels(p) && p.variantes.length > 1) {
        if (p.variantes.length <= 5) {
          varHTML = '<div class="variantes-btns variantes-labs">';
          p.variantes.forEach(function(v, idx) {
            var label = v.laboratorio || (v.tipo || '').split(' ').slice(0, 2).join(' ');
            /* CORRECCIÓN BUG #7: usar precio directo de la variante, sin recalcular */
            var precioV = v.precio || 0;
            varHTML += '<button class="btn-variante' + (idx === vi ? ' activo' : '') + '"' +
              ' onclick="event.stopPropagation();selVariante(' + p.id + ',' + idx + ')"' +
              ' title="' + (v.tipo || '') + '">' +
              '<span class="vb-tipo">' + label + '</span>' +
              '<span class="vb-precio">' + cop(precioV) + '</span>' +
              '</button>';
          });
          varHTML += '</div>';
        } else {
          varHTML = '<select class="variante-select"' +
            ' onclick="event.stopPropagation()"' +
            ' onchange="event.stopPropagation();selVariante(' + p.id + ',this.value)">';
          p.variantes.forEach(function(v, idx) {
            varHTML += '<option value="' + idx + '"' + (idx === vi ? ' selected' : '') + '>' +
              (v.laboratorio ? v.laboratorio : v.tipo) + '</option>';
          });
          varHTML += '</select>';
        }
      }
    }

  /* ── Precio principal en el footer de la card ──
     Si tiene presentaciones → usa el precio de la presentación activa.
     Si no → usa el precio de la variante activa. */
  var precioMostrar = _precioCard(p, vi);
  var precioFooterHTML = '<span class="prod-precio" id="precio-' + p.id + '">' + cop(precioMostrar) + '</span>';
  /* El label del footer cambia según si tiene presentaciones */
  var labelFooter = tienePresentaciones(p)
    ? '<span class="prod-desde">/ presentación</span>'
    : (p.variantes.length > 1 ? '<span class="prod-desde">/ variante</span>' : '');

  /* Badges INVIMA / Receta */
  var invimaHTML = p.categoria === 'Medicamentos'
    ? '<span class="prod-invima-badge"><i class="fas fa-shield-alt"></i> INVIMA</span>'
    : '';
  var recetaHTML = p.requiereReceta
    ? '<span class="prod-receta-badge"><i class="fas fa-prescription-bottle-alt"></i> Requiere Receta</span>'
    : '';

  /* FIX: incluir data-pres-activa en el HTML inicial para que agregarDesdeGrid
     siempre encuentre la presentación activa en el DOM */
  var piInicial = tienePresentaciones(p)
    ? (presentacionesActivas[p.id] !== undefined ? presentacionesActivas[p.id] : 0)
    : '';

  return '<article class="producto-card" data-id="' + p.id + '"' +
    (piInicial !== '' ? ' data-pres-activa="' + piInicial + '"' : '') +
    ' role="listitem"' +
    ' onclick="abrirModalProducto(' + p.id + ')"' +
    ' style="cursor:pointer"' +
    ' title="Ver detalle de ' + p.nombre + '">' +

    '<div class="prod-img-wrap">' +
      '<img src="' + imagenSrc + '" alt="' + p.nombre + '" loading="lazy"' +
        ' data-slug="' + slugProducto(p.nombre) + '" data-cat="' + (p.categoria || '') + '"' +
        ' onerror=\"onImgError(this,null,0)\">' +
      '<div class="prod-tags">' + tagsHTML + '</div>' +
      '<span class="prod-cat-badge" style="background:' + meta.accent + '22;color:' + meta.accent + '">' +
        meta.emoji + ' ' + p.categoria +
      '</span>' +
    '</div>' +

    '<div class="prod-body">' +
      '<p class="prod-marca">' + p.marca + '</p>' +
      '<h3 class="prod-nombre">' + p.nombre + '</h3>' +
      /* Solo descripción — sin info redundante de precio aquí */
      '<p class="prod-desc">' + p.descripcion + '</p>' +
      /* Selector de laboratorio (solo si aplica) */
      varHTML +
      /* Selector de presentaciones con precios */
      presHTML +
      invimaHTML +
      recetaHTML +
      '<div class="prod-footer">' +
        '<div class="prod-precio-wrap">' +
          precioFooterHTML +
          labelFooter +
        '</div>' +
        '<button class="btn-agregar"' +
          ' onclick="event.stopPropagation();agregarDesdeGrid(' + p.id + ', this)"' +
          ' aria-label="Agregar ' + p.nombre + ' al carrito">' +
          '<i class="fas fa-cart-plus"></i>' +
        '</button>' +
      '</div>' +
    '</div>' +
  '</article>';
}

/* ════════════════════════════════════════════════════════
   HELPER: imagen para un laboratorio dado
   ─────────────────────────────────────────────────────────
   Estrategia de matching (de más específica a más general):

   PRIORIDAD 0 — campo imagen directo en laboratorio{}:
      laboratorio.imagen = 'img/...' → usar directamente ✓ (NUEVO)

   1. labKey contiene el nombre de la variante:
      "genfar_s_a" contiene "genfar" → variante.laboratorio "Genfar" ✓
   2. lab.nombre (primera palabra) === variante.laboratorio exacto:
      "GENFAR" === "Genfar" (case-insensitive) ✓
   3. labKey (primera parte antes de _) === variante.laboratorio:
      "lafrancol" === "Lafrancol" ✓
   4. Variante cuyo lab aparece en nombreProducto del lab
   5. Fallback: producto.imagen
   ════════════════════════════════════════════════════════ */
function _imagenParaLab(p, labKey) {
  var labObj = p.laboratorios && p.laboratorios[labKey];

  /* ── PRIORIDAD 0: imagen definida directamente en el bloque laboratorio ── */
  if (labObj && labObj.imagen) {
    return labObj.imagen;
  }

  /* Sin variantes: solo podemos usar la imagen del producto */
  if (!p.variantes || !p.variantes.length) return p.imagen || '';

  /* "genfar_s_a" → ["genfar","s","a"] */
  var labKeyPartes = labKey.toLowerCase().split('_');
  /* "GENFAR S.A." → "genfar" */
  var labNombrePrimera = labObj
    ? labObj.nombre.split(/[\s.,]/)[0].toLowerCase()
    : labKeyPartes[0];

  var encontrada = null;

  /* Paso 1: el labKey completo CONTIENE el nombre de la variante
     ej: "genfar_s_a".includes("genfar") → TRUE
     Requerimos 4+ chars para evitar falsos positivos ("lp" dentro de "laproff", etc.)
     Para labs cortos como "MK", "GSK" se usa Paso 3 (coincidencia exacta). */
  encontrada = p.variantes.find(function(v) {
    var vLab = (v.laboratorio || '').toLowerCase();
    if (!vLab || vLab.length < 4) return false;
    return labKey.toLowerCase().includes(vLab) ||
           labKey.toLowerCase().replace(/_/g, '').includes(vLab.replace(/\s/g, ''));
  });

  /* Paso 2: primera palabra del nombre del lab === variante.laboratorio (exacto, case-insensitive) */
  if (!encontrada) {
    encontrada = p.variantes.find(function(v) {
      var vLab = (v.laboratorio || '').toLowerCase();
      return vLab === labNombrePrimera;
    });
  }

  /* Paso 3: primera parte del labKey (antes de _) === variante.laboratorio */
  if (!encontrada && labKeyPartes[0].length >= 2) {
    encontrada = p.variantes.find(function(v) {
      var vLab = (v.laboratorio || '').toLowerCase();
      return vLab === labKeyPartes[0];
    });
  }

  /* Paso 4: variante cuyo tipo/laboratorio aparece EXACTAMENTE en el nombreProducto del lab.
     Solo se aplica cuando el match es muy específico: el nombre de la variante debe coincidir
     con una palabra completa en el nombreProducto, y además la variante debe tener imagen propia.
     Se evita así que "CRONOFEN ACETAMINOFEN X100 NOVAMED" matchee la variante "Cronofen"
     cuando el laboratorio activo es Novamed. */
  if (!encontrada && labObj && labObj.nombreProducto) {
    var npLower = labObj.nombreProducto.toLowerCase();
    /* Solo hacer match si el labKey (primera parte) también aparece en el nombreProducto,
       lo que confirma que el nombreProducto realmente corresponde al laboratorio seleccionado */
    var labKeyPrimera = labKeyPartes[0];
    var labNombreEnNP = labObj.nombre.split(/[\s.,]/)[0].toLowerCase();
    var npContieneElLab = npLower.includes(labKeyPrimera) || npLower.includes(labNombreEnNP);
    if (npContieneElLab) {
      encontrada = p.variantes.find(function(v) {
        var vLab = (v.laboratorio || '').toLowerCase();
        /* El nombre del laboratorio de la variante debe ser la MISMA primera palabra del labKey */
        return vLab && vLab.length >= 3 && vLab === labKeyPrimera && v.imagen;
      });
    }
  }

  /* Fallback: imagen del producto (no usar primera variante al azar) */
  return (encontrada && encontrada.imagen) ? encontrada.imagen : (p.imagen || '');
}

/* ─── Seleccionar variante en tarjeta ─── */
function selVariante(id, idx) {
  idx = parseInt(idx, 10);
  variantesActivas[id] = idx;
  _guardarSelecciones();
  if (typeof CATALOGO === 'undefined') return;
  var p = CATALOGO.find(function(x) { return x.id === id; });
  if (!p) return;
  var v = p.variantes[idx];
  if (!v) return;

  /* Precio */
  var el = document.getElementById('precio-' + id);
  if (el) el.textContent = cop(_precioCard(p, idx));

  /* Imagen */
  var grid = document.getElementById('productosGrid');
  var card = grid ? grid.querySelector('[data-id="' + id + '"]') : null;
  var imgEl = card ? card.querySelector('.prod-img-wrap img') : null;
  if (imgEl && v.imagen) imgEl.src = v.imagen;

  /* Botones activos */
  if (card) {
    card.querySelectorAll('.btn-variante').forEach(function(b, bi) {
      b.classList.toggle('activo', bi === idx);
    });
  }
}
window.selVariante = selVariante;

/* ─── Seleccionar presentación en tarjeta ─── */
function selPresentacion(id, idx) {
  idx = parseInt(idx, 10);
  presentacionesActivas[id] = idx;
  _guardarSelecciones();
  if (typeof CATALOGO === 'undefined') return;
  var p = CATALOGO.find(function(x) { return x.id === id; });
  if (!p || !tienePresentaciones(p)) return;
  var pr = p.presentaciones[idx];
  if (!pr) return;

  /* Actualizar precio en "Precio seleccionado:" */
  var elPresSel = document.getElementById('precio-pres-' + id);
  if (elPresSel) elPresSel.textContent = cop(pr.precio);

  /* Actualizar precio en el footer de la card */
  var elFooter = document.getElementById('precio-' + id);
  if (elFooter) elFooter.textContent = cop(pr.precio);

  /* Resaltar botón activo */
  var grid = document.getElementById('productosGrid');
  var card = grid ? grid.querySelector('[data-id="' + id + '"]') : null;
  if (card) {
    /* Actualizar clase 'activo' en TODOS los botones de presentación */
    card.querySelectorAll('.btn-pres-precio').forEach(function(b, bi) {
      b.classList.toggle('activo', bi === idx);
    });
    /* Guardar presentación activa como atributo en la card */
    card.setAttribute('data-pres-activa', idx);
  }
}
window.selPresentacion = selPresentacion;

/* ─── Seleccionar laboratorio en tarjeta (nuevo sistema) ─── */
function selLaboratorio(id, labKey) {
  if (typeof CATALOGO === 'undefined') return;
  var p = CATALOGO.find(function(x) { return x.id === id; });
  if (!p || !tieneLaboratorios(p) || !p.laboratorios[labKey]) return;

  laboratoriosActivos[id] = labKey;
  _guardarSelecciones();

  var lab = p.laboratorios[labKey];
  var precEntries = Object.entries(lab.precios);
  /* Resetear al primer precio del nuevo lab */
  var precKeyActivo = precEntries[0][0];
  presentacionesActivas[id + '_' + labKey] = precKeyActivo;
  _guardarSelecciones();

  /* Actualizar botones de lab */
  var grid = document.getElementById('productosGrid');
  var card = grid ? grid.querySelector('[data-id="' + id + '"]') : null;
  if (card) {
    card.querySelectorAll('.btn-lab-card').forEach(function(b) {
      b.classList.toggle('activo', b.getAttribute('onclick').indexOf("'" + labKey + "'") !== -1);
    });

    /* Actualizar imagen de la tarjeta — CORRECCIÓN BUG #5 */
    var imgEl = card.querySelector('.prod-img-wrap img');
    if (imgEl) {
      var nuevaImg = _imagenParaLab(p, labKey);
      if (nuevaImg) {
        imgEl.src = nuevaImg;
        imgEl.onerror = function() {
          this.onerror = null;
          this.src = resolverImagen(p, seed);
        };
      }
    }

    /* Actualizar nombre del producto */
    var nombreEl = card.querySelector('#lab-nombre-' + id);
    if (nombreEl) {
      nombreEl.textContent = lab.nombreProducto;
      nombreEl.title       = lab.nombreProducto;
    }

    /* Reconstruir botones de precio */
    var precBtnsEl = card.querySelector('#pres-btns-' + id);
    if (precBtnsEl) {
      precBtnsEl.innerHTML = precEntries.map(function(entry) {
        var pk = entry[0]; var pv = entry[1];
        var isAct = pk === precKeyActivo;
        return '<button class="btn-pres-precio' + (isAct ? ' activo' : '') + '"' +
          ' onclick="event.stopPropagation();selPrecioLab(' + id + ',\'' + labKey + '\',\'' + pk + '\')"' +
          ' title="' + pv.label + '">' +
          '<span class="bpp-tipo">' + pv.label + '</span>' +
          '<span class="bpp-precio">' + cop(pv.precio) + '</span>' +
          '</button>';
      }).join('');
    }

    /* Actualizar precio seleccionado */
    var precioActivo = lab.precios[precKeyActivo].precio;
    var presSelEl = card.querySelector('#precio-pres-' + id);
    if (presSelEl) presSelEl.textContent = cop(precioActivo);
    var footerEl = document.getElementById('precio-' + id);
    if (footerEl) footerEl.textContent = cop(precioActivo);
  }
}
window.selLaboratorio = selLaboratorio;

/* ─── Seleccionar precio dentro del laboratorio activo (nuevo sistema) ─── */
function selPrecioLab(id, labKey, precKey) {
  if (typeof CATALOGO === 'undefined') return;
  var p = CATALOGO.find(function(x) { return x.id === id; });
  if (!p || !tieneLaboratorios(p) || !p.laboratorios[labKey]) return;

  var lab    = p.laboratorios[labKey];
  var precObj = lab.precios[precKey];
  if (!precObj) return;

  presentacionesActivas[id + '_' + labKey] = precKey;
  _guardarSelecciones();

  var grid = document.getElementById('productosGrid');
  var card = grid ? grid.querySelector('[data-id="' + id + '"]') : null;
  if (card) {
    /* Resaltar botón activo */
    card.querySelectorAll('#pres-btns-' + id + ' .btn-pres-precio').forEach(function(b) {
      var onclk = b.getAttribute('onclick') || '';
      b.classList.toggle('activo', onclk.indexOf("'" + precKey + "'") !== -1);
    });
    /* Actualizar precio seleccionado */
    var presSelEl = card.querySelector('#precio-pres-' + id);
    if (presSelEl) presSelEl.textContent = cop(precObj.precio);
    var footerEl = document.getElementById('precio-' + id);
    if (footerEl) footerEl.textContent = cop(precObj.precio);
  }
}
window.selPrecioLab = selPrecioLab;

/* ─── Agregar desde la grilla ─── */
function agregarDesdeGrid(id, btn) {
  if (typeof CATALOGO === 'undefined' || typeof agregarAlCarrito !== 'function') return;
  var p = CATALOGO.find(function(x) { return x.id === id; });
  if (!p) return;

  if (p.requiereReceta) {
    alert('Este producto requiere receta médica. Asegúrese de tenerla al momento de la entrega.');
  }

  var vi = variantesActivas[id] !== undefined ? variantesActivas[id] : 0;
  var pi = -1;

  /* ── CORRECCIÓN BUG #3 ──
     Si el producto usa sistema laboratorios{}, asegurarse de que
     laboratoriosActivos[id] esté correctamente sincronizado desde el DOM
     antes de llamar agregarAlCarrito. El estado ya lo gestiona selLaboratorio /
     selPrecioLab, pero verificamos la card del DOM por seguridad. */
  if (tieneLaboratorios(p)) {
    var grid = document.getElementById('productosGrid');
    var card = grid ? grid.querySelector('[data-id="' + id + '"]') : null;
    if (card) {
      var btnLabActivo = card.querySelector('.btn-lab-card.activo');
      if (btnLabActivo) {
        /* Extraer labKey del onclick del botón activo */
        var onclkLab = btnLabActivo.getAttribute('onclick') || '';
        var matchLab = onclkLab.match(/selLaboratorio\(\s*\d+\s*,\s*'([^']+)'\s*\)/);
        if (matchLab && matchLab[1] && p.laboratorios[matchLab[1]]) {
          laboratoriosActivos[id] = matchLab[1];
        }
      }
      var btnPrecActivo = card.querySelector('#pres-btns-' + id + ' .btn-pres-precio.activo');
      if (btnPrecActivo) {
        var onclkPrec = btnPrecActivo.getAttribute('onclick') || '';
        var matchPrec = onclkPrec.match(/selPrecioLab\(\s*\d+\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*\)/);
        if (matchPrec && matchPrec[1] && matchPrec[2]) {
          presentacionesActivas[id + '_' + matchPrec[1]] = matchPrec[2];
        }
      }
    }
    /* Para sistema laboratorios, pi=-1 (no usar sistema presentaciones[]) */
    agregarAlCarrito(p, vi, btn, -1);
    return;
  }

  if (tienePresentaciones(p)) {
    /* FIX: leer la presentación desde el atributo del DOM (fuente de verdad
       visual) y también desde el objeto en memoria. El DOM es más confiable
       porque se actualiza síncronamente cuando el usuario hace click. */
    var grid2 = document.getElementById('productosGrid');
    var card2 = grid2 ? grid2.querySelector('[data-id="' + id + '"]') : null;
    var piDOM = card2 ? card2.getAttribute('data-pres-activa') : null;

    if (piDOM !== null && piDOM !== '') {
      pi = parseInt(piDOM, 10);
    } else if (presentacionesActivas[id] !== undefined) {
      pi = presentacionesActivas[id];
    } else {
      pi = 0;
    }

    presentacionesActivas[id] = pi;
    _guardarSelecciones();
  }

  agregarAlCarrito(p, vi, btn, pi);
}
window.agregarDesdeGrid = agregarDesdeGrid;

/* ════════════════════════════════════════════════════════
   MODAL DE PRODUCTO — 100% DINÁMICO
   Lee toda la información directamente del objeto producto.
   ════════════════════════════════════════════════════════ */
function abrirModalProducto(id) {
  if (typeof CATALOGO === 'undefined') return;
  var p = CATALOGO.find(function(x) { return x.id === id; });
  if (!p) return;

  modalProductoId         = id;
  modalVarianteActiva     = variantesActivas[id] !== undefined ? variantesActivas[id] : 0;
  modalPresentacionActiva = (tienePresentaciones(p) && presentacionesActivas[id] !== undefined)
    ? presentacionesActivas[id] : 0;

  var meta = CAT_VISUAL[p.categoria] || { emoji: '📦', accent: '#1565C0' };

  var overlay = document.getElementById('modalProductoOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'modalProductoOverlay';
    overlay.className = 'modal-producto-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Detalle del producto');
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) cerrarModalProducto();
    });
  }

  overlay.innerHTML = _construirHTMLModal(p, meta);
  overlay.classList.add('activo');
  document.body.style.overflow = 'hidden';

  /* El botón de tema del modal se crea con ícono de luna por defecto;
     si ya estamos en modo oscuro, lo dejamos en sol para que coincida. */
  if (document.documentElement.getAttribute('data-theme') === 'dark') {
    var iconoTemaModal = overlay.querySelector('.btn-tema i');
    if (iconoTemaModal) iconoTemaModal.className = 'fas fa-sun';
  }

  overlay._escHandler = function(e) { if (e.key === 'Escape') cerrarModalProducto(); };
  document.addEventListener('keydown', overlay._escHandler);
}

/* ── Construir HTML del modal de forma 100% dinámica ── */
function _construirHTMLModal(p, meta) {
  var seed = encodeURIComponent(p.nombre);
  var vari = p.variantes[modalVarianteActiva] || p.variantes[0];

  /* CORRECCIÓN: imagen inicial del modal debe reflejar el lab activo */
  var imagenSrc;
  if (tieneLaboratorios(p)) {
    var _mLabKey = modalLabActivo || laboratoriosActivos[p.id] || Object.keys(p.laboratorios)[0];
    imagenSrc = _imagenParaLab(p, _mLabKey);
    if (!imagenSrc) imagenSrc = resolverImagen(p, seed);
  } else {
    imagenSrc = vari.imagen || resolverImagen(p, seed);
  }

  /* Tags */
  var tagsHTML = '';
  if (p.tags && p.tags.length) {
    p.tags.forEach(function(t) {
      tagsHTML += '<span class="prod-tag" style="background:' + t.color + ';border-radius:6px;font-size:.68rem;padding:.18rem .65rem">' + t.label + '</span>';
    });
  }

  /* INVIMA / Receta */
  var invimaHTML = p.categoria === 'Medicamentos'
    ? '<span class="prod-invima-badge" style="margin:.1rem 0"><i class="fas fa-shield-alt"></i> Reg. INVIMA — Medicamento certificado</span>'
    : '';
  var recetaHTML = p.requiereReceta
    ? '<div class="modal-alerta-receta"><i class="fas fa-exclamation-triangle"></i> <strong>Atención:</strong> Requiere fórmula médica válida. Preséntela al momento de la entrega.</div>'
    : '';

  /* ════════════════════════════════════════════════════════
     SECCIÓN LABORATORIOS EN MODAL — usa campo laboratorios{}
     si existe; si no, muestra las variantes como antes.
  ════════════════════════════════════════════════════════ */
  var labsHTML = '';

  if (tieneLaboratorios(p)) {
    /* ─── NUEVO: laboratorios con precios propios ─── */
    var labEntries = Object.entries(p.laboratorios);
    var labKeyActivo = laboratoriosActivos[p.id] || labEntries[0][0];
    if (!p.laboratorios[labKeyActivo]) labKeyActivo = labEntries[0][0];
    modalLabActivo = labKeyActivo;

    var labActual    = p.laboratorios[labKeyActivo];
    var precEntries  = Object.entries(labActual.precios);
    var precKeyGuard = presentacionesActivas[p.id + '_' + labKeyActivo];
    var precKeyMod   = (precKeyGuard && labActual.precios[precKeyGuard]) ? precKeyGuard : precEntries[0][0];
    modalPresentacionActiva = precKeyMod; /* reutilizar variable para el lab modal */

    labsHTML = '<div class="modal-seccion-titulo"><i class="fas fa-flask"></i> Laboratorios disponibles</div>' +
      '<div class="modal-labs-grid">';
    labEntries.forEach(function(entry) {
      var lk = entry[0]; var lb = entry[1];
      var isAct = lk === labKeyActivo;
      /* Precio más bajo del lab para mostrar en el botón */
      var preciosLab = Object.values(lb.precios);
      var precMinLab = Math.min.apply(null, preciosLab.map(function(x) { return x.precio; }));
      labsHTML += '<button class="modal-lab-card' + (isAct ? ' activo' : '') + '"' +
        ' data-labkey="' + lk + '"' +
        ' onclick="selLabModal(' + p.id + ',\'' + lk + '\')">' +
        '<span class="mlc-lab">' + lb.nombre.split(' ')[0] + '</span>' +
        '<span class="mlc-cant" style="font-size:.6rem;opacity:.7" title="' + lb.nombreProducto + '">' +
          lb.nombreProducto.substring(0, 30) + (lb.nombreProducto.length > 30 ? '…' : '') +
        '</span>' +
        '<span class="mlc-precio">desde ' + cop(precMinLab) + '</span>' +
        '</button>';
    });
    labsHTML += '</div>';

    /* Sección de precios del lab activo en modal */
    labsHTML += '<div class="modal-seccion-titulo" style="margin-top:.8rem"><i class="fas fa-cubes"></i> Presentación — ' + labActual.nombre + '</div>' +
      '<div class="modal-pres-grid" id="modalLabPresbtns">';
    precEntries.forEach(function(entry) {
      var pk = entry[0]; var pv = entry[1];
      var isAct = pk === precKeyMod;
      labsHTML += '<button class="modal-pres-pill' + (isAct ? ' activo' : '') + '"' +
        ' data-preckey="' + pk + '"' +
        ' onclick="selPrecioLabModal(' + p.id + ',\'' + labKeyActivo + '\',\'' + pk + '\')">' +
        '<span class="mpp-tipo">' + pv.label + '</span>' +
        '<span class="mpp-precio">' + cop(pv.precio) + '</span>' +
        '</button>';
    });
    labsHTML += '</div>';

  } else if (p.variantes && p.variantes.length > 0) {
    /* ─── FALLBACK: variantes originales (sabores, aromas, colores, referencias) ───
       Soporta título/ícono personalizado vía el campo opcional p.selector.
       Si no existe, mantiene el comportamiento anterior (100% compatible
       con los productos que no lo usan). ─── */
    var conLab = tieneLabels(p);
    var selectorMeta = p.selector || null;
    var titulo = (selectorMeta && selectorMeta.titulo)
      ? selectorMeta.titulo
      : (conLab ? 'Laboratorio disponible' + (p.variantes.length > 1 ? 's' : '') : 'Referencias disponibles');
    var icono = (selectorMeta && selectorMeta.icono)
      ? selectorMeta.icono
      : (conLab ? 'fas fa-flask' : 'fas fa-tags');

    labsHTML = '<div class="modal-seccion-titulo"><i class="' + icono + '"></i> ' + titulo + '</div>' +
      '<div class="modal-labs-grid">';

    p.variantes.forEach(function(v, vi) {
      var labNombre, labDetalle;
      if (conLab && v.laboratorio) {
        labNombre  = v.laboratorio;
        labDetalle = (v.tipo || '').replace(v.laboratorio, '').trim();
        if (!labDetalle) labDetalle = v.tipo || '';
      } else {
        labNombre  = v.tipo || '';
        labDetalle = '';
      }
      labsHTML += '<button class="modal-lab-card' + (vi === modalVarianteActiva ? ' activo' : '') + '"' +
        ' data-vi="' + vi + '"' +
        ' onclick="selVarianteModal(' + p.id + ', ' + vi + ')">' +
        '<span class="mlc-lab">' + labNombre + '</span>' +
        (labDetalle ? '<span class="mlc-cant">' + labDetalle + '</span>' : '') +
        '<span class="mlc-precio">' + cop(v.precio) + '</span>' +
        '</button>';
    });
    labsHTML += '</div>';
  }

  /* ════════════════════════════════════════════
     SECCIÓN MODALIDAD DE VENTA — solo si NO hay
     laboratorios (para no duplicar selectores).
  ════════════════════════════════════════════ */
  var presHTML = '';
  if (!tieneLaboratorios(p) && tienePresentaciones(p)) {
    presHTML = '<div class="modal-seccion-titulo"><i class="fas fa-cubes"></i> Modalidad de venta</div>' +
      '<div class="modal-pres-grid" id="modalPresbtns">';
    p.presentaciones.forEach(function(pr, pi) {
      presHTML += '<button class="modal-pres-pill' + (pi === modalPresentacionActiva ? ' activo' : '') + '"' +
        ' data-pi="' + pi + '"' +
        ' onclick="selPresentacionModal(' + p.id + ', ' + pi + ')">' +
        '<span class="mpp-tipo">' + pr.tipo + '</span>' +
        '<span class="mpp-precio">' + cop(pr.precio) + '</span>' +
        '</button>';
    });
    presHTML += '</div>';
  }

  /* ════════════════════════════════════════════
     PRECIO DINÁMICO MODAL
  ════════════════════════════════════════════ */
  var precioBase, tipoPrecioLabel;
  if (tieneLaboratorios(p)) {
    var _labKeyM = laboratoriosActivos[p.id] || Object.keys(p.laboratorios)[0];
    var _labM    = p.laboratorios[_labKeyM];
    var _precKeyM = (presentacionesActivas[p.id + '_' + _labKeyM]) || Object.keys(_labM.precios)[0];
    var _precObjM = _labM.precios[_precKeyM];
    precioBase      = _precObjM.precio;
    tipoPrecioLabel = _precObjM.label + ' — ' + _labM.nombre.split(' ')[0];
  } else if (tienePresentaciones(p) && p.presentaciones[modalPresentacionActiva]) {
    precioBase      = p.presentaciones[modalPresentacionActiva].precio;
    tipoPrecioLabel = p.presentaciones[modalPresentacionActiva].tipo;
  } else {
    precioBase      = vari.precio || 0;
    tipoPrecioLabel = vari.tipo   || '';
  }

  /* WhatsApp msg dinámico */
  var waMsg = encodeURIComponent(
    'Hola, quiero pedir: *' + p.nombre + '* — ' + (vari.tipo || '') +
    (tipoPrecioLabel && tipoPrecioLabel !== vari.tipo ? ' / ' + tipoPrecioLabel : '') +
    ' (' + cop(precioBase) + ').' +
    (p.requiereReceta ? ' Requiere receta médica.' : '') +
    ' ¿Tienen disponibilidad?'
  );

  return '<div class="modal-producto" role="document">' +

    /* ── Imagen lado izquierdo ── */
    '<div class="modal-prod-img-side">' +
      '<img id="modalProdImg" src="' + imagenSrc + '" alt="' + p.nombre + '"' +
        ' onclick="abrirImagenAmpliada(this)"' +
        ' data-slug="' + slugProducto(p.nombre) + '" data-cat="' + (p.categoria || '') + '"' +
        ' onerror=\"onImgError(this,null,1)\">' +
      '<button class="modal-img-zoom-hint" onclick="abrirImagenAmpliada(document.getElementById(\'modalProdImg\'))" aria-label="Ampliar imagen" title="Ampliar imagen">' +
        '<i class="fas fa-search-plus"></i>' +
      '</button>' +
    '</div>' +

    /* ── Información lado derecho ── */
    '<div class="modal-prod-info">' +

      '<button class="btn-tema" onclick="toggleTema()" aria-label="Cambiar tema claro/oscuro" title="Cambiar tema">' +
        '<i class="fas fa-moon"></i>' +
      '</button>' +

      '<button class="modal-close" onclick="cerrarModalProducto()" aria-label="Cerrar">' +
        '<i class="fas fa-times"></i>' +
      '</button>' +

      /* 1. Categoría + tags */
      '<div class="modal-header-chips">' +
        '<span class="modal-categoria-chip" style="background:' + meta.accent + '18;color:' + meta.accent + '">' +
          meta.emoji + ' ' + p.categoria +
        '</span>' +
        tagsHTML +
      '</div>' +

      /* 2. Marca + nombre + INVIMA */
      '<p class="modal-prod-marca">' + p.marca + '</p>' +
      '<h2 class="modal-prod-nombre">' + p.nombre + '</h2>' +
      invimaHTML +
      recetaHTML +

      /* 2b. Código de barras — refleja la variante activa si tiene uno propio */
      '<p class="modal-prod-codigo"><i class="fas fa-barcode"></i> ' +
        '<span id="modalCodigoBarras">' + ((vari && vari.codigoBarras) || p.codigoBarras || 'No registrado') + '</span>' +
      '</p>' +

      /* 3. Descripción */
      '<p class="modal-prod-desc">' + p.descripcion + '</p>' +

      /* 4. Laboratorios / Referencias (dinámico) */
      labsHTML +

      /* 5. Modalidad de venta (solo si aplica) */
      presHTML +

      /* 6. Precio destacado */
      '<div class="modal-precio-bloque" id="modalPrecioBloque">' +
        '<span class="modal-precio-val" id="modalPrecioVal">' + cop(precioBase) + '</span>' +
        '<span class="modal-precio-pres-label" id="modalPrecioLabel">/ ' + tipoPrecioLabel + '</span>' +
      '</div>' +

      /* 7. Botones */
      '<div class="modal-btns">' +
        '<button class="modal-btn-agregar" id="modalBtnAgregar"' +
          ' onclick="agregarDesdeModal(' + p.id + ')">' +
          '<i class="fas fa-cart-plus"></i> Agregar al carrito' +
        '</button>' +
        '<a class="modal-btn-wa"' +
          ' href="https://wa.me/' + WA_NUM + '?text=' + waMsg + '"' +
          ' target="_blank" rel="noopener">' +
          '<i class="fab fa-whatsapp"></i> Pedir' +
        '</a>' +
      '</div>' +

      /* 7b. Productos relacionados */
      renderRelacionados(p) +

      /* 8. Info extra */
      '<div class="modal-info-extra">' +
        '<div class="modal-info-item"><i class="fas fa-motorcycle"></i><span>🚚 <strong>Domicilio GRATIS en pedidos +$20.000 · Mosquera y Funza</strong></span></div>' +
        '<div class="modal-info-item"><i class="fas fa-mobile-alt"></i><span>💳 Pagos: Nequi · Transferencia al <strong>323 249 7559</strong></span></div>' +
        '<div class="modal-info-item"><i class="fas fa-shield-alt"></i><span>Productos 100% originales y verificados</span></div>' +
        '<div class="modal-info-item"><i class="fas fa-clock"></i><span>Entrega estimada <strong>30–40 min</strong></span></div>' +
      '</div>' +

    '</div>' +
  '</div>';
}

/* ════════════════════════════════════════════════════════
   SELECCIONAR VARIANTE (LABORATORIO) EN MODAL — DINÁMICO
   ════════════════════════════════════════════════════════ */
function selVarianteModal(prodId, vi) {
  if (typeof CATALOGO === 'undefined') return;
  var p = CATALOGO.find(function(x) { return x.id === prodId; });
  if (!p) return;

  modalVarianteActiva = parseInt(vi, 10);
  variantesActivas[prodId] = modalVarianteActiva;
  _guardarSelecciones();

  var v = p.variantes[modalVarianteActiva];
  if (!v) return;

  /* Precio — respetar presentación activa si existe */
  var precioEl = document.getElementById('modalPrecioVal');
  var labelEl  = document.getElementById('modalPrecioLabel');
  if (tienePresentaciones(p) && p.presentaciones[modalPresentacionActiva]) {
    var pr = p.presentaciones[modalPresentacionActiva];
    if (precioEl) precioEl.textContent = cop(pr.precio);
    if (labelEl)  labelEl.textContent  = '/ ' + pr.tipo;
  } else {
    /* CORRECCIÓN BUG #8: usar precio de la variante directamente, sin recalcular */
    var precioMostrar = v.precio || 0;
    if (precioEl) precioEl.textContent = cop(precioMostrar);
    if (labelEl)  labelEl.textContent  = '/ ' + (v.tipo || '');
  }

  /* Imagen con transición */
  var imgEl = document.getElementById('modalProdImg');
  if (imgEl) {
    /* CORRECCIÓN: 'seed' no existía en este scope; se reemplaza por un
       fallback seguro basado en el nombre del producto. */
    var nuevaSrc = v.imagen || p.imagen || resolverImagen(p, encodeURIComponent(p.nombre));
    imgEl.style.opacity = '0';
    setTimeout(function() { imgEl.src = nuevaSrc; imgEl.style.opacity = '1'; }, 150);
  }

  /* Código de barras — usa el de la variante si existe, si no el del producto */
  var codEl = document.getElementById('modalCodigoBarras');
  if (codEl) codEl.textContent = v.codigoBarras || p.codigoBarras || 'No registrado';

  /* Botones activos en el modal */
  document.querySelectorAll('.modal-labs-grid .modal-lab-card').forEach(function(btn) {
    btn.classList.toggle('activo', parseInt(btn.dataset.vi, 10) === modalVarianteActiva);
  });

  /* Sincronizar precio en la grilla */
  var gridPrecio = document.getElementById('precio-' + prodId);
  if (gridPrecio) gridPrecio.textContent = cop(_precioCard(p, modalVarianteActiva));

  /* Actualizar link WhatsApp */
  var waMsg = encodeURIComponent(
    'Hola, quiero pedir: *' + p.nombre + '* — ' + (v.tipo || '') +
    ' (' + cop(v.precio || 0) + ').' +
    (p.requiereReceta ? ' Requiere receta médica.' : '') +
    ' ¿Tienen disponibilidad?'
  );
  var waBtn = document.querySelector('.modal-btn-wa');
  if (waBtn) waBtn.href = 'https://wa.me/' + WA_NUM + '?text=' + waMsg;
}
window.selVarianteModal = selVarianteModal;

/* ════════════════════════════════════════════════════════
   SELECCIONAR LABORATORIO EN MODAL (nuevo sistema)
   ════════════════════════════════════════════════════════ */
function selLabModal(prodId, labKey) {
  if (typeof CATALOGO === 'undefined') return;
  var p = CATALOGO.find(function(x) { return x.id === prodId; });
  if (!p || !tieneLaboratorios(p) || !p.laboratorios[labKey]) return;

  laboratoriosActivos[prodId] = labKey;
  modalLabActivo = labKey;
  _guardarSelecciones();

  var lab = p.laboratorios[labKey];
  var precEntries = Object.entries(lab.precios);
  var precKeyActivo = precEntries[0][0];
  presentacionesActivas[prodId + '_' + labKey] = precKeyActivo;
  _guardarSelecciones();

  /* Resaltar botón de lab activo */
  document.querySelectorAll('.modal-labs-grid .modal-lab-card').forEach(function(btn) {
    btn.classList.toggle('activo', btn.getAttribute('data-labkey') === labKey);
  });

  /* Reconstruir botones de precio del lab */
  var precGrid = document.getElementById('modalLabPresbtns');
  if (precGrid) {
    precGrid.innerHTML = precEntries.map(function(entry) {
      var pk = entry[0]; var pv = entry[1];
      var isAct = pk === precKeyActivo;
      return '<button class="modal-pres-pill' + (isAct ? ' activo' : '') + '"' +
        ' data-preckey="' + pk + '"' +
        ' onclick="selPrecioLabModal(' + prodId + ',\'' + labKey + '\',\'' + pk + '\')">' +
        '<span class="mpp-tipo">' + pv.label + '</span>' +
        '<span class="mpp-precio">' + cop(pv.precio) + '</span>' +
        '</button>';
    }).join('');
    /* Actualizar el título de la sección */
    var tituloEl = precGrid.previousElementSibling;
    if (tituloEl) tituloEl.innerHTML = '<i class="fas fa-cubes"></i> Presentación — ' + lab.nombre;
  }

  /* Actualizar imagen del modal — CORRECCIÓN BUG #6 */
  var imgModal = document.getElementById('modalProdImg');
  if (imgModal) {
    var nuevaImgModal = _imagenParaLab(p, labKey);
    if (nuevaImgModal) {
      imgModal.style.opacity = '0';
      setTimeout(function() {
        imgModal.src = nuevaImgModal;
        imgModal.onerror = function() {
          this.onerror = null;
          this.src = resolverImagen(p, seed);
        };
        imgModal.style.opacity = '1';
      }, 150);
    }
  }

  /* Actualizar precio */
  var precioActivo = lab.precios[precKeyActivo].precio;
  var precioEl = document.getElementById('modalPrecioVal');
  var labelEl  = document.getElementById('modalPrecioLabel');
  if (precioEl) precioEl.textContent = cop(precioActivo);
  if (labelEl)  labelEl.textContent  = '/ ' + lab.precios[precKeyActivo].label + ' — ' + lab.nombre.split(' ')[0];

  /* Sincronizar con la tarjeta */
  var gridPrecio = document.getElementById('precio-' + prodId);
  if (gridPrecio) gridPrecio.textContent = cop(precioActivo);

  /* Sincronizar botones de lab en la tarjeta */
  selLaboratorio(prodId, labKey);
}
window.selLabModal = selLabModal;

/* ════════════════════════════════════════════════════════
   SELECCIONAR PRECIO DE LAB EN MODAL (nuevo sistema)
   ════════════════════════════════════════════════════════ */
function selPrecioLabModal(prodId, labKey, precKey) {
  if (typeof CATALOGO === 'undefined') return;
  var p = CATALOGO.find(function(x) { return x.id === prodId; });
  if (!p || !tieneLaboratorios(p) || !p.laboratorios[labKey]) return;

  var lab = p.laboratorios[labKey];
  var precObj = lab.precios[precKey];
  if (!precObj) return;

  presentacionesActivas[prodId + '_' + labKey] = precKey;
  _guardarSelecciones();

  /* Resaltar botón activo */
  var precGrid = document.getElementById('modalLabPresbtns');
  if (precGrid) {
    precGrid.querySelectorAll('.modal-pres-pill').forEach(function(btn) {
      btn.classList.toggle('activo', btn.getAttribute('data-preckey') === precKey);
    });
  }

  /* Actualizar precio */
  var precioEl = document.getElementById('modalPrecioVal');
  var labelEl  = document.getElementById('modalPrecioLabel');
  if (precioEl) precioEl.textContent = cop(precObj.precio);
  if (labelEl)  labelEl.textContent  = '/ ' + precObj.label + ' — ' + lab.nombre.split(' ')[0];

  /* Sincronizar con tarjeta */
  var gridPrecio = document.getElementById('precio-' + prodId);
  if (gridPrecio) gridPrecio.textContent = cop(precObj.precio);
  selPrecioLab(prodId, labKey, precKey);
}
window.selPrecioLabModal = selPrecioLabModal;

/* ════════════════════════════════════════════════════════
   SELECCIONAR PRESENTACIÓN EN MODAL — DINÁMICO
   Lee precio y tipo directamente del array presentaciones[]
   ════════════════════════════════════════════════════════ */
function selPresentacionModal(prodId, pi) {
  if (typeof CATALOGO === 'undefined') return;
  var p = CATALOGO.find(function(x) { return x.id === prodId; });
  if (!p || !tienePresentaciones(p)) return;

  modalPresentacionActiva = parseInt(pi, 10);
  presentacionesActivas[prodId] = modalPresentacionActiva;
  _guardarSelecciones();

  var pr = p.presentaciones[modalPresentacionActiva];
  if (!pr) return;

  /* Actualizar precio y label */
  var precioEl = document.getElementById('modalPrecioVal');
  var labelEl  = document.getElementById('modalPrecioLabel');
  if (precioEl) precioEl.textContent = cop(pr.precio);
  if (labelEl)  labelEl.textContent  = '/ ' + pr.tipo;

  /* Botones activos en modal — usar selector robusto */
  var btnSelector = '#modalPresbtns .modal-pres-pill, .modal-pres-grid .modal-pres-pill, [class*="modal"][class*="pres"]';
  document.querySelectorAll(btnSelector).forEach(function(btn) {
    if (btn.getAttribute('data-pi')) {
      btn.classList.toggle('activo', parseInt(btn.getAttribute('data-pi'), 10) === modalPresentacionActiva);
    }
  });

  /* Sincronizar precio y botones en la grilla */
  var gridPrecio = document.getElementById('precio-' + prodId);
  if (gridPrecio) gridPrecio.textContent = cop(pr.precio);

  var grid = document.getElementById('productosGrid');
  var card = grid ? grid.querySelector('[data-id="' + prodId + '"]') : null;
  if (card) {
    card.querySelectorAll('.btn-pres-precio').forEach(function(b, bi) {
      b.classList.toggle('activo', bi === modalPresentacionActiva);
    });
    card.setAttribute('data-pres-activa', modalPresentacionActiva);
  }

  /* Badge de ahorro si existe */
  var badge = document.getElementById('modalAhorroBadge');
  if (badge && p.presentaciones.length > 1) {
    var precioBase = p.presentaciones[0].precio;
    if (modalPresentacionActiva > 0 && pr.precio > precioBase) {
      var cantRef = pr.cantidad || (modalPresentacionActiva + 1);
      var precioUni = Math.round(pr.precio / cantRef);
      var precioUniBase = precioBase;
      if (precioUni < precioUniBase) {
        var ahorroPct = Math.round((1 - precioUni / precioUniBase) * 100);
        badge.style.display = 'inline-flex';
        badge.innerHTML = '<i class="fas fa-piggy-bank"></i> ' +
          'Ahorras ' + ahorroPct + '% por unidad vs presentación individual';
      } else {
        badge.style.display = 'none';
      }
    } else {
      badge.style.display = 'none';
    }
  }
}
window.selPresentacionModal = selPresentacionModal;

/* ─── Agregar al carrito desde modal ─── */
function agregarDesdeModal(prodId) {
  if (typeof CATALOGO === 'undefined' || typeof agregarAlCarrito !== 'function') return;
  var p = CATALOGO.find(function(x) { return x.id === prodId; });
  if (!p) return;
  if (p.requiereReceta) {
    alert('Este producto requiere receta médica. Asegúrese de tenerla al momento de la entrega.');
  }

  /* CORRECCIÓN BUG #4: para sistema laboratorios{}, asegurarse de que
     laboratoriosActivos[prodId] y presentacionesActivas estén sincronizados
     con el estado del modal (modalLabActivo / modalPresentacionActiva). */
  if (tieneLaboratorios(p)) {
    if (modalLabActivo && p.laboratorios[modalLabActivo]) {
      laboratoriosActivos[prodId] = modalLabActivo;
      /* modalPresentacionActiva contiene el precKey cuando hay labs */
      if (modalPresentacionActiva && p.laboratorios[modalLabActivo].precios[modalPresentacionActiva]) {
        presentacionesActivas[prodId + '_' + modalLabActivo] = modalPresentacionActiva;
      }
    }
    _guardarSelecciones();
    agregarAlCarrito(p, modalVarianteActiva, null, -1);
  } else {
    var pi = tienePresentaciones(p) ? modalPresentacionActiva : -1;
    agregarAlCarrito(p, modalVarianteActiva, null, pi);
  }

  var btn = document.getElementById('modalBtnAgregar');
  if (btn) {
    var orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> ¡Agregado!';
    btn.style.background = '#2E7D32';
    setTimeout(function() { btn.innerHTML = orig; btn.style.background = ''; }, 1400);
  }
}
window.agregarDesdeModal = agregarDesdeModal;

/* ─── Cerrar modal ─── */

/* ══════════════════════════════════════════════════════════
   CROSS-SELL — productos relacionados por categoría
   Muestra hasta 4 productos de la misma categoría
   excluyendo el producto actual.
   ══════════════════════════════════════════════════════════ */
function renderRelacionados(p) {
  if (typeof CATALOGO === 'undefined') return '';
  var mismaCategoria = CATALOGO.filter(function(c) {
    if (c.id === p.id) return false;
    /* Soporte para fusión Cuidado Personal y Belleza */
    var catP = p.categoria;
    var catC = c.categoria;
    if (catP === 'Cuidado Personal y Belleza' || catP === 'Belleza' || catP === 'Cuidado Personal') {
      return catC === 'Cuidado Personal y Belleza' || catC === 'Belleza' || catC === 'Cuidado Personal';
    }
    return catC === catP;
  });
  if (!mismaCategoria.length) return '';

  /* Priorizar productos con tag "Más vendido", luego orden original */
  mismaCategoria.sort(function(a, b) {
    var aMv = a.tags && a.tags.some(function(t) { return t.label === 'Más vendido'; }) ? 0 : 1;
    var bMv = b.tags && b.tags.some(function(t) { return t.label === 'Más vendido'; }) ? 0 : 1;
    return aMv - bMv;
  });

  var items = mismaCategoria.slice(0, 4);
  var num = WA_NUM;

  var html = '<div class="cross-sell-wrap">' +
    '<p class="cross-sell-titulo"><i class="fas fa-star"></i> También te puede interesar</p>' +
    '<div class="cross-sell-grid">';

  items.forEach(function(rel) {
    var precio = _precioCard(rel, 0);
    var seed   = encodeURIComponent(rel.nombre);
    var img    = (rel.variantes[0] && rel.variantes[0].imagen) || resolverImagen(rel, seed);
    var msg    = encodeURIComponent('Hola, me interesa: ' + rel.nombre + ' — ¿tienen disponible?');
    html +=
      '<button class="cs-item" onclick="cerrarModalProducto();setTimeout(function(){abrirModalProducto(' + rel.id + ')},180)">' +
        '<img src="' + img + '" alt="' + rel.nombre + '" loading="lazy" onerror="this.style.display=&quot;none&quot;">' +
        '<div class="cs-info">' +
          '<span class="cs-nombre">' + rel.nombre + '</span>' +
          '<span class="cs-precio">' + cop(precio) + '</span>' +
        '</div>' +
      '</button>';
  });

  html += '</div></div>';
  return html;
}

function cerrarModalProducto() {
  var overlay = document.getElementById('modalProductoOverlay');
  if (!overlay) return;
  overlay.classList.remove('activo');
  document.body.style.overflow = '';
  modalProductoId = null;
  if (overlay._escHandler) {
    document.removeEventListener('keydown', overlay._escHandler);
    overlay._escHandler = null;
  }
}
window.cerrarModalProducto = cerrarModalProducto;
window.abrirModalProducto  = abrirModalProducto;

/* ════════════════════════════════════════════════════════
   LIGHTBOX — Ampliar imagen del producto (tap para zoom)
   ════════════════════════════════════════════════════════ */
function abrirImagenAmpliada(imgEl) {
  if (!imgEl || !imgEl.src) return;

  var overlay = document.getElementById('lightboxImgOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'lightboxImgOverlay';
    overlay.className = 'lightbox-img-overlay';
    overlay.innerHTML =
      '<button class="lightbox-close-btn" aria-label="Cerrar imagen ampliada" onclick="cerrarImagenAmpliada()">' +
        '<i class="fas fa-times"></i>' +
      '</button>' +
      '<img id="lightboxImg" src="" alt="">';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) cerrarImagenAmpliada();
    });
  }

  var lbImg = document.getElementById('lightboxImg');
  lbImg.src = imgEl.src;
  lbImg.alt = imgEl.alt || '';

  overlay.classList.add('activo');
  document.body.style.overflow = 'hidden';

  overlay._escHandler = function(e) { if (e.key === 'Escape') cerrarImagenAmpliada(); };
  document.addEventListener('keydown', overlay._escHandler);
}
window.abrirImagenAmpliada = abrirImagenAmpliada;

function cerrarImagenAmpliada() {
  var overlay = document.getElementById('lightboxImgOverlay');
  if (!overlay) return;
  overlay.classList.remove('activo');

  /* Restaurar scroll solo si el modal de producto también está cerrado */
  var modalProducto = document.getElementById('modalProductoOverlay');
  if (!modalProducto || !modalProducto.classList.contains('activo')) {
    document.body.style.overflow = '';
  }
  if (overlay._escHandler) document.removeEventListener('keydown', overlay._escHandler);
}
window.cerrarImagenAmpliada = cerrarImagenAmpliada;

/* ════════════════════════════════════════════════════════
   ESTILOS INYECTADOS POR JS
   Solo para elementos del catálogo que NO están en estilos.css.
   Los estilos del modal viven en estilos.css (bloque MODAL DEFINITIVO v3).
   ════════════════════════════════════════════════════════ */
function inyectarEstilosModal() {
  if (document.getElementById('modal-extra-styles')) return;
  var s = document.createElement('style');
  s.id = 'modal-extra-styles';
  s.textContent = [
    /* Cards del catálogo */
    '.prod-img-wrap{position:relative;width:100%;aspect-ratio:1/1;overflow:hidden;background:#f8f8f8;display:flex;align-items:center;justify-content:center;border-radius:12px 12px 0 0}',
    '.prod-img-wrap img{width:100%;height:100%;object-fit:contain;object-position:center;transition:transform .4s ease;padding:8px;box-sizing:border-box}',
    '.producto-card:hover .prod-img-wrap img{transform:scale(1.05)}',
    '.producto-card{display:flex;flex-direction:column;height:100%;border-radius:14px;border:1.5px solid #e8e8e8;overflow:hidden;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.06);transition:transform .22s,box-shadow .22s}',
    '.producto-card:hover{transform:translateY(-4px);box-shadow:0 8px 24px rgba(0,0,0,.12)}',
    '.prod-body{display:flex;flex-direction:column;flex:1;padding:1rem;gap:.3rem}',
    '.prod-footer{margin-top:auto;padding-top:.5rem;display:flex;align-items:center;justify-content:space-between;gap:.4rem}',
    /* Badge unidad */
    '.badge-unidad{display:inline-flex;align-items:center;gap:.25rem;background:#E0F2F1;color:#00695C;border:1px solid #B2DFDB;border-radius:6px;font-size:.66rem;font-weight:800;padding:.15rem .55rem;margin:.2rem 0 .3rem}',
    '.badge-unidad i{font-size:.6rem}',
    /* Descuento */
    '.prod-descuento-pct{background:#e53935;color:#fff;font-size:.6rem;font-weight:900;padding:.1rem .4rem;border-radius:50px;margin-left:.3rem;white-space:nowrap}',
    /* Variantes en card */
    '.variantes-btns{display:flex;flex-wrap:wrap;gap:.3rem;margin:.15rem 0 .3rem}',
    '.variantes-labs .btn-variante{min-width:56px}',
    '.btn-variante{display:flex;flex-direction:column;align-items:flex-start;padding:.35rem .6rem;border:1.5px solid #e0e0e0;border-radius:8px;background:#fff;cursor:pointer;font-family:inherit;transition:all .15s;min-width:70px;max-width:120px}',
    '.btn-variante:hover{border-color:#1565C0;background:#E3F2FD}',
    '.btn-variante.activo{border-color:#1565C0;background:#1565C0;color:#fff}',
    '.btn-variante .vb-tipo{font-size:.65rem;font-weight:700;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100px}',
    '.btn-variante .vb-precio{font-size:.75rem;font-weight:900;margin-top:.05rem}',
    /* Selector presentaciones en card — v9 con precio por opción */
    '.pres-selector{margin:.4rem 0 .15rem;padding:.4rem .5rem;background:#F8FFFE;border:1.5px solid #E0F2F1;border-radius:10px}',
    '.pres-label{font-size:.62rem;font-weight:800;color:#00695C;text-transform:uppercase;letter-spacing:.05em;display:flex;align-items:center;gap:.3rem;margin-bottom:.3rem}',
    '.pres-btns{display:flex;flex-wrap:wrap;gap:.3rem;margin-bottom:.35rem}',
    /* Botón de presentación CON precio propio */
    '.btn-pres-precio{display:flex;flex-direction:column;align-items:center;padding:.3rem .55rem;border:1.5px solid #B2DFDB;border-radius:8px;background:#fff;cursor:pointer;font-family:inherit;transition:all .15s;min-width:72px;text-align:center}',
    '.btn-pres-precio:hover{border-color:#1565C0;background:#E3F2FD;transform:translateY(-1px)}',
    '.btn-pres-precio.activo{border-color:#1565C0;background:#1565C0;color:#fff;box-shadow:0 2px 8px #1565C044}',
    '.btn-pres-precio .bpp-tipo{font-size:.63rem;font-weight:700;line-height:1.2;white-space:nowrap}',
    '.btn-pres-precio .bpp-precio{font-size:.78rem;font-weight:900;margin-top:.1rem}',
    '.btn-pres-precio.activo .bpp-precio{color:#fff}',
    /* Precio dinámico seleccionado */
    '.pres-precio-seleccionado{display:flex;align-items:center;justify-content:space-between;background:#E3F2FD;border-radius:6px;padding:.22rem .5rem;font-size:.72rem}',
    '.pps-label{color:#1565C0;font-weight:600}',
    '.pps-valor{color:#0d47a1;font-weight:900;font-size:.82rem}',
    /* === NUEVO: selector de laboratorio en card === */
    '.lab-selector{background:#F3F8FF;border-color:#BBDEFB}',
    '.lab-btns{display:flex;flex-wrap:wrap;gap:.28rem;margin-bottom:.3rem}',
    '.btn-lab-card{padding:.28rem .6rem;border:1.5px solid #BBDEFB;border-radius:7px;background:#fff;cursor:pointer;font-family:inherit;transition:all .15s;font-size:.68rem;font-weight:700;color:#1565C0;white-space:nowrap}',
    '.btn-lab-card:hover{border-color:#1565C0;background:#E3F2FD}',
    '.btn-lab-card.activo{border-color:#1565C0;background:#1565C0;color:#fff;box-shadow:0 2px 6px #1565C033}',
    '.lab-nombre-prod{font-size:.6rem;color:#555;background:#EEF4FF;border-radius:5px;padding:.2rem .45rem;margin:.1rem 0 .3rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;display:block}',
    /* variante-select (más de 5 variantes) */
    '.variante-select{width:100%;padding:.35rem .5rem;border:1.5px solid #e0e0e0;border-radius:8px;font-family:inherit;font-size:.75rem;font-weight:600;color:#333;background:#fff;cursor:pointer;margin:.2rem 0}',
  ].join('');
  document.head.appendChild(s);
}

/* ════════════════════════════════════════════════════════
   CATEGORÍAS PRESENTES EN EL CATÁLOGO
   Devuelve solo las categorías que tienen al menos 1 producto,
   en el orden definido en CAT_VISUAL (y cualquier categoría nueva
   que no esté en CAT_VISUAL se agrega al final, por seguridad).
   ════════════════════════════════════════════════════════ */
function getCategorias() {
  /* Categorías fusionadas: Belleza + Cuidado Personal → Cuidado Personal y Belleza */
  var FUSIONADAS = ['Belleza', 'Cuidado Personal'];
  var NOMBRE_FUSIONADO = 'Cuidado Personal y Belleza';

  var presentes = {};
  var tieneFusionadas = false;
  CATALOGO.forEach(function(p) {
    if (!p.categoria) return;
    if (FUSIONADAS.indexOf(p.categoria) !== -1) {
      tieneFusionadas = true;
    } else {
      presentes[p.categoria] = true;
    }
  });
  if (tieneFusionadas) presentes[NOMBRE_FUSIONADO] = true;

  /* Orden según CAT_VISUAL (excluir las entradas de retrocompatibilidad) */
  var ordenPrincipal = ['Medicamentos', NOMBRE_FUSIONADO, 'Bebé y Mamá', 'Mercado y Hogar', 'Marcas Propias'];
  var ordenadas = ordenPrincipal.filter(function(c) { return presentes[c]; });
  Object.keys(presentes).forEach(function(c) {
    if (ordenadas.indexOf(c) === -1) ordenadas.push(c);
  });
  return ordenadas;
}

/* ════════════════════════════════════════════════════════
   RENDER CATEGORÍAS
   ════════════════════════════════════════════════════════ */
function renderCategorias() {
  var el = document.getElementById('categoriasGrid');
  if (!el || typeof CATALOGO === 'undefined') return;
  var cats = getCategorias();

  if (ES_INDEX) {
    var html = '<button class="cat-btn' + (!ESTADO.filtros.categoria ? ' activo' : '') + '" onclick="filtrarCategoria(null)">' +
      '🏪 Todos <span class="cat-count">' + CATALOGO.length + '</span>' +
    '</button>';
    cats.forEach(function(cat) {
      var m   = CAT_VISUAL[cat] || { emoji: '📦', accent: '#1565C0' };
      var cnt;
      if (cat === 'Cuidado Personal y Belleza') {
        cnt = CATALOGO.filter(function(p) {
          return p.categoria === 'Belleza' || p.categoria === 'Cuidado Personal' || p.categoria === 'Cuidado Personal y Belleza';
        }).length;
      } else {
        cnt = CATALOGO.filter(function(p) { return p.categoria === cat; }).length;
      }
      var act = ESTADO.filtros.categoria === cat;
      html += '<button class="cat-btn' + (act ? ' activo' : '') + '" onclick="filtrarCategoria(\'' + cat + '\')"' +
        (act ? ' style="background:' + m.accent + ';color:#fff;border-color:' + m.accent + '"' : '') + '>' +
        m.emoji + ' ' + cat + ' <span class="cat-count">' + cnt + '</span>' +
      '</button>';
    });
    el.innerHTML = html;
  } else {
    inyectarEstilosExtra();
    var html2 = '<div class="cat-cards-grid">';
    html2 += '<button class="cat-card' + (!ESTADO.filtros.categoria ? ' activo' : '') + '"' +
      ' onclick="filtrarCategoria(null)"' +
      ' style="--cat-bg:linear-gradient(135deg,#E3F2FD,#BBDEFB);--cat-accent:#1565C0">' +
      '<div class="cat-card-icon"><i class="fas fa-store"></i></div>' +
      '<div class="cat-card-info">' +
        '<span class="cat-card-name">Todos</span>' +
        '<span class="cat-card-desc">Todo el catálogo</span>' +
        '<span class="cat-card-count">' + CATALOGO.length + ' productos</span>' +
      '</div>' +
      '<div class="cat-card-check"><i class="fas fa-check"></i></div>' +
    '</button>';
    cats.forEach(function(cat) {
      var m2   = CAT_VISUAL[cat] || { emoji: '📦', accent: '#1565C0', bg: '#f5f5f5', icon: 'fas fa-box', desc: '' };
      var cnt2;
      if (cat === 'Cuidado Personal y Belleza') {
        cnt2 = CATALOGO.filter(function(p) {
          return p.categoria === 'Belleza' || p.categoria === 'Cuidado Personal' || p.categoria === 'Cuidado Personal y Belleza';
        }).length;
      } else {
        cnt2 = CATALOGO.filter(function(p) { return p.categoria === cat; }).length;
      }
      var act2 = ESTADO.filtros.categoria === cat;
      html2 += '<button class="cat-card' + (act2 ? ' activo' : '') + '"' +
        ' onclick="filtrarCategoria(\'' + cat + '\')"' +
        ' style="--cat-bg:' + m2.bg + ';--cat-accent:' + m2.accent + '">' +
        '<div class="cat-card-icon"><i class="' + m2.icon + '"></i></div>' +
        '<div class="cat-card-info">' +
          '<span class="cat-card-name">' + m2.emoji + ' ' + cat + '</span>' +
          '<span class="cat-card-desc">' + m2.desc + '</span>' +
          '<span class="cat-card-count">' + cnt2 + ' productos</span>' +
        '</div>' +
        '<div class="cat-card-check"><i class="fas fa-check"></i></div>' +
      '</button>';
    });
    html2 += '</div>';
    el.innerHTML = html2;
  }
}

/* ════════════════════════════════════════════════════════
   FILTROS
   ════════════════════════════════════════════════════════ */
function aplicarFiltros() {
  if (typeof CATALOGO === 'undefined') return;
  var precioMax   = ESTADO.filtros.precioMax || 200000;
  var tagsActivos = ESTADO.filtros.tagsActivos || [];

  ESTADO.resultados = CATALOGO.filter(function(p) {
    var precioBase = p.variantes[0].precio;
    if (precioBase > precioMax) return false;
    if (tagsActivos.length && !tagsActivos.some(function(t) {
      return p.tags && p.tags.some(function(pt) { return pt.label === t; });
    })) return false;
    var q = (ESTADO.filtros.busqueda || '').toLowerCase();
    if (q && !p.nombre.toLowerCase().includes(q) &&
             !p.categoria.toLowerCase().includes(q) &&
             !p.marca.toLowerCase().includes(q) &&
             !p.descripcion.toLowerCase().includes(q)) return false;
    /* Filtro de categoría con soporte para fusión */
    if (ESTADO.filtros.categoria) {
      var catFiltro = ESTADO.filtros.categoria;
      if (catFiltro === 'Cuidado Personal y Belleza') {
        /* Incluir productos de Belleza, Cuidado Personal y la categoría fusionada */
        if (p.categoria !== 'Belleza' && p.categoria !== 'Cuidado Personal' && p.categoria !== 'Cuidado Personal y Belleza') return false;
      } else {
        if (p.categoria !== catFiltro) return false;
      }
    }
    return true;
  });

  ESTADO.resultados = _aplicarOrden(ESTADO.resultados);
  ESTADO.pagina = 1;
  renderGrilla();
  actualizarContador();
}

/* ════════════════════════════════════════════════════════
   RENDER GRILLA — paginación correcta (sin duplicados)
   ════════════════════════════════════════════════════════ */
function renderGrilla(append) {
  var grid = document.getElementById('productosGrid');
  if (!grid || typeof CATALOGO === 'undefined') return;

  var lista = [];

  if (ES_INDEX) {
    var q = (ESTADO.filtros.busqueda || '').toLowerCase();
    if (q) {
      lista = CATALOGO.filter(function(p) {
        return p.nombre.toLowerCase().includes(q) ||
               p.categoria.toLowerCase().includes(q) ||
               p.marca.toLowerCase().includes(q);
      }).slice(0, CFG.DESTACADOS);
    } else if (ESTADO.filtros.categoria) {
      var catSel = ESTADO.filtros.categoria;
      lista = CATALOGO.filter(function(p) {
        if (catSel === 'Cuidado Personal y Belleza') {
          return p.categoria === 'Belleza' || p.categoria === 'Cuidado Personal' || p.categoria === 'Cuidado Personal y Belleza';
        }
        return p.categoria === catSel;
      }).slice(0, CFG.DESTACADOS);
    } else {
      var prio  = CATALOGO.filter(function(p) {
        return p.tags && p.tags.some(function(t) {
          return t.label === 'Más vendido' || t.label === 'Oferta' || t.label === 'Destacado';
        });
      });
      var resto = CATALOGO.filter(function(p) { return prio.indexOf(p) === -1; });
      lista = prio.concat(resto).slice(0, CFG.DESTACADOS);
    }
  } else {
    if (!append) {
      lista = ESTADO.resultados.slice(0, ESTADO.pagina * CFG.POR_PAGINA);
    } else {
      var startIndex = (ESTADO.pagina - 1) * CFG.POR_PAGINA;
      var endIndex   = ESTADO.pagina * CFG.POR_PAGINA;
      lista = ESTADO.resultados.slice(startIndex, endIndex);
    }
  }

  if (!lista.length && !append) {
    grid.innerHTML = '<div class="empty-state">' +
      '<div class="empty-icon">🔍</div>' +
      '<h3>Sin resultados</h3>' +
      '<p>No encontramos <strong>' + (ESTADO.filtros.busqueda ? '&ldquo;' + ESTADO.filtros.busqueda + '&rdquo;' : 'productos') + '</strong> con esos filtros.</p>' +
      '<div style="display:flex;gap:.8rem;justify-content:center;flex-wrap:wrap;margin-top:1.5rem">' +
        '<button onclick="limpiarFiltros()" class="btn-primario"><i class="fas fa-redo"></i> Limpiar filtros</button>' +
        '<a href="https://wa.me/' + WA_NUM + '?text=Hola%2C+busco+un+producto+específico" target="_blank" class="btn-primario" style="background:#25D366"><i class="fab fa-whatsapp"></i> Pedir por WhatsApp</a>' +
      '</div>' +
    '</div>';
    ocultarVerMas();
    return;
  }

  var rendered = lista.map(renderTarjeta).join('');

  if (!append) {
    grid.innerHTML = rendered;
    requestAnimationFrame(function() {
      grid.querySelectorAll('.producto-card').forEach(function(card, c) {
        card.style.cssText = 'opacity:0;transform:translateY(16px)';
        setTimeout(function() {
          card.style.cssText = 'transition:opacity .35s ease,transform .35s ease;opacity:1;transform:translateY(0)';
        }, c * 45);
      });
    });
  } else {
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = rendered;
    Array.from(tempDiv.children).forEach(function(card, c) {
      card.style.cssText = 'opacity:0;transform:translateY(16px)';
      grid.appendChild(card);
      setTimeout(function() {
        card.style.cssText = 'transition:opacity .35s ease,transform .35s ease;opacity:1;transform:translateY(0)';
      }, c * 45);
    });
  }

  if (!ES_INDEX) {
    var mostrados = Math.min(ESTADO.pagina * CFG.POR_PAGINA, ESTADO.resultados.length);
    var total = ESTADO.resultados.length;
    if (mostrados >= total) { ocultarVerMas(); } else { mostrarVerMas(mostrados, total); }
  }
}

/* ════════════════════════════════════════════════════════
   VER MÁS
   ════════════════════════════════════════════════════════ */
function mostrarVerMas(mostrados, total) {
  var btn = document.getElementById('btnVerMas');
  if (!btn) {
    btn = document.createElement('div');
    btn.id = 'btnVerMas';
    btn.style.cssText = 'text-align:center;margin:2.5rem 0';
    btn.innerHTML = '<button class="btn-ver-mas" onclick="verMas()">' +
      '<i class="fas fa-chevron-down"></i> Cargar más <span id="cuentaVerMas"></span>' +
    '</button>';
    var g = document.getElementById('productosGrid');
    if (g && g.parentNode) g.parentNode.insertBefore(btn, g.nextSibling);
  }
  btn.style.display = 'block';
  var c = document.getElementById('cuentaVerMas');
  if (c) c.textContent = '(' + mostrados + ' de ' + total + ')';
}

function ocultarVerMas() {
  var b = document.getElementById('btnVerMas');
  if (b) b.style.display = 'none';
}

function verMas() {
  ESTADO.pagina++;
  renderGrilla(true);
}
window.verMas = verMas;

/* ════════════════════════════════════════════════════════
   CONTADOR + FILTRAR CATEGORÍA + LIMPIAR
   ════════════════════════════════════════════════════════ */
function actualizarContador() {
  var el = document.getElementById('productosCount');
  if (!el || typeof CATALOGO === 'undefined') return;
  var n = ES_INDEX ? CATALOGO.length : ESTADO.resultados.length;
  el.innerHTML = '<strong>' + n + '</strong> producto' + (n !== 1 ? 's' : '') + ' encontrado' + (n !== 1 ? 's' : '');
}

function filtrarCategoria(cat) {
  ESTADO.filtros.categoria = cat;
  renderCategorias();
  if (ES_INDEX) { renderGrilla(); } else { aplicarFiltros(); }
  var grid = document.getElementById('productosGrid');
  if (grid) setTimeout(function() { grid.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
}
window.filtrarCategoria = filtrarCategoria;

function limpiarFiltros() {
  ESTADO.filtros = { categoria: null, busqueda: '', precioMax: 200000, tagsActivos: [] };
  var b = document.getElementById('busquedaInput');
  if (b) b.value = '';
  var slider = document.getElementById('filtroPrecio');
  var label  = document.getElementById('precioMaxLabel');
  if (slider) slider.value = 200000;
  if (label)  label.textContent = '$200.000';
  document.querySelectorAll('.filtro-tag.activo').forEach(function(t) { t.classList.remove('activo'); });
  cerrarAutocomplete();
  renderCategorias();
  if (ES_INDEX) { renderGrilla(); } else { aplicarFiltros(); }
}
window.limpiarFiltros = limpiarFiltros;

/* ════════════════════════════════════════════════════════
   BUSCADOR CON AUTOCOMPLETE
   ════════════════════════════════════════════════════════ */
function initBuscador() {
  var input = document.getElementById('busquedaInput');
  if (!input) return;
  var wrap = input.closest('.productos-header') || input.parentElement;
  var dropdown = document.createElement('div');
  dropdown.id = 'busquedaDropdown';
  dropdown.className = 'busqueda-dropdown';
  if (wrap) wrap.style.position = 'relative';
  if (wrap) wrap.appendChild(dropdown);

  var timer;
  input.addEventListener('input', function() {
    clearTimeout(timer);
    ESTADO.filtros.busqueda = input.value.trim();
    timer = setTimeout(function() {
      if (ES_INDEX) { renderGrilla(); } else { aplicarFiltros(); }
      mostrarAutocomplete(ESTADO.filtros.busqueda, dropdown);
    }, CFG.DEBOUNCE);
  });

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      input.value = '';
      ESTADO.filtros.busqueda = '';
      cerrarAutocomplete();
      if (ES_INDEX) { renderGrilla(); } else { aplicarFiltros(); }
    }
  });

  document.addEventListener('click', function(e) {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) cerrarAutocomplete();
  });
}

function mostrarAutocomplete(q, dropdown) {
  if (!q || q.length < 2 || typeof CATALOGO === 'undefined') { cerrarAutocomplete(); return; }
  var ql = q.toLowerCase();
  var resultados = CATALOGO.filter(function(p) {
    return p.nombre.toLowerCase().includes(ql) ||
           p.categoria.toLowerCase().includes(ql) ||
           p.marca.toLowerCase().includes(ql);
  }).slice(0, 6);
  if (!resultados.length) { cerrarAutocomplete(); return; }

  dropdown.innerHTML = resultados.map(function(p) {
    var v0    = p.variantes[0] || {};
    var precio = _precioCard(p, 0);
    var seed   = encodeURIComponent(p.nombre);
    var img = v0.imagen || resolverImagen(p, seed);
    var nombre = p.nombre.replace(
      new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'),
      '<mark>$1</mark>'
    );
    var uniTag = tienePresentaciones(p)
      ? '<span style="font-size:.6rem;background:#E0F2F1;color:#00695C;border-radius:4px;padding:.05rem .35rem;font-weight:800">Und.</span>'
      : '';
    return '<div class="ac-item" onclick="seleccionarSugerencia(\'' + p.nombre.replace(/'/g, "\\'") + '\', ' + p.id + ')">' +
      '<img class="ac-img" src="' + img + '" alt="' + p.nombre + '"' +
        ' data-slug="' + slugProducto(p.nombre) + '" data-cat="' + (p.categoria || '') + '"' +
        ' onerror=\"onImgError(this,null,2)\"' +
        ' style="width:40px;height:40px;object-fit:contain;background:#f5f5f5;border-radius:8px;flex-shrink:0;padding:3px">' +
      '<div class="ac-texto" style="flex:1;min-width:0">' +
        '<span class="ac-nombre">' + nombre + ' ' + uniTag + '</span>' +
        '<span class="ac-meta">' + p.categoria + ' · ' + cop(precio) + '</span>' +
      '</div>' +
      '<i class="fas fa-chevron-right ac-arrow" style="color:#ccc;font-size:.7rem"></i>' +
    '</div>';
  }).join('');
  dropdown.style.display = 'block';
}

function cerrarAutocomplete() {
  var d = document.getElementById('busquedaDropdown');
  if (d) d.style.display = 'none';
}

function seleccionarSugerencia(nombre, id) {
  var input = document.getElementById('busquedaInput');
  if (input) input.value = nombre;
  ESTADO.filtros.busqueda = nombre;
  cerrarAutocomplete();
  if (ES_INDEX) { renderGrilla(); } else { aplicarFiltros(); }
  if (id && typeof abrirModalProducto === 'function') {
    setTimeout(function() { abrirModalProducto(id); }, 200);
  }
}
window.seleccionarSugerencia = seleccionarSugerencia;

/* ════════════════════════════════════════════════════════
   ESTILOS EXTRA — categorías cards (página productos.html)
   ════════════════════════════════════════════════════════ */
function inyectarEstilosExtra() {
  if (document.getElementById('cat-cards-style')) return;
  var s = document.createElement('style');
  s.id = 'cat-cards-style';
  s.textContent = [
    /* Grid de categorías — 3 columnas en desktop, 2 en tablet, 1 en móvil */
    '.cat-cards-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.1rem;margin-bottom:2.5rem}',
    '@media(max-width:900px){.cat-cards-grid{grid-template-columns:repeat(2,1fr)}}',
    '@media(max-width:480px){.cat-cards-grid{grid-template-columns:1fr 1fr;gap:.6rem}}',

    /* Card base */
    '.cat-card{display:flex;align-items:center;gap:1rem;padding:1.1rem 1.25rem;background:var(--cat-bg,#f5f5f5);' +
      'border:2px solid transparent;border-radius:18px;cursor:pointer;text-align:left;font-family:inherit;' +
      'transition:transform .22s cubic-bezier(.34,1.56,.64,1),box-shadow .22s,border-color .22s;' +
      'position:relative;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.06)}',

    /* Línea decorativa izquierda */
    '.cat-card::before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;' +
      'background:var(--cat-accent,#1565C0);border-radius:18px 0 0 18px;opacity:0;transition:opacity .2s}',
    '.cat-card:hover::before,.cat-card.activo::before{opacity:1}',

    /* Hover y activo */
    '.cat-card:hover{transform:translateY(-3px) scale(1.015);box-shadow:0 10px 28px rgba(0,0,0,.13)}',
    '.cat-card.activo{border-color:var(--cat-accent,#1565C0);box-shadow:0 6px 22px rgba(0,0,0,.14);transform:translateY(-2px)}',

    /* Ícono */
    '.cat-card-icon{width:50px;height:50px;min-width:50px;background:var(--cat-accent,#1565C0);color:#fff;' +
      'border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.25rem;' +
      'box-shadow:0 4px 12px rgba(0,0,0,.18);transition:transform .22s cubic-bezier(.34,1.56,.64,1)}',
    '.cat-card:hover .cat-card-icon{transform:scale(1.1) rotate(-4deg)}',
    '.cat-card.activo .cat-card-icon{transform:scale(1.08)}',

    /* Texto */
    '.cat-card-info{flex:1;display:flex;flex-direction:column;gap:.14rem;min-width:0}',
    '.cat-card-name{font-size:.95rem;font-weight:800;color:#1a1a2e;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.cat-card-desc{font-size:.7rem;color:#888;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.cat-card-count{display:inline-flex;align-items:center;gap:.25rem;font-size:.7rem;font-weight:800;' +
      'color:var(--cat-accent,#1565C0);background:rgba(0,0,0,.06);border-radius:50px;padding:.12rem .55rem;margin-top:.2rem;width:fit-content}',

    /* Check activo */
    '.cat-card-check{width:24px;height:24px;min-width:24px;background:var(--cat-accent,#1565C0);color:#fff;' +
      'border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.65rem;' +
      'opacity:0;transform:scale(0);transition:opacity .2s,transform .3s cubic-bezier(.34,1.56,.64,1)}',
    '.cat-card.activo .cat-card-check{opacity:1;transform:scale(1)}',

    /* Ocultar descripción en móvil pequeño */
    '@media(max-width:480px){.cat-card-desc{display:none}.cat-card{padding:.75rem .85rem;gap:.65rem}.cat-card-icon{width:40px;height:40px;min-width:40px;font-size:1rem}.cat-card-name{font-size:.82rem}}',

    /* Empty state */
    '.empty-state{grid-column:1/-1;text-align:center;padding:4rem 2rem}',
    '.empty-icon{font-size:3.5rem;margin-bottom:1rem}',
    '.empty-state h3{font-size:1.3rem;font-weight:800;margin-bottom:.5rem}',
    '.empty-state p{color:#888}',
  ].join('');
  document.head.appendChild(s);
}

/* ════════════════════════════════════════════════════════
   FILTROS AVANZADOS
   ════════════════════════════════════════════════════════ */
function initFiltrosAvanzados() {
  var sliderPrecio = document.getElementById('filtroPrecio');
  var labelPrecio  = document.getElementById('precioMaxLabel');
  if (sliderPrecio) {
    sliderPrecio.addEventListener('input', function() {
      var val = parseInt(sliderPrecio.value);
      if (labelPrecio) labelPrecio.textContent = '$' + val.toLocaleString('es-CO');
      ESTADO.filtros.precioMax = val;
      aplicarFiltros();
    });
  }
  document.querySelectorAll('.filtro-tag').forEach(function(btn) {
    btn.addEventListener('click', function() {
      btn.classList.toggle('activo');
      ESTADO.filtros.tagsActivos = Array.from(
        document.querySelectorAll('.filtro-tag.activo')
      ).map(function(b) { return b.dataset.tag; });
      aplicarFiltros();
    });
  });
  var btnLimpiar = document.getElementById('btnLimpiarFiltros');
  if (btnLimpiar) btnLimpiar.addEventListener('click', limpiarFiltros);
}

/* ════════════════════════════════════════════════════════
   INICIALIZACIÓN
   ════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
  if (typeof CATALOGO === 'undefined') {
    var grid = document.getElementById('productosGrid');
    if (grid) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem;color:#e53935">' +
        '<i class="fas fa-exclamation-triangle" style="font-size:2rem;display:block;margin-bottom:1rem"></i>' +
        '<strong>No se pudo cargar el catálogo.</strong><br>' +
        '<small>Verifica que <code>productos-data.js</code> carga ANTES que catalogo.js</small>' +
      '</div>';
    }
    return;
  }

  inyectarEstilosModal();

  ES_INDEX = !document.querySelector('.page-hero');

  var gridEl = document.getElementById('productosGrid');
  if (gridEl) gridEl.innerHTML = renderSkeletons(ES_INDEX ? CFG.DESTACADOS : CFG.POR_PAGINA);

  var params   = new URLSearchParams(window.location.search);
  var catParam = params.get('cat');
  if (catParam) ESTADO.filtros.categoria = decodeURIComponent(catParam);
  var buscarParam = params.get('buscar');
  if (buscarParam) {
    ESTADO.filtros.busqueda = decodeURIComponent(buscarParam);
    /* Reflejar en el input del catálogo si existe */
    var busqInput = document.getElementById('busquedaInput');
    if (busqInput) busqInput.value = ESTADO.filtros.busqueda;
  }

  if (ES_INDEX) {
    requestAnimationFrame(function() {
      renderCategorias();
      renderGrilla();
      actualizarContador();
      initBuscador();
    });
  } else {
    inyectarEstilosExtra();
    requestAnimationFrame(function() {
      renderCategorias();
      aplicarFiltros();
      initBuscador();
      initFiltrosAvanzados();
    });
  }
});