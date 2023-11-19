import * as THREE from 'three'
import * as CANNON from 'cannon-es'

export const basicMaterial = new CANNON.Material()
export const basicContactMaterial = new CANNON.ContactMaterial(
  basicMaterial,
  basicMaterial,
  {
    friction: 0.0,
    restitution: 0,
    contactEquationStiffness: 1e9,
    contactEquationRelaxation: 4,
  }
)
