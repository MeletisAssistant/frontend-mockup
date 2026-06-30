import { $, $$ } from '../core/dom.js';
import { emit } from '../core/events.js';
import { showView } from '../core/router.js';

export function initAuth() {
  
  $$('[data-auth-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.authTab;
      $$('.auth-tab').forEach((t) => t.classList.toggle('is-active', t.dataset.authTab === tab));
      $$('.auth-form').forEach((f) => f.classList.toggle('is-active', f.dataset.authForm === tab));
    });
  });

  
  $('[data-auth-form="login"]').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    emit('auth:login', data);          
    showView('app');                    
  });

  
  $('[data-auth-form="register"]').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    emit('auth:register', data);        
    showView('onboarding');             
  });
}
