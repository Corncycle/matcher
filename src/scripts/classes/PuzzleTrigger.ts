import * as THREE from 'three'
import * as CANNON from 'cannon-es'

export default class PuzzleTrigger {
  body: CANNON.Body
  id: number

  constructor(
    width: number,
    height: number,
    length: number,
    x: number,
    y: number,
    z: number,
    rotation: number,
    id: number = -1
  ) {
    const c_axis = new CANNON.Vec3(0, 1, 0)

    const boxShape = new CANNON.Box(
      new CANNON.Vec3(width / 2, height / 2, length / 2)
    )
    this.body = new CANNON.Body({ isTrigger: true })
    this.body.addShape(boxShape)
    this.body.position.x = x
    this.body.position.y = y
    this.body.position.z = z

    this.body.quaternion.setFromAxisAngle(c_axis, rotation)

    this.body.addEventListener('collide', () => {
      console.log(`something entered trigger with id ${this.id}`)
    })

    this.id = id
  }
}
