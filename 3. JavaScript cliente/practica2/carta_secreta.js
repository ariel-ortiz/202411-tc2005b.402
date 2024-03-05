const laCarta = document.getElementById("laCarta");
const cantidad = document.getElementById("cantidad");
const botonPrincipal = document.getElementById("botonPrincipal");
const pushale = document.getElementById("pushale");
const botonReinicia = document.getElementById("botonReinicia");
const cartas = iniciaCartas();

pushale.addEventListener("click", descubreCarta);

function iniciaCartas() {
  const resultado = [];
  for (let palo of 'CDHS') {
    for (let i = 1; i <= 13; i++) {
      resultado.push(`${palo}_${i.toString().padStart(2, '0')}.svg`);
    }
  }
  shuffle(resultado);
  return resultado;
}

// Algoritmo de Fisher-Yates, tomado de:
// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
function shuffle(a) {
  for (let i = a.length - 1; i >= 1; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]; // swap
  }
}

function descubreCarta() {
  const carta = cartas.pop();
  laCarta.src = 'cards/' + carta;
  cantidad.innerText = cartas.length.toString();
  if (cartas.length == 0) {
    botonPrincipal.style.display = 'none';
    botonReinicia.style.display = 'block';
  }
}
