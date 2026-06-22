/* =================================================================
   Meletis · app.js  (MAQUETA)
   -----------------------------------------------------------------
   no hay lógica de negocio ni llamadas a api todavía.
   el frontend ya está "cableado" para migrar a React + TS sin
   tocar la capa de presentación.
   ================================================================= */

'use strict';

/* ---------- Helpers ---------- */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/**
 * punto único donde se "emiten" las intenciones del usuario
 * aquí se enganchará el cliente HTTP / SSE real.
 */
function emit(name, detail = {}) {
  document.dispatchEvent(new CustomEvent(`meletis:${name}`, { detail }));
  console.log(`[meletis] → ${name}`, detail);
}

/* ---------- Router de vistas (mock) ---------- */
function showView(view) {
  $$('.view').forEach((v) => v.classList.toggle('is-active', v.dataset.view === view));
  // marca el botón activo en el conmutador de desarrollo
  $$('[data-devnav] button').forEach((b) => b.classList.toggle('is-active', b.dataset.goto === view));
  window.scrollTo(0, 0);
  emit('view:change', { view });
}

/* DEV: conmutador de vistas (borrar junto con .devnav al integrar) */
function initDevNav() {
  $$('[data-devnav] button').forEach((btn) =>
    btn.addEventListener('click', () => showView(btn.dataset.goto))
  );
  showView('auth'); // estado inicial
}

/* =================================================================
   1. AUTENTICACIÓN  (RF-01)
   ================================================================= */
function initAuth() {
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

/* =================================================================
   2. ONBOARDING DE PERFIL  (RF-02)
   ================================================================= */
function initOnboarding() {
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

/* =================================================================
   3. GESTIÓN DE AULAS  (RF-03)
   ================================================================= */
function initSessions() {
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

/* =================================================================
   4. CHAT  (RF-04 / RF-05 / RNF-03 streaming)
   ================================================================= */
function initChat() {
  const form   = $('[data-composer]');
  const input  = $('[data-composer-input]');
  const scroll = $('[data-chat-scroll]');

  // Auto-crecer el textarea
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = `${input.scrollHeight}px`;
  });

  // Enter para enviar, Shift+Enter para salto de línea
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  // Enviar pregunta → contrato: POST /sessions/:id/messages (respuesta vía SSE)
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    emit('chat:send', { text });        // aquí se abrirá el stream SSE real

    // Feedback visual de maqueta (sin IA): pinta el mensaje del usuario
    appendUserBubble(scroll, text);
    input.value = '';
    input.style.height = 'auto';

    // y muestra el indicador "escribiendo…" (placeholder del efecto SSE)
    showTypingPlaceholder(scroll);
  });

  $('[data-edit-profile]').addEventListener('click', () => {
    emit('profile:edit');
    showView('onboarding');
  });

  $('[data-rag-badge]').addEventListener('click', () => emit('chat:show-context'));
  $('[data-user-menu]').addEventListener('click', () => emit('user:menu'));
}

function appendUserBubble(scroll, text) {
  const el = document.createElement('article');
  el.className = 'msg msg--user';
  el.innerHTML = `<div class="msg__bubble"><p></p></div>`;
  $('p', el).textContent = text;        // textContent: evita inyección de HTML
  scroll.appendChild(el);
  scroll.scrollTop = scroll.scrollHeight;
}

function showTypingPlaceholder(scroll) {
  const el = document.createElement('article');
  el.className = 'msg msg--bot';
  el.innerHTML = `
    <span class="msg__avatar" data-logo></span>
    <div class="msg__bubble">
      <div class="typing"><span></span><span></span><span></span></div>
    </div>`;
  scroll.appendChild(el);
  scroll.scrollTop = scroll.scrollHeight;
  // En la maqueta el indicador queda visible: no hay IA conectada todavía.
}

/* =================================================================
   5. UI general (sidebar)
   ================================================================= */
function initShell() {
  const shell = $('.app-shell');
  $$('[data-toggle-sidebar]').forEach((btn) =>
    btn.addEventListener('click', () => shell.classList.toggle('sidebar-hidden'))
  );

  // En pantallas pequeñas, el sidebar arranca oculto
  if (window.matchMedia('(max-width: 720px)').matches) {
    shell.classList.add('sidebar-hidden');
  }
}

/* ---------- Bootstrap ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  initOnboarding();
  initSessions();
  initChat();
  initShell();
  initDevNav();
  console.log('%c🍃 Meletis · maqueta de frontend lista', 'color:#4f8050;font-weight:bold');
});
