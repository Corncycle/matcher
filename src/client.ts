import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import CannonDebugRenderer from './scripts/util/cannonDebugRenderer'
import { basicMaterial } from './scripts/util/materials'
import SpaceManager from './scripts/classes/Space'
import {
  createDynamicBall,
  createStaticBox,
  createStaticGround,
} from './scripts/util/objects'
import Stats from 'three/examples/jsm/libs/stats.module'

// ***** BEGIN SETUP *****

const space = new SpaceManager()
const cannonDebugRenderer = new CannonDebugRenderer(space.scene, space.world)

// ****** END SETUP ******

// !!!!!!!! TEMPORARY OBJECT SETUP !!!!!!!!

space.addStaticObject(createStaticGround(0))

space.addStaticObject(createStaticBox(1, 3, 1, -2, 1, -2))
space.addStaticObject(createStaticBox(1, 2, 1, -1, 1, -2))

for (let i = 0; i < 10; i++) {
  const { mesh, body } = createDynamicBall(
    Math.random() * 5 - 2,
    Math.random() * 10 + 10,
    Math.random() * 5 - 2
  )
  space.addDynamicObject({ mesh, body })
}

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
