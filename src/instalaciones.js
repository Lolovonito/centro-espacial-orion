import * as THREE from '../vendor/three.module.js';
import { colocarEn } from './coordenadas.js';

export const MATERIALES = {
  concreto: new THREE.MeshStandardMaterial({ color: 0x9aa1aa, roughness: 0.95 }),
  concretoOscuro: new THREE.MeshStandardMaterial({ color: 0x5f6670, roughness: 0.95 }),
  metal: new THREE.MeshStandardMaterial({ color: 0xc4ccd6, metalness: 0.75, roughness: 0.35 }),
  metalOscuro: new THREE.MeshStandardMaterial({ color: 0x5a636f, metalness: 0.7, roughness: 0.4 }),
  vidrio: new THREE.MeshStandardMaterial({
    color: 0x7fd4ff,
    metalness: 0.2,
    roughness: 0.08,
    transparent: true,
    opacity: 0.55,
    emissive: 0x0a2a44,
    emissiveIntensity: 0.6,
  }),
  agua: new THREE.MeshStandardMaterial({
    color: 0x2e9fd6,
    metalness: 0.1,
    roughness: 0.15,
    transparent: true,
    opacity: 0.55,
  }),
  blanco: new THREE.MeshStandardMaterial({ color: 0xf3f5f8, roughness: 0.6 }),
  negro: new THREE.MeshStandardMaterial({ color: 0x1a1d22, roughness: 0.8 }),
  rojo: new THREE.MeshStandardMaterial({ color: 0xc0392b, roughness: 0.7 }),
  azul: new THREE.MeshStandardMaterial({ color: 0x2b6cb0, roughness: 0.7 }),
  amarillo: new THREE.MeshStandardMaterial({ color: 0xf2c94c, roughness: 0.6 }),
  emisivoAzul: new THREE.MeshStandardMaterial({
    color: 0x0b2a4a,
    emissive: 0x1e6fff,
    emissiveIntensity: 1.4,
    roughness: 0.4,
  }),
  emisivoCian: new THREE.MeshStandardMaterial({
    color: 0x082a33,
    emissive: 0x28e0ff,
    emissiveIntensity: 1.4,
    roughness: 0.4,
  }),
  emisivoAmbar: new THREE.MeshStandardMaterial({
    color: 0x3a2408,
    emissive: 0xffa41e,
    emissiveIntensity: 1.4,
    roughness: 0.4,
  }),
};

export function crearEtiqueta(texto, color = '#ffe27a', anchoDeseado = 16) {
  const canvas = document.createElement('canvas');
  const contexto = canvas.getContext('2d');
  const fuente = 'bold 48px system-ui, sans-serif';
  contexto.font = fuente;
  const anchoTexto = Math.ceil(contexto.measureText(texto).width) + 48;
  canvas.width = anchoTexto;
  canvas.height = 96;
  contexto.font = fuente;
  contexto.textAlign = 'center';
  contexto.textBaseline = 'middle';
  contexto.fillStyle = 'rgba(8, 16, 28, 0.78)';
  contexto.fillRect(0, 0, canvas.width, canvas.height);
  contexto.strokeStyle = color;
  contexto.lineWidth = 4;
  contexto.strokeRect(3, 3, canvas.width - 6, canvas.height - 6);
  contexto.fillStyle = color;
  contexto.fillText(texto, canvas.width / 2, canvas.height / 2 + 2);
  const textura = new THREE.CanvasTexture(canvas);
  textura.minFilter = THREE.LinearFilter;
  const material = new THREE.SpriteMaterial({ map: textura, transparent: true, depthTest: true });
  const sprite = new THREE.Sprite(material);
  const escala = anchoDeseado / canvas.width;
  sprite.scale.set(anchoDeseado, canvas.height * escala, 1);
  return sprite;
}

export function caja(ancho, alto, largo, material, x = 0, y = 0, z = 0, padre = null) {
  const malla = new THREE.Mesh(new THREE.BoxGeometry(ancho, alto, largo), material);
  malla.position.set(x, y, z);
  malla.castShadow = true;
  malla.receiveShadow = true;
  if (padre) padre.add(malla);
  return malla;
}

export function cilindro(radioSuperior, radioInferior, alto, material, x = 0, y = 0, z = 0, padre = null, segmentos = 24) {
  const malla = new THREE.Mesh(
    new THREE.CylinderGeometry(radioSuperior, radioInferior, alto, segmentos),
    material,
  );
  malla.position.set(x, y, z);
  malla.castShadow = true;
  malla.receiveShadow = true;
  if (padre) padre.add(malla);
  return malla;
}

export function cono(radio, alto, material, x = 0, y = 0, z = 0, padre = null, segmentos = 24) {
  const malla = new THREE.Mesh(new THREE.ConeGeometry(radio, alto, segmentos), material);
  malla.position.set(x, y, z);
  malla.castShadow = true;
  malla.receiveShadow = true;
  if (padre) padre.add(malla);
  return malla;
}

export function esfera(radio, material, x = 0, y = 0, z = 0, padre = null, ancho = 16, alto = 12) {
  const malla = new THREE.Mesh(new THREE.SphereGeometry(radio, ancho, alto), material);
  malla.position.set(x, y, z);
  malla.castShadow = true;
  malla.receiveShadow = true;
  if (padre) padre.add(malla);
  return malla;
}

export function plano(ancho, alto, material, x = 0, y = 0, z = 0, padre = null, rotY = 0) {
  const malla = new THREE.Mesh(new THREE.PlaneGeometry(ancho, alto), material);
  malla.position.set(x, y, z);
  malla.rotation.y = rotY;
  if (padre) padre.add(malla);
  return malla;
}

export function marcarInteractivo(objeto, clave) {
  objeto.userData.instalacion = clave;
  return objeto;
}

function crearPlataforma() {
  const grupo = new THREE.Group();
  colocarEn(grupo, 'plataforma');
  marcarInteractivo(grupo, 'plataforma');

  const base = cilindro(16, 16, 1.6, MATERIALES.concreto, 0, 0.8, 0, grupo, 48);
  marcarInteractivo(base, 'plataforma');

  const anillo = new THREE.Mesh(new THREE.TorusGeometry(15.1, 0.45, 8, 48), MATERIALES.amarillo);
  anillo.rotation.x = Math.PI / 2;
  anillo.position.y = 1.65;
  grupo.add(anillo);

  const cohete = new THREE.Group();
  cohete.position.set(0, 1.6, 0);
  cilindro(2.4, 2.8, 22, MATERIALES.blanco, 0, 11, 0, cohete, 24);
  cono(2.6, 6, MATERIALES.blanco, 0, 25, 0, cohete, 24);
  cilindro(2.85, 2.85, 2.4, MATERIALES.rojo, 0, 6, 0, cohete, 24);
  cilindro(2.85, 2.85, 1.2, MATERIALES.azul, 0, 15, 0, cohete, 24);
  cilindro(0.5, 0.5, 3, MATERIALES.metal, 0, 29.5, 0, cohete, 8);
  cono(0.28, 1.4, MATERIALES.rojo, 0, 31.7, 0, cohete, 8);
  for (let i = 0; i < 4; i += 1) {
    const angulo = (i / 4) * Math.PI * 2;
    const aleta = caja(0.6, 5, 3, MATERIALES.rojo, Math.cos(angulo) * 3.1, 4, Math.sin(angulo) * 3.1, cohete);
    aleta.rotation.y = -angulo;
  }
  grupo.add(cohete);

  const torre = new THREE.Group();
  torre.position.set(-7, 1.6, 0);
  caja(3, 26, 3, MATERIALES.metalOscuro, 0, 13, 0, torre);
  for (let y = 3; y < 26; y += 4) {
    caja(6, 0.35, 0.35, MATERIALES.metal, 0, y, 1.6, torre);
    caja(0.35, 0.35, 6, MATERIALES.metal, 1.6, y, 0, torre);
  }
  caja(8, 0.6, 8, MATERIALES.metalOscuro, 0, 26, 0, torre);
  grupo.add(torre);

  caja(4, 0.5, 1, MATERIALES.metal, -4, 18, 0, grupo);
  caja(4, 0.5, 1, MATERIALES.metal, -4, 12, 0, grupo);

  const terminal = new THREE.Group();
  terminal.position.set(10, 1.6, 8);
  caja(4, 2.4, 3, MATERIALES.metalOscuro, 0, 1.2, 0, terminal);
  plano(2.6, 1.4, MATERIALES.emisivoCian, 0, 1.5, 1.55, terminal);
  grupo.add(terminal);

  const luz = new THREE.PointLight(0xffb347, 1.1, 55, 2);
  luz.position.set(0, 9, 12);
  grupo.add(luz);

  const etiqueta = crearEtiqueta('Plataforma de lanzamiento');
  etiqueta.position.set(0, 34, 0);
  grupo.add(etiqueta);

  return grupo;
}

function crearHangar() {
  const grupo = new THREE.Group();
  colocarEn(grupo, 'hangar');
  marcarInteractivo(grupo, 'hangar');

  const pad = caja(42, 0.6, 56, MATERIALES.concreto, 0, 0.3, 0, grupo);
  marcarInteractivo(pad, 'hangar');

  caja(1.2, 28, 46, MATERIALES.concreto, -17, 14, 0, grupo);
  caja(1.2, 28, 46, MATERIALES.concreto, 17, 14, 0, grupo);
  caja(34, 28, 1.2, MATERIALES.concreto, 0, 14, -23, grupo);
  caja(36, 1.4, 48, MATERIALES.metalOscuro, 0, 28.3, 0, grupo);
  caja(34, 1, 46, MATERIALES.concretoOscuro, 0, 0.5, 0, grupo);

  caja(34, 2, 1.2, MATERIALES.metal, 0, 27.3, 23, grupo);
  caja(2, 28, 2, MATERIALES.metal, -17, 14, 23, grupo);
  caja(2, 28, 2, MATERIALES.metal, 17, 14, 23, grupo);
  caja(0.35, 24, 0.5, MATERIALES.metal, -6, 13, 23.2, grupo);
  caja(0.35, 24, 0.5, MATERIALES.metal, 6, 13, 23.2, grupo);

  for (const x of [-17.65, 17.65]) {
    for (let z = -16; z <= 16; z += 8) {
      plano(3.2, 2.2, MATERIALES.emisivoAzul, x, 19, z, grupo, x < 0 ? Math.PI / 2 : -Math.PI / 2);
    }
  }

  const cohete = new THREE.Group();
  cohete.position.set(0, 1, 0);
  cilindro(2.6, 2.9, 20, MATERIALES.blanco, 0, 10, 0, cohete, 24);
  cono(2.7, 5, MATERIALES.blanco, 0, 22.5, 0, cohete, 24);
  cilindro(2.95, 2.95, 2.2, MATERIALES.rojo, 0, 5, 0, cohete, 24);
  cilindro(2.95, 2.95, 1, MATERIALES.negro, 0, 14, 0, cohete, 24);
  for (let i = 0; i < 4; i += 1) {
    const angulo = (i / 4) * Math.PI * 2;
    const aleta = caja(0.5, 4.5, 2.6, MATERIALES.rojo, Math.cos(angulo) * 3.1, 3.5, Math.sin(angulo) * 3.1, cohete);
    aleta.rotation.y = -angulo;
  }
  grupo.add(cohete);

  for (const x of [-9, -3, 3, 9]) {
    caja(3.2, 0.25, 1.8, MATERIALES.metalOscuro, x, 1.6, 8, grupo);
    caja(0.3, 1.1, 1.4, MATERIALES.metal, x, 1, 8.2, grupo);
    plano(1.4, 1, MATERIALES.emisivoCian, x, 2.1, 8.95, grupo);
  }

  caja(30, 0.4, 0.6, MATERIALES.metal, 0, 24, 0, grupo);

  const luz = new THREE.PointLight(0xffd8a0, 1.3, 70, 2);
  luz.position.set(0, 17, 0);
  grupo.add(luz);

  const etiqueta = crearEtiqueta('Hangar de ensamblaje');
  etiqueta.position.set(0, 34, 0);
  grupo.add(etiqueta);

  return grupo;
}

function crearCentroControl() {
  const grupo = new THREE.Group();
  colocarEn(grupo, 'control');
  marcarInteractivo(grupo, 'control');

  const pad = caja(38, 0.6, 32, MATERIALES.concreto, 0, 0.3, 0, grupo);
  marcarInteractivo(pad, 'control');

  caja(30, 13, 24, MATERIALES.concreto, 0, 6.5, 0, grupo);
  caja(32, 0.8, 26, MATERIALES.metalOscuro, 0, 13.4, 0, grupo);
  caja(26, 7, 0.4, MATERIALES.vidrio, 0, 8, 12.1, grupo);

  const pantallas = [
    { material: MATERIALES.emisivoCian, x: -10.4 },
    { material: MATERIALES.emisivoAzul, x: -5.2 },
    { material: MATERIALES.emisivoCian, x: 0 },
    { material: MATERIALES.emisivoAzul, x: 5.2 },
    { material: MATERIALES.emisivoCian, x: 10.4 },
  ];
  pantallas.forEach(({ material, x }) => {
    plano(4.4, 3.2, material, x, 8, 12.35, grupo);
  });

  for (const x of [-15.2, 15.2]) {
    for (let z = -7; z <= 7; z += 7) {
      plano(3, 2.4, MATERIALES.emisivoAzul, x, 8, z, grupo, x < 0 ? Math.PI / 2 : -Math.PI / 2);
    }
  }

  cilindro(0.25, 0.25, 6, MATERIALES.metal, 10, 16.2, -7, grupo, 8);
  const antena = new THREE.Mesh(
    new THREE.CylinderGeometry(2.6, 0.4, 2, 20, 1, true),
    MATERIALES.metal,
  );
  antena.position.set(10, 19.4, -7);
  antena.rotation.x = -Math.PI / 3;
  grupo.add(antena);

  for (const x of [-9, -3, 3, 9]) {
    caja(3.4, 0.25, 1.8, MATERIALES.metalOscuro, x, 1.4, 17, grupo);
    caja(0.3, 1.2, 1.4, MATERIALES.metal, x, 0.8, 17.2, grupo);
    plano(1.5, 1, MATERIALES.emisivoCian, x, 2, 17.95, grupo);
  }

  const luz = new THREE.PointLight(0x4fbcff, 1.2, 60, 2);
  luz.position.set(0, 11, 16);
  grupo.add(luz);

  const etiqueta = crearEtiqueta('Centro de control de misiones');
  etiqueta.position.set(0, 22, 0);
  grupo.add(etiqueta);

  return grupo;
}

function crearEntrenamiento() {
  const grupo = new THREE.Group();
  colocarEn(grupo, 'entrenamiento');
  marcarInteractivo(grupo, 'entrenamiento');

  const pad = caja(38, 0.6, 32, MATERIALES.concreto, 0, 0.3, 0, grupo);
  marcarInteractivo(pad, 'entrenamiento');

  caja(24, 11, 18, MATERIALES.concreto, 0, 5.5, -3, grupo);
  caja(26, 0.8, 20, MATERIALES.metalOscuro, 0, 11.4, -3, grupo);
  caja(18, 4, 0.4, MATERIALES.vidrio, 0, 6.5, 6.1, grupo);
  caja(3, 4, 0.4, MATERIALES.metalOscuro, 0, 2, 6.15, grupo);

  const centrifuga = new THREE.Group();
  centrifuga.position.set(12, 0, 9);
  cilindro(4.5, 4.8, 1, MATERIALES.concretoOscuro, 0, 0.8, 0, centrifuga, 32);
  cilindro(0.5, 0.7, 8, MATERIALES.metal, 0, 4.8, 0, centrifuga, 12);
  const brazo = new THREE.Group();
  brazo.position.set(0, 8.6, 0);
  brazo.rotation.y = 0.6;
  caja(12, 0.5, 0.5, MATERIALES.metal, 0, 0, 0, brazo);
  const capsula = cilindro(1.2, 1.2, 2.4, MATERIALES.blanco, 6, 0, 0, brazo, 16);
  capsula.rotation.z = Math.PI / 2;
  caja(2, 1.6, 2, MATERIALES.metalOscuro, -6, 0, 0, brazo);
  centrifuga.add(brazo);
  grupo.add(centrifuga);

  const simulador = new THREE.Group();
  simulador.position.set(-12, 0, 9);
  caja(6, 0.5, 6, MATERIALES.concretoOscuro, 0, 0.55, 0, simulador);
  for (let i = 0; i < 4; i += 1) {
    const angulo = (i / 4) * Math.PI * 2;
    const pata = cilindro(0.28, 0.28, 3.2, MATERIALES.metal, Math.cos(angulo) * 2.1, 2, Math.sin(angulo) * 2.1, simulador, 8);
    pata.rotation.x = Math.PI / 9;
    pata.rotation.z = Math.PI / 9;
  }
  caja(4.4, 0.4, 4.4, MATERIALES.metalOscuro, 0, 3.6, 0, simulador);
  const cabina = cilindro(1.7, 1.7, 3.2, MATERIALES.blanco, 0, 5, 0, simulador, 16);
  cabina.rotation.z = Math.PI / 2;
  esfera(1.7, MATERIALES.vidrio, 1.6, 5, 0.9, simulador);
  grupo.add(simulador);

  const truss = new THREE.Group();
  truss.position.set(0, 0, 11);
  for (const x of [-1.5, 1.5]) {
    for (const z of [-1.5, 1.5]) {
      cilindro(0.18, 0.18, 6, MATERIALES.metal, x, 3, z, truss, 6);
    }
  }
  for (let y = 1; y <= 5; y += 2) {
    caja(3, 0.18, 0.18, MATERIALES.metal, 0, y, -1.5, truss);
    caja(3, 0.18, 0.18, MATERIALES.metal, 0, y, 1.5, truss);
    caja(0.18, 0.18, 3, MATERIALES.metal, -1.5, y, 0, truss);
    caja(0.18, 0.18, 3, MATERIALES.metal, 1.5, y, 0, truss);
  }
  grupo.add(truss);

  const luz = new THREE.PointLight(0xffffff, 1, 60, 2);
  luz.position.set(0, 12, 12);
  grupo.add(luz);

  const etiqueta = crearEtiqueta('Centro de entrenamiento');
  etiqueta.position.set(0, 18, 0);
  grupo.add(etiqueta);

  return grupo;
}

function crearFlotabilidad() {
  const grupo = new THREE.Group();
  colocarEn(grupo, 'flotabilidad');
  marcarInteractivo(grupo, 'flotabilidad');

  const deck = caja(42, 0.6, 32, MATERIALES.concreto, 0, 0.3, 0, grupo);
  marcarInteractivo(deck, 'flotabilidad');

  caja(30, 0.8, 20, MATERIALES.concretoOscuro, 0, 0.4, 0, grupo);
  caja(1.2, 3.2, 20, MATERIALES.concreto, -15, 1.6, 0, grupo);
  caja(1.2, 3.2, 20, MATERIALES.concreto, 15, 1.6, 0, grupo);
  caja(30, 3.2, 1.2, MATERIALES.concreto, 0, 1.6, -10, grupo);
  caja(30, 3.2, 1.2, MATERIALES.concreto, 0, 1.6, 10, grupo);

  caja(28.8, 2.4, 18.8, MATERIALES.agua, 0, 1.6, 0, grupo);

  const modulo = cilindro(2.4, 2.4, 9, MATERIALES.metal, 0, 1.4, -2, grupo, 20);
  modulo.rotation.z = Math.PI / 2;
  caja(6, 1.6, 3, MATERIALES.metalOscuro, 6, 1.2, 3, grupo);
  caja(4, 1.2, 2.4, MATERIALES.amarillo, -7, 1, 3.5, grupo);

  const astronauta = new THREE.Group();
  astronauta.position.set(0, 3, 4);
  esfera(0.55, MATERIALES.blanco, 0, 2.1, 0, astronauta, 16, 12);
  caja(0.9, 1.5, 0.6, MATERIALES.blanco, 0, 1, 0, astronauta);
  caja(1.1, 1.2, 0.5, MATERIALES.metalOscuro, 0, 1.1, -0.5, astronauta);
  caja(0.25, 1.2, 0.25, MATERIALES.blanco, -0.55, 1, 0, astronauta);
  caja(0.25, 1.2, 0.25, MATERIALES.blanco, 0.55, 1, 0, astronauta);
  caja(0.25, 1.1, 0.25, MATERIALES.blanco, -0.25, 0.2, 0, astronauta);
  caja(0.25, 1.1, 0.25, MATERIALES.blanco, 0.25, 0.2, 0, astronauta);
  grupo.add(astronauta);

  for (const x of [-18, 18]) {
    for (const z of [-14, 14]) {
      cilindro(0.5, 0.5, 16, MATERIALES.metal, x, 8, z, grupo, 10);
    }
  }
  for (const z of [-14, 0, 14]) {
    caja(38, 0.5, 0.7, MATERIALES.metal, 0, 16, z, grupo);
  }
  for (const x of [-18, 18]) {
    caja(0.7, 0.5, 30, MATERIALES.metal, x, 16, 0, grupo);
  }

  caja(6, 0.5, 11, MATERIALES.metalOscuro, 20, 3, 0, grupo);
  for (const z of [-5.5, 5.5]) {
    cilindro(0.15, 0.15, 2.4, MATERIALES.metal, 23, 4.2, z, grupo, 6);
  }
  caja(0.2, 1.2, 11, MATERIALES.metal, 23, 4.2, 0, grupo);

  const luz = new THREE.PointLight(0x7fe4ff, 1.2, 70, 2);
  luz.position.set(0, 13, 0);
  grupo.add(luz);

  const etiqueta = crearEtiqueta('Laboratorio de flotabilidad neutral');
  etiqueta.position.set(0, 22, 0);
  grupo.add(etiqueta);

  return grupo;
}

function crearAcademia() {
  const grupo = new THREE.Group();
  colocarEn(grupo, 'academia');
  marcarInteractivo(grupo, 'academia');

  const pad = caja(32, 0.6, 26, MATERIALES.concreto, 0, 0.3, 0, grupo);
  marcarInteractivo(pad, 'academia');

  caja(22, 9, 16, MATERIALES.concreto, 0, 4.5, 0, grupo);
  caja(24, 0.8, 18, MATERIALES.metalOscuro, 0, 9.4, 0, grupo);
  caja(16, 4, 0.4, MATERIALES.vidrio, 0, 5.5, 8.1, grupo);
  caja(3, 4, 0.4, MATERIALES.metalOscuro, 0, 2, 8.15, grupo);
  plano(6, 3, MATERIALES.emisivoAzul, -4, 6, 8.2, grupo);

  const sistema = new THREE.Group();
  sistema.position.set(0, 0, 15);
  cilindro(3, 3.4, 0.8, MATERIALES.concretoOscuro, 0, 0.4, 0, sistema, 24);
  cilindro(0.4, 0.4, 2.4, MATERIALES.metal, 0, 2, 0, sistema, 8);
  esfera(1.4, MATERIALES.emisivoAmbar, 0, 3.6, 0, sistema, 20, 16);
  for (const radio of [3.2, 4.6, 6]) {
    const orbita = new THREE.Mesh(new THREE.TorusGeometry(radio, 0.06, 6, 48), MATERIALES.metal);
    orbita.rotation.x = Math.PI / 2;
    orbita.position.y = 3.6;
    sistema.add(orbita);
  }
  const planetas = [
    { radio: 3.2, tamano: 0.38, color: MATERIALES.rojo, angulo: 0.8 },
    { radio: 4.6, tamano: 0.62, color: MATERIALES.azul, angulo: 2.4 },
    { radio: 6, tamano: 0.5, color: MATERIALES.amarillo, angulo: 4.2 },
  ];
  planetas.forEach(({ radio, tamano, color, angulo }) => {
    esfera(tamano, color, Math.cos(angulo) * radio, 3.6, Math.sin(angulo) * radio, sistema, 12, 10);
  });
  grupo.add(sistema);

  const luz = new THREE.PointLight(0xffe08a, 0.9, 50, 2);
  luz.position.set(0, 10, 12);
  grupo.add(luz);

  const etiqueta = crearEtiqueta('Academia Espacial Juvenil');
  etiqueta.position.set(0, 15, 0);
  grupo.add(etiqueta);

  return grupo;
}

export function crearInstalaciones(scene) {
  const grupo = new THREE.Group();
  grupo.add(crearPlataforma());
  grupo.add(crearHangar());
  grupo.add(crearCentroControl());
  grupo.add(crearEntrenamiento());
  grupo.add(crearFlotabilidad());
  grupo.add(crearAcademia());
  scene.add(grupo);
  return grupo;
}
