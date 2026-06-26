/* Meletis · core/events.js
   Punto único donde se emiten las intenciones del usuario.
   Aquí se enganchará el cliente HTTP / SSE real. */

/**
 * Emite un CustomEvent con el prefijo `meletis:` y lo registra en consola.
 * @param {string} name   nombre del evento (ej. 'auth:login')
 * @param {object} detail payload asociado
 */
export function emit(name, detail = {}) {
  document.dispatchEvent(new CustomEvent(`meletis:${name}`, { detail }));
  console.log(`[meletis] → ${name}`, detail);
}
