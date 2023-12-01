import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import CannonDebugRenderer from './scripts/util/cannonDebugRenderer'
import SpaceManager from './scripts/classes/Space'
import { createStaticGround } from './scripts/util/objects'
import Stats from 'three/examples/jsm/libs/stats.module'
import { loadLevel } from './scripts/util/level'

// ***** BEGIN SETUP *****

const space = new SpaceManager()
space.cameraControls.space = space
const cannonDebugRenderer = new CannonDebugRenderer(space.scene, space.world)

space.addStaticObject(createStaticGround(0))

const stats = new Stats()
document.body.appendChild(stats.dom)

loadLevel(space, 1)

// const light = new THREE.PointLight(0xffffff, 1000)
// light.position.set(4, 10, 4)
// space.scene.add(light)

// ****** END SETUP ******

function animate() {
  requestAnimationFrame(animate)

  space.updateCameraControls()
  space.physicsStep(3)
  space.render()

  stats.update()

  // cannonDebugRenderer.update()
}

animate()
