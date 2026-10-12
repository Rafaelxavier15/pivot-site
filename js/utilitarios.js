const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
const $$ = (seletor, raiz = document) => [...raiz.querySelectorAll(seletor)];

const escapar = (texto) =>
  String(texto).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const icone = (nome) => `<svg viewBox="0 0 100 100"><use href="#${nome}"/></svg>`;

const ROBO = '<svg viewBox="0 0 100 110"><use href="#bot"/></svg>';

let temporizadorAviso;

function aviso(texto) {
  const el = $("#toast");
  el.textContent = texto;
  el.classList.add("on");
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => el.classList.remove("on"), 2800);
}
