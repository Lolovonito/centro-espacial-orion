import { activities } from './motor.js';

const CLAVES_BOTONES = ['plataforma', 'hangar', 'control', 'entrenamiento', 'flotabilidad', 'academia'];

function limitar(valor) {
  return Math.max(0, Math.min(100, valor));
}

export function createUI(raiz, estadoInicial = {}) {
  const estado = {
    energy: typeof estadoInicial.energy === 'number' ? estadoInicial.energy : 100,
    fun: typeof estadoInicial.fun === 'number' ? estadoInicial.fun : 100,
    hygiene: typeof estadoInicial.hygiene === 'number' ? estadoInicial.hygiene : 100,
    social: typeof estadoInicial.social === 'number' ? estadoInicial.social : 100,
    score: { research: 0, experience: 0 },
    currentActivity: null,
    timer: 0,
    timerHandle: null,
  };

  const botones = Array.from(raiz.querySelectorAll('button'));
  const botonesActividad = botones.filter((boton) => !boton.classList.contains('reset'));
  const botonesReset = botones.filter((boton) => boton.classList.contains('reset'));
  let habilitados = true;

  function habilitar(valor) {
    habilitados = valor;
    botonesActividad.forEach((boton) => {
      boton.disabled = !valor;
    });
    botonesReset.forEach((boton) => {
      boton.disabled = false;
    });
  }

  function detenerTemporizador() {
    if (estado.timerHandle) {
      clearTimeout(estado.timerHandle);
      estado.timerHandle = null;
    }
  }

  function iniciarActividad(clave) {
    if (estado.currentActivity) return;
    const actividad = activities[clave];
    if (!actividad) return;
    estado.currentActivity = actividad;
    estado.timer = 0;
    habilitar(false);
  }

  function aplicarEfectos(efectos) {
    if (efectos.energy) estado.energy = limitar(estado.energy + efectos.energy);
    if (efectos.fun) estado.fun = limitar(estado.fun + efectos.fun);
    if (efectos.hygiene) estado.hygiene = limitar(estado.hygiene + efectos.hygiene);
    if (efectos.social) estado.social = limitar(estado.social + efectos.social);
  }

  botonesActividad.forEach((boton, indice) => {
    const clave = CLAVES_BOTONES[indice];
    if (!clave) return;
    boton.addEventListener('click', () => iniciarActividad(clave));
  });

  if (botonesReset[0]) {
    botonesReset[0].addEventListener('click', () => {
      estado.energy = 100;
      estado.fun = 100;
      estado.hygiene = 100;
      estado.social = 100;
      estado.currentActivity = null;
      estado.timer = 0;
      detenerTemporizador();
      habilitar(true);
    });
  }

  if (botonesReset[1]) {
    botonesReset[1].addEventListener('click', () => {
      estado.score.research = 0;
      estado.score.experience = 0;
    });
  }

  raiz.addEventListener('click', (evento) => {
    evento.stopPropagation();
  });

  setInterval(() => {
    if (!estado.currentActivity) {
      if (!habilitados) habilitar(true);
      return;
    }
    aplicarEfectos(estado.currentActivity.effects || {});
  }, 1000);

  return {
    state: estado,
    enableButtons: habilitar,
    stopTimer: detenerTemporizador,
  };
}
