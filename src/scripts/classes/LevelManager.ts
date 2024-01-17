import { loadLevel } from '../util/level'
import DynamicObject from './DynamicObject'
import PuzzleTrigger from './PuzzleTrigger'
import SpaceManager from './Space'
import * as CANNON from 'cannon-es'

export default class LevelManager {
  space: SpaceManager
  triggers: PuzzleTrigger[]
  triggerInventories: { [key: number]: Set<number> }

  constructor(space: SpaceManager) {
    space.levelManager = this
    this.space = space
    this.triggerInventories = {}
    this.triggers = []
  }

  loadLevel(levelNumber: number) {
    const { tables } = loadLevel(this.space, levelNumber)
    this.triggers = tables.map((obj) => obj.trigger)
    this.triggerInventories = {}

    for (const obj of tables) {
      this.triggerInventories[obj.trigger.id] = new Set()
      obj.trigger.body.addEventListener(
        'collide',
        (e: { body: CANNON.Body }) => {
          const dynObj = this.space.getDynamicObjectByBody(e.body)
          if (dynObj) {
            this.triggerInventories[obj.trigger.id].add(dynObj.id)
            dynObj.showChecker()
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
            this.triggerInventories[tri.id].delete(dynObj.id)
            dynObj.hideChecker()
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
}
