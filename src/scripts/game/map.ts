import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { createBasicBox } from '../util/worldUtil'

export const createEmptyLevel = (
  threeScene: THREE.Scene,
  cannonWorld: CANNON.World
) => {
  const interiorWidth = 8
  const interiorLength = 8

  const levelData = [
    // walls
    [0, 0, 0, interiorWidth + 2, 4, 1],
    [0, 0, 0, 1, 4, interiorLength + 2],
    [interiorWidth + 1, 0, 0, interiorWidth + 2, 4, interiorLength + 2],
    [0, 0, interiorLength + 1, interiorWidth + 2, 4, interiorLength + 2],
    // floor and ceiling
    [0, -1, 0, interiorWidth + 2, 0, interiorLength + 2],
    [0, 3, 0, interiorWidth + 2, 4, interiorLength + 2],
  ]

  const room = new THREE.Object3D()
  for (const coords of levelData) {
    const { mesh, body } = createBasicBox(
      ...(coords as [number, number, number, number, number, number])
    )
    cannonWorld.addBody(body)

    room.add(mesh)
  }

  threeScene.add(room)

  return room
}
