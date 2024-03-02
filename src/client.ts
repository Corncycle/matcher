import CannonDebugRenderer from './scripts/util/cannonDebugRenderer'
import SpaceManager from './scripts/classes/Space'
import Stats from 'three/examples/jsm/libs/stats.module'
import LevelManager from './scripts/classes/LevelManager'
import { wrapWithTransition } from './scripts/util/util'
import { modelLoadingScreen } from './scripts/util/modelLoading'
import {
  createProps,
  createPuzzleObjects,
  objectSpec,
} from './scripts/util/level'
import { PropTypes } from './scripts/util/props'

// ***** BEGIN SETUP *****

const space = new SpaceManager()
const levelManager = new LevelManager(space)

let cannonDebugRenderer: CannonDebugRenderer | null = null

let stats: any

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
    } else if (e.key === 'c') {
      console.log(space.cameraControls.currentInput)
    } else if (e.key === '[') {
      cannonDebugRenderer = new CannonDebugRenderer(space.scene, space.world)
    } else if (e.key === 't') {
      space.levelManager?.overlayManager.slideOut()
    } else if (e.key === 'y') {
      space.levelManager?.overlayManager.fadeIn()
    } else if (e.key === 'z') {
      if (!stats) {
        stats = new Stats()
        document.querySelector('.matcher-container')?.appendChild(stats.dom)
      }
    }
  })
  return 'Dev commands enabled'
}

// window.DEV_COMMANDS()

modelLoadingScreen(() => {
  createProps(space, 0, [
    { type: PropTypes.LAMP, x: 5, z: -5, rotation: 0 },
    { type: PropTypes.DRESSER, x: 5, z: -5, rotation: 0 },
    { type: PropTypes.DRESSER, x: 5, z: -5, rotation: 0, color: 'washed' },
    { type: PropTypes.ARMCHAIR, x: 5, z: -5, rotation: 0 },
    { type: PropTypes.ARMCHAIR, x: 5, z: -5, rotation: 0, color: 'blue' },
    { type: PropTypes.ARMCHAIR, x: 5, z: -5, rotation: 0, color: 'pink' },
    { type: PropTypes.CHANDELIER, x: 5, z: -5, rotation: 0 },
    { type: PropTypes.RUG, x: 5, z: -5, rotation: 0, color: 'red' },
    { type: PropTypes.RUG, x: 5, z: -5, rotation: 0, color: 'blue' },
    { type: PropTypes.NIGHTSTAND, x: 5, z: -5, rotation: 0 },
    { type: PropTypes.NIGHTSTAND, x: 5, z: -5, rotation: 0, color: 'washed' },
    { type: PropTypes.GRANDFATHER_CLOCK, x: 5, z: -5, rotation: 0 },
  ])
  const testObj = createPuzzleObjects(space, 100, true, objectSpec[100])
  for (const obj of testObj) {
    space.addDynamicObject(obj)
  }
  levelManager.overlayManager.endLoading()
})

// setTimeout(() => {
//   levelManager.overlayManager.setMode(OverlayModes.INFO)
//   levelManager.loadLevel(2, objectSpec[2])
//   cannonDebugRenderer = new CannonDebugRenderer(space.scene, space.world)
// }, 400)

// ****** END SETUP ******

function animate() {
  requestAnimationFrame(animate)

  space.computeDelta()
  space.updateCameraControls()
  space.physicsStep(1)
  space.render()

  if (stats) {
    stats.update()
  }

  if (cannonDebugRenderer) {
    cannonDebugRenderer.update()
  }
}

animate()
