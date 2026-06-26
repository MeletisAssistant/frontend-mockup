/* Meletis · views/chat.js  ·  CHAT (RF-04) */

import { $ } from '../core/dom.js';
import { emit } from '../core/events.js';
import { showView } from '../core/router.js';

export function initChat() {
  const form   = $('[data-composer]');
  const input  = $('[data-composer-input]');
  const scroll = $('[data-chat-scroll]');

  // Auto-crecer el textarea
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = `${input.scrollHeight}px`;
  });

  // Enter para enviar, Shift+Enter para salto de línea
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  // Enviar pregunta → contrato: POST /sessions/:id/messages (respuesta vía SSE)
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    emit('chat:send', { text });        // aquí se abrirá el stream SSE real

    // Feedback visual de maqueta (sin IA): pinta el mensaje del usuario
    appendUserBubble(scroll, text);
    input.value = '';
    input.style.height = 'auto';

    // y muestra el indicador "escribiendo…" (placeholder del efecto SSE)
    showTypingPlaceholder(scroll);
  });

  // Estos son opcionales: usamos ?. para que, si el botón no está en el HTML,
  // NO se rompa el resto del arranque (p. ej. la navegación).
  $('[data-edit-profile]')?.addEventListener('click', () => {
    emit('profile:edit');
    showView('onboarding');
  });

  $('[data-rag-badge]')?.addEventListener('click', () => emit('chat:show-context'));
  $('[data-user-menu]')?.addEventListener('click', () => emit('user:menu'));
}

function appendUserBubble(scroll, text) {
  const el = document.createElement('article');
  el.className = 'msg msg--user';
  el.innerHTML = `<div class="msg__bubble"><p></p></div>`;
  $('p', el).textContent = text;        // textContent: evita inyección de HTML
  scroll.appendChild(el);
  scroll.scrollTop = scroll.scrollHeight;
}

function showTypingPlaceholder(scroll) {
  const el = document.createElement('article');
  el.className = 'msg msg--bot';
  el.innerHTML = `
    <span class="msg__avatar" data-logo></span>
    <div class="msg__bubble">
      <div class="typing"><span></span><span></span><span></span></div>
    </div>`;
  scroll.appendChild(el);
  scroll.scrollTop = scroll.scrollHeight;
  // En la maqueta el indicador queda visible: no hay IA conectada todavía.
}
