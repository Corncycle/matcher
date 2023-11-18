import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { clamp, BooleanDirection } from './util/util'
import { SLIPPERY_MATERIAL, createBasicBox } from './util/worldUtil'

export default class CameraControls {
  canvas: HTMLElement
  camera: THREE.Camera
  active: boolean
  horizontalNormal: THREE.Vector3
  movementVector: THREE.Vector3
  currentlyPressedDirection: BooleanDirection
  VERTICAL_RANGE: number
  panMultiplier: number
  body: CANNON.Body

  constructor(
    canvas: HTMLElement,
    camera: THREE.Camera,
    scene: THREE.Scene,
    world: CANNON.World
  ) {
    this.canvas = canvas
    this.camera = camera
    this.active = false
    this.horizontalNormal = new THREE.Vector3()
    this.movementVector = new THREE.Vector3()
    this.currentlyPressedDirection = {
      left: false,
      right: false,
      forward: false,
      back: false,
    }
    this.VERTICAL_RANGE = 0.9 * (Math.PI / 2)
    this.panMultiplier = 0.001
    this.camera.rotation.order = 'YXZ'

    const { body } = createBasicBox(2, 1.5, 2, 3, 2.5, 3, 1, SLIPPERY_MATERIAL)
    body.fixedRotation = true
    body.sleepSpeedLimit = 3
    body.updateMassProperties()
    console.log(body)
    this.body = body
    world.addBody(body)

    canvas.addEventListener('click', () => {
      canvas.requestPointerLock()
    })

    canvas.addEventListener('mousemove', (e: MouseEvent) => {
      this.handlePointerLockEvent(e)
    })

    window.addEventListener('keydown', (e) => {
      switch (e.key.toLowerCase()) {
        case 'arrowleft':
        case 'a':
          this.currentlyPressedDirection.left = true
          break
        case 'arrowright':
        case 'd':
          this.currentlyPressedDirection.right = true
          break
        case 'arrowup':
        case 'w':
          this.currentlyPressedDirection.forward = true
          break
        case 'arrowdown':
        case 's':
          this.currentlyPressedDirection.back = true
          break
      }
    })

    window.addEventListener('keyup', (e) => {
      switch (e.key.toLowerCase()) {
        case 'arrowleft':
        case 'a':
          this.currentlyPressedDirection.left = false
          break
        case 'arrowright':
        case 'd':
          this.currentlyPressedDirection.right = false
          break
        case 'arrowup':
        case 'w':
          this.currentlyPressedDirection.forward = false
          break
        case 'arrowdown':
        case 's':
          this.currentlyPressedDirection.back = false
          break
      }
    })

    window.addEventListener('pointerlockchange', () => {
      this.active = document.pointerLockElement === canvas
    })
  }

  clampView() {
    this.camera.rotation.x = clamp(
      this.camera.rotation.x,
      -this.VERTICAL_RANGE,
      this.VERTICAL_RANGE
    )
  }

  moveToBody() {
    this.camera.position.set(
      this.body.position.x,
      this.body.position.y,
      this.body.position.z
    )
  }

  handlePointerLockEvent(e: MouseEvent) {
    if (!this.active) {
      return
    }
    this.camera.rotation.y -= this.panMultiplier * e.movementX
    this.camera.rotation.x -= this.panMultiplier * e.movementY

    this.clampView()
  }

  updateHorizontal() {
    this.camera.getWorldDirection(this.horizontalNormal)
    this.horizontalNormal.y = 0
    this.horizontalNormal.normalize()
  }

  processKeyboardInput() {
    if (!this.active) {
      return
    }
    this.move(this.currentlyPressedDirection)
  }

  move(dir: BooleanDirection) {
    this.updateHorizontal()

    let lr = (dir.left ? -1 : 0) + (dir.right ? 1 : 0)
    let fb = (dir.back ? -1 : 0) + (dir.forward ? 1 : 0)

    if (lr === 0 && fb === 0) {
      this.body.velocity.set(0, this.body.velocity.y, 0)
      return
    }

    this.movementVector.x =
      fb * this.horizontalNormal.x - lr * this.horizontalNormal.z
    this.movementVector.z =
      fb * this.horizontalNormal.z + lr * this.horizontalNormal.x

    this.movementVector.normalize()

    this.body.velocity.set(
      this.movementVector.x * 3,
      this.body.velocity.y,
      this.movementVector.z * 3
    )
    // this.camera.position.add(this.movementVector.multiplyScalar(0.05))
  }
}
