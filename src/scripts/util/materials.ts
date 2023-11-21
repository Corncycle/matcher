import * as THREE from 'three'
import * as CANNON from 'cannon-es'

export const normalMaterial = new THREE.MeshNormalMaterial()

export const playerMaterial = new CANNON.Material()
export const basicMaterial = new CANNON.Material()
export const playerBasicContactMaterial = new CANNON.ContactMaterial(
  playerMaterial,
  basicMaterial,
  {
    friction: 0.0,
    restitution: 0,
    contactEquationStiffness: 1e9,
    contactEquationRelaxation: 4,
  }
)
