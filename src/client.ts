import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import CannonDebugRenderer from './scripts/util/cannonDebugRenderer'
import SpaceManager from './scripts/classes/Space'
import {
  appleGroup,
  createStaticBox,
  createStaticGround,
} from './scripts/util/objects'
import Stats from 'three/examples/jsm/libs/stats.module'
import LevelManager from './scripts/classes/LevelManager'
import { wrapWithTransition } from './scripts/util/util'

// ***** BEGIN SETUP *****

const space = new SpaceManager()
const levelManager = new LevelManager(space)

let cannonDebugRenderer: CannonDebugRenderer | null = null

const stats = new Stats()
document.body.appendChild(stats.dom)

levelManager.loadMenu()

window.addEventListener('keydown', (e) => {
  // reload
  if (e.key === '1' || e.key === '2' || e.key === '3' || e.key === '0') {
    wrapWithTransition(levelManager, () => {
      space.reset()
      levelManager.loadTwoStageLevel(parseInt(e.key))
    })
  } else if (e.key === 'm') {
    levelManager.loadMenu()
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
  } else if (e.key === 'n') {
    appleGroup?.position.set(5, 3, 5)
    space.scene.add(appleGroup!)
  } else if (e.key === 'r') {
    console.log(space.dynamicObjects[1].body.quaternion)
  } else if (e.key === '[') {
    cannonDebugRenderer = new CannonDebugRenderer(space.scene, space.world)
  } else if (e.key === 't') {
    space.levelManager?.overlayManager.slideOut()
  } else if (e.key === 'y') {
    space.levelManager?.overlayManager.fadeIn()
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

  if (cannonDebugRenderer) {
    cannonDebugRenderer.update()
  }
}

animate()
