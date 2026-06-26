/* Meletis · core/router.js
   Router de vistas (mock). Solo puede haber una vista activa a la vez;
   el JS pone/quita .is-active sobre los <section class="view">. */

import { $$ } from './dom.js';
import { emit } from './events.js';

/** Muestra una vista por su data-view y oculta el resto. */
export function showView(view) {
  $$('.view').forEach((v) => v.classList.toggle('is-active', v.dataset.view === view));
  // Marca el botón activo en el conmutador de desarrollo.
  $$('[data-devnav] button').forEach((b) => b.classList.toggle('is-active', b.dataset.goto === view));
  window.scrollTo(0, 0);
  emit('view:change', { view });
}

/* DEV: conmutador de vistas (borrar junto con .devnav al integrar). */
export function initDevNav() {
  $$('[data-devnav] button').forEach((btn) =>
    btn.addEventListener('click', () => showView(btn.dataset.goto))
  );
  showView('auth'); // estado inicial
}
