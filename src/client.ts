import CannonDebugRenderer from './scripts/util/cannonDebugRenderer'
import SpaceManager from './scripts/classes/Space'
import { appleGroup } from './scripts/util/objects'
import Stats from 'three/examples/jsm/libs/stats.module'
import LevelManager from './scripts/classes/LevelManager'
import { wrapWithTransition } from './scripts/util/util'
import { modelLoadingScreen } from './scripts/util/modelLoading'

// ***** BEGIN SETUP *****

const space = new SpaceManager()
const levelManager = new LevelManager(space)

let cannonDebugRenderer: CannonDebugRenderer | null = null

const stats = new Stats()
document.body.appendChild(stats.dom)

levelManager.loadMenu()

declare global {
  interface Window {
    DEV_COMMANDS: any
  }
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Shift') {
    if (levelManager.canSkip) {
      levelManager.canSkip = false
      levelManager.goToSecondStage()
    }
  }
})

window.DEV_COMMANDS = () => {
  window.addEventListener('keydown', (e) => {
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
    } else if (e.key === 'c') {
      console.log(space.cameraControls.currentInput)
    } else if (e.key === '[') {
      cannonDebugRenderer = new CannonDebugRenderer(space.scene, space.world)
    } else if (e.key === 't') {
      space.levelManager?.overlayManager.slideOut()
    } else if (e.key === 'y') {
      space.levelManager?.overlayManager.fadeIn()
    } else if (e.key === 'k') {
      window.addEventListener('keydown', (e) => {
        if (e.key === '.') {
          // meshGroup.position.y = meshGroup.position.y - 0.01
        }
      })
    }
  })
}

window.DEV_COMMANDS()

modelLoadingScreen(() => {
  levelManager.overlayManager.endLoading()
})

setTimeout(() => {
  // levelManager.overlayManager.setMode(OverlayModes.INFO)
  // levelManager.loadLevel(2, objectSpec[2])
  // cannonDebugRenderer = new CannonDebugRenderer(space.scene, space.world)
}, 400)

// ****** END SETUP ******

function animate() {
  requestAnimationFrame(animate)

  space.updateCameraControls()
  space.physicsStep(1)
  space.render()

  stats.update()

  if (cannonDebugRenderer) {
    cannonDebugRenderer.update()
  }
}

animate()
