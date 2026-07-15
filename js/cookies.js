/* ══════════════════════════════════════════════════════════
 *  Sabana Farma — cookies.js v1.0
 *  Banner de consentimiento de cookies / habeas data (Ley 1581).
 *  Auto-inyectable: solo se muestra una vez por dispositivo.
 *  No bloquea nada si localStorage no está disponible.
 * ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var LS_KEY = 'sf_cookies_ok';

  try { if (localStorage.getItem(LS_KEY)) return; } catch (e) { return; }

  function init() {
    if (document.getElementById('sfCookieBanner')) return;

    var s = document.createElement('style');
    s.textContent = [
      '#sfCookieBanner{position:fixed;left:12px;right:12px;bottom:12px;z-index:2500;',
        'background:#1a1a2e;color:#fff;border-radius:14px;padding:.9rem 1.1rem;',
        'display:flex;align-items:center;gap:.9rem;flex-wrap:wrap;',
        'box-shadow:0 10px 34px rgba(0,0,0,.35);font-size:.8rem;line-height:1.45;',
        'animation:sfCookieIn .4s ease}',
      '@keyframes sfCookieIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}',
      '#sfCookieBanner p{margin:0;flex:1;min-width:200px}',
      '#sfCookieBanner a{color:#90CAF9;text-decoration:underline}',
      '#sfCookieBanner button{background:#1976D2;color:#fff;border:none;border-radius:10px;',
        'padding:.55rem 1.2rem;font-family:inherit;font-size:.82rem;font-weight:800;cursor:pointer}',
      '#sfCookieBanner button:hover{filter:brightness(1.12)}',
      '@media(min-width:700px){#sfCookieBanner{left:auto;right:20px;bottom:20px;max-width:420px}}'
    ].join('');
    document.head.appendChild(s);

    var div = document.createElement('div');
    div.id = 'sfCookieBanner';
    div.setAttribute('role', 'region');
    div.setAttribute('aria-label', 'Aviso de cookies');
    div.innerHTML =
      '<p>🍪 Usamos cookies para que la página funcione bien y para medir las visitas de forma anónima. ' +
      'Conoce nuestra <a href="politica-datos.html">Política de tratamiento de datos</a>.</p>' +
      '<button type="button" id="sfCookieOk">Aceptar</button>';
    document.body.appendChild(div);

    document.getElementById('sfCookieOk').addEventListener('click', function () {
      try { localStorage.setItem(LS_KEY, String(Date.now())); } catch (e) {}
      div.style.transition = 'opacity .25s, transform .25s';
      div.style.opacity = '0';
      div.style.transform = 'translateY(16px)';
      setTimeout(function () { if (div.parentNode) div.parentNode.removeChild(div); }, 260);
    });
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
