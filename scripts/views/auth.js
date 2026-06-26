/* Meletis · views/auth.js  ·  AUTENTICACIÓN (RF-01) */

import { $, $$ } from '../core/dom.js';
import { emit } from '../core/events.js';
import { showView } from '../core/router.js';

export function initAuth() {
  // Cambiar entre pestañas login / registro
  $$('[data-auth-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.authTab;
      $$('.auth-tab').forEach((t) => t.classList.toggle('is-active', t.dataset.authTab === tab));
      $$('.auth-form').forEach((f) => f.classList.toggle('is-active', f.dataset.authForm === tab));
    });
  });

  // Login → contrato: POST /auth/login
  $('[data-auth-form="login"]').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    emit('auth:login', data);          // { email, password }
    showView('app');                    // mock: pasa directo a la app
  });

  // Registro → contrato: POST /auth/register
  $('[data-auth-form="register"]').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    emit('auth:register', data);        // { name, email, password }
    showView('onboarding');             // mock: tras registrar, va al perfil
  });
}
