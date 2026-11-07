import * as THREE from '../vendor/three.module.js';
import { MATERIALES, crearEtiqueta, caja, cilindro, esfera } from './instalaciones.js';

function crearArcoEntrada(grupo) {
  const arco = new THREE.Group();
  arco.position.set(0, 0, 88);
  caja(2.4, 11, 2.4, MATERIALES.concreto, -9, 5.5, 0, arco);
  caja(2.4, 11, 2.4, MATERIALES.concreto, 9, 5.5, 0, arco);
  caja(20.4, 1.8, 2.4, MATERIALES.metalOscuro, 0, 11, 0, arco);
  caja(0.4, 8, 0.4, MATERIALES.emisivoCian, -9, 6, 1.25, arco);
  caja(0.4, 8, 0.4, MATERIALES.emisivoCian, 9, 6, 1.25, arco);
  const etiqueta = crearEtiqueta('CENTRO ESPACIAL ORIÓN', '#7fe4ff', 22);
  etiqueta.position.set(0, 14.2, 0);
  arco.add(etiqueta);
  grupo.add(arco);
}

function crearBanderas(grupo) {
  const colores = [
    { color: 0x2f6fd0, emisivo: 0x123c80 },
    { color: 0x26b4d8, emisivo: 0x0b5a70 },
    { color: 0xf2f5f8, emisivo: 0x555b63 },
  ];
  [-21, 0, 21].forEach((x, indice) => {
    const palo = new THREE.Group();
    palo.position.set(x, 0, 82);
    cilindro(0.18, 0.22, 10, MATERIALES.metal, 0, 5, 0, palo, 8);
    esfera(0.32, MATERIALES.amarillo, 0, 10.2, 0, palo, 10, 8);
    const material = new THREE.MeshStandardMaterial({
      color: colores[indice].color,
      emissive: colores[indice].emisivo,
      emissiveIntensity: 0.4,
      side: THREE.DoubleSide,
      roughness: 0.8,
    });
    const tela = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 2.4), material);
    tela.position.set(2.2, 8.6, 0);
    palo.add(tela);
    grupo.add(palo);
  });
}

function crearFarolas(grupo) {
  const total = 10;
  for (let i = 0; i < total; i += 1) {
    const angulo = (i / total) * Math.PI * 2;
    const x = Math.cos(angulo) * 39;
    const z = Math.sin(angulo) * 39;
    const farola = new THREE.Group();
    farola.position.set(x, 0, z);
    cilindro(0.18, 0.24, 7, MATERIALES.metal, 0, 3.5, 0, farola, 8);
    esfera(0.42, MATERIALES.emisivoAmbar, 0, 7.2, 0, farola, 12, 10);
    if (i % 3 === 0) {
      const luz = new THREE.PointLight(0xffc46b, 0.7, 28, 2);
      luz.position.set(0, 7, 0);
      farola.add(luz);
    }
    grupo.add(farola);
  }
}

function crearMonumento(grupo) {
  const monumento = new THREE.Group();
  monumento.position.set(0, 0, 18);
  cilindro(4, 4.4, 1, MATERIALES.concretoOscuro, 0, 0.5, 0, monumento, 32);
  const anillo = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.3, 10, 48), MATERIALES.emisivoCian);
  anillo.rotation.x = Math.PI / 2;
  anillo.position.y = 2.6;
  monumento.add(anillo);
  const anilloVertical = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.22, 10, 48), MATERIALES.emisivoAzul);
  anilloVertical.position.y = 3.4;
  anilloVertical.rotation.y = 0.5;
  monumento.add(anilloVertical);
  esfera(1, MATERIALES.emisivoCian, 0, 3.4, 0, monumento, 20, 16);
  const etiqueta = crearEtiqueta('Orión', '#7fe4ff', 9);
  etiqueta.position.set(0, 7, 0);
  monumento.add(etiqueta);
  grupo.add(monumento);
}

function crearBancas(grupo) {
  const posiciones = [
    { x: 0, z: 32, giro: Math.PI },
    { x: -32, z: 0, giro: Math.PI / 2 },
    { x: 32, z: 0, giro: -Math.PI / 2 },
    { x: 0, z: -32, giro: 0 },
  ];
  posiciones.forEach(({ x, z, giro }) => {
    const banca = new THREE.Group();
    banca.position.set(x, 0, z);
    banca.rotation.y = giro;
    caja(4, 0.35, 1.3, MATERIALES.concretoOscuro, 0, 0.85, 0, banca);
    caja(4, 0.9, 0.25, MATERIALES.concretoOscuro, 0, 1.45, -0.55, banca);
    caja(0.3, 0.7, 1.1, MATERIALES.metal, -1.6, 0.35, 0, banca);
    caja(0.3, 0.7, 1.1, MATERIALES.metal, 1.6, 0.35, 0, banca);
    grupo.add(banca);
  });
}

export function crearDetallesComplejo(scene) {
  const grupo = new THREE.Group();
  crearArcoEntrada(grupo);
  crearBanderas(grupo);
  crearFarolas(grupo);
  crearMonumento(grupo);
  crearBancas(grupo);
  scene.add(grupo);
  return grupo;
}
