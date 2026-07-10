/**
 * FORMULARIO DE CONTACTO — Sabana Farma
 * Validación JS + simulación de envío
 * En producción: apunta a php/contacto.php
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formContacto');
  if (!form) return;

  const campos = {
    nombre:  { el: form.nombre,   min: 3,   msg: 'Ingresa tu nombre completo (mín. 3 caracteres).' },
    correo:  { el: form.correo,   regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: 'Ingresa un correo válido.' },
    asunto:  { el: form.asunto,   min: 3,   msg: 'Selecciona o escribe el asunto.' },
    mensaje: { el: form.mensaje,  min: 15,  msg: 'El mensaje debe tener al menos 15 caracteres.' }
  };

  function validarCampo(key) {
    const { el, min, regex, msg } = campos[key];
    const val = el.value.trim();
    const group = el.closest('.form-group');
    let ok = true;
    if (regex)     ok = regex.test(val);
    else if (min)  ok = val.length >= min;
    else           ok = val.length > 0;
    group.classList.toggle('error', !ok);
    group.classList.toggle('ok', ok && val.length > 0);
    return ok;
  }

  // Validación en tiempo real
  Object.keys(campos).forEach(k => {
    campos[k].el?.addEventListener('blur', () => validarCampo(k));
    campos[k].el?.addEventListener('input', () => {
      if (campos[k].el.closest('.form-group').classList.contains('error')) validarCampo(k);
    });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const validos = Object.keys(campos).map(validarCampo);
    if (!validos.every(Boolean)) return;

    const btn = form.querySelector('.btn-enviar');
    const msgEl = document.getElementById('formMensaje');

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    try {
      // ── En producción: descomentar y eliminar la simulación ──
      // const res = await fetch('php/contacto.php', {
      //   method:'POST',
      //   body: new FormData(form)
      // });
      // const data = await res.json();
      // if (!data.ok) throw new Error(data.mensaje);

      // Simulación (500 ms)
      await new Promise(r => setTimeout(r, 700));

      msgEl.className = 'form-mensaje exito';
      msgEl.innerHTML = '<i class="fas fa-check-circle"></i> ¡Mensaje enviado! Te responderemos pronto.';
      form.reset();
      document.querySelectorAll('.form-group').forEach(g => g.classList.remove('ok', 'error'));
    } catch (err) {
      msgEl.className = 'form-mensaje error-form';
      msgEl.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error al enviar. Intenta de nuevo.';
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensaje';
      setTimeout(() => { msgEl.className = 'form-mensaje'; }, 6000);
    }
  });
});