import { $, $$ } from '../core/dom.js';
import { emit } from '../core/events.js';

export function initSessions() {
  
  $('[data-new-session]').addEventListener('click', () => emit('session:create'));

  
  $('[data-session-list]').addEventListener('click', (e) => {
    const delBtn = e.target.closest('[data-delete-session]');
    const item   = e.target.closest('[data-session]');
    if (!item) return;

    if (delBtn) {                       
      e.preventDefault();
      const name = $('.session-item__name', item)?.textContent.trim();
      emit('session:delete', { name });
      return;
    }

    
    $$('.session-item').forEach((s) => s.classList.remove('is-active'));
    item.classList.add('is-active');
    const name = $('.session-item__name', item)?.textContent.trim();
    $('[data-current-session]').textContent = name;
    emit('session:select', { name });
  });
}
