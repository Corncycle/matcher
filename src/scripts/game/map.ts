import * as THREE from 'three'
import { createBasicBoxMesh } from '../threeUtil'

export const createEmptyLevel = () => {
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
    room.add(
      createBasicBoxMesh(
        ...(coords as [number, number, number, number, number, number])
      )
    )
  }

  return room
}
