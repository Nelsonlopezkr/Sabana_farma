/**
 * promo-dia.js — Barra de promoción diaria
 * Droguerías Económicas
 *
 * Uso: incluir ANTES del </body> en todas las páginas.
 * Crea e inyecta automáticamente el div#promoDiaBar si no existe,
 * y lo inserta como PRIMER elemento del <body>.
 *
 * Estilos: definidos en estilos.css (.promo-dia-bar)
 */
(function () {
  'use strict';

  /* ── Promociones por día de la semana ─────────────────────────
     getDay() → 0=Dom, 1=Lun, 2=Mar, 3=Mié, 4=Jue, 5=Vie, 6=Sáb
  ──────────────────────────────────────────────────────────────── */
  var PROMOS = [
    /* 0 Dom */ '☀️ HOY DOMINGO — Electrolit 3 por el precio de 2 · <strong>¡Solo hoy!</strong> · <a href="https://wa.me/573118719476?text=Hola%2C+quiero+aprovechar+la+promo+del+día+domingo" target="_blank" rel="noopener">Pedir ya →</a>',
    /* 1 Lun */ '🌟 HOY LUNES — Acetaminofén MK 100 tab a <strong>$16.000</strong> · <a href="https://wa.me/573118719476?text=Hola%2C+quiero+el+Acetaminofén+MK+100+tab+a+%2416.000" target="_blank" rel="noopener">Pedir ya →</a>',
    /* 2 Mar */ '🌟 HOY MARTES — Loratadina 10mg 2×1 · <strong>¡Anti-alergia!</strong> · <a href="https://wa.me/573118719476?text=Hola%2C+quiero+la+promo+Loratadina+2x1+del+martes" target="_blank" rel="noopener">Pedir ya →</a>',
    /* 3 Mié */ '🌟 HOY MIÉRCOLES — Vitamina C efervescente x10 a <strong>$4.500</strong> · <a href="https://wa.me/573118719476?text=Hola%2C+quiero+la+Vitamina+C+efervescente+x10+a+%244.500" target="_blank" rel="noopener">Pedir ya →</a>',
    /* 4 Jue */ '🌟 HOY JUEVES — Omeprazol 20mg x30 cáps a <strong>$9.800</strong> · <a href="https://wa.me/573118719476?text=Hola%2C+quiero+el+Omeprazol+20mg+x30+a+%249.800" target="_blank" rel="noopener">Pedir ya →</a>',
    /* 5 Vie */ '🌟 HOY VIERNES — Crema Bepanthen 30g a <strong>$15.000</strong> · <a href="https://wa.me/573118719476?text=Hola%2C+quiero+la+Crema+Bepanthen+30g+a+%2415.000" target="_blank" rel="noopener">Pedir ya →</a>',
    /* 6 Sáb */ '🌟 HOY SÁBADO — Pañales Pampers talla 2 x40 a <strong>$24.500</strong> · <a href="https://wa.me/573118719476?text=Hola%2C+quiero+los+Pañales+Pampers+talla+2+x40+a+%2424.500" target="_blank" rel="noopener">Pedir ya →</a>'
  ];

  /* ── Obtener o crear el contenedor ─────────────────────────── */
  var bar = document.getElementById('promoDiaBar');

  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'promoDiaBar';
    bar.setAttribute('aria-label', 'Promoción del día');
    bar.setAttribute('role', 'banner');
    /* Insertar como primer hijo del body */
    var body = document.body || document.getElementsByTagName('body')[0];
    if (body.firstChild) {
      body.insertBefore(bar, body.firstChild);
    } else {
      body.appendChild(bar);
    }
  }

  /* ── Rellenar con la promo del día ──────────────────────────── */
  var dia = new Date().getDay();
  bar.innerHTML = PROMOS[dia];

})();
