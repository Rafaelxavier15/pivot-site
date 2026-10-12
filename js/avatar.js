const PELES = ["#f1c9a5", "#e0a47c", "#c68642", "#8d5524", "#f7d6bd", "#a8693b"];
const CABELOS = ["#2a1a12", "#4a2c17", "#a9622a", "#14213d", "#7a3b1f", "#d9b36c"];
const FUNDOS = ["#eaf0ff", "#fff9b8", "#ffd6ea", "#d9f3e4"];
const CAMISAS = ["#1f5cff", "#f2e60f", "#ff5fa8", "#14213d", "#ff7a00", "#8fb0ff"];

function gerarAvatar(indice) {
  const pele = PELES[indice % 6];
  const cabelo = CABELOS[(indice * 5 + 1) % 6];
  const fundo = FUNDOS[indice % 4];
  const camisa = CAMISAS[(indice * 3 + 1) % 6];
  const estilo = indice % 5;
  const oculos = indice % 3 === 1;
  let atras = "";
  let frente = "";

  if (estilo === 1) {
    atras = `<path d="M24 48C22 18 40 9 50 9C62 9 78 18 76 48V76H66V46H34V76H24Z" fill="${cabelo}"/>`;
  }
  if (estilo === 2) {
    atras = `<circle cx="50" cy="12" r="10" fill="${cabelo}"/>`;
  }
  if (estilo === 3) {
    atras = [[28, 26], [38, 17], [50, 14], [62, 17], [72, 26]]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="11" fill="${cabelo}"/>`)
      .join("");
  }
  if (estilo <= 2) {
    frente = `<path d="M27 46C25 22 40 14 50 14C62 14 75 22 73 46C69 36 61 31 50 31C39 31 31 36 27 46Z" fill="${cabelo}"/>`;
  }
  if (estilo === 3) {
    frente = `<path d="M29 44C30 32 38 28 50 28C62 28 70 32 71 44C66 38 58 35 50 35C42 35 34 38 29 44Z" fill="${cabelo}"/>`;
  }
  if (estilo === 4) {
    frente = `<path d="M34 62C36 78 64 78 66 62C62 70 38 70 34 62Z" fill="${cabelo}"/>`;
  }

  const armacao = oculos
    ? '<g fill="none" stroke="#14213d" stroke-width="2.4"><circle cx="41" cy="50" r="7.5"/><circle cx="59" cy="50" r="7.5"/><path d="M48.5 50H51.5"/></g>'
    : "";

  return `<svg viewBox="0 0 100 100">
    <rect width="100" height="100" fill="${fundo}"/>
    ${atras}
    <path d="M10 100C12 80 28 71 50 71C72 71 88 80 90 100Z" fill="${camisa}"/>
    <rect x="43" y="62" width="14" height="14" rx="5" fill="${pele}"/>
    <ellipse cx="50" cy="48" rx="23" ry="26" fill="${pele}"/>
    ${frente}
    <circle cx="41" cy="50" r="2.6" fill="#2a1a12"/>
    <circle cx="59" cy="50" r="2.6" fill="#2a1a12"/>
    <path d="M42 60Q50 67 58 60" fill="none" stroke="#7a3b1f" stroke-width="2.6" stroke-linecap="round"/>
    ${armacao}
  </svg>`;
}
