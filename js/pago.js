/* ══════════════════════════════════════════════════════════
 *  Sabana Farma — Módulo de Pagos
 *  pago.js  |  v2.0
 *
 *  CAMBIO IMPORTANTE (v2.0):
 *  ─────────────────────────
 *  Se eliminó el "modo demo" que simulaba pagos exitosos con
 *  Tarjeta/PSE sin cobrar nada (riesgo crítico en producción).
 *  Ahora TODOS los métodos generan un pedido real por WhatsApp
 *  con las instrucciones de pago correspondientes.
 *
 *  Métodos disponibles:
 *   • Nequi          → pago al 312 421 39 86 + comprobante por WhatsApp
 *   • Daviplata      → pago al 312 421 39 86 + comprobante por WhatsApp
 *   • Contra entrega → efectivo al recibir el pedido
 *
 *  INTEGRACIÓN:
 *   Agregar DESPUÉS de carrito.js en cada HTML:
 *     <script src="js/pago.js"></script>
 * ══════════════════════════════════════════════════════════ */
'use strict';

/* ─── Configuración Central ─────────────────────────────── */
var PAGO_CONFIG = {
  nequi: {
    numero: (window.DE_CONFIG && window.DE_CONFIG.WA_NEQUI) || '3124213986',
    nombre: 'Sabana Farma'
  },
  whatsapp: (window.DE_CONFIG && window.DE_CONFIG.WA_NUM) || '573118719476'
};

/* Número de pagos con formato legible (312 421 39 86) */
function pagoNumeroFmt() {
  var n = PAGO_CONFIG.nequi.numero;
  return n.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');
}

/* ─── Estado del módulo de pago ─────────────────────────── */
var PAGO_ESTADO = {
  metodoSeleccionado: null,   /* 'nequi' | 'daviplata' | 'contraentrega' */
  procesando: false
};

/* ════════════════════════════════════════════════════════════
   INYECCIÓN EN EL DOM DEL CARRITO
   ════════════════════════════════════════════════════════════ */
function inyectarSelectorPago() {
  var footer = document.querySelector('.carrito-footer');
  if (!footer) return;
  if (document.getElementById('pagoSection')) return; /* ya inyectado */

  var html = [
    '<div id="pagoSection" class="pago-section">',

      '<p class="pago-titulo"><i class="fas fa-credit-card"></i> Método de pago</p>',

      '<div class="pago-opciones">',

        /* Nequi */
        '<button class="pago-opcion" data-metodo="nequi" onclick="seleccionarMetodoPago(\'nequi\')" aria-label="Pagar con Nequi">',
          '<span class="pago-opcion-icono pago-nequi">N</span>',
          '<span class="pago-opcion-label">Nequi</span>',
          '<span class="pago-opcion-check"><i class="fas fa-check"></i></span>',
        '</button>',

        /* Daviplata */
        '<button class="pago-opcion" data-metodo="daviplata" onclick="seleccionarMetodoPago(\'daviplata\')" aria-label="Pagar con Daviplata">',
          '<span class="pago-opcion-icono pago-daviplata">D</span>',
          '<span class="pago-opcion-label">Daviplata</span>',
          '<span class="pago-opcion-check"><i class="fas fa-check"></i></span>',
        '</button>',

        /* Contra entrega */
        '<button class="pago-opcion" data-metodo="contraentrega" onclick="seleccionarMetodoPago(\'contraentrega\')" aria-label="Pago contra entrega">',
          '<span class="pago-opcion-icono pago-contra"><i class="fas fa-motorcycle"></i></span>',
          '<span class="pago-opcion-label">Contra entrega</span>',
          '<span class="pago-opcion-check"><i class="fas fa-check"></i></span>',
        '</button>',

      '</div>', /* /pago-opciones */

      /* Paneles de formulario (uno por método) */
      '<div id="pagoFormularios"></div>',

      /* Mensaje de error/éxito */
      '<div id="pagoMensaje" class="pago-mensaje" role="alert"></div>',

    '</div>' /* /pagoSection */
  ].join('');

  /* Insertar ANTES del botón checkout */
  var btnCheckout = document.getElementById('btnCheckout');
  if (btnCheckout) {
    btnCheckout.insertAdjacentHTML('beforebegin', html);
  } else {
    footer.insertAdjacentHTML('afterbegin', html);
  }

  /* Mantener el botón WhatsApp original visible para conservar el flujo previo. */
  if (btnCheckout) {
    btnCheckout.style.display = '';
  }

  /* Insertar botón "Confirmar pedido" */
  var btnHtml = '<button class="btn-pagar-ahora" id="btnPagarAhora" onclick="iniciarPago()" disabled>' +
    '<i class="fas fa-lock"></i> <span id="btnPagarTexto">Selecciona un método</span>' +
    '</button>';

  var btnVaciar = document.getElementById('btnVaciarCarrito');
  if (btnVaciar) {
    btnVaciar.insertAdjacentHTML('beforebegin', btnHtml);
  } else {
    footer.insertAdjacentHTML('beforeend', btnHtml);
  }

  inyectarEstilosPago();
}

/* ════════════════════════════════════════════════════════════
   SELECCIÓN DE MÉTODO DE PAGO
   ════════════════════════════════════════════════════════════ */
function seleccionarMetodoPago(metodo) {
  PAGO_ESTADO.metodoSeleccionado = metodo;

  /* Resaltar opción activa */
  var opciones = document.querySelectorAll('.pago-opcion');
  for (var i = 0; i < opciones.length; i++) {
    opciones[i].classList.toggle('activo', opciones[i].dataset.metodo === metodo);
  }

  /* Renderizar formulario correspondiente */
  var contenedor = document.getElementById('pagoFormularios');
  if (!contenedor) return;

  var formularios = {
    nequi:         renderFormNequi,
    daviplata:     renderFormDaviplata,
    contraentrega: renderFormContraEntrega
  };

  contenedor.innerHTML = '';
  if (formularios[metodo]) {
    contenedor.innerHTML = formularios[metodo]();
  }

  /* Activar botón Confirmar */
  var btn = document.getElementById('btnPagarAhora');
  if (btn) {
    btn.disabled = false;
    document.getElementById('btnPagarTexto').textContent = 'Confirmar pedido';
  }

  limpiarMensajePago();
}

/* ════════════════════════════════════════════════════════════
   FORMULARIOS POR MÉTODO
   ════════════════════════════════════════════════════════════ */

/* Campos comunes de entrega */
function camposEntrega() {
  return '<label class="pago-label">Dirección de entrega</label>' +
    '<input type="text" class="pago-input" id="peDireccion" ' +
      'placeholder="Calle, Carrera, Barrio... (Mosquera o Funza)">' +
    '<label class="pago-label">Teléfono de contacto</label>' +
    '<input type="tel" class="pago-input" id="peTelefono" ' +
      'placeholder="3XX XXX XXXX" maxlength="10" ' +
      'oninput="this.value=this.value.replace(/\\D/g,\'\')">' +
    '<label class="pago-label">Nota adicional (opcional)</label>' +
    '<textarea class="pago-input" id="peNota" rows="2" ' +
      'placeholder="Ej: apartamento 301, portería..."></textarea>';
}

/* ── Nequi ── */
function renderFormNequi() {
  return '<div class="pago-form" id="formNequi">' +
    '<p class="pago-form-info">' +
      '<i class="fas fa-info-circle"></i> ' +
      'Paga desde tu app Nequi al número <strong>' + pagoNumeroFmt() + '</strong> ' +
      '(' + PAGO_CONFIG.nequi.nombre + ') y envía el comprobante por WhatsApp al confirmar el pedido.' +
    '</p>' +
    camposEntrega() +
    '<p class="pago-nota">📱 Tu pedido se despacha al verificar el pago.</p>' +
  '</div>';
}

/* ── Daviplata ── */
function renderFormDaviplata() {
  return '<div class="pago-form" id="formDaviplata">' +
    '<p class="pago-form-info">' +
      '<i class="fas fa-info-circle"></i> ' +
      'Paga desde tu app Daviplata al número <strong>' + pagoNumeroFmt() + '</strong> ' +
      '(' + PAGO_CONFIG.nequi.nombre + ') y envía el comprobante por WhatsApp al confirmar el pedido.' +
    '</p>' +
    camposEntrega() +
    '<p class="pago-nota">🔴 Tu pedido se despacha al verificar el pago.</p>' +
  '</div>';
}

/* ── Contra entrega ── */
function renderFormContraEntrega() {
  return '<div class="pago-form" id="formContraEntrega">' +
    '<p class="pago-form-info"><i class="fas fa-motorcycle"></i> ' +
      'Paga en efectivo cuando recibas tu pedido. Cobertura en Mosquera y Funza.' +
    '</p>' +
    camposEntrega() +
    '<p class="pago-nota">🕐 Entrega estimada: 30–60 minutos.</p>' +
  '</div>';
}

/* ════════════════════════════════════════════════════════════
   VALIDACIONES
   ════════════════════════════════════════════════════════════ */
function validarFormulario() {
  var errores = [];
  var dir = (document.getElementById('peDireccion') || {}).value || '';
  var tel = (document.getElementById('peTelefono')  || {}).value || '';
  if (dir.trim() === '') errores.push('Ingresa la dirección de entrega.');
  if (tel.length < 7)    errores.push('Ingresa un teléfono de contacto válido.');
  return errores;
}

/* ════════════════════════════════════════════════════════════
   INICIAR PAGO — punto de entrada principal
   Construye el pedido y lo envía por WhatsApp. Sin simulaciones.
   ════════════════════════════════════════════════════════════ */
function iniciarPago() {
  if (PAGO_ESTADO.procesando) return;
  if (!PAGO_ESTADO.metodoSeleccionado) {
    mostrarMensajePago('⚠️ Selecciona un método de pago.', 'error');
    return;
  }
  if (typeof carrito === 'undefined' || !carrito || !carrito.length) {
    mostrarMensajePago('⚠️ El carrito está vacío.', 'error');
    return;
  }

  var errores = validarFormulario();
  if (errores.length) {
    mostrarMensajePago('⚠️ ' + errores.join(' '), 'error');
    return;
  }

  enviarPedidoWhatsApp(PAGO_ESTADO.metodoSeleccionado);
}

/* ════════════════════════════════════════════════════════════
   ENVÍO DEL PEDIDO POR WHATSAPP
   ════════════════════════════════════════════════════════════ */
function enviarPedidoWhatsApp(metodo) {
  var direccion = (document.getElementById('peDireccion') || {}).value || '';
  var telefono  = (document.getElementById('peTelefono')  || {}).value || '';
  var nota      = (document.getElementById('peNota')      || {}).value || '';
  var totales   = calcularTotales();

  var etiquetas = {
    nequi:         '💜 Nequi (' + pagoNumeroFmt() + ')',
    daviplata:     '🔴 Daviplata (' + pagoNumeroFmt() + ')',
    contraentrega: '🛵 Contra entrega (efectivo)'
  };

  setProcesando(true);

  /* ── Construir mensaje ── */
  var msg = '🛒 *Pedido Sabana Farma*\n\n';
  for (var i = 0; i < carrito.length; i++) {
    var it = carrito[i];
    var pu = window.precioEfectivo ? window.precioEfectivo(it) : it.precio; /* aplica promos por cantidad */
    var precioFormato = '$' + Number(pu * it.cantidad).toLocaleString('es-CO');
    var tagPromo = '';
    if (typeof promoCantidadActiva === 'function' && promoCantidadActiva(it)) {
      var pr = PROMOS_CANTIDAD[it.id];
      tagPromo = (pr && pr.tipo === 'tercera_pct')
        ? ' 🎉 (compra 2 y el 3.º con ' + pr.pct + '% OFF)'
        : ' 🎉 (promo $' + Number(pu).toLocaleString('es-CO') + ' c/u)';
    }
    var desc = it.variante || '';
    if (it.presentacion) desc += (desc ? ' · ' : '') + it.presentacion;
    msg += '📦 ' + it.nombre + (desc ? ' (' + desc + ')' : '') + ' x' + it.cantidad + ' → ' + precioFormato + tagPromo + '\n';
  }

  var subtotalFormato = '$' + Number(totales.subtotal).toLocaleString('es-CO');
  var envioFormato    = totales.envio === 0 ? 'Gratis 🎉' : '$' + Number(totales.envio).toLocaleString('es-CO');
  var totalFormato    = '$' + Number(totales.total).toLocaleString('es-CO');

  msg += '\n━━━━━━━━━━━━━━━━━━\n';
  msg += '💰 Subtotal: ' + subtotalFormato + '\n';
  if (totales.descuentoPromos > 0) {
    msg += '🎉 Ahorro en promociones: −$' + Number(totales.descuentoPromos).toLocaleString('es-CO') + '\n';
  }
  if (totales.descuento > 0) {
    msg += '💚 Descuento (' + totales.pctDescuento + '%): −$' + Number(totales.descuento).toLocaleString('es-CO') + '\n';
  }
  msg += '🚚 Envío: ' + envioFormato + '\n';
  msg += '━━━━━━━━━━━━━━━━━━\n';
  msg += '💳 *TOTAL: ' + totalFormato + '*\n\n';
  msg += '💳 *Método de pago:* ' + (etiquetas[metodo] || metodo) + '\n';
  if (metodo === 'nequi' || metodo === 'daviplata') {
    msg += '   Envío el comprobante de pago por este chat. 🧾\n';
  }
  msg += '📍 *Dirección:* ' + direccion + '\n';
  msg += '📱 *Teléfono:* ' + telefono;
  if (nota.trim()) msg += '\n📝 *Nota:* ' + nota;
  msg += '\n\n¿Confirman disponibilidad y tiempo de entrega? ✅';

  /* Registrar pedido en la hoja de ventas (si está configurado) */
  if (window.registrarPedido) window.registrarPedido({
    origen:    'checkout-pago',
    metodo:    metodo,
    productos: carrito.map(function(i){ return i.nombre + ' x' + i.cantidad; }).join(' | '),
    items:     carrito.reduce(function(a,i){ return a + i.cantidad; }, 0),
    subtotal:  totales.subtotal,
    ahorro_promos: totales.descuentoPromos || 0,
    descuento: totales.descuento || 0,
    pct:       totales.pctDescuento || 0,
    envio:     totales.envio,
    total:     totales.total
  });

  window.open('https://wa.me/' + PAGO_CONFIG.whatsapp + '?text=' + encodeURIComponent(msg), '_blank');

  setProcesando(false);
  mostrarPantallaExito({
    metodo:    metodo === 'contraentrega' ? 'Contra entrega'
             : metodo === 'nequi'         ? 'Nequi'
             : 'Daviplata',
    total:     totales.total,
    referencia: generarReferencia(),
    detalle:   metodo === 'contraentrega'
      ? 'Tu pedido fue enviado por WhatsApp. Pagas en efectivo al recibirlo.'
      : 'Tu pedido fue enviado por WhatsApp. Paga al ' + pagoNumeroFmt() + ' y envía el comprobante por el chat.'
  });
}

/* ════════════════════════════════════════════════════════════
   PANTALLA DE CONFIRMACIÓN
   (siempre "¡Pedido enviado!", nunca simula un cobro)
   ════════════════════════════════════════════════════════════ */
function mostrarPantallaExito(info) {
  var panel = document.querySelector('.carrito-panel');
  if (!panel) return;

  var iconos = {
    'Nequi':          '💜',
    'Daviplata':      '🔴',
    'Contra entrega': '📦'
  };
  var icono = iconos[info.metodo] || '✅';

  panel.innerHTML = [
    '<div class="pago-exito" role="status">',
      '<div class="pago-exito-icono">' + icono + '</div>',
      '<h2 class="pago-exito-titulo">¡Pedido enviado!</h2>',
      '<p class="pago-exito-metodo">' + info.metodo + '</p>',
      '<div class="pago-exito-total">',
        '<span>Total del pedido</span>',
        '<strong>' + _cop(info.total) + '</strong>',
      '</div>',
      '<div class="pago-exito-ref">',
        'Ref. <code>' + info.referencia + '</code>',
      '</div>',
      info.detalle
        ? '<p class="pago-exito-detalle">' + info.detalle + '</p>'
        : '',
      '<button class="btn-pagar-ahora" style="margin-top:1.5rem" onclick="cerrarCarrito();location.reload()">',
        '<i class="fas fa-store"></i> Seguir comprando',
      '</button>',
    '</div>'
  ].join('');
}

/* ════════════════════════════════════════════════════════════
   HELPERS UI
   ════════════════════════════════════════════════════════════ */
function mostrarMensajePago(texto, tipo) {
  var el = document.getElementById('pagoMensaje');
  if (!el) return;
  el.textContent = texto;
  el.className = 'pago-mensaje pago-mensaje-' + (tipo || 'info') + ' activo';
}

function limpiarMensajePago() {
  var el = document.getElementById('pagoMensaje');
  if (el) { el.textContent = ''; el.className = 'pago-mensaje'; }
}

function setProcesando(estado) {
  PAGO_ESTADO.procesando = estado;
  var btn = document.getElementById('btnPagarAhora');
  if (!btn) return;
  btn.disabled = estado;
  if (estado) {
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando pedido...';
  } else {
    btn.innerHTML = '<i class="fas fa-lock"></i> Confirmar pedido';
  }
}

function generarReferencia() {
  return 'SF-' + Date.now().toString(36).toUpperCase() + '-' +
    Math.random().toString(36).substr(2,4).toUpperCase();
}

/* ════════════════════════════════════════════════════════════
   ESTILOS (inyectados dinámicamente para no editar el CSS)
   ════════════════════════════════════════════════════════════ */
function inyectarEstilosPago() {
  if (document.getElementById('pago-estilos')) return;
  var s = document.createElement('style');
  s.id = 'pago-estilos';
  s.textContent = [

    /* Sección principal */
    '.pago-section{padding:.8rem 0;border-top:1.5px solid #e0e0e0;margin-top:.5rem}',
    '.pago-titulo{font-size:.82rem;font-weight:900;color:#546e7a;text-transform:uppercase;letter-spacing:.08em;margin-bottom:.75rem;display:flex;align-items:center;gap:.4rem}',

    /* Grid de opciones */
    '.pago-opciones{display:grid;grid-template-columns:repeat(3,1fr);gap:.45rem;margin-bottom:.9rem}',

    /* Botón opción */
    '.pago-opcion{display:flex;flex-direction:column;align-items:center;gap:.3rem;padding:.65rem .3rem;background:#fafafa;border:2px solid #e0e0e0;border-radius:12px;cursor:pointer;font-family:inherit;transition:all .2s;position:relative}',
    '.pago-opcion:hover{border-color:#1565C0;background:#e3f2fd;transform:translateY(-1px)}',
    '.pago-opcion.activo{border-color:#1565C0;background:#e3f2fd}',

    /* Ícono de opción */
    '.pago-opcion-icono{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:.85rem;font-weight:900;color:#fff}',
    '.pago-nequi{background:linear-gradient(135deg,#7B1FA2,#9C27B0)}',
    '.pago-daviplata{background:linear-gradient(135deg,#C62828,#E53935)}',
    '.pago-contra{background:linear-gradient(135deg,#E65100,#F57C00)}',

    '.pago-opcion-label{font-size:.66rem;font-weight:800;color:#333;text-align:center;line-height:1.2}',

    /* Check de selección */
    '.pago-opcion-check{position:absolute;top:4px;right:4px;width:16px;height:16px;background:#1565C0;border-radius:50%;color:#fff;font-size:.55rem;display:flex;align-items:center;justify-content:center;opacity:0;transform:scale(0);transition:all .2s}',
    '.pago-opcion.activo .pago-opcion-check{opacity:1;transform:scale(1)}',

    /* Formularios */
    '.pago-form{background:#f8f9ff;border:1.5px solid #e0e0e0;border-radius:12px;padding:.9rem;margin-bottom:.8rem;animation:pagoFormIn .2s ease}',
    '@keyframes pagoFormIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}',
    '.pago-form-info{font-size:.76rem;color:#555;background:#fff;border:1px solid #e0e0e0;border-radius:8px;padding:.5rem .7rem;margin-bottom:.7rem;display:flex;align-items:flex-start;gap:.4rem}',
    '.pago-form-info i{color:#1565C0;margin-top:.1rem;flex-shrink:0}',
    '.pago-label{display:block;font-size:.74rem;font-weight:700;color:#444;margin-bottom:.3rem;margin-top:.55rem}',
    '.pago-input{width:100%;padding:.6rem .8rem;border:2px solid #e0e0e0;border-radius:9px;font-family:inherit;font-size:.85rem;outline:none;transition:border-color .2s;box-sizing:border-box;background:#fff}',
    '.pago-input:focus{border-color:#1565C0}',
    '.pago-nota{font-size:.7rem;color:#888;margin-top:.5rem}',

    /* Mensajes */
    '.pago-mensaje{font-size:.78rem;font-weight:700;padding:.5rem .8rem;border-radius:8px;display:none;margin-bottom:.6rem}',
    '.pago-mensaje.activo{display:block}',
    '.pago-mensaje-error{background:#FFEBEE;color:#C62828;border:1px solid #FFCDD2}',
    '.pago-mensaje-info{background:#E3F2FD;color:#1565C0;border:1px solid #BBDEFB}',
    '.pago-mensaje-exito{background:#E8F5E9;color:#2E7D32;border:1px solid #C8E6C9}',

    /* Botón Confirmar pedido */
    '.btn-pagar-ahora{width:100%;padding:.95rem;background:linear-gradient(135deg,#1565C0,#1976D2);color:#fff;border:none;border-radius:14px;font-family:inherit;font-size:.98rem;font-weight:900;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.5rem;transition:all .2s;box-shadow:0 3px 12px rgba(21,101,192,.3)}',
    '.btn-pagar-ahora:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 20px rgba(21,101,192,.4)}',
    '.btn-pagar-ahora:disabled{opacity:.5;cursor:not-allowed;transform:none}',

    /* Pantalla de confirmación */
    '.pago-exito{display:flex;flex-direction:column;align-items:center;text-align:center;padding:2rem 1.5rem;animation:exitoIn .5s cubic-bezier(.34,1.56,.64,1)}',
    '@keyframes exitoIn{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}',
    '.pago-exito-icono{font-size:4rem;margin-bottom:.8rem}',
    '.pago-exito-titulo{font-size:1.4rem;font-weight:900;color:#1a1a2e;margin-bottom:.3rem}',
    '.pago-exito-metodo{font-size:.88rem;color:#555;margin-bottom:1rem}',
    '.pago-exito-total{display:flex;justify-content:space-between;align-items:center;background:#e3f2fd;border-radius:10px;padding:.7rem 1.2rem;width:100%;margin-bottom:.6rem;font-weight:700}',
    '.pago-exito-total strong{font-size:1.2rem;color:#1565C0}',
    '.pago-exito-ref{font-size:.76rem;color:#888;margin-bottom:.8rem}',
    '.pago-exito-ref code{background:#f5f5f5;padding:.2rem .5rem;border-radius:5px;color:#333}',
    '.pago-exito-detalle{font-size:.82rem;color:#666;max-width:280px;line-height:1.5}',

  ].join('');
  document.head.appendChild(s);
}

/* ════════════════════════════════════════════════════════════
   EXPOSICIÓN GLOBAL
   ════════════════════════════════════════════════════════════ */
window.seleccionarMetodoPago = seleccionarMetodoPago;
window.iniciarPago           = iniciarPago;

/* ════════════════════════════════════════════════════════════
   INIT — inyectar cuando el DOM esté listo Y cuando el
   carrito se abra (por si el panel se renderiza tarde)
   ════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
  /* Observar el botón de abrir carrito para inyectar al abrirlo */
  var botonesAbrir = document.querySelectorAll('#btnAbrirCarrito, .btn-carrito');
  for (var i = 0; i < botonesAbrir.length; i++) {
    botonesAbrir[i].addEventListener('click', function() {
      /* pequeño delay para que carrito.js termine de renderizar */
      setTimeout(inyectarSelectorPago, 80);
    });
  }

  /* También inyectar si el modal ya está activo */
  var modal = document.getElementById('carritoModal');
  if (modal) {
    var obs = new MutationObserver(function(mutations) {
      for (var m = 0; m < mutations.length; m++) {
        if (mutations[m].target.classList.contains('activo')) {
          setTimeout(inyectarSelectorPago, 80);
        }
      }
    });
    obs.observe(modal, { attributes: true, attributeFilter: ['class'] });
  }
});
