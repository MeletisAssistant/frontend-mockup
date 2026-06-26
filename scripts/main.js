/* Meletis · main.js  (MAQUETA)
   -----------------------------------------------------------------
   Punto de entrada. Carga las vistas (parciales HTML de /pages) dentro
   del contenedor [data-views] y luego cablea cada módulo.

   No hay lógica de negocio ni llamadas a nada todavía; el frontend ya
   está "cableado" para migrar a React + TS sin tocar la presentación.

   NOTA: como las vistas se cargan con fetch(), la página debe abrirse
   servida por HTTP (el contenedor con `serve` ya lo hace), no con file://. */

import { initDevNav } from './core/router.js';
import { initAuth } from './views/auth.js';
import { initOnboarding } from './views/onboarding.js';
import { initSessions } from './views/sessions.js';
import { initChat } from './views/chat.js';
import { initShell } from './views/shell.js';

/* Vistas en el orden en que se inyectan en el DOM. */
const VIEWS = ['auth', 'onboarding', 'app'];

/** Descarga cada parcial de /pages y lo inserta dentro de [data-views]. */
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

/** Arranque: primero el HTML de las vistas, luego los manejadores. */
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
