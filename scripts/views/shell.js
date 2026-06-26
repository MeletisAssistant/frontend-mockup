/* Meletis · views/shell.js  ·  UI general de la app (sidebar) */

import { $, $$ } from '../core/dom.js';

export function initShell() {
  const shell = $('.app-shell');
  $$('[data-toggle-sidebar]').forEach((btn) =>
    btn.addEventListener('click', () => shell.classList.toggle('sidebar-hidden'))
  );

  // En pantallas pequeñas, el sidebar arranca oculto
  if (window.matchMedia('(max-width: 720px)').matches) {
    shell.classList.add('sidebar-hidden');
  }
}
