/**
 * promo-dia.js v3.0 — Promociones diarias con datos reales
 * Sabana Farma
 * Productos seleccionados por: volumen de ventas real + margen verificado
 * Actualizado: Junio 2026
 */
(function () {
  'use strict';
  var WA = '573118719476';

  function horaCol() {
    var ahora = new Date();
    var utc = ahora.getTime() + ahora.getTimezoneOffset() * 60000;
    return new Date(utc - 5 * 3600000);
  }

  function tiempoRestante() {
    var col = horaCol();
    var medianoche = new Date(col);
    medianoche.setHours(24, 0, 0, 0);
    var diff = Math.floor((medianoche - col) / 1000);
    var h = Math.floor(diff / 3600);
    var m = Math.floor((diff % 3600) / 60);
    return h > 0 ? h + 'h ' + m + 'm' : m + ' min';
  }

  /* Promos basadas en datos reales de ventas e inventario */
  var PROMOS = [
    /* Dom — Tripleviral: ranking #1, 1973 vendidos, margen 95% */
    {
      txt: '🔥 DOMINGO — Tripleviral Proomo <strong>$1.000</strong> — el más vendido de la semana',
      wa:  'Hola%2C+quiero+el+Tripleviral+Proomo+a+%241.000+del+domingo'
    },
    /* Lun — Curas Hansaplast: #6 en ventas, margen 75%, 1035 en stock */
    {
      txt: '🩹 LUNES — Curas Hansaplast 100 unds <strong>$490</strong> — ¡Stock amplio!',
      wa:  'Hola%2C+quiero+las+Curas+Hansaplast+100+unds+a+%24490+del+lunes'
    },
    /* Mar — Vitamina E: margen 99%, 200 en stock */
    {
      txt: '💊 MARTES — Vitamina E 400UI x100 cáps <strong>$4.332</strong> — oferta del día',
      wa:  'Hola%2C+quiero+la+Vitamina+E+400UI+x100+a+%244.332+del+martes'
    },
    /* Mié — Loratadina: #98 top ventas, margen 72%, 640 en stock */
    {
      txt: '🤧 MIÉRCOLES — Loratadina 10mg <strong>$2.000</strong> — anti-alergia al mejor precio',
      wa:  'Hola%2C+quiero+la+Loratadina+10mg+a+%242.000+del+miércoles'
    },
    /* Jue — Aceclofenaco: margen 66%, 42 en stock */
    {
      txt: '💙 JUEVES — Ainedix Aceclofenaco 100mg x10 <strong>$4.368</strong> — anti-inflamatorio',
      wa:  'Hola%2C+quiero+el+Ainedix+Aceclofenaco+x10+a+%244.368+del+jueves'
    },
    /* Vie — Crema Pods Aclarant B3: margen 90%, 21 en stock */
    {
      txt: '✨ VIERNES — Crema Pods Aclarant B3 sachet <strong>$1.800</strong> — belleza al precio justo',
      wa:  'Hola%2C+quiero+la+Crema+Pods+Aclarant+B3+a+%241.800+del+viernes'
    },
    /* Sáb — X Ray Dol: margen 37%, top ventas */
    {
      txt: '⚡ SÁBADO — X Ray Dol 48 tabletas <strong>$3.327</strong> — alivio rápido',
      wa:  'Hola%2C+quiero+el+X+Ray+Dol+48+tab+a+%243.327+del+sábado'
    },
  ];

  var bar = document.getElementById('promoDiaBar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'promoDiaBar';
    bar.className = 'promo-dia-bar';
    bar.setAttribute('aria-label', 'Promoción del día');
    bar.setAttribute('role', 'banner');
    var body = document.body || document.getElementsByTagName('body')[0];
    if (body.firstChild) body.insertBefore(bar, body.firstChild);
    else body.appendChild(bar);
  }

  var col  = horaCol();
  var hora = col.getHours();
  var dia  = col.getDay();
  var promo = PROMOS[dia];
  var resto = tiempoRestante();

  if (hora < 7 || hora >= 22) {
    bar.innerHTML =
      '🕐 Abrimos a las <strong>7am</strong> · Lun–Dom 7am–10pm · ' +
      '<a href="https://wa.me/' + WA + '?text=Hola%2C+tengo+una+consulta" target="_blank" rel="noopener">Dejar mensaje →</a>';
    return;
  }

  bar.innerHTML =
    promo.txt +
    ' · <span class="promo-timer" title="Tiempo restante hoy">⏳ ' + resto + ' restantes</span>' +
    ' · <a href="https://wa.me/' + WA + '?text=' + promo.wa + '" target="_blank" rel="noopener">Pedir ya →</a>';

  setInterval(function () {
    var t = bar.querySelector('.promo-timer');
    if (t) t.textContent = '⏳ ' + tiempoRestante() + ' restantes';
  }, 60000);

})();