import { $$ } from './dom.js';
import { emit } from './events.js';


export function showView(view) {
  $$('.view').forEach((v) => v.classList.toggle('is-active', v.dataset.view === view));
  
  $$('[data-devnav] button').forEach((b) => b.classList.toggle('is-active', b.dataset.goto === view));
  window.scrollTo(0, 0);
  emit('view:change', { view });
}


export function initDevNav() {
  $$('[data-devnav] button').forEach((btn) =>
    btn.addEventListener('click', () => showView(btn.dataset.goto))
  );
  showView('auth'); 
}
