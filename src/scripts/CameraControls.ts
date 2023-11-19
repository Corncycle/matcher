import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { BooleanDirection, clamp } from './util/util'
import { basicMaterial } from './util/materials'

export default class CameraControls {
  camera: THREE.Camera
  active: boolean
  currentInput: BooleanDirection
  body: CANNON.Body
  horizontalNormal: THREE.Vector3

  VERTICAL_RANGE: number
  PAN_MULTIPLIER: number

  constructor(
    canvas: HTMLElement,
    camera: THREE.Camera,
    scene: THREE.Scene,
    world: CANNON.World,
    bodyRadius: number = 0.2
  ) {
    this.camera = camera
    this.active = false
    this.currentInput = {
      left: false,
      right: false,
      forward: false,
      back: false,
    }
    this.horizontalNormal = new THREE.Vector3(1, 0, 0)

    // 90% of the full extent of vertical rotation
    this.VERTICAL_RANGE = 0.9 * (Math.PI / 2)
    this.PAN_MULTIPLIER = 0.001

    // rotation gets WACKY if we don't do this
    this.camera.rotation.order = 'YXZ'

    const bodyShape = new CANNON.Cylinder(bodyRadius, bodyRadius, 1.5, 10)
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

  clampView() {
    this.camera.rotation.x = clamp(
      this.camera.rotation.x,
      -this.VERTICAL_RANGE,
      this.VERTICAL_RANGE
    )
  }

  handleMouseMove(e: MouseEvent) {
    // use e.movementX and e.movementY
    if (!this.active) {
      return
    }
    this.camera.rotation.y -= this.PAN_MULTIPLIER * e.movementX
    this.camera.rotation.x -= this.PAN_MULTIPLIER * e.movementY

    this.clampView()
    this.updateHorizontal()
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

  updateHorizontal() {
    this.camera.getWorldDirection(this.horizontalNormal)
    this.horizontalNormal.y = 0
    this.horizontalNormal.normalize()
  }

  setVelocityFromCurrentInput() {
    if (!this.active) {
      this.body.velocity.set(0, this.body.velocity.y, 0)
      return
    }

    const lr =
      (this.currentInput.left ? -1 : 0) + (this.currentInput.right ? 1 : 0)
    const fb =
      (this.currentInput.forward ? 1 : 0) + (this.currentInput.back ? -1 : 0)

    if (lr === 0 && fb === 0) {
      this.body.velocity.set(0, this.body.velocity.y, 0)
      return
    }

    let proposedVelocity = new CANNON.Vec3(
      fb * this.horizontalNormal.x - lr * this.horizontalNormal.z,
      0,
      fb * this.horizontalNormal.z + lr * this.horizontalNormal.x
    )
    proposedVelocity.normalize()
    proposedVelocity = proposedVelocity.scale(3)
    proposedVelocity.y = this.body.velocity.y

    this.body.velocity = proposedVelocity
  }
}
