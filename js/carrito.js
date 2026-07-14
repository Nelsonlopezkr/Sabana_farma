/* ══════════════════════════════════════════════════════════
 *  Sabana Farma — Carrito PRO v2.0
 *  Mejoras: barra envío gratis, sugerencias, precio en badge,
 *           animación fly-to-cart, feedback visual botones
 * ══════════════════════════════════════════════════════════ */

/* ─── Estado del carrito ─── */
var carrito = [];

try {
  var _carritoRaw    = localStorage.getItem('de_carrito');
  var _carritoParsed = _carritoRaw ? JSON.parse(_carritoRaw) : [];
  _carritoParsed = Array.isArray(_carritoParsed) ? _carritoParsed : [];
  /* Migrar keys antiguas al nuevo formato id_vN_pN / id_vN_pX */
  _carritoParsed.forEach(function(item) {
    if (item.key && !/^[^_]+_v\d+_p/.test(item.key)) {
      /* key vieja: reconstruir */
      item.key = item.id + '_v0_pX';
    }
  });
  carrito = _carritoParsed;
} catch (e) {
  carrito = [];
}

/* ─── Helper precio ─── */
function _cop(n) {
  return '$' + Number(n).toLocaleString('es-CO');
}

/* ─── Guardar ─── */
function guardarCarrito() {
  try { localStorage.setItem('de_carrito', JSON.stringify(carrito)); } catch (e) {}
}

/* ─── Reglas de productos sugeridos ───
   IDs verificados contra productos-data.js (catálogo real).
   Si un ID deja de existir, el respaldo por categoría lo cubre. */
var SUGERENCIAS_MAP = {
  10239: [10053, 10656, 10168], // Acetaminofén 500MG → Noxpirin, Vitamina C+Zinc, Loratadina
  10659: [10215, 10239],        // Ibuprofeno 400MG → Diclofenaco Retard, Acetaminofén
  10053: [10239, 10656],        // Noxpirin (antigripal) → Acetaminofén, Vitamina C+Zinc
  10436: [10011, 10005],        // Omeprazol → Sal de Frutas, Alka-Seltzer
  10735: [10734, 10002],        // Electrolit 625ML → Pedialyte, Hidraplus
  10734: [10735, 10002],        // Pedialyte → Electrolit, Hidraplus
  10002: [10735, 10734],        // Hidraplus → Electrolit, Pedialyte
  40038: [20039, 10660],        // Pañal Winny Pants Etp6 → Toallitas Winny, Acid Mantle antipañalitis
  40020: [20039, 10660],        // Pañal Winny Pants ET5 → Toallitas Winny, Acid Mantle antipañalitis
  20013: [20026, 20105],        // Sedal Shampoo → Acondicionador Savital, Oferta Savital
  40007: [20276, 40030]         // Jabón Dove → Desodorante Speed Stick, Yodora
};

function getSugerencias() {
  if (!carrito.length || typeof CATALOGO === 'undefined') return [];
  var yaEnCarrito = carrito.map(function(i) { return i.id; });
  var candidatos  = [];

  /* 1. Sugerencias curadas (solo si el ID existe en el catálogo) */
  carrito.forEach(function(item) {
    var sugs = SUGERENCIAS_MAP[item.id];
    if (!sugs) return;
    sugs.forEach(function(sid) {
      if (yaEnCarrito.indexOf(sid) === -1 && candidatos.indexOf(sid) === -1) {
        candidatos.push(sid);
      }
    });
  });

  var resultado = candidatos.slice(0, 3).map(function(sid) {
    return CATALOGO.find(function(p) { return p.id === sid; });
  }).filter(Boolean);

  /* 2. Respaldo: completar con productos de la misma categoría
        (con stock y precio válido) si faltan sugerencias */
  if (resultado.length < 3) {
    var catsEnCarrito = {};
    carrito.forEach(function(i) {
      var p = CATALOGO.find(function(x) { return x.id === i.id; });
      if (p && p.categoria) catsEnCarrito[p.categoria] = true;
    });
    var idsUsados = resultado.map(function(p) { return p.id; });
    for (var k = 0; k < CATALOGO.length && resultado.length < 3; k++) {
      var c = CATALOGO[k];
      if (!catsEnCarrito[c.categoria]) continue;
      if (yaEnCarrito.indexOf(c.id) !== -1 || idsUsados.indexOf(c.id) !== -1) continue;
      if (!c.existencias || c.existencias <= 0) continue;
      if (!c.variantes || !c.variantes[0] || !c.variantes[0].precio) continue;
      resultado.push(c);
      idsUsados.push(c.id);
    }
  }

  return resultado;
}

/* ─── Agregar ─── */
function agregarAlCarrito(producto, varianteIdx, triggerEl, presentacionIdx) {
  varianteIdx = parseInt(varianteIdx != null ? varianteIdx : 0);

  /* ══════════════════════════════════════════════════════════════
     CORRECCIÓN BUG #2: Soporte completo para sistema laboratorios{}
     Si el producto tiene laboratorios{}, leer el lab activo y su
     precio activo directamente desde laboratoriosActivos /
     presentacionesActivas (mismos objetos que usa catalogo.js).
     NO recalcular precios — usar el precio tal como lo ve el usuario.
  ══════════════════════════════════════════════════════════════ */

  var _labActivo    = null;  /* objeto laboratorio activo */
  var _labKeyActivo = null;  /* key del laboratorio */
  var _precObjActivo = null; /* objeto precio activo dentro del lab */
  var _precKeyActivo = null;

  var _tieneLabs = producto.laboratorios && Object.keys(producto.laboratorios).length > 0;

  if (_tieneLabs) {
    /* Leer lab activo desde el estado global de catalogo.js */
    var _labsRef  = (typeof laboratoriosActivos !== 'undefined') ? laboratoriosActivos : {};
    var _presRef  = (typeof presentacionesActivas !== 'undefined') ? presentacionesActivas : {};
    var _labKeys  = Object.keys(producto.laboratorios);
    _labKeyActivo = _labsRef[producto.id] || _labKeys[0];
    if (!producto.laboratorios[_labKeyActivo]) _labKeyActivo = _labKeys[0];
    _labActivo    = producto.laboratorios[_labKeyActivo];

    var _precKeys = Object.keys(_labActivo.precios);
    _precKeyActivo = _presRef[producto.id + '_' + _labKeyActivo] || _precKeys[0];
    if (!_labActivo.precios[_precKeyActivo]) _precKeyActivo = _precKeys[0];
    _precObjActivo = _labActivo.precios[_precKeyActivo];
  }

  /* ── Variante (sistema viejo) ── */
  var variantes = Array.isArray(producto.variantes) ? producto.variantes
    : [{ tipo: producto.variante || '', precio: producto.precio || 0, imagen: producto.imagen || '' }];
  var variante = variantes[varianteIdx] || variantes[0];

  /* ── Presentación (sistema viejo con presentaciones[]) ── */
  var _pi = (presentacionIdx !== undefined && presentacionIdx !== null) ? parseInt(presentacionIdx) : -1;
  var tienePres = _pi >= 0 && producto.presentaciones && producto.presentaciones[_pi];
  var tipoPres   = tienePres ? producto.presentaciones[_pi].tipo  : '';

  /* ── Precio final: NUNCA recalcular ──
     Prioridad: 1) laboratorio activo  2) presentación activa  3) variante */
  var precioPres;
  var nombreVarianteCarrito;
  var imagenCarrito;
  var labNombreCarrito = '';

  if (_tieneLabs && _precObjActivo) {
    /* Sistema nuevo: precio directo del objeto de precio del lab */
    precioPres            = _precObjActivo.precio;
    nombreVarianteCarrito = _labActivo.nombre.split(' ')[0] + ' — ' + _precObjActivo.label;
    labNombreCarrito      = _labActivo.nombre.split(' ')[0];
    /* Imagen: PRIORIDAD 1 → campo imagen directo en laboratorio{}
                PRIORIDAD 2 → variante que coincida por nombre de lab
                PRIORIDAD 3 → imagen general del producto */
    var _imgLab = _labActivo.imagen || null;
    if (!_imgLab && Array.isArray(producto.variantes)) {
      var _labKeyLower2 = _labKeyActivo.toLowerCase();
      var _matchedVar = producto.variantes.find(function(v) {
        var vl = (v.laboratorio || '').toLowerCase();
        return vl && vl.length >= 2 && (
          _labKeyLower2.includes(vl) ||
          _labKeyLower2.replace(/_/g,'').includes(vl.replace(/\s/g,'')) ||
          (_labActivo.nombreProducto && _labActivo.nombreProducto.toLowerCase().includes(vl))
        );
      });
      if (_matchedVar && _matchedVar.imagen) _imgLab = _matchedVar.imagen;
    }
    imagenCarrito = _imgLab || producto.imagen || '';
  } else if (tienePres) {
    precioPres            = producto.presentaciones[_pi].precio;
    nombreVarianteCarrito = variante.tipo || variante.laboratorio || '';
    imagenCarrito         = variante.imagen || producto.imagen || '';
  } else {
    /* Sistema viejo sin presentaciones */
    precioPres            = variante.precio || 0;
    nombreVarianteCarrito = variante.tipo || '';
    imagenCarrito         = variante.imagen || producto.imagen || '';
  }

  /* Key única por combinación producto + laboratorio/variante + presentación */
  var keyPart = _tieneLabs
    ? ('_lab_' + _labKeyActivo + '_p_' + _precKeyActivo)
    : ('_v' + varianteIdx + (tienePres ? '_p' + _pi : '_pX'));
  var key = producto.id + keyPart;

  var existente = carrito.find(function(i) { return i.key === key; });

  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({
      key:          key,
      id:           producto.id,
      nombre:       producto.nombre,
      imagen:       imagenCarrito,
      categoria:    producto.categoria || '',
      variante:     nombreVarianteCarrito,
      laboratorio:  labNombreCarrito,
      presentacion: _tieneLabs ? _precObjActivo.label : tipoPres,
      precio:       precioPres,
      cantidad:     1
    });
  }

  guardarCarrito();
  actualizarUI();
  mostrarToast('✅ ' + producto.nombre + ' agregado al carrito');

  /* Animación fly-to-cart */
  if (triggerEl) flyToCart(triggerEl);

  /* Feedback visual en botón */
  if (triggerEl) {
    var originalHTML = triggerEl.innerHTML;
    triggerEl.innerHTML = '<i class="fas fa-check"></i>';
    triggerEl.style.background = '#2E7D32';
    setTimeout(function() {
      triggerEl.innerHTML = originalHTML;
      triggerEl.style.background = '';
    }, 1200);
  }
}

/* ─── Animación fly-to-cart ─── */
function flyToCart(btn) {
  var cartBtn = document.getElementById('btnAbrirCarrito');
  if (!cartBtn || !btn) return;

  var btnRect  = btn.getBoundingClientRect();
  var cartRect = cartBtn.getBoundingClientRect();

  var dot = document.createElement('div');
  dot.style.cssText = [
    'position:fixed',
    'width:14px',
    'height:14px',
    'background:var(--azul,#1565C0)',
    'border-radius:50%',
    'z-index:99999',
    'pointer-events:none',
    'top:' + (btnRect.top + btnRect.height / 2 - 7) + 'px',
    'left:' + (btnRect.left + btnRect.width / 2 - 7) + 'px',
    'transition:all .55s cubic-bezier(.25,.46,.45,.94)',
    'opacity:1'
  ].join(';');
  document.body.appendChild(dot);

  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      dot.style.top  = (cartRect.top + cartRect.height / 2 - 7) + 'px';
      dot.style.left = (cartRect.left + cartRect.width / 2 - 7) + 'px';
      dot.style.opacity = '0';
      dot.style.transform = 'scale(0.3)';
      setTimeout(function() { document.body.removeChild(dot); }, 600);
    });
  });
}
window.flyToCart = flyToCart;

/* ─── Eliminar ─── */
function eliminarDelCarrito(key) {
  carrito = carrito.filter(function(i) { return i.key !== key; });
  guardarCarrito();
  actualizarUI();
}

/* ─── Cantidad ─── */
function cambiarCantidad(key, delta) {
  carrito.forEach(function(i) {
    if (i.key === key) {
      i.cantidad = Math.max(1, i.cantidad + delta);
    }
  });
  guardarCarrito();
  actualizarUI();
}

/* ─── Vaciar ─── */
function vaciarCarrito() {
  if (!carrito.length) return;
  if (!confirm('¿Deseas vaciar el carrito?')) return;
  carrito = [];
  guardarCarrito();
  actualizarUI();
}

/* ─── Descuentos por monto de compra (Sabana Farma) ───
   ≥ $50.000 → 5% · ≥ $100.000 → 7% · ≥ $150.000 → 10%
   Ordenados de mayor a menor `min`. Editar solo aquí. */
var DESCUENTOS_MONTO = [
  { min: 150000, pct: 10 },
  { min: 100000, pct: 7 },
  { min: 50000,  pct: 5 }
];

/* Nivel de descuento alcanzado (o null) */
function nivelDescuento(subtotal) {
  for (var i = 0; i < DESCUENTOS_MONTO.length; i++) {
    if (subtotal >= DESCUENTOS_MONTO[i].min) return DESCUENTOS_MONTO[i];
  }
  return null;
}

/* Siguiente nivel aún no alcanzado (o null si ya está en el máximo) */
function proximoNivelDescuento(subtotal) {
  var prox = null;
  for (var i = 0; i < DESCUENTOS_MONTO.length; i++) {
    if (subtotal < DESCUENTOS_MONTO[i].min) prox = DESCUENTOS_MONTO[i];
  }
  return prox;
}

/* ─── Promos por cantidad — se aplican solas en el carrito ───
   Dos tipos de promo:
   · tercera_pct: "Compra 2 y el 3.º con X% de descuento". Por CADA grupo de
     `grupo` unidades del MISMO producto, una unidad recibe `pct`% OFF
     (3.ª, 6.ª, 9.ª…). No se mezclan productos distintos; sí se pueden
     mezclar sabores/variantes del mismo producto.
   · precio_fijo: lleva `min` o más unidades y CADA unidad queda a `precio`.
   Los productos con promo activa no acumulan además el % por monto
   (protege el margen). */
/* Modelo único de promoción: compra 2 unidades de la misma referencia
   y la 3.ª queda con 25% OFF (≈8,3% de descuento efectivo sobre 3 unds —
   seguro para márgenes ≥15%). IDs verificados contra productos-data.js. */
var PROMOS_CANTIDAD = {
  /* Hidratación */
  10735: { tipo: 'tercera_pct', grupo: 3, pct: 25, etiqueta: '🔥 3er producto 25% OFF' },  /* Electrolit 625 ml ($8.500) */
  10734: { tipo: 'tercera_pct', grupo: 3, pct: 25, etiqueta: '🔥 3er producto 25% OFF' },  /* Pedialyte Max 500 ml ($10.300) */
  10002: { tipo: 'tercera_pct', grupo: 3, pct: 25, etiqueta: '🔥 3er producto 25% OFF' },  /* Hidraplus 400 ml ($10.600) */
  /* Gripa y alergia (temporada de frío) */
  10168: { tipo: 'tercera_pct', grupo: 3, pct: 25, etiqueta: '🔥 3er producto 25% OFF' },  /* Loratadina 10 mg ($2.000, stock 640) */
  10048: { tipo: 'tercera_pct', grupo: 3, pct: 25, etiqueta: '🔥 3er producto 25% OFF' },  /* Resfrygrip Plus 100 caps ($1.400, stock 352) */
  10786: { tipo: 'tercera_pct', grupo: 3, pct: 25, etiqueta: '🔥 3er producto 25% OFF' },  /* Noraver Garganta x12 ($2.300, stock 204) */
  10051: { tipo: 'tercera_pct', grupo: 3, pct: 25, etiqueta: '🔥 3er producto 25% OFF' },  /* Pax Caliente Noche 24 sbs ($2.800) */
  /* Vitaminas y bienestar */
  10018: { tipo: 'tercera_pct', grupo: 3, pct: 25, etiqueta: '🔥 3er producto 25% OFF' },  /* Vitamina E 400UI x100 ($4.500, stock 200) */
  10714: { tipo: 'tercera_pct', grupo: 3, pct: 25, etiqueta: '🔥 3er producto 25% OFF' },  /* Vitamina E+A 150 caps ($11.000, stock 450) */
  10011: { tipo: 'tercera_pct', grupo: 3, pct: 25, etiqueta: '🔥 3er producto 25% OFF' },  /* Sal de Frutas 50 sbs ($3.200) */
  10840: { tipo: 'tercera_pct', grupo: 3, pct: 25, etiqueta: '🔥 3er producto 25% OFF' },  /* Ainedix Aceclofenaco x10 ($2.000) */
  /* Bebé y Mamá (sin pañales — margen bajo) */
  20039: { tipo: 'tercera_pct', grupo: 3, pct: 25, etiqueta: '🔥 3er producto 25% OFF' }   /* Toallitas Winny Aloe x100 ($13.000) */
};

/* Unidades totales de un producto en el carrito (suma sabores/variantes) */
function _cantidadProducto(id) {
  return carrito.reduce(function(a, i) { return i.id === id ? a + i.cantidad : a; }, 0);
}

/* Precio unitario más bajo de un producto en el carrito (por si hay variantes) */
function _precioUnitProducto(id) {
  var min = 0;
  carrito.forEach(function(i) {
    if (i.id === id && (min === 0 || i.precio < min)) min = i.precio;
  });
  return min;
}

/* Precio unitario efectivo (solo promos precio_fijo rebajan el unitario) */
function precioEfectivo(item) {
  var p = PROMOS_CANTIDAD[item.id];
  if (p && p.tipo === 'precio_fijo' && _cantidadProducto(item.id) >= p.min) return p.precio;
  return item.precio;
}

function promoCantidadActiva(item) {
  var p = PROMOS_CANTIDAD[item.id];
  if (!p) return false;
  var qty = _cantidadProducto(item.id);
  return p.tipo === 'tercera_pct' ? qty >= p.grupo : qty >= p.min;
}
window.precioEfectivo = precioEfectivo;

/* Descuento tipo tercera_pct de UN producto: floor(qty/grupo) unidades con pct% OFF */
function descuentoPromoProducto(id) {
  var p = PROMOS_CANTIDAD[id];
  if (!p || p.tipo !== 'tercera_pct') return 0;
  var unidadesGratis = Math.floor(_cantidadProducto(id) / p.grupo);
  if (unidadesGratis === 0) return 0;
  return unidadesGratis * Math.round(_precioUnitProducto(id) * p.pct / 100);
}

/* ¿Este item es la primera línea de su producto en el carrito?
   (evita repetir el mensaje de promo cuando hay varios sabores) */
function _esPrimeraLineaProducto(item) {
  for (var i = 0; i < carrito.length; i++) {
    if (carrito[i].id === item.id) return carrito[i].key === item.key;
  }
  return false;
}

/* Mensaje de promo que se muestra bajo el producto en el carrito */
function mensajePromoLinea(item) {
  var p = PROMOS_CANTIDAD[item.id];
  if (!p) return '';

  if (p.tipo === 'tercera_pct') {
    if (!_esPrimeraLineaProducto(item)) return '';
    var qty = _cantidadProducto(item.id);
    if (qty >= p.grupo) {
      return '<small style="display:block;color:#2E7D32;font-weight:800">' +
        '✔ Promoción aplicada<br>Compra 2 y el tercero tiene ' + p.pct + '% OFF · ' +
        'Ahorras ' + _cop(descuentoPromoProducto(item.id)) + '</small>';
    }
    var faltan = p.grupo - qty;
    return '<small style="display:block;color:#1565C0;font-weight:700">' +
      '💧 Agrega ' + faltan + ' más y el 3.º te sale con ' + p.pct + '% OFF</small>';
  }

  /* precio_fijo */
  if (promoCantidadActiva(item)) {
    return '<small style="display:block;color:#2E7D32;font-weight:800">🎉 ' +
      p.etiqueta + ' → ' + _cop(precioEfectivo(item)) + ' c/u</small>';
  }
  return '';
}

/* ─── Totales ─── */
function calcularTotales() {
  var subtotal = 0, basePct = 0, ahorroPromos = 0, descuentoPromos = 0;
  var idsTercera = [];

  carrito.forEach(function(i) {
    var pu = precioEfectivo(i);
    subtotal += pu * i.cantidad;
    if (promoCantidadActiva(i)) {
      var p = PROMOS_CANTIDAD[i.id];
      if (p.tipo === 'precio_fijo') {
        ahorroPromos += (i.precio - pu) * i.cantidad; /* ya rebajado en subtotal */
      } else if (idsTercera.indexOf(i.id) === -1) {
        idsTercera.push(i.id); /* tercera_pct: se calcula una vez por producto */
      }
    } else {
      basePct += pu * i.cantidad; /* solo lo SIN promo suma para el % por monto */
    }
  });

  idsTercera.forEach(function(id) {
    descuentoPromos += descuentoPromoProducto(id);
  });
  ahorroPromos += descuentoPromos;

  var subtotalNeto = subtotal - descuentoPromos;
  var nivel = nivelDescuento(subtotalNeto);
  var descuento = nivel ? Math.round(basePct * nivel.pct / 100) : 0;
  var envio = (subtotalNeto > 0 && subtotalNeto < 20000) ? 3000 : 0; /* GRATIS en pedidos +$20.000 */
  return {
    subtotal: subtotal,
    descuentoPromos: descuentoPromos, /* ahorro promos que se resta del total */
    ahorroPromos: ahorroPromos,       /* ahorro total en promos (informativo) */
    descuento: descuento,
    pctDescuento: nivel ? nivel.pct : 0,
    envio: envio,
    total: subtotalNeto - descuento + envio
  };
}

/* ─── Barra de progreso — envío gratis y descuentos por monto ─── */
function renderBarraEnvio(subtotal) {
  if (subtotal === 0) return '';
  if (subtotal >= 20000) {
    var nivel = nivelDescuento(subtotal);
    var prox  = proximoNivelDescuento(subtotal);
    var msg, pctBar;
    if (nivel && prox) {
      msg = '💚 <strong>' + nivel.pct + '% de descuento aplicado</strong> · agrega <strong>$' +
            (prox.min - subtotal).toLocaleString('es-CO') + '</strong> y sube al ' + prox.pct + '%';
      pctBar = Math.min(Math.round(subtotal / prox.min * 100), 100);
    } else if (nivel) {
      msg = '🏆 ¡Descuento máximo del <strong>' + nivel.pct + '%</strong> aplicado!';
      pctBar = 100;
    } else if (prox) {
      msg = '🎉 ¡Domicilio GRATIS! · Te faltan <strong>$' +
            (prox.min - subtotal).toLocaleString('es-CO') + '</strong> para el <strong>' + prox.pct + '% de descuento</strong>';
      pctBar = Math.min(Math.round(subtotal / prox.min * 100), 100);
    } else {
      msg = '🎉 ¡Domicilio GRATIS activado!';
      pctBar = 100;
    }
    return '<div class="envio-progreso-wrap">' +
      '<div class="envio-progreso-msg envio-libre">' + msg + '</div>' +
      '<div class="envio-progreso-bar"><div class="envio-progreso-fill" style="width:' + pctBar + '%"></div></div>' +
    '</div>';
  }
  var pct   = Math.min(Math.round(subtotal / 20000 * 100), 100);
  var falta = (20000 - subtotal).toLocaleString('es-CO');
  return '<div class="envio-progreso-wrap">' +
    '<div class="envio-progreso-msg">🛵 Te faltan <strong>$' + falta + '</strong> para domicilio GRATIS</div>' +
    '<div class="envio-progreso-bar"><div class="envio-progreso-fill" style="width:' + pct + '%"></div></div>' +
  '</div>';
}

/* ─── UI ─── */
function actualizarUI() {
  var totalItems = carrito.reduce(function(acc, i) { return acc + i.cantidad; }, 0);
  var t = calcularTotales();

  /* Badge */
  document.querySelectorAll('.carrito-badge').forEach(function(b) {
    b.textContent = totalItems;
    b.classList.toggle('oculto', totalItems === 0);
  });

  /* Precio en botón del navbar */
  var btnCarrito = document.getElementById('btnAbrirCarrito');
  if (btnCarrito) {
    var precioSpan = btnCarrito.querySelector('.carrito-precio-inline');
    if (!precioSpan) {
      precioSpan = document.createElement('span');
      precioSpan.className = 'carrito-precio-inline';
      btnCarrito.appendChild(precioSpan);
    }
    precioSpan.textContent = totalItems > 0 ? ' · ' + _cop(t.subtotal) : '';
  }

  /* Barra mobile bottom */
  actualizarBarraMobile(totalItems, t);

  var itemsEl = document.getElementById('carritoItems') || document.querySelector('.carrito-items');
  if (!itemsEl) return;

  if (!carrito.length) {
    itemsEl.innerHTML =
      '<div class="carrito-vacio">' +
        '<i class="fas fa-shopping-basket"></i>' +
        '<p>Tu carrito está vacío</p>' +
        '<a href="productos.html" class="btn-ir-catalogo" onclick="cerrarCarrito()">Ver catálogo</a>' +
      '</div>';
  } else {
    itemsEl.innerHTML = carrito.map(function(item) {
      var itemImg = item.imagen || 'https://picsum.photos/seed/' + item.id + '/80/80';
      return '<div class="carrito-item">' +
        '<img src="' + itemImg + '" onerror="this.src=\'https://picsum.photos/seed/' + item.id + '/80/80\'">' +
        '<div class="carrito-item-info">' +
          '<p class="carrito-item-nombre">' + item.nombre + '</p>' +
          '<small class="carrito-item-variante">' + item.variante + (item.presentacion ? ' · ' + item.presentacion : '') + '</small>' +
          mensajePromoLinea(item) +
          '<p class="carrito-item-precio">' + _cop(precioEfectivo(item) * item.cantidad) + '</p>' +
        '</div>' +
        '<div class="carrito-item-controles">' +
          '<button class="btn-cant" onclick="cambiarCantidad(\'' + item.key + '\',-1)" aria-label="Quitar uno">−</button>' +
          '<span>' + item.cantidad + '</span>' +
          '<button class="btn-cant" onclick="cambiarCantidad(\'' + item.key + '\',1)" aria-label="Agregar uno">+</button>' +
          '<button class="btn-eliminar" onclick="eliminarDelCarrito(\'' + item.key + '\')" aria-label="Eliminar">🗑</button>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  /* Totales */
  var subtotalEl = document.getElementById('carritoSubtotal');
  var envioEl    = document.getElementById('carritoEnvio');
  var totalEl    = document.getElementById('carritoTotal');
  if (subtotalEl) subtotalEl.textContent = _cop(t.subtotal);

  /* Fila "Ahorro en promociones" — se crea dinámicamente si no existe */
  var filaPromo = document.getElementById('carritoAhorroPromosFila');
  if (!filaPromo && subtotalEl && subtotalEl.parentNode && subtotalEl.parentNode.parentNode) {
    filaPromo = document.createElement('div');
    filaPromo.className = 'carrito-resumen-fila';
    filaPromo.id = 'carritoAhorroPromosFila';
    filaPromo.innerHTML = '<span>🎉 Ahorro en promociones</span>' +
      '<span id="carritoAhorroPromos" style="font-weight:700;color:#2E7D32">−$0</span>';
    subtotalEl.parentNode.parentNode.insertBefore(filaPromo, subtotalEl.parentNode.nextSibling);
  }
  if (filaPromo) {
    filaPromo.style.display = t.descuentoPromos > 0 ? '' : 'none';
    if (t.descuentoPromos > 0) {
      var valPromo = document.getElementById('carritoAhorroPromos');
      if (valPromo) valPromo.textContent = '−' + _cop(t.descuentoPromos);
    }
  }

  /* Fila de descuento por monto — se crea dinámicamente si no existe */
  var filaDesc = document.getElementById('carritoDescuentoFila');
  if (!filaDesc && subtotalEl && subtotalEl.parentNode && subtotalEl.parentNode.parentNode) {
    filaDesc = document.createElement('div');
    filaDesc.className = 'carrito-resumen-fila';
    filaDesc.id = 'carritoDescuentoFila';
    filaDesc.innerHTML = '<span id="carritoDescuentoLabel">Descuento</span>' +
      '<span id="carritoDescuento" style="font-weight:700;color:#2E7D32">−$0</span>';
    var refPromo = document.getElementById('carritoAhorroPromosFila');
    subtotalEl.parentNode.parentNode.insertBefore(filaDesc, (refPromo || subtotalEl.parentNode).nextSibling);
  }
  if (filaDesc) {
    filaDesc.style.display = t.descuento > 0 ? '' : 'none';
    if (t.descuento > 0) {
      var lblDesc = document.getElementById('carritoDescuentoLabel');
      var valDesc = document.getElementById('carritoDescuento');
      if (lblDesc) lblDesc.textContent = '💚 Descuento (' + t.pctDescuento + '%)';
      if (valDesc) valDesc.textContent = '−' + _cop(t.descuento);
    }
  }

  if (envioEl) {
    if (t.subtotal === 0) {
      envioEl.textContent = '—';
      envioEl.style.color = 'var(--gris-500,#9e9e9e)';
    } else if (t.envio === 0) {
      envioEl.textContent = '🚚 GRATIS';
      envioEl.style.color = '#2E7D32';
    } else {
      envioEl.textContent = '$' + t.envio.toLocaleString('es-CO');
      envioEl.style.color = '#E65100';
    }
  }
  if (totalEl)    totalEl.textContent = _cop(t.total);

  /* Barra progreso envío (sobre el subtotal ya con promos aplicadas) */
  var barraEl = document.getElementById('envioProgresoZone');
  if (barraEl) barraEl.innerHTML = renderBarraEnvio(t.subtotal - t.descuentoPromos);

  renderCarritoDropdown();

  /* Sugerencias */
  renderSugerenciasCarrito();
}

/* ─── Dropdown de carrito ─── */
function crearCarritoDropdown() {
  // No mostrar dropdown en afiliaciones.html
  var paginasExcluidas = ['afiliaciones.html'];
var paginaActual = window.location.pathname.split('/').pop();
if (paginasExcluidas.indexOf(paginaActual) !== -1) return;
  
  if (document.getElementById('carritoDropdown')) return;

  var html =
    '<div id="carritoDropdown" class="carrito-dropdown" aria-live="polite">' +
      '<button type="button" id="carritoDropdownToggle" class="carrito-dropdown-toggle" aria-expanded="false">' +
        '<span><i class="fas fa-shopping-cart"></i> Carrito</span>' +
        '<strong class="carrito-dropdown-count">0</strong>' +
        '<i class="fas fa-chevron-up"></i>' +
      '</button>' +
      '<div class="carrito-dropdown-panel" role="region" aria-label="Resumen de carrito">' +
        '<div class="carrito-dropdown-items"></div>' +
        '<div class="carrito-dropdown-footer">' +
          '<div class="carrito-dropdown-total"><span>Total</span><strong>$0</strong></div>' +
          '<div class="carrito-dropdown-actions">' +
            '<button type="button" class="btn-primario btn-dropdown-ver">Ver carrito</button>' +
            '<button type="button" class="btn-vaciar btn-dropdown-vaciar">Vaciar</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  document.body.insertAdjacentHTML('beforeend', html);

  var toggle = document.getElementById('carritoDropdownToggle');
  var dropdown = document.getElementById('carritoDropdown');

  if (toggle) {
    toggle.addEventListener('click', function(event) {
      event.stopPropagation();
      toggleCarritoDropdown();
    });
  }

  document.addEventListener('click', function(event) {
    if (!dropdown.contains(event.target)) {
      closeCarritoDropdown();
    }
  });

  var btnVer = document.querySelector('.btn-dropdown-ver');
  var btnVaciar = document.querySelector('.btn-dropdown-vaciar');
  if (btnVer) btnVer.addEventListener('click', function() { abrirCarrito(); closeCarritoDropdown(); });
  if (btnVaciar) btnVaciar.addEventListener('click', function() { vaciarCarrito(); closeCarritoDropdown(); });
}

function renderCarritoDropdown() {
  
  var dropdown = document.getElementById('carritoDropdown');
  if (!dropdown) return;

  var countEl = dropdown.querySelector('.carrito-dropdown-count');
  var itemsContainer = dropdown.querySelector('.carrito-dropdown-items');
  var totalEl = dropdown.querySelector('.carrito-dropdown-total strong');

  var totalItems = carrito.reduce(function(acc, i) { return acc + i.cantidad; }, 0);
  var totales = calcularTotales();

  if (countEl) countEl.textContent = totalItems;
  if (totalEl) totalEl.textContent = _cop(totales.total);

  if (!itemsContainer) return;

  if (!carrito.length) {
    itemsContainer.innerHTML = '<div class="carrito-dropdown-empty">No hay productos seleccionados.</div>';
    dropdown.classList.remove('activo');
    return;
  }

  itemsContainer.innerHTML = carrito.map(function(item) {
    var itemImg = item.imagen || 'https://picsum.photos/seed/' + item.id + '/80/80';
    return '<div class="carrito-dropdown-item">' +
      '<img src="' + itemImg + '" onerror="this.src=\'https://picsum.photos/seed/' + item.id + '/80/80\'" alt="' + item.nombre + '">' +
      '<div class="carrito-dropdown-item-info">' +
        '<strong>' + item.nombre + '</strong>' +
        '<span>' + (item.variante ? item.variante : '') + (item.presentacion ? ' · ' + item.presentacion : '') + ' x' + item.cantidad + '</span>' +
      '</div>' +
      '<span class="carrito-dropdown-item-precio">' + _cop(precioEfectivo(item) * item.cantidad) + '</span>' +
    '</div>';
  }).join('');
}




/* ─── Sugerencias en el carrito ─── */
function renderSugerenciasCarrito() {
  var el = document.getElementById('carritoSugerencias');
  if (!el) return;
  var sugs = getSugerencias();
  if (!sugs.length) { el.innerHTML = ''; return; }

  el.innerHTML =
    '<p class="sugerencias-titulo"><i class="fas fa-star"></i> También te puede interesar</p>' +
    '<div class="sugerencias-lista">' +
      sugs.map(function(p) {
        var precio = p.variantes[0].precio;
        return '<div class="sug-item">' +
          '<img src="' + (p.imagen || 'https://picsum.photos/seed/' + p.id + '/60/60') + '" ' +
               'onerror="this.src=\'https://picsum.photos/seed/' + p.id + '/60/60\'">' +
          '<div class="sug-info">' +
            '<span class="sug-nombre">' + p.nombre + '</span>' +
            '<span class="sug-precio">' + _cop(precio) + '</span>' +
          '</div>' +
          '<button class="sug-btn" onclick="agregarAlCarrito(CATALOGO.find(function(x){return x.id===' + p.id + '}),0,this)" ' +
                  'aria-label="Agregar ' + p.nombre + '">+</button>' +
        '</div>';
      }).join('') +
    '</div>';
}

/* ─── Barra mobile fija abajo ─── */
function actualizarBarraMobile(totalItems, t) {
  var barra = document.getElementById('mobileCartBar');
  if (!barra) return;
  if (totalItems === 0) {
    barra.style.display = 'none';
    return;
  }
  barra.style.display = 'flex';
  var numEl   = barra.querySelector('.mcb-num');
  var totalEl = barra.querySelector('.mcb-total');
  if (numEl)   numEl.textContent   = totalItems + (totalItems === 1 ? ' producto' : ' productos');
  if (totalEl) totalEl.textContent = _cop(t.total);
}

/* ─── Modal ─── */
function abrirCarrito() {
  var modal = document.getElementById('carritoModal');
  if (modal) { modal.classList.add('activo'); document.body.style.overflow = 'hidden'; }
}

function cerrarCarrito() {
  var modal = document.getElementById('carritoModal');
  if (modal) { modal.classList.remove('activo'); document.body.style.overflow = ''; }
}

/* ─── Toast ─── */
function mostrarToast(msg) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('activo');
  setTimeout(function() { t.classList.remove('activo'); }, 3000);
}

/* ════════════════════════════════════════
   CHECKOUT — WhatsApp
════════════════════════════════════════ */
function checkoutWhatsApp() {
  var totales = calcularTotales();
  var msg = '🛒 *PEDIDO — Sabana Farma*\n\n';
  carrito.forEach(function(i) {
    var desc = i.variante || '';
    if (i.presentacion) desc += (desc ? ' · ' : '') + i.presentacion;
    var pu = precioEfectivo(i);
    var tagPromo = '';
    if (promoCantidadActiva(i)) {
      var pr = PROMOS_CANTIDAD[i.id];
      tagPromo = pr.tipo === 'tercera_pct'
        ? ' 🎉 (compra 2 y el 3.º con ' + pr.pct + '% OFF)'
        : ' 🎉 (promo ' + _cop(pu) + ' c/u)';
    }
    msg += '• ' + i.nombre + (desc ? ' (' + desc + ')' : '') + ' x' + i.cantidad + ' → ' + _cop(pu * i.cantidad) + tagPromo + '\n';
  });
  msg += '\n━━━━━━━━━━━━━━━━\n';
  msg += '💰 Subtotal: ' + _cop(totales.subtotal) + '\n';
  if (totales.descuentoPromos > 0) msg += '🎉 Ahorro en promociones: −' + _cop(totales.descuentoPromos) + '\n';
  if (totales.descuento > 0) msg += '💚 Descuento (' + totales.pctDescuento + '%): −' + _cop(totales.descuento) + '\n';
  msg += '🚚 Envío: ' + (totales.envio === 0 ? 'Gratis 🎉' : _cop(totales.envio)) + '\n';
  msg += '━━━━━━━━━━━━━━━━\n';
  msg += '💳 *TOTAL: ' + _cop(totales.total) + '*\n\n';
  msg += '📍 *Dirección de entrega:* (por favor indíquela)\n';
  msg += '\n💳 *Pago:* Nequi · Daviplata · Contra entrega (efectivo)\n';
  msg += '   Número de pagos: *312 421 39 86*\n\n';
  msg += '🚚 Domicilio: ' + (totales.envio === 0 ? 'GRATIS ✅' : '$3.000 (gratis en pedidos +$20.000)') + '\n';
  msg += '⏱️ Entrega estimada: 30–40 minutos\n\n';
  msg += '¿Confirman disponibilidad? ✅';

  /* Registrar pedido en la hoja de ventas (si está configurado) */
  if (window.registrarPedido) window.registrarPedido({
    origen:    'carrito',
    productos: carrito.map(function(i){ return i.nombre + ' x' + i.cantidad; }).join(' | '),
    items:     carrito.reduce(function(a,i){ return a + i.cantidad; }, 0),
    subtotal:  totales.subtotal,
    ahorro_promos: totales.descuentoPromos,
    descuento: totales.descuento,
    pct:       totales.pctDescuento,
    envio:     totales.envio,
    total:     totales.total
  });

  window.open('https://wa.me/573118719476?text=' + encodeURIComponent(msg), '_blank');
}


/* ════════════════════════════════════════
   INYECTOR DEL MODAL — se auto-inserta en
   cualquier página donde no exista el HTML
════════════════════════════════════════ */
function inyectarModalCarrito() {
  if (document.getElementById('carritoModal')) return;

  var html =
    '<div class="modal-overlay" id="carritoModal" role="dialog" aria-modal="true" aria-label="Carrito">' +
      '<div class="carrito-panel">' +
        '<div class="carrito-header">' +
          '<h2><i class="fas fa-shopping-cart"></i> Mi Carrito</h2>' +
          '<button class="btn-cerrar-carrito" id="btnCerrarCarrito" aria-label="Cerrar">&#x2715;</button>' +
        '</div>' +
        '<div class="carrito-items" id="carritoItems">' +
          '<div class="carrito-vacio">' +
            '<i class="fas fa-shopping-basket"></i>' +
            '<p>Tu carrito est\u00e1 vac\u00edo</p>' +
            '<a href="productos.html" class="btn-ir-catalogo">Ver cat\u00e1logo</a>' +
          '</div>' +
        '</div>' +
        '<div id="carritoSugerencias"></div>' +
        '<div id="envioProgresoZone"></div>' +
        '<div class="carrito-footer">' +
          '<div class="domicilio-info">' +
            '<i class="fas fa-motorcycle"></i>' +
            '<div>' +
              '<strong>🚚 Domicilio GRATIS en pedidos +$20.000</strong><br>' +
              '<span style="font-weight:600;font-size:.73rem;color:#E65100">$3.000 en pedidos menores · ⏱️ 30–40 min</span>' +
            '</div>' +
          '</div>' +
          '<div class="carrito-resumen">' +
            '<div class="carrito-resumen-fila"><span>Subtotal</span><span id="carritoSubtotal">$0</span></div>' +
            '<div class="carrito-resumen-fila"><span>Domicilio</span><span id="carritoEnvio" style="font-weight:700">—</span></div>' +
            '<div id="carritoEnvioMsg" style="font-size:.75rem;font-weight:700;color:#1565C0;margin-top:.2rem">🚚 Domicilio GRATIS en pedidos +$20.000</div>' +
          '</div>' +
          '<div class="carrito-total-fila"><span>Total</span><span id="carritoTotal">$0</span></div>' +
          '<div style="background:#E8F5E9;border:1.5px solid #C8E6C9;border-radius:10px;padding:.7rem .9rem;font-size:.75rem;margin:.2rem 0">' +
            '<div style="font-weight:900;color:#1B5E20;margin-bottom:.35rem">💳 Datos para pago:</div>' +
            '<div style="font-size:.73rem;color:#2E7D32;font-weight:700;margin-bottom:.2rem">📲 Nequi · Daviplata: <strong>312 421 39 86</strong></div>' +
            '<div style="font-size:.68rem;color:#555">Realiza tu pago y envía el comprobante por WhatsApp al confirmar el pedido.</div>' +
          '</div>' +
          '<div>' +
            '<div class="pagos-carrito-title">&#x1F4B3; Aceptamos:</div>' +
            '<div class="pagos-carrito">' +
              '<span class="pago-mini">🟢 Nequi</span>' +
              '<span class="pago-mini">🔴 Daviplata</span>' +
              '<span class="pago-mini">🛵 Contra entrega</span>' +
              '<div style="font-size:.66rem;color:#6b7280;margin-top:.25rem">Pagos al: <strong>312 421 39 86</strong></div>' +
            '</div>' +
          '</div>' +
          '<button class="btn-checkout" id="btnCheckout"><i class="fab fa-whatsapp"></i> Pedir por WhatsApp</button>' +
          '<button class="btn-vaciar" id="btnVaciarCarrito"><i class="fas fa-trash"></i> Vaciar carrito</button>' +
        '</div>' +
      '</div>' +
    '</div>';

  document.body.insertAdjacentHTML('beforeend', html);

  if (!document.getElementById('toast')) {
    var toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
}

/* ─── INIT ─── */
document.addEventListener('DOMContentLoaded', function() {
  inyectarModalCarrito();
  actualizarUI();

  var btnAbrir  = document.getElementById('btnAbrirCarrito');
  var btnAbrirMobile = document.getElementById('btnAbrirCarritoMobile');
  var btnCerrar = document.getElementById('btnCerrarCarrito');
  var btnVaciar = document.getElementById('btnVaciarCarrito');
  var btnCheckout = document.getElementById('btnCheckout');
  var overlay   = document.getElementById('carritoModal');

  if (btnAbrir)   btnAbrir.addEventListener('click', abrirCarrito);
  if (btnAbrirMobile) btnAbrirMobile.addEventListener('click', abrirCarrito);
  if (btnCerrar)  btnCerrar.addEventListener('click', cerrarCarrito);
  if (btnVaciar)  btnVaciar.addEventListener('click', vaciarCarrito);
  if (btnCheckout) btnCheckout.addEventListener('click', checkoutWhatsApp);

  /* Cerrar al click fuera del panel */
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) cerrarCarrito();
    });
  }

  /* Navbar toggle */
  var navToggle = document.getElementById('navToggle');
  var navLinks  = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function() {
      navLinks.classList.toggle('activo');
      navToggle.setAttribute('aria-expanded', navLinks.classList.contains('activo'));
    });
  }

  /* Mensaje domicilio — GRATIS en pedidos +$20.000 */
  (function() {
    var msgEl = document.getElementById('carritoEnvioMsg');
    if (!msgEl) return;
    msgEl.textContent = '🚚 Domicilio GRATIS en pedidos +$20.000';
    msgEl.style.color = '#1565C0';
  })();

  /* Sincronizar badge del bottom nav */
  (function() {
    var mainBadge = document.querySelector('.carrito-badge');
    var bnCount   = document.getElementById('bnCount');
    if (!mainBadge || !bnCount) return;
    function sync() {
      bnCount.textContent = mainBadge.textContent.trim();
      bnCount.classList.toggle('oculto', mainBadge.classList.contains('oculto'));
    }
    new MutationObserver(sync).observe(mainBadge, { childList: true, attributes: true });
  })();
});

/* ─── GLOBALES ─── */
window.agregarAlCarrito  = agregarAlCarrito;
window.eliminarDelCarrito = eliminarDelCarrito;
window.cambiarCantidad   = cambiarCantidad;
window.abrirCarrito      = abrirCarrito;
window.cerrarCarrito     = cerrarCarrito;
