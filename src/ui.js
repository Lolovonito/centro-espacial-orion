import { activities } from './actividades.js';

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
    proxima: null,
    efectosAcumulados: 0,
  };

  const botonesReset = Array.from(raiz.querySelectorAll('button.reset'));
  const accionPanel = raiz.querySelector('#accion');
  const accionTexto = raiz.querySelector('#accion-texto');
  const botonAccion = document.getElementById('btn-interactuar') || raiz.querySelector('#btn-interactuar');
  let habilitados = true;

  function habilitar(valor) {
    habilitados = valor;
  }

  function detenerTemporizador() {
    if (estado.timerHandle) {
      clearTimeout(estado.timerHandle);
      estado.timerHandle = null;
    }
  }

  function actualizarAccion() {
    const actividad = estado.proxima ? activities[estado.proxima] : null;
    const visible = !!actividad && !estado.currentActivity;
    if (accionPanel) accionPanel.hidden = !visible;
    if (accionTexto && actividad) {
      accionTexto.innerHTML = `Cerca de: <strong>${actividad.name}</strong>`;
    }
    if (botonAccion) {
      botonAccion.classList.toggle('visible', visible);
      botonAccion.disabled = !visible;
      botonAccion.textContent = 'Interactuar';
    }
  }

  function iniciarActividad(clave) {
    if (estado.currentActivity) return false;
    const actividad = activities[clave];
    if (!actividad) return false;
    estado.currentActivity = actividad;
    estado.timer = 0;
    estado.efectosAcumulados = 0;
    actualizarAccion();
    return true;
  }

  function setProximidad(clave) {
    estado.proxima = clave || null;
    actualizarAccion();
  }

  function interactuar() {
    if (estado.currentActivity || !estado.proxima) return false;
    return iniciarActividad(estado.proxima);
  }

  function aplicarEfectos(efectos) {
    if (efectos.energy) estado.energy = limitar(estado.energy + efectos.energy);
    if (efectos.fun) estado.fun = limitar(estado.fun + efectos.fun);
    if (efectos.hygiene) estado.hygiene = limitar(estado.hygiene + efectos.hygiene);
    if (efectos.social) estado.social = limitar(estado.social + efectos.social);
  }

  function actualizar(dt) {
    if (!estado.currentActivity) return;
    estado.timer += dt;
    estado.efectosAcumulados += dt;
    while (estado.efectosAcumulados >= 1) {
      aplicarEfectos(estado.currentActivity.effects || {});
      estado.efectosAcumulados -= 1;
    }
    if (estado.timer >= estado.currentActivity.duration) {
      const actividad = estado.currentActivity;
      estado.score.research += actividad.researchPoints || 0;
      estado.score.experience += actividad.experiencePoints || 0;
      estado.currentActivity = null;
      estado.timer = 0;
      estado.efectosAcumulados = 0;
      actualizarAccion();
    }
  }

  if (botonAccion) {
    botonAccion.addEventListener('click', (evento) => {
      evento.stopPropagation();
      interactuar();
    });
  }

  if (botonesReset[0]) {
    botonesReset[0].addEventListener('click', () => {
      estado.energy = 100;
      estado.fun = 100;
      estado.hygiene = 100;
      estado.social = 100;
      estado.currentActivity = null;
      estado.timer = 0;
      estado.efectosAcumulados = 0;
      detenerTemporizador();
      actualizarAccion();
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

  return {
    state: estado,
    enableButtons: habilitar,
    stopTimer: detenerTemporizador,
    setProximidad,
    interactuar,
    actualizar,
  };
}
