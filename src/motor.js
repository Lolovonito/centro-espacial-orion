import * as THREE from '../vendor/three.module.js';
import { crearMundoTerra } from './mundo-terra.js';
import { crearInstalaciones } from './instalaciones.js';
import { crearDetallesComplejo } from './instalaciones2.js';
import { crearVehiculos } from './vehiculos.js';
import { crearJugador } from './jugador.js';

export { activities } from './actividades.js';

let camara = null;
const puntero = new THREE.Vector2();
let punteroActivo = false;

export function initEngine(idLienzo) {
  const lienzo = document.getElementById(idLienzo) || document.querySelector('canvas');

  const escena = new THREE.Scene();
  escena.background = new THREE.Color(0x0a1424);
  escena.fog = new THREE.Fog(0x0a1424, 170, 560);

  camara = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1400);

  const renderizador = new THREE.WebGLRenderer({
    canvas: lienzo,
    antialias: true,
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

  const juego = crearJugador(escena, camara, renderizador.domElement);

  const actualizarPuntero = (evento) => {
    const rect = lienzo.getBoundingClientRect();
    puntero.x = ((evento.clientX - rect.left) / rect.width) * 2 - 1;
    puntero.y = -((evento.clientY - rect.top) / rect.height) * 2 + 1;
    punteroActivo = true;
  };
  lienzo.addEventListener('pointermove', actualizarPuntero, { passive: true });
  lienzo.addEventListener('pointerdown', actualizarPuntero, { passive: true });

  const alRedimensionar = () => {
    camara.aspect = window.innerWidth / window.innerHeight;
    camara.updateProjectionMatrix();
    renderizador.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', alRedimensionar);

  return { scene: escena, camera: camara, renderer: renderizador, juego };
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
