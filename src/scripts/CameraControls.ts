import * as THREE from 'three'
import { clamp, BooleanDirection } from './util'

export default class CameraControls {
  canvas: HTMLElement
  camera: THREE.Camera
  active: boolean
  horizontalNormal: THREE.Vector3
  movementVector: THREE.Vector3
  VERTICAL_RANGE: number
  panMultiplier: number

  constructor(
    canvas: HTMLElement,
    camera: THREE.Camera,
    VERTICAL_RANGE: number = 0.9 * (Math.PI / 2),
    panMultiplier: number = 0.001
  ) {
    this.canvas = canvas
    this.camera = camera
    this.active = false
    this.horizontalNormal = new THREE.Vector3()
    this.movementVector = new THREE.Vector3()
    this.VERTICAL_RANGE = VERTICAL_RANGE
    this.panMultiplier = panMultiplier
    this.camera.rotation.order = 'YXZ'

    canvas.addEventListener('click', () => {
      canvas.requestPointerLock()
    })

    canvas.addEventListener('mousemove', (e: MouseEvent) => {
      this.handlePointerLockEvent(e)
    })

    window.addEventListener('pointerlockchange', () => {
      console.log('pointerlock changed: ')
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

  move(dir: BooleanDirection) {
    this.updateHorizontal()

    let lr = (dir.left ? -1 : 0) + (dir.right ? 1 : 0)
    let fb = (dir.back ? -1 : 0) + (dir.forward ? 1 : 0)

    if (lr === 0 && fb === 0) {
      return
    }

    this.movementVector.x =
      fb * this.horizontalNormal.x - lr * this.horizontalNormal.z
    this.movementVector.z =
      fb * this.horizontalNormal.z + lr * this.horizontalNormal.x

    this.movementVector.normalize()

    this.camera.position.add(this.movementVector.multiplyScalar(0.05))
  }
}
