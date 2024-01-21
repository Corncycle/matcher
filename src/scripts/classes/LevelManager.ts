import {
  loadLevel,
  menuCameraPos,
  menuCameraQuat,
  spawnSpec,
} from '../util/level'
import DynamicObject from './DynamicObject'
import { CheckStates } from './ObjectChecker'
import PuzzleTrigger from './PuzzleTrigger'
import SpaceManager from './Space'
import * as CANNON from 'cannon-es'
import OverlayManager, { OverlayModes } from './text/OverlayManager'
import CheatManager from './CheatManager'
import CheatRecord from './CheatRecord'

export enum CompletenessStatuses {
  WIN = 'win',
  LOSE = 'lose',
  UNFINISHED = 'unfinished',
}
export default class LevelManager {
  inMenu: boolean

  // currentLevel is mostly used to detect level 3 so we can override functionality
  // default to -1
  currentLevel: number

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
  cheatManager?: CheatManager
  cheatRecord?: CheatRecord

  constructor(space: SpaceManager) {
    this.inMenu = true

    this.currentLevel = -1
    space.levelManager = this
    this.space = space
    this.triggerInventories = {}
    this.checkedInventories = {}
    this.triggers = []

    this.overlayManager = new OverlayManager(this)
  }

  loadMenu() {
    this.loadLevel(0)
    this.space.menuCamera.setRotationFromQuaternion(menuCameraQuat)
    this.space.menuCamera.position.set(
      menuCameraPos.x,
      menuCameraPos.y,
      menuCameraPos.z
    )
    this.inMenu = true
    document.exitPointerLock()
    this.overlayManager.setMode(OverlayModes.MAIN_MENU)
  }

  // load the preview on a timer, then load the main level
  loadTwoStageLevel(levelNumber: number) {
    this.loadPreviewLevel(levelNumber)
    this.overlayManager.setMode(OverlayModes.COUNTDOWN)
    setTimeout(() => {
      this.updateCheatingResources()
      const record = this.createCheatRecord()
      this.loadLevel(levelNumber)
      this.cheatRecord = record
      this.overlayManager.setMode(OverlayModes.INFO)
      this.overlayManager.setText(
        this.overlayManager.headerElm,
        'Match the objects to their positions!'
      )
    }, 5 * 1000)
  }

  loadPreviewLevel(levelNumber: number) {
    this.inMenu = false
    this.currentLevel = levelNumber
    this.cheatManager = undefined
    this.space.reset(
      spawnSpec[levelNumber as 1][0],
      spawnSpec[levelNumber as 1][1]
    )
    loadLevel(this.space, levelNumber, true)
    if (levelNumber === 3) {
      this.loadCheatingResources()
    }
  }

  loadLevel(levelNumber: number) {
    this.inMenu = false
    this.currentLevel = levelNumber
    this.cheatManager = undefined
    this.cheatRecord = undefined
    this.space.reset(
      spawnSpec[levelNumber as 1][0],
      spawnSpec[levelNumber as 1][1]
    )
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
        switch (this.checkForLevelCompletion()) {
          case CompletenessStatuses.WIN:
            this.winGameSequence()
            break
          case CompletenessStatuses.LOSE:
            this.loseGameSequence()
            break
          case CompletenessStatuses.UNFINISHED:
            break
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

  loadCheatingResources() {
    this.cheatManager = new CheatManager(
      this.space.cameraControls,
      this,
      this.space
    )
  }

  createCheatRecord() {
    if (this.cheatManager) {
      return new CheatRecord(
        this.cheatManager.notVisibleTableIds,
        this.cheatManager.dynamicObjectsByTableId.map((obj) => obj.id),
        this
      )
    }
  }

  // this should be called by the render loop
  updateCheatingResources() {
    if (this.cheatManager) {
      this.cheatManager.updateNotVisibleToTableIdsWithBuffer()
      if (this.cheatManager.foundChange) {
        this.cheatManager.doNotVisibleSwap()
      }
    }
  }

  logTriggerInventories() {
    let out = ''
    for (const id in this.triggerInventories) {
      out = out + `${id}: ` + `${Array.from(this.triggerInventories[id])}\n`
    }
    console.log(out)
  }

  validateObjectById(objId: number) {
    if (this.currentLevel === 3) {
      if (this.cheatRecord) {
        this.cheatRecord.validateObjectById(objId)
      } else {
        console.log(
          "Bad news: we should be using a cheat record for validation but we couldn't find one :("
        )
      }
      return
    }
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
    for (const obj of this.space.dynamicObjects) {
      if (obj.checker.state === CheckStates.INVALID) {
        return CompletenessStatuses.LOSE
      }
    }
    for (const id in this.checkedInventories) {
      if (this.checkedInventories[id].size === 0) {
        return CompletenessStatuses.UNFINISHED
      }
    }
    return CompletenessStatuses.WIN
  }

  disableGrabbingAllObjects() {
    for (const dynObj of this.space.dynamicObjects) {
      dynObj.isHoldable = false
    }
  }

  winGameSequence() {
    this.disableGrabbingAllObjects()
    setTimeout(() => {
      this.loadTwoStageLevel(this.currentLevel + 1)
    }, 5000)
  }

  loseGameSequence() {
    this.disableGrabbingAllObjects()
    setTimeout(() => {
      this.loadMenu()
    }, 5000)
  }
}
