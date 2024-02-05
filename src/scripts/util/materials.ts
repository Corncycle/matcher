import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import {
  floorTexture,
  tableLegTexture,
  tabletopTexture,
  wallTexture,
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

export const t_wallMaterial = new THREE.MeshToonMaterial({ map: wallTexture })
export const t_tabletopMaterial = new THREE.MeshToonMaterial({
  map: tabletopTexture,
})
t_tabletopMaterial.lightMapIntensity = 0
export const t_tableLegMaterial = new THREE.MeshToonMaterial({
  map: tableLegTexture,
})
export const t_floorMaterial = new THREE.MeshLambertMaterial({
  map: floorTexture,
})

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
