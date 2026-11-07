export const POSICIONES = {
  plataforma: { x: 0, y: 0, z: -52 },
  hangar: { x: -54, y: 0, z: -4 },
  control: { x: 54, y: 0, z: -4 },
  entrenamiento: { x: -54, y: 0, z: 38 },
  flotabilidad: { x: 54, y: 0, z: 38 },
  academia: { x: 0, y: 0, z: 54 },
  orion: { x: -72, y: 0, z: -64 },
  crew_dragon: { x: -26, y: 0, z: -80 },
  starship: { x: 26, y: 0, z: -80 },
  saturn_v: { x: 72, y: 0, z: -64 },
};

export function obtenerPosicion(clave) {
  const posicion = POSICIONES[clave];
  if (!posicion) {
    throw new Error(`Posición desconocida: ${clave}`);
  }
  return posicion;
}

export function colocarEn(objeto, clave) {
  const posicion = obtenerPosicion(clave);
  objeto.position.set(posicion.x, posicion.y, posicion.z);
  return objeto;
}
