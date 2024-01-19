import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import CannonDebugRenderer from './scripts/util/cannonDebugRenderer'
import SpaceManager from './scripts/classes/Space'
import { createStaticGround } from './scripts/util/objects'
import Stats from 'three/examples/jsm/libs/stats.module'
import { loadLevel } from './scripts/util/level'
import { roughSizeOfObject } from './scripts/util/util'
import LevelManager from './scripts/classes/LevelManager'

// ***** BEGIN SETUP *****

const space = new SpaceManager()
const levelManager = new LevelManager(space)

const cannonDebugRenderer = new CannonDebugRenderer(space.scene, space.world)

const stats = new Stats()
document.body.appendChild(stats.dom)

levelManager.loadTwoStageLevel(1)

window.addEventListener('keydown', (e) => {
  // reload
  if (e.key === '1' || e.key === '2' || e.key === '3') {
    space.reset()
    levelManager.loadLevel(parseInt(e.key))
    // memory profile
  } else if (e.key === 'm') {
    console.log(roughSizeOfObject(space))
  } else if (e.key === 'p') {
    console.log(
      `Current camera position: ${space.cameraControls.camera.position.x.toFixed(
        2
      )}, ${space.cameraControls.camera.position.y.toFixed(
        2
      )}, ${space.cameraControls.camera.position.z.toFixed(2)}`
    )
    console.log(space.cameraControls)
  } else if (e.key === 'i') {
    levelManager.logTriggerInventories()
  }
})

// const light = new THREE.PointLight(0xffffff, 1000)
// light.position.set(4, 10, 4)
// space.scene.add(light)

// ****** END SETUP ******

function animate() {
  requestAnimationFrame(animate)

  space.updateCameraControls()
  space.physicsStep(2)
  space.render()

  stats.update()

  // cannonDebugRenderer.update()
}

animate()
