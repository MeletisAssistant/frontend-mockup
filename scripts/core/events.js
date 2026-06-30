


export function emit(name, detail = {}) {
  document.dispatchEvent(new CustomEvent(`meletis:${name}`, { detail }));
  console.log(`[meletis] → ${name}`, detail);
}
