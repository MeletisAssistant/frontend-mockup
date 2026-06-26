/* Meletis · views/onboarding.js  ·  ONBOARDING DE PERFIL */

import { $, $$ } from '../core/dom.js';
import { emit } from '../core/events.js';
import { showView } from '../core/router.js';

export function initOnboarding() {
  // Chips de estilos de aprendizaje (multi-selección)
  $$('[data-chips] .chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('is-selected');
      emit('profile:toggle-style', {
        value: chip.dataset.value,
        selected: chip.classList.contains('is-selected'),
      });
    });
  });

  // Guardar perfil → contrato: POST /profile  (alimentará RF-06 embeddings)
  $('.onboarding-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    data.learningStyles = $$('[data-chips] .chip.is-selected').map((c) => c.dataset.value);
    emit('profile:save', data);         // { strengths, weaknesses, knowledge, learningStyles[] }
    showView('app');
  });

  $('[data-skip-onboarding]').addEventListener('click', () => {
    emit('profile:skip');
    showView('app');
  });
}
