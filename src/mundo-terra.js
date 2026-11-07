import * as THREE from 'three';
import { POSICIONES } from './coordenadas.js';

const MATERIAL_SUELO = new THREE.MeshStandardMaterial({ color: 0x1b3324, roughness: 0.98 });
const MATERIAL_PLAZA = new THREE.MeshStandardMaterial({ color: 0x89909a, roughness: 0.92 });
const MATERIAL_CAMINO = new THREE.MeshStandardMaterial({ color: 0x2b3038, roughness: 0.95 });
const MATERIAL_CERCA = new THREE.MeshStandardMaterial({ color: 0x6b7480, metalness: 0.5, roughness: 0.6 });
const MATERIAL_TRONCO = new THREE.MeshStandardMaterial({ color: 0x5a3a24, roughness: 1 });
const MATERIAL_COPA = new THREE.MeshStandardMaterial({ color: 0x2f6d42, roughness: 1 });

function crearCamino(desde, hasta, ancho, grupo) {
  const dx = hasta.x - desde.x;
  const dz = hasta.z - desde.z;
  const largo = Math.hypot(dx, dz);
  if (largo < 0.001) return;
  const camino = new THREE.Mesh(new THREE.BoxGeometry(ancho, 0.12, largo), MATERIAL_CAMINO);
  camino.position.set((desde.x + hasta.x) / 2, 0.06, (desde.z + hasta.z) / 2);
  camino.rotation.y = Math.atan2(dx, dz);
  camino.receiveShadow = true;
  grupo.add(camino);
}

function crearArbol(x, z, escala, grupo) {
  const arbol = new THREE.Group();
  const tronco = new THREE.Mesh(new THREE.CylinderGeometry(0.35 * escala, 0.5 * escala, 3.2 * escala, 6), MATERIAL_TRONCO);
  tronco.position.y = 1.6 * escala;
  const copa = new THREE.Mesh(new THREE.ConeGeometry(2.4 * escala, 7 * escala, 8), MATERIAL_COPA);
  copa.position.y = 6 * escala;
  tronco.castShadow = true;
  tronco.receiveShadow = true;
  copa.castShadow = true;
  copa.receiveShadow = true;
  arbol.add(tronco, copa);
  arbol.position.set(x, 0, z);
  grupo.add(arbol);
}

function crearCerca(grupo) {
  const ancho = 200;
  const largo = 230;
  const altura = 3.2;
  const paso = 12.5;
  const poste = new THREE.BoxGeometry(0.5, altura, 0.5);
  for (let x = -ancho / 2; x <= ancho / 2; x += paso) {
    for (const z of [-largo / 2, largo / 2]) {
      const p = new THREE.Mesh(poste, MATERIAL_CERCA);
      p.position.set(x, altura / 2, z);
      p.castShadow = true;
      grupo.add(p);
    }
  }
  for (let z = -largo / 2; z <= largo / 2; z += paso) {
    for (const x of [-ancho / 2, ancho / 2]) {
      const p = new THREE.Mesh(poste, MATERIAL_CERCA);
      p.position.set(x, altura / 2, z);
      p.castShadow = true;
      grupo.add(p);
    }
  }
  const rielX = new THREE.BoxGeometry(ancho, 0.25, 0.25);
  const rielZ = new THREE.BoxGeometry(0.25, 0.25, largo);
  for (const y of [1.2, 2.6]) {
    for (const z of [-largo / 2, largo / 2]) {
      const r = new THREE.Mesh(rielX, MATERIAL_CERCA);
      r.position.set(0, y, z);
      grupo.add(r);
    }
    for (const x of [-ancho / 2, ancho / 2]) {
      const r = new THREE.Mesh(rielZ, MATERIAL_CERCA);
      r.position.set(x, y, 0);
      grupo.add(r);
    }
  }
}

function crearEstrellas(grupo) {
  const total = 900;
  const posiciones = new Float32Array(total * 3);
  for (let i = 0; i < total; i += 1) {
    const angulo = Math.random() * Math.PI * 2;
    const radio = 160 + Math.random() * 140;
    const altura = 40 + Math.random() * 170;
    posiciones[i * 3] = Math.cos(angulo) * radio;
    posiciones[i * 3 + 1] = altura;
    posiciones[i * 3 + 2] = Math.sin(angulo) * radio;
  }
  const geometria = new THREE.BufferGeometry();
  geometria.setAttribute('position', new THREE.BufferAttribute(posiciones, 3));
  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.1,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.85,
    fog: false,
  });
  grupo.add(new THREE.Points(geometria, material));
}

function crearLuna(grupo) {
  const luna = new THREE.Mesh(
    new THREE.SphereGeometry(9, 32, 24),
    new THREE.MeshStandardMaterial({
      color: 0xcfd6df,
      roughness: 1,
      emissive: 0x1a2230,
      emissiveIntensity: 0.6,
    }),
  );
  luna.position.set(-150, 95, -240);
  grupo.add(luna);
}

export function crearMundoTerra(scene) {
  const grupo = new THREE.Group();

  const suelo = new THREE.Mesh(new THREE.PlaneGeometry(360, 360), MATERIAL_SUELO);
  suelo.rotation.x = -Math.PI / 2;
  suelo.receiveShadow = true;
  grupo.add(suelo);

  const plaza = new THREE.Mesh(new THREE.CircleGeometry(30, 64), MATERIAL_PLAZA);
  plaza.rotation.x = -Math.PI / 2;
  plaza.position.y = 0.03;
  plaza.receiveShadow = true;
  grupo.add(plaza);

  const anilloPlaza = new THREE.Mesh(
    new THREE.TorusGeometry(25, 0.35, 8, 64),
    new THREE.MeshStandardMaterial({
      color: 0x2f9fe0,
      emissive: 0x1d6fb0,
      emissiveIntensity: 0.8,
      roughness: 0.4,
    }),
  );
  anilloPlaza.rotation.x = Math.PI / 2;
  anilloPlaza.position.y = 0.08;
  grupo.add(anilloPlaza);

  const centro = new THREE.Vector3(0, 0, 0);
  Object.values(POSICIONES).forEach((posicion) => {
    crearCamino(centro, posicion, 5.5, grupo);
  });

  crearCerca(grupo);

  let semilla = 7;
  const aleatorio = () => {
    semilla = (semilla * 9301 + 49297) % 233280;
    return semilla / 233280;
  };
  for (let i = 0; i < 34; i += 1) {
    const angulo = aleatorio() * Math.PI * 2;
    const radio = 78 + aleatorio() * 58;
    const x = Math.cos(angulo) * radio;
    const z = Math.sin(angulo) * radio;
    const escala = 0.8 + aleatorio() * 0.9;
    crearArbol(x, z, escala, grupo);
  }

  crearEstrellas(grupo);
  crearLuna(grupo);

  scene.add(grupo);
  return grupo;
}
