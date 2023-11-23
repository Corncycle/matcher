import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import CannonDebugRenderer from './scripts/util/cannonDebugRenderer'
import { c_basicMaterial } from './scripts/util/materials'
import SpaceManager from './scripts/classes/Space'
import {
  createDynamicBall,
  createStaticBox,
  createStaticGround,
} from './scripts/util/objects'
import Stats from 'three/examples/jsm/libs/stats.module'
import HeldObject from './scripts/classes/HeldObject'

// ***** BEGIN SETUP *****

const space = new SpaceManager()
space.cameraControls.space = space
const cannonDebugRenderer = new CannonDebugRenderer(space.scene, space.world)

// ****** END SETUP ******

// !!!!!!!! TEMPORARY OBJECT SETUP !!!!!!!!

space.addStaticObject(createStaticGround(0))

space.addStaticObject(createStaticBox(1, 3, 1, -2, 1, -2))
space.addStaticObject(createStaticBox(1, 2, 1, -1, 1, -2))

const { mesh: specialMesh, body: specialBody } = createDynamicBall(
  0,
  4,
  -3,
  0.2,
  1000
)
space.addDynamicObject({ mesh: specialMesh, body: specialBody })
const obj = new HeldObject(
  specialMesh,
  specialBody
)
space.cameraControls.heldObject = obj

const stats = new Stats()
document.body.appendChild(stats.dom)

// !!!!!!!! TEMPORARY OBJECT SETUP !!!!!!!!

function animate() {
  requestAnimationFrame(animate)

  space.updateCameraControls()
  space.physicsStep(3)
  space.render()

  stats.update()

  // cannonDebugRenderer.update()
}

animate()
