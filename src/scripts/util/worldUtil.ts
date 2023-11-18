import * as THREE from 'three'
import * as CANNON from 'cannon-es'

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial = new THREE.MeshNormalMaterial()

export const SLIPPERY_MATERIAL = new CANNON.Material('slippery')
export const GROUND_MATERIAL = new CANNON.Material('ground')

export const SLIPPERY_GROUND = new CANNON.ContactMaterial(
  GROUND_MATERIAL,
  SLIPPERY_MATERIAL,
  {
    friction: 0,
    restitution: 0.3,
    contactEquationStiffness: 1e8,
    contactEquationRelaxation: 3,
  }
)

export const SLIPPERY_SLIPPERY = new CANNON.ContactMaterial(
  SLIPPERY_MATERIAL,
  SLIPPERY_MATERIAL,
  {
    friction: 0,
    restitution: 0.3,
    contactEquationStiffness: 1e8,
    contactEquationRelaxation: 3,
  }
)

export const createBasicBox = (
  xStart: number,
  yStart: number,
  zStart: number,
  xEnd: number,
  yEnd: number,
  zEnd: number,
  mass?: number | undefined,
  material?: CANNON.Material | undefined
) => {
  const mesh = new THREE.Mesh(cubeGeometry, cubeMaterial)
  mesh.scale.x = xEnd - xStart
  mesh.scale.y = yEnd - yStart
  mesh.scale.z = zEnd - zStart

  mesh.position.x = (xStart + xEnd) / 2
  mesh.position.y = (yStart + yEnd) / 2
  mesh.position.z = (zStart + zEnd) / 2

  const shape = new CANNON.Box(
    new CANNON.Vec3(
      (xEnd - xStart) / 2,
      (yEnd - yStart) / 2,
      (zEnd - zStart) / 2
    )
  )
  const body = new CANNON.Body({
    mass,
    material: SLIPPERY_MATERIAL,
  })
  body.updateMassProperties()
  body.addShape(shape)

  body.position.x = mesh.position.x
  body.position.y = mesh.position.y
  body.position.z = mesh.position.z

  return { mesh, body }
}
