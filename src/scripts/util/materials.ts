import * as THREE from 'three'
import * as CANNON from 'cannon-es'

// THREE MATERIALS
export const t_normalMaterial = new THREE.MeshNormalMaterial()
export const t_lambertMaterial = new THREE.MeshLambertMaterial({color: 0xFF0000})

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
