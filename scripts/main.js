

import { initDevNav } from './core/router.js';
import { initAuth } from './views/auth.js';
import { initOnboarding } from './views/onboarding.js';
import { initSessions } from './views/sessions.js';
import { initChat } from './views/chat.js';
import { initShell } from './views/shell.js';


const VIEWS = ['auth', 'onboarding', 'app'];


async function loadViews() {
  const mount = document.querySelector('[data-views]');
  const parts = await Promise.all(
    VIEWS.map((name) =>
      fetch(`pages/${name}.html`).then((res) => {
        if (!res.ok) throw new Error(`No se pudo cargar la vista "${name}" (${res.status})`);
        return res.text();
      })
    )
  );
  mount.innerHTML = parts.join('\n');
}


async function boot() {
  await loadViews();

  initAuth();
  initOnboarding();
  initSessions();
  initChat();
  initShell();
  initDevNav();

  console.log('%c🍃 Meletis · maqueta de frontend lista', 'color:#4f8050;font-weight:bold');
}

boot().catch((err) => console.error('[meletis] error al arrancar:', err));
