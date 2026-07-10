/* ══════════════════════════════════════════════════════════
 *  Sabana Farma — Módulo de Pagos
 *  pago.js  |  v1.0
 *
 *  INSTRUCCIONES DE INTEGRACIÓN:
 *  ─────────────────────────────
 *  1. Agregar este script DESPUÉS de carrito.js en cada HTML:
 *       <script src="js/pago.js"></script>
 *
 *  2. Para activar Stripe real:
 *       a. Crear cuenta en https://stripe.com
 *       b. Obtener Public Key en Dashboard → Developers → API keys
 *       c. Reemplazar PAGO_CONFIG.stripe.publicKey con tu pk_live_...
 *       d. Crear backend (Node.js / PHP) para crear PaymentIntent
 *          (ver sección BACKEND al final de este archivo)
 *
 *  3. Para activar MercadoPago real:
 *       a. Crear cuenta en https://mercadopago.com.co
 *       b. Obtener Public Key en Credenciales de producción
 *       c. Reemplazar PAGO_CONFIG.mercadopago.publicKey
 *       d. Crear preferencia de pago desde tu backend
 *
 *  MODO DEMO:
 *  - Mientras PAGO_CONFIG.modoDemo = true, los pagos son simulados
 *  - En demo, cualquier número de tarjeta "funciona"
 *  - Cambiar a false solo cuando el backend esté listo
 * ══════════════════════════════════════════════════════════ */

/* ─── Configuración Central ─────────────────────────────── */
var PAGO_CONFIG = {
  modoDemo: true,                          /* ← cambiar a false con backend real */

  stripe: {
    publicKey: 'pk_test_TU_CLAVE_PUBLICA', /* ← reemplazar con tu clave Stripe   */
    endpointBackend: '/api/crear-pago'     /* ← tu endpoint PHP/Node              */
  },

  mercadopago: {
    publicKey: 'TEST-TU-CLAVE-PUBLICA',    /* ← reemplazar con tu clave MP        */
    endpointBackend: '/api/mp-preferencia' /* ← tu endpoint PHP/Node              */
  },

  nequi: {
    numero: '3124213986',                  /* ← número Nequi de la droguería      */
    nombre: 'Sabana Farma'
  },

  whatsapp: '573118719476'                 /* ← ya existente en carrito.js        */
};

/* ─── Estado del módulo de pago ─────────────────────────── */
var PAGO_ESTADO = {
  metodoSeleccionado: null,   /* 'nequi' | 'tarjeta' | 'pse' | 'contraentrega'   */
  procesando: false,
  datosFormulario: {}
};

/* ════════════════════════════════════════════════════════════
   INYECCIÓN EN EL DOM DEL CARRITO
   Se llama automáticamente cuando el DOM esté listo.
   Agrega el bloque de método de pago ANTES del botón checkout.
   ════════════════════════════════════════════════════════════ */
function inyectarSelectorPago() {
  var footer = document.querySelector('.carrito-footer');
  if (!footer) return;
  if (document.getElementById('pagoSection')) return; /* ya inyectado */

  /* ── Bloque HTML del selector de pago ── */
  var html = [
    '<div id="pagoSection" class="pago-section">',

      /* Título */
      '<p class="pago-titulo"><i class="fas fa-credit-card"></i> Método de pago</p>',

      /* Opciones */
      '<div class="pago-opciones">',

        /* Nequi */
        '<button class="pago-opcion" data-metodo="nequi" onclick="seleccionarMetodoPago(\'nequi\')" aria-label="Pagar con Nequi">',
          '<span class="pago-opcion-icono pago-nequi">N</span>',
          '<span class="pago-opcion-label">Nequi</span>',
          '<span class="pago-opcion-check"><i class="fas fa-check"></i></span>',
        '</button>',

        /* Tarjeta */
        '<button class="pago-opcion" data-metodo="tarjeta" onclick="seleccionarMetodoPago(\'tarjeta\')" aria-label="Pagar con tarjeta">',
          '<span class="pago-opcion-icono pago-tarjeta"><i class="fas fa-credit-card"></i></span>',
          '<span class="pago-opcion-label">Tarjeta</span>',
          '<span class="pago-opcion-check"><i class="fas fa-check"></i></span>',
        '</button>',

        /* PSE */
        '<button class="pago-opcion" data-metodo="pse" onclick="seleccionarMetodoPago(\'pse\')" aria-label="Pagar con PSE">',
          '<span class="pago-opcion-icono pago-pse">PSE</span>',
          '<span class="pago-opcion-label">PSE</span>',
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

  /* Mantener el botón WhatsApp original visible para conservar el flujo previo.
     El módulo de pago agrega además un botón "Pagar ahora" si se selecciona método. */
  if (btnCheckout) {
    btnCheckout.style.display = '';
  }

  /* Insertar botón "Pagar ahora" */
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
    tarjeta:       renderFormTarjeta,
    pse:           renderFormPSE,
    contraentrega: renderFormContraEntrega
  };

  contenedor.innerHTML = '';
  if (formularios[metodo]) {
    contenedor.innerHTML = formularios[metodo]();
  }

  /* Activar botón Pagar */
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

/* ── Nequi ── */
function renderFormNequi() {
  return '<div class="pago-form" id="formNequi">' +
    '<p class="pago-form-info">' +
      '<i class="fas fa-info-circle"></i> ' +
      'Recibirás una notificación push en tu app Nequi para autorizar el pago.' +
    '</p>' +
    '<label class="pago-label">Número Nequi registrado</label>' +
    '<input type="tel" class="pago-input" id="nequiNumero" ' +
      'placeholder="3XX XXX XXXX" maxlength="10" ' +
      'oninput="this.value=this.value.replace(/\\D/g,\'\')">' +
    '<p class="pago-nota">📱 Asegúrate de tener saldo disponible en tu cuenta Nequi.</p>' +
  '</div>';
}

/* ── Tarjeta (Stripe demo) ── */
function renderFormTarjeta() {
  var demo = PAGO_CONFIG.modoDemo
    ? '<span class="pago-demo-badge">MODO DEMO</span>' : '';
  return '<div class="pago-form" id="formTarjeta">' +
    '<div class="pago-form-header">' +
      '<span>Tarjeta crédito / débito</span>' + demo +
      '<span class="pago-marcas">' +
        '<i class="fab fa-cc-visa"></i> ' +
        '<i class="fab fa-cc-mastercard"></i>' +
      '</span>' +
    '</div>' +
    '<label class="pago-label">Número de tarjeta</label>' +
    '<input type="text" class="pago-input" id="cardNumber" ' +
      'placeholder="1234 5678 9012 3456" maxlength="19" ' +
      'oninput="formatearTarjeta(this)">' +
    '<div class="pago-row">' +
      '<div>' +
        '<label class="pago-label">Vencimiento</label>' +
        '<input type="text" class="pago-input" id="cardExpiry" ' +
          'placeholder="MM/AA" maxlength="5" ' +
          'oninput="formatearExpiry(this)">' +
      '</div>' +
      '<div>' +
        '<label class="pago-label">CVV</label>' +
        '<input type="text" class="pago-input" id="cardCvv" ' +
          'placeholder="123" maxlength="4" ' +
          'oninput="this.value=this.value.replace(/\\D/g,\'\')">' +
      '</div>' +
    '</div>' +
    '<label class="pago-label">Nombre en la tarjeta</label>' +
    '<input type="text" class="pago-input" id="cardNombre" ' +
      'placeholder="Como aparece en la tarjeta" ' +
      'style="text-transform:uppercase">' +
    (PAGO_CONFIG.modoDemo
      ? '<p class="pago-nota">🔒 Modo demo activo — ningún cobro real será efectuado.</p>'
      : '<p class="pago-nota">🔒 Pago seguro procesado por Stripe. Tus datos están cifrados.</p>') +
    '<button type="button" class="pago-btn-confirmar" onclick="iniciarPago()">Confirmar pago</button>' +
  '</div>';
}

/* ── PSE ── */
function renderFormPSE() {
  var bancos = [
    'Bancolombia','Banco de Bogotá','BBVA Colombia','Davivienda',
    'Banco Popular','Banco Agrario','Banco de Occidente','Colpatria',
    'Scotiabank Colpatria','AV Villas','Banco Caja Social','Itaú Colombia'
  ];
  var options = bancos.map(function(b) {
    return '<option value="' + b + '">' + b + '</option>';
  }).join('');
  return '<div class="pago-form" id="formPSE">' +
    '<p class="pago-form-info"><i class="fas fa-info-circle"></i> ' +
      'Serás redirigido al portal de tu banco para autorizar el débito.' +
    '</p>' +
    '<label class="pago-label">Banco</label>' +
    '<select class="pago-input" id="pseBanco">' +
      '<option value="">— Selecciona tu banco —</option>' + options +
    '</select>' +
    '<label class="pago-label">Tipo de persona</label>' +
    '<div class="pago-radio-group">' +
      '<label><input type="radio" name="pseTipo" value="natural" checked> Natural</label>' +
      '<label><input type="radio" name="pseTipo" value="juridica"> Jurídica</label>' +
    '</div>' +
    '<label class="pago-label">Número de documento</label>' +
    '<input type="text" class="pago-input" id="pseDocumento" ' +
      'placeholder="Cédula o NIT" maxlength="15">' +
    '<p class="pago-nota">🏦 PSE opera de lunes a sábado 7am–7pm.</p>' +
    '<button type="button" class="pago-btn-confirmar" onclick="iniciarPago()">Confirmar pago</button>' +
  '</div>';
}

/* ── Contra entrega ── */
function renderFormContraEntrega() {
  return '<div class="pago-form" id="formContraEntrega">' +
    '<p class="pago-form-info"><i class="fas fa-motorcycle"></i> ' +
      'Paga en efectivo cuando recibas tu pedido. Cobertura en Facatativá y alrededores.' +
    '</p>' +
    '<label class="pago-label">Dirección de entrega</label>' +
    '<input type="text" class="pago-input" id="ceDireccion" ' +
      'placeholder="Calle, Carrera, Barrio...">' +
    '<label class="pago-label">Teléfono de contacto</label>' +
    '<input type="tel" class="pago-input" id="ceTelefono" ' +
      'placeholder="3XX XXX XXXX" maxlength="10" ' +
      'oninput="this.value=this.value.replace(/\\D/g,\'\')">' +
    '<label class="pago-label">Nota adicional (opcional)</label>' +
    '<textarea class="pago-input" id="ceNota" rows="2" ' +
      'placeholder="Ej: apartamento 301, portería..."></textarea>' +
    '<p class="pago-nota">🕐 Entrega estimada: 30–60 minutos.</p>' +
    '<button type="button" class="pago-btn-confirmar" onclick="iniciarPago()">📦 Confirmar pedido contra entrega</button>' +
  '</div>';
}

/* ════════════════════════════════════════════════════════════
   VALIDACIONES
   ════════════════════════════════════════════════════════════ */
function validarFormulario(metodo) {
  var errores = [];

  if (metodo === 'nequi') {
    var num = (document.getElementById('nequiNumero') || {}).value || '';
    if (num.length < 10) errores.push('Ingresa un número Nequi válido (10 dígitos).');
  }

  if (metodo === 'tarjeta') {
    var cn  = ((document.getElementById('cardNumber')  || {}).value || '').replace(/\s/g,'');
    var ex  = (document.getElementById('cardExpiry')   || {}).value || '';
    var cv  = (document.getElementById('cardCvv')      || {}).value || '';
    var nm  = (document.getElementById('cardNombre')   || {}).value || '';
    if (cn.length < 16)  errores.push('Número de tarjeta inválido.');
    if (ex.length < 5)   errores.push('Fecha de vencimiento inválida (MM/AA).');
    if (cv.length < 3)   errores.push('CVV inválido.');
    if (nm.trim() === '') errores.push('Ingresa el nombre del titular.');
  }

  if (metodo === 'pse') {
    var banco = (document.getElementById('pseBanco')     || {}).value || '';
    var doc   = (document.getElementById('pseDocumento') || {}).value || '';
    if (!banco)           errores.push('Selecciona tu banco.');
    if (doc.length < 5)   errores.push('Ingresa tu número de documento.');
  }

  if (metodo === 'contraentrega') {
    var dir = (document.getElementById('ceDireccion') || {}).value || '';
    var tel = (document.getElementById('ceTelefono')  || {}).value || '';
    if (dir.trim() === '') errores.push('Ingresa la dirección de entrega.');
    if (tel.length < 7)    errores.push('Ingresa un teléfono de contacto válido.');
  }

  return errores;
}

/* ════════════════════════════════════════════════════════════
   INICIAR PAGO — punto de entrada principal
   ════════════════════════════════════════════════════════════ */
function iniciarPago() {
  if (PAGO_ESTADO.procesando) return;
  if (!PAGO_ESTADO.metodoSeleccionado) {
    mostrarMensajePago('⚠️ Selecciona un método de pago.', 'error');
    return;
  }
  if (!carrito || !carrito.length) {
    mostrarMensajePago('⚠️ El carrito está vacío.', 'error');
    return;
  }

  var errores = validarFormulario(PAGO_ESTADO.metodoSeleccionado);
  if (errores.length) {
    mostrarMensajePago('⚠️ ' + errores.join(' '), 'error');
    return;
  }

  var manejadores = {
    nequi:         procesarNequi,
    tarjeta:       procesarTarjeta,
    pse:           procesarPSE,
    contraentrega: procesarContraEntrega
  };

  var fn = manejadores[PAGO_ESTADO.metodoSeleccionado];
  if (fn) fn();
}

/* ════════════════════════════════════════════════════════════
   PROCESADORES POR MÉTODO
   ════════════════════════════════════════════════════════════ */

/* ── Nequi ── */
function procesarNequi() {
  var numero = document.getElementById('nequiNumero').value;
  var totales = calcularTotales();

  setProcesando(true);
  mostrarMensajePago('💜 Enviando solicitud a Nequi...', 'info');

  if (PAGO_CONFIG.modoDemo) {
    /* Simulación: 2s de "espera" */
    setTimeout(function() {
      setProcesando(false);
      mostrarPantallaExito({
        metodo:    'Nequi',
        total:     totales.total,
        referencia: generarReferencia(),
        detalle:   'Notificación enviada al número ' + numero + '. Abre tu app Nequi para autorizar.'
      });
    }, 2000);
    return;
  }

  /* ── INTEGRACIÓN REAL (descomentar cuando tengas backend) ──
  fetch('/api/nequi-cobro', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phoneNumber: numero,
      amount: totales.total,
      reference: generarReferencia()
    })
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    setProcesando(false);
    if (data.success) {
      mostrarPantallaExito({ metodo: 'Nequi', total: totales.total, referencia: data.referencia });
    } else {
      mostrarMensajePago('❌ ' + (data.mensaje || 'Error al procesar Nequi.'), 'error');
    }
  })
  .catch(function() {
    setProcesando(false);
    mostrarMensajePago('❌ No se pudo conectar con el servicio de pago.', 'error');
  });
  ── fin integración real ── */
}

/* ── Tarjeta (Stripe) ── */
function procesarTarjeta() {
  var totales = calcularTotales();
  setProcesando(true);
  mostrarMensajePago('🔒 Procesando pago de forma segura...', 'info');

  if (PAGO_CONFIG.modoDemo) {
    setTimeout(function() {
      setProcesando(false);
      /* Simular 10% de rechazo para que sea realista */
      if (Math.random() < 0.1) {
        mostrarMensajePago('❌ Tarjeta declinada. Verifica los datos e intenta de nuevo.', 'error');
        return;
      }
      mostrarPantallaExito({
        metodo:    'Tarjeta',
        total:     totales.total,
        referencia: generarReferencia(),
        detalle:   'Pago aprobado. Recibirás confirmación por correo.'
      });
    }, 2500);
    return;
  }

  /* ── INTEGRACIÓN STRIPE REAL ──
  //  PASO 1: Tu backend crea un PaymentIntent y devuelve el clientSecret
  //  PASO 2: Stripe.js tokeniza la tarjeta en el frontend (sin que el número llegue a tu servidor)
  //
  //  Instalar Stripe.js agregando en el <head>:
  //    <script src="https://js.stripe.com/v3/"></script>
  //
  //  Luego reemplazar esto:

  var stripe = Stripe(PAGO_CONFIG.stripe.publicKey);

  fetch(PAGO_CONFIG.stripe.endpointBackend, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: totales.total * 100, currency: 'cop' }) // Stripe usa centavos
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    var cardElement = stripe.elements().create('card');
    // En modo real, usarías un #card-element en el DOM, no inputs manuales
    return stripe.confirmCardPayment(data.clientSecret, {
      payment_method: { card: cardElement }
    });
  })
  .then(function(result) {
    setProcesando(false);
    if (result.error) {
      mostrarMensajePago('❌ ' + result.error.message, 'error');
    } else {
      mostrarPantallaExito({ metodo: 'Stripe', total: totales.total, referencia: result.paymentIntent.id });
    }
  })
  .catch(function() {
    setProcesando(false);
    mostrarMensajePago('❌ Error de conexión con Stripe.', 'error');
  });

  // BACKEND EJEMPLO (Node.js/Express):
  // app.post('/api/crear-pago', async (req, res) => {
  //   const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  //   const intent = await stripe.paymentIntents.create({
  //     amount: req.body.amount,
  //     currency: 'cop',
  //   });
  //   res.json({ clientSecret: intent.client_secret });
  // });
  ── fin Stripe ── */
}

/* ── PSE ── */
function procesarPSE() {
  var banco     = document.getElementById('pseBanco').value;
  var documento = document.getElementById('pseDocumento').value;
  var totales   = calcularTotales();

  setProcesando(true);
  mostrarMensajePago('🏦 Conectando con ' + banco + '...', 'info');

  if (PAGO_CONFIG.modoDemo) {
    setTimeout(function() {
      setProcesando(false);
      mostrarPantallaExito({
        metodo:    'PSE — ' + banco,
        total:     totales.total,
        referencia: generarReferencia(),
        detalle:   'En modo real serías redirigido al portal de tu banco para autorizar el débito.'
      });
    }, 2200);
    return;
  }

  /* ── INTEGRACIÓN PSE REAL (vía MercadoPago o Wompi) ──
  //
  //  Opción A — MercadoPago (recomendada para Colombia):
  //  - Crear preferencia en backend con método PSE
  //  - Redirigir a data.init_point
  //
  //  fetch(PAGO_CONFIG.mercadopago.endpointBackend, {
  //    method: 'POST',
  //    headers: { 'Content-Type': 'application/json' },
  //    body: JSON.stringify({
  //      banco: banco,
  //      documento: documento,
  //      monto: totales.total,
  //      items: carrito
  //    })
  //  })
  //  .then(r => r.json())
  //  .then(data => {
  //    window.location.href = data.redirect_url; // portal del banco
  //  });
  ── fin PSE ── */
}

/* ── Contra entrega ── */
function procesarContraEntrega() {
  var direccion = document.getElementById('ceDireccion').value;
  var telefono  = document.getElementById('ceTelefono').value;
  var nota      = (document.getElementById('ceNota') || {}).value || '';
  var totales   = calcularTotales();

  setProcesando(true);
  mostrarMensajePago('📦 Procesando pedido contra entrega...', 'info');

  if (PAGO_CONFIG.modoDemo) {
    setTimeout(function() {
      setProcesando(false);
      
      /* Formatear monto */
      var totalFormato = '$' + Number(totales.total).toLocaleString('es-CO');
      
      /* Construir mensaje */
      var msg = '🛒 *Pedido Sabana Farma*\n\n';
      for (var i = 0; i < carrito.length; i++) {
        var it = carrito[i];
        var precioFormato = '$' + Number(it.precio * it.cantidad).toLocaleString('es-CO');
        msg += '📦 ' + it.nombre + ' (' + it.variante + ') x' + it.cantidad + ' → ' + precioFormato + '\n';
      }
      var subtotalFormato = '$' + Number(totales.subtotal).toLocaleString('es-CO');
      var envioFormato = totales.envio === 0 ? 'Gratis 🎉' : '$' + Number(totales.envio).toLocaleString('es-CO');
      
      msg += '\n━━━━━━━━━━━━━━━━━━\n';
      msg += '💰 Subtotal: ' + subtotalFormato + '\n';
      if (totales.descuento > 0) {
        msg += '💚 Descuento (' + totales.pctDescuento + '%): −$' + Number(totales.descuento).toLocaleString('es-CO') + '\n';
      }
      msg += '🚚 Envío: ' + envioFormato + '\n';
      msg += '━━━━━━━━━━━━━━━━━━\n';
      msg += '💳 *TOTAL: ' + totalFormato + '*\n\n';
      msg += '🛵 *Método de pago:* Contra entrega (efectivo)\n';
      msg += '📍 *Dirección:* ' + direccion + '\n';
      msg += '📱 *Teléfono:* ' + telefono;
      if (nota.trim()) msg += '\n📝 *Nota:* ' + nota;
      msg += '\n\n¿Confirman disponibilidad y tiempo de entrega? ✅';

      /* Registrar pedido en la hoja de ventas (si está configurado) */
      if (window.registrarPedido) window.registrarPedido({
        origen:    'checkout-pago',
        productos: carrito.map(function(i){ return i.nombre + ' x' + i.cantidad; }).join(' | '),
        items:     carrito.reduce(function(a,i){ return a + i.cantidad; }, 0),
        subtotal:  totales.subtotal,
        descuento: totales.descuento || 0,
        pct:       totales.pctDescuento || 0,
        envio:     totales.envio,
        total:     totales.total
      });

      window.open('https://wa.me/' + PAGO_CONFIG.whatsapp + '?text=' + encodeURIComponent(msg), '_blank');

      mostrarPantallaExito({
        metodo:    'Contra entrega',
        total:     totales.total,
        referencia: generarReferencia(),
        detalle:   'Tu pedido fue enviado por WhatsApp. Te contactaremos para confirmar.',
        esWhatsApp: true
      });
    }, 1500);
    return;
  }
}

/* ════════════════════════════════════════════════════════════
   PANTALLA DE ÉXITO
   ════════════════════════════════════════════════════════════ */
function mostrarPantallaExito(info) {
  /* Vaciar carrito al confirmar pago (excepto contra entrega que ya abre WhatsApp) */
  if (!info.esWhatsApp) {
    carrito = [];
    guardarCarrito();
  }

  var panel = document.querySelector('.carrito-panel');
  if (!panel) return;

  var iconos = {
    'Nequi':          '💜',
    'Tarjeta':        '💳',
    'Contra entrega': '📦'
  };
  var icono = iconos[info.metodo] || '✅';

  panel.innerHTML = [
    '<div class="pago-exito" role="status">',
      '<div class="pago-exito-icono">' + icono + '</div>',
      '<h2 class="pago-exito-titulo">',
        info.esWhatsApp ? '¡Pedido enviado!' : '¡Pago exitoso!',
      '</h2>',
      '<p class="pago-exito-metodo">' + info.metodo + '</p>',
      '<div class="pago-exito-total">',
        '<span>Total pagado</span>',
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
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
  } else {
    btn.innerHTML = '<i class="fas fa-lock"></i> Confirmar pedido';
  }
}

function generarReferencia() {
  return 'DE-' + Date.now().toString(36).toUpperCase() + '-' +
    Math.random().toString(36).substr(2,4).toUpperCase();
}

/* Formateos de inputs */
function formatearTarjeta(input) {
  var v = input.value.replace(/\D/g, '').substring(0, 16);
  input.value = v.replace(/(.{4})/g, '$1 ').trim();
}

function formatearExpiry(input) {
  var v = input.value.replace(/\D/g, '').substring(0, 4);
  if (v.length >= 2) v = v.substring(0,2) + '/' + v.substring(2);
  input.value = v;
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
    '.pago-opciones{display:grid;grid-template-columns:repeat(4,1fr);gap:.45rem;margin-bottom:.9rem}',

    /* Botón opción */
    '.pago-opcion{display:flex;flex-direction:column;align-items:center;gap:.3rem;padding:.65rem .3rem;background:#fafafa;border:2px solid #e0e0e0;border-radius:12px;cursor:pointer;font-family:inherit;transition:all .2s;position:relative}',
    '.pago-opcion:hover{border-color:#1565C0;background:#e3f2fd;transform:translateY(-1px)}',
    '.pago-opcion.activo{border-color:#1565C0;background:#e3f2fd}',

    /* Ícono de opción */
    '.pago-opcion-icono{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:.85rem;font-weight:900;color:#fff}',
    '.pago-nequi{background:linear-gradient(135deg,#7B1FA2,#9C27B0)}',
    '.pago-tarjeta{background:linear-gradient(135deg,#1565C0,#1976D2)}',
    '.pago-pse{background:linear-gradient(135deg,#1B5E20,#2E7D32);font-size:.65rem}',
    '.pago-contra{background:linear-gradient(135deg,#E65100,#F57C00)}',

    '.pago-opcion-label{font-size:.66rem;font-weight:800;color:#333;text-align:center;line-height:1.2}',

    /* Check de selección */
    '.pago-opcion-check{position:absolute;top:4px;right:4px;width:16px;height:16px;background:#1565C0;border-radius:50%;color:#fff;font-size:.55rem;display:flex;align-items:center;justify-content:center;opacity:0;transform:scale(0);transition:all .2s}',
    '.pago-opcion.activo .pago-opcion-check{opacity:1;transform:scale(1)}',

    /* Formularios */
    '.pago-form{background:#f8f9ff;border:1.5px solid #e0e0e0;border-radius:12px;padding:.9rem;margin-bottom:.8rem;animation:pagoFormIn .2s ease}',
    '@keyframes pagoFormIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}',
    '.pago-form-header{display:flex;justify-content:space-between;align-items:center;font-size:.82rem;font-weight:800;color:#1a1a2e;margin-bottom:.7rem}',
    '.pago-marcas{font-size:1.3rem;color:#555}',
    '.pago-marcas .fa-cc-visa{color:#1A1F71}',
    '.pago-marcas .fa-cc-mastercard{color:#EB001B}',
    '.pago-form-info{font-size:.76rem;color:#555;background:#fff;border:1px solid #e0e0e0;border-radius:8px;padding:.5rem .7rem;margin-bottom:.7rem;display:flex;align-items:flex-start;gap:.4rem}',
    '.pago-form-info i{color:#1565C0;margin-top:.1rem;flex-shrink:0}',
    '.pago-label{display:block;font-size:.74rem;font-weight:700;color:#444;margin-bottom:.3rem;margin-top:.55rem}',
    '.pago-input{width:100%;padding:.6rem .8rem;border:2px solid #e0e0e0;border-radius:9px;font-family:inherit;font-size:.85rem;outline:none;transition:border-color .2s;box-sizing:border-box;background:#fff}',
    '.pago-input:focus{border-color:#1565C0}',
    '.pago-row{display:grid;grid-template-columns:1fr 1fr;gap:.6rem}',
    '.pago-nota{font-size:.7rem;color:#888;margin-top:.5rem}',
    '.pago-radio-group{display:flex;gap:1rem;margin:.3rem 0}',
    '.pago-radio-group label{font-size:.8rem;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:.3rem}',
    '.pago-demo-badge{background:#FF9800;color:#fff;font-size:.62rem;font-weight:800;padding:.15rem .5rem;border-radius:4px}',

    /* Mensajes */
    '.pago-mensaje{font-size:.78rem;font-weight:700;padding:.5rem .8rem;border-radius:8px;display:none;margin-bottom:.6rem}',
    '.pago-mensaje.activo{display:block}',
    '.pago-mensaje-error{background:#FFEBEE;color:#C62828;border:1px solid #FFCDD2}',
    '.pago-mensaje-info{background:#E3F2FD;color:#1565C0;border:1px solid #BBDEFB}',
    '.pago-mensaje-exito{background:#E8F5E9;color:#2E7D32;border:1px solid #C8E6C9}',

    /* Botón Pagar Ahora */
    '.btn-pagar-ahora{width:100%;padding:.95rem;background:linear-gradient(135deg,#1565C0,#1976D2);color:#fff;border:none;border-radius:14px;font-family:inherit;font-size:.98rem;font-weight:900;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.5rem;transition:all .2s;box-shadow:0 3px 12px rgba(21,101,192,.3)}',
    '.btn-pagar-ahora:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 20px rgba(21,101,192,.4)}',
    '.btn-pagar-ahora:disabled{opacity:.5;cursor:not-allowed;transform:none}',
    '.pago-btn-confirmar{width:100%;margin-top:1rem;padding:.8rem 1rem;border:none;border-radius:12px;background:#1976D2;color:#fff;font-size:.95rem;font-weight:800;cursor:pointer;transition:transform .2s,box-shadow .2s}',
    '.pago-btn-confirmar:hover{transform:translateY(-1px);box-shadow:0 5px 14px rgba(21,101,192,.3)}',
    '.pago-btn-confirmar:focus{outline:2px solid rgba(25,118,210,.5);outline-offset:2px}',

    /* Pantalla de éxito */
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
window.formatearTarjeta      = formatearTarjeta;
window.formatearExpiry       = formatearExpiry;
window.suscribirWhatsapp     = window.suscribirWhatsapp; /* preservar promo */

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