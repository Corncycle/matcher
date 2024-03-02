import {
  loadLevel,
  menuCameraPos,
  menuCameraQuat,
  objectSpec,
  spawnSpec,
  timeSpec,
} from '../util/level'
import { CheckStates } from './ObjectChecker'
import PuzzleTrigger from './PuzzleTrigger'
import SpaceManager from './Space'
import * as CANNON from 'cannon-es'
import { Howl } from 'howler'
import OverlayManager, { OverlayModes } from './text/OverlayManager'
import CheatManager from './CheatManager'
import CheatRecord from './CheatRecord'
import { wrapWithTransition } from '../util/util'

export enum CompletenessStatuses {
  WIN = 'win',
  LOSE = 'lose',
  UNFINISHED = 'unfinished',
}

export default class LevelManager {
  inMenu: boolean
  canSkip: boolean
  inPreview: boolean
  timeoutId: ReturnType<typeof setInterval> | undefined
  countdownAmount: number

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

  muted: boolean
  audioPlayer: Howl

  // do not tamper with this. this is only to be used so that the tab override to skip
  // the preview portion of a level knows which objects to spawn
  _objSpec: string[]

  constructor(space: SpaceManager) {
    this.inMenu = true
    this.inPreview = false
    this.canSkip = false

    this.currentLevel = -1
    space.levelManager = this
    this.space = space
    this.triggerInventories = {}
    this.checkedInventories = {}
    this.triggers = []

    this._objSpec = []

    this.overlayManager = new OverlayManager(this)

    this.countdownAmount = -1

    this.audioPlayer = new Howl({
      src: ['assets/audio/compressed-64.aac'],
      loop: true,
      volume: 0.25,
    })

    this.audioPlayer.play()
    this.muted = false
  }

  loadMenu() {
    this.loadLevel(0, [])
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
    if (this.timeoutId) {
      clearInterval(this.timeoutId)
      this.timeoutId = undefined
    }

    const objSpec = [...objectSpec[levelNumber as 1]]
    objSpec.sort((a, b) => 0.5 - Math.random())
    this.loadPreviewLevel(levelNumber, objSpec)
    this.overlayManager.setMode(OverlayModes.COUNTDOWN)
    this.overlayManager.suggestSkip()

    this._objSpec = objSpec
    this.countdownAmount = timeSpec[levelNumber as 1]

    setTimeout(() => {
      this.overlayManager.splashCountdown(this.countdownAmount)
      this.timeoutId = setInterval(() => {
        this.countdownAmount -= 1

        if (this.countdownAmount <= 0) {
          this.overlayManager.hideElm(this.overlayManager.countdownElm)
          this.goToSecondStage()
        } else {
          this.overlayManager.splashCountdown(this.countdownAmount)
        }
      }, 1000)
    }, 1500)
  }

  goToSecondStage() {
    this.inPreview = false
    this.canSkip = false
    if (this.timeoutId) {
      clearInterval(this.timeoutId)
      this.timeoutId = undefined
    }
    wrapWithTransition(this, () => {
      this.updateCheatingResources()
      const record = this.createCheatRecord()
      this.loadLevel(this.currentLevel, this._objSpec)
      this.cheatRecord = record
      this.overlayManager.setMode(OverlayModes.INFO)
      this.overlayManager.suggestNone()
    })
  }

  loadPreviewLevel(levelNumber: number, objSpec: string[]) {
    this.inMenu = false
    this.inPreview = true
    this.currentLevel = levelNumber
    this.cheatManager = undefined
    this.space.reset(
      spawnSpec[levelNumber as 1][0],
      spawnSpec[levelNumber as 1][1]
    )
    loadLevel(this.space, levelNumber, true, objSpec)
    setTimeout(() => {
      this.canSkip = true
      this.overlayManager.skipElm.style.opacity = '80%'
    }, 2000)
    if (levelNumber === 3) {
      this.loadCheatingResources()
    }
  }

  loadLevel(levelNumber: number, objSpec: string[]) {
    this.inMenu = false
    this.inPreview = false
    this.currentLevel = levelNumber
    this.cheatManager = undefined
    this.cheatRecord = undefined
    this.space.reset(
      spawnSpec[levelNumber as 1][0],
      spawnSpec[levelNumber as 1][1]
    )
    const { tables } = loadLevel(this.space, levelNumber, false, objSpec)
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
            dynObj.setCheckerState(CheckStates.CHECKING, this.muted)
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
            dynObj.setCheckerState(CheckStates.UNSET, this.muted)
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
            obj.setCheckerState(CheckStates.VALID, this.muted)
          } else {
            obj.setCheckerState(CheckStates.INVALID, this.muted)
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
    this.overlayManager.setMode(OverlayModes.CORRECT)
    setTimeout(() => {
      wrapWithTransition(this, () => {
        this.loadTwoStageLevel(this.currentLevel + 1)
      })
    }, 2000)
  }

  loseGameSequence() {
    this.disableGrabbingAllObjects()
    this.space.cameraControls.heldObject = null
    this.overlayManager.setMode(OverlayModes.INCORRECT)
    setTimeout(() => {
      wrapWithTransition(this, () => {
        for (const obj of this.space.dynamicObjects) {
          obj.setCheckerState(CheckStates.UNSET)
        }
        this.loadMenu()
      })
    }, 2000)
  }

  pauseAudio() {
    this.muted = true
    this.audioPlayer.pause()
  }

  playAudio() {
    this.muted = false
    this.audioPlayer.play()
  }
}
