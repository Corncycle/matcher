import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import CannonDebugRenderer from './scripts/util/cannonDebugRenderer'
import SpaceManager from './scripts/classes/Space'
import { createStaticGround } from './scripts/util/objects'
import Stats from 'three/examples/jsm/libs/stats.module'
import { loadLevel } from './scripts/util/level'
import { roughSizeOfObject } from './scripts/util/util'

// ***** BEGIN SETUP *****

const space = new SpaceManager()

const cannonDebugRenderer = new CannonDebugRenderer(space.scene, space.world)

const stats = new Stats()
document.body.appendChild(stats.dom)

loadLevel(space, 1)

window.addEventListener('keydown', (e) => {
  // reload
  if (e.key === 'r') {
    space.reset()
    loadLevel(space, 2)
    // memory profile
  } else if (e.key === 'm') {
    console.log(roughSizeOfObject(document))
  }
})

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

  cannonDebugRenderer.update()
}

animate()
