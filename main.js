/* Javier Gisbert Talboom 2ºDAW */

/* Creamos las variables necesarias para el juego: un array con las posiciones del 1 al 9 que representa el tablero,
el elemento donde mostraremos el mensaje del ganador y los elementos del marcador
para mostrar las victorias del jugador y de la máquina */

const tablaPosiciones = [1,2,3,4,5,6,7,8,9];
const mensajeGanador = document.getElementById("mensajeGanador");
const jugadorWin = document.getElementById("winCountPlayer");
const maquinaWin = document.getElementById("winCountMachine");

/* Definimos las constantes para identificar al jugador con "X" y a la máquina con "O" */

const jugador = "X";
const maquina = "O";

/* Contadores para el marcador de victorias */

let jugadorVictoria = 0;
let maquinaVictoria = 0;

/* Variables para la fase 2 (V2) del juego:
- fichaSeleccionada: guarda la casilla que el jugador ha seleccionado para mover en su primer click.
  Cuando es null significa que el jugador aún no ha seleccionado ficha (esperamos el primer click).
  Cuando tiene un valor (ej: 5) significa que el jugador ya eligió esa ficha y esperamos el segundo click para el destino.
- jugadasJugador / jugadasMaquina: cuentan cuántas fichas ha colocado cada uno.
  Cuando ambos llegan a 3, el juego pasa de fase 1 (colocar) a fase 2 (mover). */

let fichaSeleccionada = null;
let jugadasJugador = 0;
let jugadasMaquina = 0;

/* Definimos las 8 posibles combinaciones ganadoras del tres en raya: tres filas, tres columnas y dos diagonales.
Cada sub-array contiene los tres números de casilla que forman una línea ganadora. */

const posiblesCombinaciones = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]];

/* La función Jugar es la función principal que se ejecuta cada vez que se hace click en la tabla.
Comprobamos que el click se haya hecho en un botón con event.target.tagName.

Recogemos el retorno de Jugador() en jugadaValida. Jugador() devuelve true cuando el jugador ha completado
un movimiento válido (colocar en fase 1 o mover en fase 2), y false cuando no ha pasado nada
(click en casilla vacía en fase 2 sin ficha seleccionada, o click en casilla de la máquina).

Después comprobamos fichaSeleccionada: si no es null el jugador está a medias de un movimiento en fase 2
(primer click hecho, falta el segundo), así que hacemos return para esperar.

Si jugadaValida es false, también hacemos return porque el jugador no ha hecho nada y la máquina
no debe jugar — esto evita que la máquina juegue cuando el jugador hace click en una casilla
inválida por error.

Si todo es válido, comprobamos ganador, luego la máquina juega y volvemos a comprobar.
En la V2 no hay comprobación de empate porque con 3 fichas por jugador siempre quedan 3 casillas libres,
así que el juego continúa hasta que alguien gane. */

function Jugar(event){

  if (event.target.tagName !== "BUTTON") return;
  
  let jugadaValida = Jugador(event);

  if (fichaSeleccionada !== null) return;
  if (!jugadaValida) return;

  if (Ganador()) {
    botonesOut();
    return;
  }

  Maquina();

  if (Ganador()) {
    botonesOut();
    return;
  }

}

/* La función Jugador tiene dos modos de funcionamiento según la fase del juego.
Devuelve true si el jugador ha completado un movimiento válido, false si no ha pasado nada.

FASE 1 (jugadasJugador < 3): Funciona como el tres en raya clásico. Recorre el array buscando la casilla
pulsada, comprueba que esté libre (que no sea ni "X" ni "O"), y si lo está asigna "X" en el array,
cambia el texto del botón, suma una jugada al contador y devuelve true.

FASE 2 (jugadasJugador >= 3): El jugador ya tiene 3 fichas puestas y ahora necesita MOVER una.
Esto requiere dos clicks:

  PRIMER CLICK (fichaSeleccionada === null): El jugador pulsa una de sus fichas para seleccionarla.
  Comprobamos que la casilla pulsada contenga "X" (tablaPosiciones[numeroJugador - 1] === jugador).
  El -1 es porque los botones van del 1 al 9 pero los índices del array van del 0 al 8.
  Si es suya, guardamos su número en fichaSeleccionada para recordarla en el siguiente click.
  No devolvemos true aquí porque el movimiento aún no está completo.

  SEGUNDO CLICK (fichaSeleccionada !== null): El jugador pulsa una casilla vacía como destino.
  Comprobamos que no sea ni "X" ni "O". Si está libre, hacemos el movimiento:
    1. Ponemos "X" en la posición destino del array (tablaPosiciones[numeroJugador - 1] = jugador)
    2. Restauramos la posición origen del array a su número original (tablaPosiciones[fichaSeleccionada - 1] = fichaSeleccionada)
       Ej: si la ficha estaba en casilla 5, ponemos el 5 de vuelta para que vuelva a ser una casilla libre
    3. Cambiamos el textContent del botón destino a "X"
    4. Limpiamos el textContent del botón origen con document.getElementById(fichaSeleccionada)
    5. Ponemos fichaSeleccionada a null para indicar que el movimiento se ha completado
    6. Devolvemos true porque el movimiento se ha completado

Si ninguna condición se cumple (click inválido), la función llega al return false del final,
indicando que no se ha hecho ningún movimiento y la máquina no debe jugar. */

function Jugador(event) {

  let numeroJugador = parseInt(event.target.id);
  const botonJugador = document.getElementById(numeroJugador);

  if (jugadasJugador >= 3) {

    if (fichaSeleccionada === null && tablaPosiciones[numeroJugador - 1] === jugador) {

      fichaSeleccionada = numeroJugador;

    } else if (fichaSeleccionada !== null && tablaPosiciones[numeroJugador - 1] !== jugador && tablaPosiciones[numeroJugador - 1] !== maquina) {
      tablaPosiciones[numeroJugador - 1] = jugador;          
      tablaPosiciones[fichaSeleccionada - 1] = fichaSeleccionada;
      botonJugador.textContent = jugador;
      document.getElementById(fichaSeleccionada).textContent = "";
      fichaSeleccionada = null;
      return true;
    }
    
  } else {
      for (let i = 0; i < tablaPosiciones.length; i++) {
        if (numeroJugador === tablaPosiciones[i] && tablaPosiciones[i] != jugador && tablaPosiciones[i] != maquina) {
          tablaPosiciones[i] = jugador;
          jugadasJugador++;
          botonJugador.textContent = jugador;
          return true;
        }
      }
  }    
  return false;
}

/* La función Maquina también tiene dos fases:

FASE 2 (jugadasMaquina >= 3): La máquina ya tiene 3 fichas y necesita mover una.
A diferencia del jugador, la máquina no necesita dos clicks — lo hace todo de golpe en un solo paso.

  Primero recorremos tablaPosiciones y guardamos en un array fichasMaquina las casillas que tienen "O".
  Guardamos i + 1 porque i es el índice (0-8) y necesitamos el número de casilla (1-9).

  Después recorremos otra vez y guardamos en casillasVacias las casillas que no son ni "X" ni "O".

  Con estas dos listas, elegimos una al azar de cada una usando Math.random():
    Math.floor(Math.random() * fichasMaquina.length) genera un índice aleatorio dentro del array.
    Ej: si fichasMaquina es [2, 5, 7] y Math.random() da 0.6, hacemos Math.floor(0.6 * 3) = 1,
    así que fichasMaquina[1] = 5 → la máquina moverá la ficha de la casilla 5.

  Después hacemos el movimiento:
    1. Ponemos "O" en la posición destino del array
    2. Restauramos la posición origen a su número original
    3. Cambiamos el textContent del botón destino a "O"
    4. Limpiamos el textContent del botón origen

FASE 1 (jugadasMaquina < 3): Comprueba si hay posiciones libres recorriendo el array.
Si las hay, entra en un do-while que genera números random del 1 al 9 hasta encontrar una casilla
libre donde colocar "O". Suma una jugada al contador cuando coloca. */

function Maquina() {

  if (jugadasMaquina >= 3) {

    let fichasMaquina = [];
    for (let i = 0; i < tablaPosiciones.length; i++) {
      if (tablaPosiciones[i] === maquina) {
        fichasMaquina.push(i + 1); 
      }
    }

    let casillasVacias = [];
    for (let i = 0; i < tablaPosiciones.length; i++) {
      if (tablaPosiciones[i] !== jugador && tablaPosiciones[i] !== maquina) {
        casillasVacias.push(i + 1);
      }
    }

    let origen = fichasMaquina[Math.floor(Math.random() * fichasMaquina.length)];
    let destino = casillasVacias[Math.floor(Math.random() * casillasVacias.length)];

    tablaPosiciones[destino - 1] = maquina;          
    tablaPosiciones[origen - 1] = origen;
    document.getElementById(destino).textContent = maquina;
    document.getElementById(origen).textContent = "";

  } else { 
    let valorMaquina = false;
    let posicionLibre = false;

    for (let i = 0; i < tablaPosiciones.length; i++) {
      if (tablaPosiciones[i] != jugador && tablaPosiciones[i] != maquina) {
        posicionLibre = true;
        break;
      }
    }

    if (posicionLibre === true) {
      do {
        let numeroMaquina = Math.floor(Math.random()*9+1);
        const botonMaquina = document.getElementById(numeroMaquina);

        for (let i = 0; i < tablaPosiciones.length; i++) {
          if (numeroMaquina === tablaPosiciones[i] && tablaPosiciones[i] != jugador && tablaPosiciones[i] != maquina) {
            tablaPosiciones[i] = maquina;
            jugadasMaquina++;
            botonMaquina.textContent = maquina;
            valorMaquina = true;
            break;
          }             
        }
      } while (!valorMaquina);
    }
  }
}

/* La función Ganador recorre todas las combinaciones ganadoras. Para cada combinación extraemos las tres casillas
y comprobamos en el array tablaPosiciones si las tres tienen el valor del jugador o las tres tienen el valor de la máquina.
Restamos 1 al número de casilla porque el array empieza en índice 0 pero las casillas van del 1 al 9.

Si alguna combinación se cumple, mostramos el mensaje correspondiente, sumamos al contador de victorias,
actualizamos el marcador en el HTML y devolvemos true.
Si ninguna combinación se cumple después de recorrerlas todas, devolvemos false. */

function Ganador() {

  for (let i = 0; i < posiblesCombinaciones.length; i++) {
    let casilla1 = posiblesCombinaciones[i][0];
    let casilla2 = posiblesCombinaciones[i][1];
    let casilla3 = posiblesCombinaciones[i][2];

    if (tablaPosiciones[casilla1 -1] === jugador && tablaPosiciones[casilla2 -1] === jugador && tablaPosiciones[casilla3 -1] === jugador) {
      mensajeGanador.textContent = "Ha ganado el jugador";
      mensajeGanador.classList.add('visible');
      jugadorVictoria++;
      jugadorWin.textContent = jugadorVictoria;
      return true;
      
    } else if (tablaPosiciones[casilla1 -1] === maquina && tablaPosiciones[casilla2 -1] === maquina && tablaPosiciones[casilla3 -1] === maquina) {
      mensajeGanador.textContent = "Ha ganado la máquina";
      mensajeGanador.classList.add('visible');
      maquinaVictoria++;
      maquinaWin.textContent = maquinaVictoria;
      return true;
    } 
  }
  
  return false;
}

/* La función Reiniciar recorre los botones del 1 al 9, los habilita de nuevo, les limpia el texto
y restablece el array tablaPosiciones a sus valores originales (1 al 9). También limpia el mensaje del ganador
y reinicia los contadores de jugadas a 0 para que la siguiente partida empiece en fase 1.
Nota: los contadores de victorias NO se reinician para mantener el marcador entre partidas. */

function Reiniciar() {
  
  for (let i = 1; i <= tablaPosiciones.length; i++) {
    const boton = document.getElementById(i);
    boton.disabled = false;
    boton.textContent = "";
    tablaPosiciones[i - 1] = i; 
  }
  mensajeGanador.textContent = "";
  mensajeGanador.classList.remove('visible');
  jugadasMaquina = 0;
  jugadasJugador = 0;
}

/* La función botonesOut deshabilita todos los botones del tablero para que no se pueda seguir jugando
una vez alguien ha ganado la partida. Recorre del 1 al 9 (inclusive) porque los ids de los botones van del 1 al 9. */

function botonesOut() {
  for (let i = 1; i <= tablaPosiciones.length; i++) {
    const boton = document.getElementById(i);
    boton.disabled = true; 
  }
}