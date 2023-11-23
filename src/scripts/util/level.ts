import * as THREE from "three"
import * as CANNON from "cannon-es"
import { createDynamicBall, createStaticBox } from "./objects"
import SpaceManager from "../classes/Space"

export function loadLevel(space: SpaceManager) {
  const roomSpecification = [
    [1, 3, 8, 0.5, 1.5, 4],
    [1, 3, 8, 7.5, 1.5, 4],
    [8, 3, 1, 4, 1.5, 0.5],
    [8, 3, 1, 4, 1.5, 7.5]
  ]

  const tableSpecification = [
    [0.8, 0.5, 0.8, 2, 0.25, 2]
  ]
  
  const collection = new THREE.Object3D()
  for (const spec of roomSpecification) {
    const { mesh, body } = createStaticBox(...(spec as [number, number, number, number, number, number]))
    space.addStaticObject({ mesh, body })
  }

  for (const spec of tableSpecification) {
    const { mesh, body } = createStaticBox(...(spec as [number, number, number, number, number, number]))
    space.addStaticObject({ mesh, body })
  }

  space.addDynamicObject(createDynamicBall(2, 4, 2, 0.2))

  space.cameraControls.body.position = new CANNON.Vec3(4, 2, 6)
}