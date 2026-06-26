/* Meletis · core/dom.js
   Helpers mínimos de selección de DOM, reutilizados por todas las vistas. */

/** querySelector con contexto opcional. */
export const $ = (sel, ctx = document) => ctx.querySelector(sel);

/** querySelectorAll devuelto ya como array (para usar map/forEach/filter). */
export const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
