import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import {
  carpetNormalTexture,
  carpetTexture,
  floorTexture,
  plasterNormalTexture,
  plasterTexture,
  tableLegTexture,
  tabletopTexture,
  woodTrimTexture,
  wpGreenNormalTexture,
  wpGreenTexture,
  wpPinkNormalTexture,
  wpPinkTexture,
  wpPurpleNormalTexture,
  wpPurpleTexture,
} from './textures'

// THREE MATERIALS
export const t_normalMaterial = new THREE.MeshNormalMaterial()
export const t_lambertMaterial = new THREE.MeshLambertMaterial({
  color: 0xff0000,
})

export enum TestColors {
  RED = 'red',
  GREEN = 'green',
  BLUE = 'blue',
  YELLOW = 'yellow',
  MAGENTA = 'magenta',
  CYAN = 'cyan',
}

export const testColoredMaterials = {
  red: new THREE.MeshLambertMaterial({ color: 0xff0000 }),
  green: new THREE.MeshLambertMaterial({ color: 0x00ff00 }),
  blue: new THREE.MeshLambertMaterial({ color: 0x0000ff }),
  yellow: new THREE.MeshLambertMaterial({ color: 0xffff00 }),
  magenta: new THREE.MeshLambertMaterial({ color: 0xff00ff }),
  cyan: new THREE.MeshLambertMaterial({ color: 0x00ffff }),
}

export const t_tabletopMaterial = new THREE.MeshStandardMaterial({
  map: tabletopTexture,
})
export const t_tableLegMaterial = new THREE.MeshStandardMaterial({
  map: tableLegTexture,
})
export const t_woodTrimMaterial = new THREE.MeshStandardMaterial({
  map: woodTrimTexture,
})
export const t_floorMaterial = new THREE.MeshLambertMaterial({
  map: floorTexture,
})
export const t_carpetMaterial = new THREE.MeshLambertMaterial({
  map: carpetTexture,
  normalMap: carpetNormalTexture,
})
t_carpetMaterial.normalScale.set(2, 2)

export const t_plasterMaterial = new THREE.MeshLambertMaterial({
  map: plasterTexture,
  normalMap: plasterNormalTexture,
})
t_plasterMaterial.normalScale.set(50, 50)

export const t_wpPinkMaterial = new THREE.MeshLambertMaterial({
  map: wpPinkTexture,
  normalMap: wpPinkNormalTexture,
})
t_wpPinkMaterial.normalScale.set(2, 2)

export const t_wpGreenMaterial = new THREE.MeshLambertMaterial({
  map: wpGreenTexture,
  normalMap: wpGreenNormalTexture,
})
t_wpGreenMaterial.normalScale.set(2, 2)

export const t_wpPurpleMaterial = new THREE.MeshLambertMaterial({
  map: wpPurpleTexture,
  normalMap: wpPurpleNormalTexture,
})
t_wpPurpleMaterial.normalScale.set(2, 2)

// CANNON MATERIALS
export const c_playerMaterial = new CANNON.Material()
export const c_basicMaterial = new CANNON.Material()
export const c_playerBasicContactMaterial = new CANNON.ContactMaterial(
  c_playerMaterial,
  c_basicMaterial,
  {
    friction: 0.0,
    restitution: 0,
    contactEquationStiffness: 1e9,
    contactEquationRelaxation: 4,
  }
)

export const c_basicBasicContactMaterial = new CANNON.ContactMaterial(
  c_basicMaterial,
  c_basicMaterial,
  {
    friction: 4,
    restitution: 0.25,
    contactEquationStiffness: 1e9,
    contactEquationRelaxation: 4,
  }
)
