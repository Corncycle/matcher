import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { BooleanDirection, clamp } from '../util/util'
import { c_playerMaterial } from '../util/materials'
import HeldObject from './HeldObject'
import SpaceManager from './Space'
import Reticle from './Reticle'

export default class CameraControls {
  camera: THREE.Camera
  reticle: Reticle
  scene: THREE.Scene
  active: boolean
  currentInput: BooleanDirection
  body: CANNON.Body
  up: CANNON.Vec3
  contactNormal: CANNON.Vec3
  canJump: boolean

  // if cameracontrols should be able to interact (ie pick up and drop)
  // objects in its associated space, `space` MUST be defined externally
  space: SpaceManager | undefined

  horizontalNormal: THREE.Vector3
  heldObjectDestination: THREE.Vector3

  worldDirection: THREE.Vector3
  raycaster: THREE.Raycaster

  heldObject: HeldObject | null

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
    this.reticle = new Reticle(camera)
    this.scene = scene
    this.active = false
    this.currentInput = {
      left: false,
      right: false,
      forward: false,
      back: false,
    }
    this.up = new CANNON.Vec3(0, 1, 0)
    this.contactNormal = new CANNON.Vec3()
    this.canJump = true

    this.horizontalNormal = new THREE.Vector3(1, 0, 0)
    this.heldObjectDestination = new THREE.Vector3(0, 0, -1)

    this.worldDirection = new THREE.Vector3(0, 0, 0)
    this.raycaster = new THREE.Raycaster()

    this.heldObject = null

    // 90% of the full extent of vertical rotation
    this.VERTICAL_RANGE = 0.9 * (Math.PI / 2)
    this.PAN_MULTIPLIER = 0.001

    // rotation gets WACKY if we don't do this
    this.camera.rotation.order = 'YXZ'

    const bodyShape = new CANNON.Cylinder(bodyRadius, bodyRadius, 1.5, 10)
    const body = new CANNON.Body({ mass: 10, material: c_playerMaterial })
    body.addShape(bodyShape)
    body.position.y = 2
    body.position.z = 2
    body.fixedRotation = true
    body.updateMassProperties()
    world.addBody(body)
    this.body = body

    body.addEventListener('collide', (e: { contact: any }) => {
      const { contact } = e
      if (contact.bi.id === this.body.id) {
        contact.ni.negate(this.contactNormal)
      } else {
        this.contactNormal.copy(contact.ni)
      }

      if (this.contactNormal.dot(this.up) > 0.5) {
        this.canJump = true
      }
    })

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
      case ' ':
        this.attemptJump()
        break
      case 'e':
        this.interactWithObject()
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

  attemptJump() {
    if (!this.canJump) {
      return
    }
    this.body.velocity.set(this.body.velocity.x, 2, this.body.velocity.z)
    this.canJump = false
  }

  interactWithObject() {
    if (this.heldObject) {
      this.dropHeldObject()
      return
    }

    if (!this.space) {
      return
    }

    this.camera.getWorldDirection(this.worldDirection)
    this.raycaster.set(this.camera.position, this.worldDirection)

    const intersects = this.raycaster.intersectObjects(this.scene.children)
    const closestIntersection = intersects[0]

    if (closestIntersection.distance > 2) {
      return
    }

    this.heldObject = this.space.createHeldObjectByIntersection(intersects[0])

    if (this.heldObject) {
      this.reticle.setMode('ACTIVE')
    }
  }

  dropHeldObject() {
    if (!this.heldObject) {
      return
    }
    this.reticle.setMode('INACTIVE')
    this.heldObject = null
  }

  updateHorizontal() {
    this.camera.getWorldDirection(this.horizontalNormal)
    this.horizontalNormal.y = 0
    this.horizontalNormal.normalize()
  }

  updateHeldObjectDestination() {
    this.camera.getWorldDirection(this.heldObjectDestination)
    this.heldObjectDestination = this.heldObjectDestination.multiplyScalar(0.75)
    this.heldObjectDestination.add(this.camera.position)
    this.heldObjectDestination.y =
      clamp(
        this.heldObjectDestination.y,
        this.camera.position.y - 0.25,
        this.camera.position.y + 0.25
      ) - 0.05
  }

  updateHeldObject() {
    if (!this.heldObject) {
      return
    }

    this.updateHeldObjectDestination()

    this.heldObject.body.velocity.x =
      (this.heldObjectDestination.x - this.heldObject.body.position.x) * 10
    this.heldObject.body.velocity.y =
      (this.heldObjectDestination.y - this.heldObject.body.position.y) * 10
    this.heldObject.body.velocity.z =
      (this.heldObjectDestination.z - this.heldObject.body.position.z) * 10

    this.heldObject.body.angularVelocity.x = 0
    this.heldObject.body.angularVelocity.y = 0
    this.heldObject.body.angularVelocity.z = 0
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

  moveCameraToBody() {
    this.camera.position.set(
      this.body.position.x,
      this.body.position.y,
      this.body.position.z
    )
  }
}
