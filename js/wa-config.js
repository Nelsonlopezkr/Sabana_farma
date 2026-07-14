/* ══════════════════════════════════════════════════════════
 *  Sabana Farma — Configuración Global
 *  Carga este archivo PRIMERO en todos los HTML, antes de
 *  carrito.js, pago.js y catalogo.js
 * ══════════════════════════════════════════════════════════ */
'use strict';

window.DE_CONFIG = {
  /* ── Contacto ── */
  WA_NUM:     '573118719476',       /* ← pedidos WhatsApp; cámbialo aquí si cambia */
  WA_NEQUI:   '3124213986',         /* ← pagos Nequi / transferencias */
  TEL:        '+573118719476',

  /* ── Tienda ── */
  NOMBRE:     'Sabana Farma',
  DIRECCION:  'Calle 10 #16b 21 Barrio El Poblado, Mosquera, Cundinamarca',
  HORARIO:    'Lun – Dom: 7 am – 10 pm',
  EMAIL:      'sabanafarma01@gmail.com',

  /* ── Envío ── */
  ENVIO_PRECIO:       3000,
  ENVIO_GRATIS_DESDE: 20000,

  /* ── Métodos de pago aceptados ──
     Nequi y Daviplata al número WA_NEQUI, o efectivo contra entrega. */
  PAGOS: ['Nequi', 'Daviplata', 'Contra entrega'],

  /* ── Registro de pedidos (Google Sheets) ──
     Pega aquí la URL de la aplicación web de Apps Script.
     Si queda vacío, no se registra nada (el sitio funciona igual). */
  VENTAS_WEBHOOK: 'https://script.google.com/macros/s/AKfycbyW1Oq1USPJVgroKKeYiphAH9a6VInCQTJl7G9BbRZORxZYcdb54GuamZ0OXN2jX2it/exec',
};

/* Helpers globales */
window.waLink = function(msg) {
  return 'https://wa.me/' + window.DE_CONFIG.WA_NUM + '?text=' + encodeURIComponent(msg || '');
};
window.copCurrency = function(n) {
  return '$' + Number(n).toLocaleString('es-CO');
};

/* Registro de pedidos en Google Sheets — no bloquea el checkout.
   No envía datos personales del cliente (solo productos y montos). */
window.registrarPedido = function(datos) {
  try {
    var url = window.DE_CONFIG && window.DE_CONFIG.VENTAS_WEBHOOK;
    if (!url) return;
    var body = JSON.stringify(datos || {});
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([body], { type: 'text/plain' }));
    } else if (window.fetch) {
      fetch(url, { method: 'POST', mode: 'no-cors', keepalive: true, body: body });
    }
  } catch (e) { /* nunca interrumpir el pedido */ }
};