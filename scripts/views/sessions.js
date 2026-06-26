/* Meletis · views/sessions.js  ·  GESTIÓN DE AULAS (RF-03) */

import { $, $$ } from '../core/dom.js';
import { emit } from '../core/events.js';

export function initSessions() {
  // Nueva aula → contrato: POST /sessions
  $('[data-new-session]').addEventListener('click', () => emit('session:create'));

  // Delegación sobre la lista (seleccionar / eliminar)
  $('[data-session-list]').addEventListener('click', (e) => {
    const delBtn = e.target.closest('[data-delete-session]');
    const item   = e.target.closest('[data-session]');
    if (!item) return;

    if (delBtn) {                       // eliminar → DELETE /sessions/:id
      e.preventDefault();
      const name = $('.session-item__name', item)?.textContent.trim();
      emit('session:delete', { name });
      return;
    }

    // seleccionar aula → GET /sessions/:id/messages (RF-05)
    $$('.session-item').forEach((s) => s.classList.remove('is-active'));
    item.classList.add('is-active');
    const name = $('.session-item__name', item)?.textContent.trim();
    $('[data-current-session]').textContent = name;
    emit('session:select', { name });
  });
}
