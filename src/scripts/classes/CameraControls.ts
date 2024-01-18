import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { BooleanDirection, clamp } from '../util/util'
import { TestColors, c_playerMaterial } from '../util/materials'
import SpaceManager from './Space'
import Reticle, { ReticleDisplays } from './Reticle'
import DynamicObject from './DynamicObject'

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

  defaultBodyMass = 10

  // if cameracontrols should be able to interact (ie pick up and drop)
  // objects in its associated space, `space` MUST be defined externally
  space: SpaceManager | undefined

  horizontalNormal: THREE.Vector3
  heldObjectDestination: THREE.Vector3

  worldDirection: THREE.Vector3
  raycaster: THREE.Raycaster

  heldObject: DynamicObject | null | undefined

  VERTICAL_RANGE: number
  PAN_MULTIPLIER: number

  constructor(
    canvas: HTMLElement,
    camera: THREE.Camera,
    scene: THREE.Scene,
    world: CANNON.World,
    bodyRadius: number = 0.15
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

    // 92% of the full extent of vertical rotation
    this.VERTICAL_RANGE = 0.92 * (Math.PI / 2)
    this.PAN_MULTIPLIER = 0.001

    // rotation gets WACKY if we don't do this
    this.camera.rotation.order = 'YXZ'

    const bodyShape = new CANNON.Cylinder(bodyRadius, bodyRadius, 1.5, 10)
    const body = new CANNON.Body({
      mass: this.defaultBodyMass,
      material: c_playerMaterial,
    })
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

  getInteractableObjectInSight() {
    this.camera.getWorldDirection(this.worldDirection)
    this.raycaster.set(this.camera.position, this.worldDirection)

    const intersects = this.raycaster.intersectObjects(this.scene.children)
    const closestIntersection = intersects[0]

    if (!closestIntersection) {
      return null
    }

    if (closestIntersection.distance > 2) {
      return null
    }

    return this.space?.getDynamicObjectIfHoldable(intersects[0])
  }

  interactWithObject() {
    if (this.heldObject) {
      this.body.mass = this.defaultBodyMass // reset player mass when dropping object
      this.body.updateMassProperties()
      this.dropHeldObject()
      return
    }

    if (!this.space) {
      return
    }

    this.heldObject = this.getInteractableObjectInSight()

    if (this.heldObject) {
      this.body.mass = 1000 // make the player more massive while holding object so the held object can't push the player
      this.body.updateMassProperties()
      this.reticle.setMode(ReticleDisplays.ACTIVE)
      // this.heldObject.setColor(TestColors.RED)
    }
  }

  dropHeldObject() {
    if (this.heldObject) {
      // this.heldObject.setColor('native')
    }
    this.reticle.setMode(ReticleDisplays.INACTIVE)
    this.heldObject = null
  }

  updateHorizontal() {
    this.camera.getWorldDirection(this.horizontalNormal)
    this.horizontalNormal.y = 0
    this.horizontalNormal.normalize()
  }

  updateHeldObjectDestination() {
    this.camera.getWorldDirection(this.heldObjectDestination)
    const height = this.heldObjectDestination.y
    this.heldObjectDestination.y = 0
    this.heldObjectDestination.normalize()
    this.heldObjectDestination.y = clamp(height, -0.5, 0.5)
    this.heldObjectDestination = this.heldObjectDestination.multiplyScalar(0.75)
    this.heldObjectDestination.add(this.camera.position)
  }

  updateHeldObject() {
    if (!this.heldObject) {
      return
    }

    this.updateHeldObjectDestination()
    this.heldObject.updateAsHeldObject(this.camera, this.heldObjectDestination)
  }

  updateReticle() {
    if (this.heldObject) {
      this.reticle.setMode(ReticleDisplays.ACTIVE)
    } else if (this.getInteractableObjectInSight()) {
      this.reticle.setMode(ReticleDisplays.HOVER)
    } else {
      this.reticle.setMode(ReticleDisplays.INACTIVE)
    }
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

  reset(
    scene: THREE.Scene,
    camera: THREE.Camera,
    world: CANNON.World,
    bodyRadius: number = 0.15
  ) {
    this.camera = camera
    this.scene = scene
    this.reticle = new Reticle(camera)

    this.canJump = false

    this.heldObjectDestination = new THREE.Vector3(0, 0, -1)

    this.worldDirection = new THREE.Vector3(0, 0, 0)
    this.raycaster = new THREE.Raycaster()

    this.heldObject = null

    // 92% of the full extent of vertical rotation
    this.VERTICAL_RANGE = 0.92 * (Math.PI / 2)
    this.PAN_MULTIPLIER = 0.001

    // rotation gets WACKY if we don't do this
    this.camera.rotation.order = 'YXZ'

    const bodyShape = new CANNON.Cylinder(bodyRadius, bodyRadius, 1.5, 10)
    const body = new CANNON.Body({
      mass: this.defaultBodyMass,
      material: c_playerMaterial,
    })
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
  }
}
