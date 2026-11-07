import * as THREE from 'three';
import { crearMundoTerra } from './mundo-terra.js';
import { crearInstalaciones } from './instalaciones.js';
import { crearDetallesComplejo } from './instalaciones2.js';
import { crearVehiculos } from './vehiculos.js';

export const activities = {
  plataforma: {
    name: 'Revisar una misión',
    duration: 18,
    researchPoints: 3,
    experiencePoints: 9,
    effects: { energy: -1, fun: 0.4, hygiene: -0.2, social: 0.2 },
  },
  hangar: {
    name: 'Práctica de ingeniería',
    duration: 28,
    researchPoints: 5,
    experiencePoints: 13,
    effects: { energy: -2.2, fun: 0.2, hygiene: -0.8, social: 0.2 },
  },
  control: {
    name: 'Análisis de telemetría',
    duration: 24,
    researchPoints: 4,
    experiencePoints: 12,
    effects: { energy: -1.6, fun: 0.2, hygiene: -0.2, social: 0.4 },
  },
  entrenamiento: {
    name: 'Entrenamiento en centrífuga',
    duration: 30,
    researchPoints: 0,
    experiencePoints: 14,
    effects: { energy: -2.8, fun: 0.6, hygiene: -1.6, social: 0.1 },
  },
  flotabilidad: {
    name: 'Entrenamiento EVA',
    duration: 30,
    researchPoints: 0,
    experiencePoints: 14,
    effects: { energy: -3, fun: 0.5, hygiene: -2, social: 0.2 },
  },
  academia: {
    name: 'Clase en la Academia',
    duration: 30,
    researchPoints: 5,
    experiencePoints: 12,
    effects: { energy: -1.2, fun: 0.8, hygiene: -0.3, social: 1.2 },
  },
  orion: {
    name: 'Inspeccionar la nave Orion',
    duration: 18,
    researchPoints: 0,
    experiencePoints: 8,
    effects: { energy: -0.9, fun: 0.7, hygiene: -0.2, social: 0.2 },
  },
  crew_dragon: {
    name: 'Inspeccionar Crew Dragon',
    duration: 18,
    researchPoints: 0,
    experiencePoints: 8,
    effects: { energy: -0.9, fun: 0.7, hygiene: -0.2, social: 0.2 },
  },
  starship: {
    name: 'Inspeccionar Starship',
    duration: 18,
    researchPoints: 0,
    experiencePoints: 8,
    effects: { energy: -0.9, fun: 0.7, hygiene: -0.2, social: 0.2 },
  },
  saturn_v: {
    name: 'Inspeccionar Saturn V',
    duration: 18,
    researchPoints: 0,
    experiencePoints: 8,
    effects: { energy: -0.9, fun: 0.7, hygiene: -0.2, social: 0.2 },
  },
};

let camara = null;
let renderizador = null;
let escena = null;
const puntero = new THREE.Vector2();
let punteroActivo = false;
const objetivo = new THREE.Vector3(0, 6, -4);
const radioComplejo = 112;

function encuadrar() {
  const aspecto = window.innerWidth / window.innerHeight;
  camara.aspect = aspecto;
  const fovVertical = THREE.MathUtils.degToRad(camara.fov);
  const fovHorizontal = 2 * Math.atan(Math.tan(fovVertical / 2) * aspecto);
  const mitadMenor = Math.min(fovVertical / 2, fovHorizontal / 2);
  const distancia = (radioComplejo / Math.sin(mitadMenor)) * 1.06;
  const direccion = new THREE.Vector3(0, 0.62, 1).normalize();
  camara.position.copy(objetivo).addScaledVector(direccion, distancia);
  camara.lookAt(objetivo);
  camara.updateProjectionMatrix();
}

export function initEngine(idLienzo) {
  const lienzo = document.getElementById(idLienzo) || document.querySelector('canvas');

  escena = new THREE.Scene();
  escena.background = new THREE.Color(0x0a1424);
  escena.fog = new THREE.Fog(0x0a1424, 220, 620);

  camara = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1400);
  encuadrar();

  renderizador = new THREE.WebGLRenderer({
    canvas: lienzo,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderizador.setSize(window.innerWidth, window.innerHeight);
  renderizador.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderizador.shadowMap.enabled = true;
  renderizador.shadowMap.type = THREE.PCFSoftShadowMap;
  renderizador.outputEncoding = THREE.sRGBEncoding;
  renderizador.toneMapping = THREE.ACESFilmicToneMapping;
  renderizador.toneMappingExposure = 1.08;

  const ambiente = new THREE.HemisphereLight(0x9ec9ff, 0x1a2a1c, 0.9);
  escena.add(ambiente);

  const sol = new THREE.DirectionalLight(0xfff1d0, 1.35);
  sol.position.set(90, 150, 90);
  sol.castShadow = true;
  sol.shadow.mapSize.set(1024, 1024);
  sol.shadow.camera.near = 20;
  sol.shadow.camera.far = 420;
  sol.shadow.camera.left = -160;
  sol.shadow.camera.right = 160;
  sol.shadow.camera.top = 160;
  sol.shadow.camera.bottom = -160;
  escena.add(sol);

  const relleno = new THREE.DirectionalLight(0x3d7dff, 0.4);
  relleno.position.set(-100, 80, -80);
  escena.add(relleno);

  crearMundoTerra(escena);
  crearInstalaciones(escena);
  crearVehiculos(escena);
  crearDetallesComplejo(escena);

  const actualizarPuntero = (evento) => {
    const rect = lienzo.getBoundingClientRect();
    puntero.x = ((evento.clientX - rect.left) / rect.width) * 2 - 1;
    puntero.y = -((evento.clientY - rect.top) / rect.height) * 2 + 1;
    punteroActivo = true;
  };
  lienzo.addEventListener('pointermove', actualizarPuntero, { passive: true });
  lienzo.addEventListener('pointerdown', actualizarPuntero, { passive: true });

  const alRedimensionar = () => {
    encuadrar();
    renderizador.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', alRedimensionar);

  return { scene: escena, camera: camara, renderer: renderizador };
}

export function findInstalledFloor(scene, raycaster, mouse) {
  if (!camara) return null;
  raycaster.setFromCamera(punteroActivo ? puntero : mouse, camara);
  const intersecciones = raycaster.intersectObjects(scene.children, true);
  for (const impacto of intersecciones) {
    let objeto = impacto.object;
    while (objeto) {
      if (objeto.userData && objeto.userData.instalacion) {
        return objeto;
      }
      objeto = objeto.parent;
    }
  }
  return null;
}
