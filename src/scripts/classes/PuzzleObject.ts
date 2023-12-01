import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { createDynamicBall } from '../util/objects'

export default class PuzzleObject {
  mesh: THREE.Mesh
  body: CANNON.Body
  name: string
  baseColor: string

  constructor(name: string, x: number, y: number, z: number) {
    this.name = name
    this.baseColor =
      { apple: 'red', banana: 'yellow', grapes: 'magenta' }[name] || 'green'
    const { mesh, body } = createDynamicBall(0.15, x, y, z, 1, this.baseColor)
    this.mesh = mesh
    this.body = body
  }
}
