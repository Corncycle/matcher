import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { BooleanDirection } from './util/util'
import { basicMaterial } from './util/materials'

export default class CameraControls {
  camera: THREE.Camera
  active: boolean
  currentInput: BooleanDirection
  body: CANNON.Body

  constructor(
    canvas: HTMLElement,
    camera: THREE.Camera,
    scene: THREE.Scene,
    world: CANNON.World
  ) {
    this.camera = camera
    this.active = false
    this.currentInput = {
      left: false,
      right: false,
      forward: false,
      back: false,
    }

    const bodyShape = new CANNON.Cylinder(0.5, 0.5, 1.5, 10)
    const body = new CANNON.Body({ mass: 10, material: basicMaterial })
    body.addShape(bodyShape)
    body.position.y = 2
    body.position.z = 2
    body.fixedRotation = true
    body.updateMassProperties()
    world.addBody(body)
    this.body = body

    canvas.addEventListener('click', () => {
      canvas.requestPointerLock()
    })

    window.addEventListener('pointerlockchange', () => {
      this.active = document.pointerLockElement === canvas
    })

    window.addEventListener('mousemove', (e) => {
      this.handleMouseMove(e)
    })
    window.addEventListener('keydown', (e) => {
      this.handleKeyDown(e)
    })
    window.addEventListener('keyup', (e) => {
      this.handleKeyUp(e)
    })
  }

  handleMouseMove(e: MouseEvent) {
    // use e.movementX and e.movementY
  }

  handleKeyDown(e: KeyboardEvent) {
    switch (e.key.toLowerCase()) {
      case 'a':
        this.currentInput.left = true
        break
      case 'd':
        this.currentInput.right = true
        break
      case 'w':
        this.currentInput.forward = true
        break
      case 's':
        this.currentInput.back = true
        break
    }
  }

  handleKeyUp(e: KeyboardEvent) {
    switch (e.key.toLowerCase()) {
      case 'a':
        this.currentInput.left = false
        break
      case 'd':
        this.currentInput.right = false
        break
      case 'w':
        this.currentInput.forward = false
        break
      case 's':
        this.currentInput.back = false
        break
    }
  }

  setVelocityFromCurrentInput() {
    const x =
      (this.currentInput.left ? -1 : 0) + (this.currentInput.right ? 1 : 0)
    const z =
      (this.currentInput.forward ? -1 : 0) + (this.currentInput.back ? 1 : 0)
    let proposedVelocity = new CANNON.Vec3(x, 0, z)
    proposedVelocity.normalize()
    proposedVelocity = proposedVelocity.scale(3)
    proposedVelocity.y = this.body.velocity.y

    this.body.velocity = proposedVelocity
  }
}
