const mi_boton = document.getElementById('mi_buton');
const mi_lista = document.getElementById('mi_lista');
mi_boton.addEventListener('click', presionar_boton);

let contador = 0;

const colores = ['red', 'green', 'blue'];

function presionar_boton() {
  contador++;
  mi_lista.innerHTML += '<li>Una opción ' + contador + '</li>';
  // mi_lista.style.color = colores[contador % colores.length];
  mi_lista.style['color'] = colores[contador % colores.length];
}
