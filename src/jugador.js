import * as THREE from 'three';
import { POSICIONES } from './coordenadas.js';
import { caja, esfera } from './instalaciones.js';

const ESTACIONES = [
  { clave: 'plataforma', radio: 20 },
  { clave: 'hangar', radio: 27 },
  { clave: 'control', radio: 24 },
  { clave: 'entrenamiento', radio: 22 },
  { clave: 'flotabilidad', radio: 24 },
  { clave: 'academia', radio: 21 },
  { clave: 'orion', radio: 14 },
  { clave: 'crew_dragon', radio: 14 },
  { clave: 'starship', radio: 14 },
  { clave: 'saturn_v', radio: 14 },
];

const OBSTACULOS = [
  { x: 0, z: -52, r: 4.5 },
  { x: -7, z: -52, r: 3 },
  { x: -54, z: -4, r: 18 },
  { x: 54, z: -4, r: 16 },
  { x: -54, z: 38, r: 14 },
  { x: 54, z: 38, r: 16 },
  { x: 0, z: 54, r: 13 },
  { x: -42, z: 47, r: 5 },
  { x: -66, z: 47, r: 4 },
  { x: -54, z: 49, r: 3 },
  { x: 0, z: 69, r: 6.5 },
  { x: 0, z: 18, r: 5 },
  { x: -21, z: 82, r: 1 },
  { x: 0, z: 82, r: 1 },
  { x: 21, z: 82, r: 1 },
  { x: -9, z: 88, r: 2.2 },
  { x: 9, z: 88, r: 2.2 },
  { x: -72, z: -64, r: 4 },
  { x: -26, z: -80, r: 4 },
  { x: 26, z: -80, r: 4 },
  { x: 72, z: -64, r: 4 },
];

const LIMITES = { x: 96, z: 110 };
const VELOCIDAD = 9;
const VELOCIDAD_CORRER = 16;
const RADIO_JUGADOR = 0.9;
const DISTANCIA_CAMARA = 15;

function limitar(valor, minimo, maximo) {
  return Math.max(minimo, Math.min(maximo, valor));
}

function suavizarAngulo(actual, objetivo, factor) {
  let diferencia = objetivo - actual;
  while (diferencia > Math.PI) diferencia -= Math.PI * 2;
  while (diferencia < -Math.PI) diferencia += Math.PI * 2;
  return actual + diferencia * factor;
}

function crearAstronauta() {
  const grupo = new THREE.Group();
  const traje = new THREE.MeshStandardMaterial({ color: 0xf1f4f8, roughness: 0.72, metalness: 0.05 });
  const detalle = new THREE.MeshStandardMaterial({ color: 0x303a47, roughness: 0.6, metalness: 0.35 });
  const visor = new THREE.MeshStandardMaterial({
    color: 0x0a2438,
    roughness: 0.12,
    metalness: 0.65,
    emissive: 0x0a3350,
    emissiveIntensity: 0.7,
  });
  const acento = new THREE.MeshStandardMaterial({
    color: 0x1f5f88,
    emissive: 0x28e0ff,
    emissiveIntensity: 0.7,
    roughness: 0.5,
  });

  caja(0.95, 1.05, 0.58, traje, 0, 1.35, 0, grupo);
  caja(0.8, 0.85, 0.34, detalle, 0, 1.4, -0.42, grupo);
  caja(0.5, 0.32, 0.1, detalle, 0, 1.32, 0.33, grupo);
  caja(0.22, 0.08, 0.04, acento, 0, 1.38, 0.39, grupo);

  const casco = esfera(0.46, traje, 0, 2.05, 0, grupo, 20, 16);
  casco.scale.set(1, 0.98, 1);
  const visorMalla = esfera(0.4, visor, 0, 2.05, 0.16, grupo, 20, 16);
  visorMalla.scale.set(0.82, 0.62, 0.55);

  const brazoIzq = new THREE.Group();
  brazoIzq.position.set(-0.62, 1.78, 0);
  grupo.add(brazoIzq);
  caja(0.24, 0.78, 0.24, traje, 0, -0.38, 0, brazoIzq);
  caja(0.27, 0.22, 0.27, detalle, 0, -0.82, 0, brazoIzq);

  const brazoDer = new THREE.Group();
  brazoDer.position.set(0.62, 1.78, 0);
  grupo.add(brazoDer);
  caja(0.24, 0.78, 0.24, traje, 0, -0.38, 0, brazoDer);
  caja(0.27, 0.22, 0.27, detalle, 0, -0.82, 0, brazoDer);

  const piernaIzq = new THREE.Group();
  piernaIzq.position.set(-0.25, 0.85, 0);
  grupo.add(piernaIzq);
  caja(0.3, 0.8, 0.3, traje, 0, -0.4, 0, piernaIzq);
  caja(0.32, 0.22, 0.48, detalle, 0, -0.84, 0.08, piernaIzq);

  const piernaDer = new THREE.Group();
  piernaDer.position.set(0.25, 0.85, 0);
  grupo.add(piernaDer);
  caja(0.3, 0.8, 0.3, traje, 0, -0.4, 0, piernaDer);
  caja(0.32, 0.22, 0.48, detalle, 0, -0.84, 0.08, piernaDer);

  grupo.traverse((objeto) => {
    if (objeto.isMesh) {
      objeto.castShadow = true;
      objeto.receiveShadow = true;
    }
  });

  return { grupo, brazoIzq, brazoDer, piernaIzq, piernaDer };
}

export function crearJugador(escena, camara, lienzo) {
  const { grupo, brazoIzq, brazoDer, piernaIzq, piernaDer } = crearAstronauta();
  grupo.position.set(0, 0, 96);
  escena.add(grupo);

  const estado = {
    proxima: null,
    velocidad: new THREE.Vector2(),
    anguloCamara: 0,
    inclinacionCamara: 0.3,
    fase: 0,
    ui: null,
  };

  const teclas = new Set();
  let joystickX = 0;
  let joystickY = 0;

  const alTeclear = (evento) => {
    if (evento.target && /input|textarea|select/i.test(evento.target.tagName)) return;
    if (evento.code === 'KeyE') {
      if (estado.ui) estado.ui.interactuar();
      return;
    }
    teclas.add(evento.code);
    if (evento.code === 'Space' || evento.code.startsWith('Arrow')) evento.preventDefault();
  };
  const alSoltar = (evento) => teclas.delete(evento.code);
  window.addEventListener('keydown', alTeclear);
  window.addEventListener('keyup', alSoltar);
  window.addEventListener('blur', () => teclas.clear());

  const baseJoystick = document.getElementById('joystick-base');
  const perilla = document.getElementById('joystick-knob');
  if (baseJoystick && perilla) {
    let pointerId = null;
    const radio = 42;
    const moverPerilla = (dx, dy) => {
      perilla.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    const actualizarJoystick = (evento) => {
      const rect = baseJoystick.getBoundingClientRect();
      let dx = evento.clientX - (rect.left + rect.width / 2);
      let dy = evento.clientY - (rect.top + rect.height / 2);
      const largo = Math.hypot(dx, dy);
      if (largo > radio) {
        dx = (dx / largo) * radio;
        dy = (dy / largo) * radio;
      }
      joystickX = dx / radio;
      joystickY = -dy / radio;
      moverPerilla(dx, dy);
    };
    const soltarJoystick = () => {
      pointerId = null;
      joystickX = 0;
      joystickY = 0;
      moverPerilla(0, 0);
    };
    baseJoystick.addEventListener('pointerdown', (evento) => {
      pointerId = evento.pointerId;
      baseJoystick.setPointerCapture(pointerId);
      actualizarJoystick(evento);
      evento.preventDefault();
    });
    baseJoystick.addEventListener('pointermove', (evento) => {
      if (evento.pointerId === pointerId) actualizarJoystick(evento);
    });
    baseJoystick.addEventListener('pointerup', soltarJoystick);
    baseJoystick.addEventListener('pointercancel', soltarJoystick);
  }

  let arrastrando = false;
  let ultimoX = 0;
  let ultimoY = 0;
  lienzo.addEventListener('contextmenu', (evento) => evento.preventDefault());
  lienzo.addEventListener('pointerdown', (evento) => {
    if (evento.pointerType === 'mouse' && evento.button !== 0) return;
    arrastrando = true;
    ultimoX = evento.clientX;
    ultimoY = evento.clientY;
    if (lienzo.setPointerCapture) lienzo.setPointerCapture(evento.pointerId);
    lienzo.style.cursor = 'grabbing';
  });
  lienzo.addEventListener('pointermove', (evento) => {
    if (!arrastrando) return;
    const dx = evento.clientX - ultimoX;
    const dy = evento.clientY - ultimoY;
    ultimoX = evento.clientX;
    ultimoY = evento.clientY;
    estado.anguloCamara -= dx * 0.005;
    estado.inclinacionCamara = limitar(estado.inclinacionCamara - dy * 0.004, 0.02, 0.95);
  });
  const soltarArrastre = () => {
    arrastrando = false;
    lienzo.style.cursor = 'grab';
  };
  window.addEventListener('pointerup', soltarArrastre);
  window.addEventListener('pointercancel', soltarArrastre);

  const coseno = Math.cos(estado.inclinacionCamara);
  camara.position.set(
    grupo.position.x + Math.sin(estado.anguloCamara) * coseno * DISTANCIA_CAMARA,
    2.5 + Math.sin(estado.inclinacionCamara) * DISTANCIA_CAMARA,
    grupo.position.z + Math.cos(estado.anguloCamara) * coseno * DISTANCIA_CAMARA,
  );
  camara.lookAt(grupo.position.x, 2.1, grupo.position.z);

  const actualizarCamara = (dt) => {
    const cosenoActual = Math.cos(estado.inclinacionCamara);
    const deseada = new THREE.Vector3(
      grupo.position.x + Math.sin(estado.anguloCamara) * cosenoActual * DISTANCIA_CAMARA,
      2.5 + Math.sin(estado.inclinacionCamara) * DISTANCIA_CAMARA,
      grupo.position.z + Math.cos(estado.anguloCamara) * cosenoActual * DISTANCIA_CAMARA,
    );
    deseada.y = Math.max(deseada.y, 2.2);
    camara.position.lerp(deseada, 1 - Math.exp(-9 * dt));
    camara.lookAt(grupo.position.x, 2.1, grupo.position.z);
  };

  const actualizarProximidad = (bloqueado) => {
    let cercana = null;
    if (!bloqueado) {
      let mejor = Infinity;
      for (const estacion of ESTACIONES) {
        const posicion = POSICIONES[estacion.clave];
        if (!posicion) continue;
        const distancia = Math.hypot(grupo.position.x - posicion.x, grupo.position.z - posicion.z);
        if (distancia <= estacion.radio && distancia < mejor) {
          mejor = distancia;
          cercana = estacion.clave;
        }
      }
    }
    if (cercana !== estado.proxima) {
      estado.proxima = cercana;
      if (estado.ui) estado.ui.setProximidad(cercana);
    }
  };

  const actualizar = (dt) => {
    const bloqueado = !!(estado.ui && estado.ui.state.currentActivity);

    let entradaX = 0;
    let entradaY = 0;
    if (!bloqueado) {
      if (teclas.has('KeyW') || teclas.has('ArrowUp')) entradaY += 1;
      if (teclas.has('KeyS') || teclas.has('ArrowDown')) entradaY -= 1;
      if (teclas.has('KeyD') || teclas.has('ArrowRight')) entradaX += 1;
      if (teclas.has('KeyA') || teclas.has('ArrowLeft')) entradaX -= 1;
      entradaX += joystickX;
      entradaY += joystickY;
    }

    const magnitudEntrada = Math.hypot(entradaX, entradaY);
    if (magnitudEntrada > 1) {
      entradaX /= magnitudEntrada;
      entradaY /= magnitudEntrada;
    }

    const adelante = new THREE.Vector3(-Math.sin(estado.anguloCamara), 0, -Math.cos(estado.anguloCamara));
    const derecha = new THREE.Vector3(Math.cos(estado.anguloCamara), 0, -Math.sin(estado.anguloCamara));
    const direccion = new THREE.Vector3();
    direccion.addScaledVector(adelante, entradaY).addScaledVector(derecha, entradaX);
    if (direccion.lengthSq() > 0.0001) direccion.normalize();

    const correr = teclas.has('ShiftLeft') || teclas.has('ShiftRight');
    const rapidez = correr ? VELOCIDAD_CORRER : VELOCIDAD;
    const factorEntrada = Math.min(1, Math.hypot(entradaX, entradaY));
    const objetivoX = direccion.x * rapidez * factorEntrada;
    const objetivoZ = direccion.z * rapidez * factorEntrada;
    const factor = 1 - Math.exp(-10 * dt);
    estado.velocidad.x += (objetivoX - estado.velocidad.x) * factor;
    estado.velocidad.y += (objetivoZ - estado.velocidad.y) * factor;

    grupo.position.x = limitar(grupo.position.x + estado.velocidad.x * dt, -LIMITES.x, LIMITES.x);
    grupo.position.z = limitar(grupo.position.z + estado.velocidad.y * dt, -LIMITES.z, LIMITES.z);

    for (const obstaculo of OBSTACULOS) {
      const dx = grupo.position.x - obstaculo.x;
      const dz = grupo.position.z - obstaculo.z;
      const distancia = Math.hypot(dx, dz);
      const minimo = obstaculo.r + RADIO_JUGADOR;
      if (distancia < minimo) {
        if (distancia < 0.0001) {
          grupo.position.x = obstaculo.x + minimo;
          grupo.position.z = obstaculo.z;
        } else {
          const escala = minimo / distancia;
          grupo.position.x = obstaculo.x + dx * escala;
          grupo.position.z = obstaculo.z + dz * escala;
        }
      }
    }

    const movimiento = Math.hypot(estado.velocidad.x, estado.velocidad.y);
    if (movimiento > 0.3) {
      const anguloObjetivo = Math.atan2(estado.velocidad.x, estado.velocidad.y);
      grupo.rotation.y = suavizarAngulo(grupo.rotation.y, anguloObjetivo, 1 - Math.exp(-12 * dt));
    }

    estado.fase += movimiento * dt * 2.4;
    const amplitud = Math.min(1, movimiento / VELOCIDAD) * 0.65;
    const balanceo = Math.sin(estado.fase) * amplitud;
    piernaIzq.rotation.x = balanceo;
    piernaDer.rotation.x = -balanceo;
    brazoIzq.rotation.x = -balanceo * 0.8;
    brazoDer.rotation.x = balanceo * 0.8;

    actualizarCamara(dt);
    actualizarProximidad(bloqueado);
  };

  const conectarUI = (ui) => {
    estado.ui = ui;
    ui.setProximidad(estado.proxima);
  };

  return {
    actualizar,
    conectarUI,
    obtenerPosicion: () => grupo.position.clone(),
    obtenerProxima: () => estado.proxima,
    grupo,
  };
}
