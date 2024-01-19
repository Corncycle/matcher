import { loadLevel } from '../util/level'
import DynamicObject from './DynamicObject'
import { CheckStates } from './ObjectChecker'
import PuzzleTrigger from './PuzzleTrigger'
import SpaceManager from './Space'
import * as CANNON from 'cannon-es'
import OverlayManager, { OverlayModes } from './text/OverlayManager'

export default class LevelManager {
  space: SpaceManager
  triggers: PuzzleTrigger[]
  // triggerInventories is the real-time inventory of trigger ids, containing the
  // ids of the puzzle objects in each trigger, updated as soon as a body enters
  // or exits the trigger
  triggerInventories: { [key: number]: Set<number> }
  // checkedInventories is similar, but only updates once the validity of the
  // object has been checked (so updates upon checker completing, or body leaving)
  checkedInventories: { [key: number]: Set<number> }

  overlayManager: OverlayManager

  constructor(space: SpaceManager) {
    space.levelManager = this
    this.space = space
    this.triggerInventories = {}
    this.checkedInventories = {}
    this.triggers = []

    this.overlayManager = new OverlayManager()
  }

  // load the preview on a timer, then load the main level
  loadTwoStageLevel(levelNumber: number) {
    this.loadPreviewLevel(levelNumber)
    this.overlayManager.setMode(OverlayModes.COUNTDOWN)
    setTimeout(() => {
      this.loadLevel(levelNumber)
      this.overlayManager.setMode(OverlayModes.INFO)
      this.overlayManager.setText(
        this.overlayManager.headerElm,
        'Match the objects to their positions!'
      )
    }, 5 * 1000)
  }

  loadPreviewLevel(levelNumber: number) {
    this.space.reset()
    loadLevel(this.space, levelNumber, true)
  }

  loadLevel(levelNumber: number) {
    this.space.reset()
    const { tables } = loadLevel(this.space, levelNumber, false)
    this.triggers = tables.map((obj) => obj.trigger)
    this.triggerInventories = {}
    this.checkedInventories = {}

    for (const dynObj of this.space.dynamicObjects) {
      // alert functions are called when the evaluation bar around an object
      // has fully filled in. when this happens, we should update the state of
      // the object's checker and check for a game win/loss
      dynObj.checker.alertFunction = (objToUpdateId: number) => {
        this.validateObjectById(objToUpdateId)
        console.log(
          `the level is${
            this.checkForLevelCompletion() ? '' : ' not'
          } completed`
        )
        if (this.checkForLevelCompletion()) {
          this.overlayManager.setText(
            this.overlayManager.headerElm,
            'Good job!'
          )
        }
      }
    }

    for (const obj of tables) {
      this.triggerInventories[obj.trigger.id] = new Set()
      this.checkedInventories[obj.trigger.id] = new Set()
      obj.trigger.body.addEventListener(
        'collide',
        (e: { body: CANNON.Body }) => {
          const dynObj = this.space.getDynamicObjectByBody(e.body)
          if (dynObj) {
            this.triggerInventories[obj.trigger.id].add(dynObj.id)
            dynObj.setCheckerState(CheckStates.CHECKING)
          }
        }
      )
    }

    this.space.world.addEventListener(
      'endContact',
      (e: { bodyA: CANNON.Body; bodyB: CANNON.Body }) => {
        let tri = this.triggers.find(
          (t) => t.body === e.bodyA || t.body === e.bodyB
        )
        if (tri) {
          let dynObj
          if (tri.body === e.bodyA) {
            dynObj = this.space.getDynamicObjectByBody(e.bodyB)
          } else {
            dynObj = this.space.getDynamicObjectByBody(e.bodyA)
          }

          // dynObj *should* always be defined here, but I've had it not happen before so
          if (dynObj) {
            this.checkedInventories[tri.id].delete(dynObj.id)
            this.triggerInventories[tri.id].delete(dynObj.id)
            dynObj.setCheckerState(CheckStates.UNSET)
          }
        }
      }
    )
  }

  logTriggerInventories() {
    let out = ''
    for (const id in this.triggerInventories) {
      out = out + `${id}: ` + `${Array.from(this.triggerInventories[id])}\n`
    }
    console.log(out)
  }

  validateObjectById(objId: number) {
    for (const id in this.triggerInventories) {
      if (this.triggerInventories[id].has(objId)) {
        const obj = this.space.dynamicObjects.find(
          (dynObj) => dynObj.id === objId
        )
        if (obj) {
          this.checkedInventories[id].add(objId)
          if (parseInt(id) === objId) {
            obj.setCheckerState(CheckStates.VALID)
          } else {
            obj.setCheckerState(CheckStates.INVALID)
          }
        }
      }
    }
  }

  findLocationOfObjectWithId(objId: number) {
    for (const id in this.triggerInventories) {
      if (this.triggerInventories[id].has(objId)) {
        return id
      }
    }
    return undefined
  }

  checkForLevelCompletion() {
    for (const id in this.checkedInventories) {
      if (!this.checkedInventories[id].has(parseInt(id))) {
        return false
      }
    }
    return true
  }
}
