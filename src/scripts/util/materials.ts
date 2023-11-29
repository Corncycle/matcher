import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { setTexture, wallTexture } from './textures'

// THREE MATERIALS
export const t_normalMaterial = new THREE.MeshNormalMaterial()
export const t_lambertMaterial = new THREE.MeshLambertMaterial({
  color: 0xff0000,
})

export const t_wallMaterial = new THREE.MeshToonMaterial()
setTexture(t_wallMaterial, wallTexture)

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
