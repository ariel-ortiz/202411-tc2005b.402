const entradas = document.getElementById('entradas');
const entrada1 = document.getElementById('entrada1');
const entrada2 = document.getElementById('entrada2');
const boton_mcd = document.getElementById('boton_mcd');
const salida = document.getElementById('salida');
const resultado = document.getElementById('resultado');

boton_mcd.addEventListener('click', calcular);

function calcular() {
  let x = parseInt(entrada1.value) || 0;
  let y = parseInt(entrada2.value) || 0;
  let z = mcd(x, y);
  resultado.innerHTML = 'El MCD de ' + x + ' y ' + y + ' es ' + z;
  entradas.style.display = 'none'; // invisble
  salida.style.display = 'block'; // visible
}

// Algoritmo de Euclidiano
function mcd(a, b) {
  while (b != 0) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a;
}
