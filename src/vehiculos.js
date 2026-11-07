import * as THREE from 'three';
import { colocarEn } from './coordenadas.js';
import {
  MATERIALES,
  crearEtiqueta,
  caja,
  cilindro,
  cono,
  esfera,
  marcarInteractivo,
} from './instalaciones.js';

function crearBase(clave, texto, altura = 1.2, ancho = 9, alturaEtiqueta = 18) {
  const grupo = new THREE.Group();
  colocarEn(grupo, clave);
  marcarInteractivo(grupo, clave);

  const plataforma = cilindro(ancho, ancho + 1, altura, MATERIALES.concretoOscuro, 0, altura / 2, 0, grupo, 48);
  marcarInteractivo(plataforma, clave);

  const anillo = new THREE.Mesh(new THREE.TorusGeometry(ancho - 0.6, 0.25, 8, 48), MATERIALES.emisivoCian);
  anillo.rotation.x = Math.PI / 2;
  anillo.position.y = altura + 0.05;
  grupo.add(anillo);

  const etiqueta = crearEtiqueta(texto, '#7fe4ff', 14);
  etiqueta.position.set(0, alturaEtiqueta, 0);
  grupo.add(etiqueta);

  return { grupo, base: altura };
}

function crearOrion() {
  const { grupo, base } = crearBase('orion', 'Nave Orion');
  cilindro(3.4, 3.4, 0.4, MATERIALES.negro, 0, base + 0.2, 0, grupo, 32);
  cilindro(2.7, 2.7, 4.2, MATERIALES.metalOscuro, 0, base + 2.3, 0, grupo, 24);
  cilindro(1.9, 3.1, 3.6, MATERIALES.blanco, 0, base + 6.2, 0, grupo, 24);
  cono(1.9, 1.8, MATERIALES.blanco, 0, base + 8.9, 0, grupo, 24);
  cilindro(0.35, 0.35, 2.4, MATERIALES.rojo, 0, base + 11, 0, grupo, 8);
  cono(0.2, 1.2, MATERIALES.rojo, 0, base + 12.8, 0, grupo, 8);
  for (const signo of [-1, 1]) {
    const panel = caja(7, 0.12, 2.6, MATERIALES.emisivoAzul, signo * 6.2, base + 2.3, 0, grupo);
    panel.rotation.z = signo * 0.08;
  }
  for (const x of [-1.1, 1.1]) {
    esfera(0.32, MATERIALES.vidrio, x, base + 6.6, 2.1, grupo, 12, 10);
  }
  return grupo;
}

function crearCrewDragon() {
  const { grupo, base } = crearBase('crew_dragon', 'Crew Dragon');
  cilindro(2.6, 2.6, 4.5, MATERIALES.metalOscuro, 0, base + 2.25, 0, grupo, 24);
  cilindro(1.5, 2.7, 3.2, MATERIALES.blanco, 0, base + 6.1, 0, grupo, 24);
  cono(1.5, 1.6, MATERIALES.blanco, 0, base + 8.5, 0, grupo, 24);
  for (const signo of [-1, 1]) {
    const panel = caja(7, 0.12, 3, MATERIALES.emisivoAzul, signo * 6, base + 2.25, 0, grupo);
    panel.rotation.z = signo * 0.12;
  }
  for (const x of [-0.9, 0.9]) {
    esfera(0.3, MATERIALES.negro, x, base + 6.5, 1.45, grupo, 10, 8);
  }
  return grupo;
}

function crearStarship() {
  const { grupo, base } = crearBase('starship', 'Starship', 1.2, 9, 42);
  cilindro(2.8, 2.9, 30, MATERIALES.metal, 0, base + 15, 0, grupo, 32);
  cono(2.8, 9, MATERIALES.metal, 0, base + 34.5, 0, grupo, 32);
  for (let i = 0; i < 4; i += 1) {
    const angulo = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const aleta = caja(0.6, 8, 4.5, MATERIALES.metalOscuro, Math.cos(angulo) * 3.2, base + 4, Math.sin(angulo) * 3.2, grupo);
    aleta.rotation.y = -angulo;
    aleta.rotation.z = 0.18;
  }
  for (let i = 0; i < 3; i += 1) {
    const angulo = (i / 3) * Math.PI * 2;
    const motor = cono(0.8, 2, MATERIALES.metalOscuro, Math.cos(angulo) * 1.4, base + 0.1, Math.sin(angulo) * 1.4, grupo, 12);
    motor.rotation.x = Math.PI;
  }
  return grupo;
}

function crearSaturnV() {
  const { grupo, base } = crearBase('saturn_v', 'Saturn V', 1.2, 9, 44);
  cilindro(3.2, 3.3, 13, MATERIALES.blanco, 0, base + 6.5, 0, grupo, 32);
  cilindro(3.25, 3.25, 0.7, MATERIALES.negro, 0, base + 3, 0, grupo, 32);
  cilindro(3.25, 3.25, 0.7, MATERIALES.negro, 0, base + 9, 0, grupo, 32);
  cilindro(3.2, 3.2, 2.4, MATERIALES.negro, 0, base + 14.2, 0, grupo, 32);
  cilindro(3.2, 3.2, 8.5, MATERIALES.blanco, 0, base + 19.65, 0, grupo, 32);
  cilindro(3.2, 3.2, 6.5, MATERIALES.blanco, 0, base + 27.15, 0, grupo, 32);
  cilindro(3.25, 3.25, 0.6, MATERIALES.negro, 0, base + 28.6, 0, grupo, 32);
  cono(3.2, 6, MATERIALES.blanco, 0, base + 33.4, 0, grupo, 32);
  cilindro(0.4, 0.4, 2.8, MATERIALES.metal, 0, base + 37.8, 0, grupo, 8);
  cono(0.25, 1.2, MATERIALES.rojo, 0, base + 39.8, 0, grupo, 8);
  for (let i = 0; i < 4; i += 1) {
    const angulo = (i / 4) * Math.PI * 2;
    const aleta = caja(0.6, 7, 4, MATERIALES.negro, Math.cos(angulo) * 3.4, base + 4, Math.sin(angulo) * 3.4, grupo);
    aleta.rotation.y = -angulo;
  }
  return grupo;
}

export function crearVehiculos(scene) {
  const grupo = new THREE.Group();
  grupo.add(crearOrion());
  grupo.add(crearCrewDragon());
  grupo.add(crearStarship());
  grupo.add(crearSaturnV());
  scene.add(grupo);
  return grupo;
}
