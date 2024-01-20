import * as THREE from 'three'
import DynamicObject from './DynamicObject'
import LevelManager from './LevelManager'

// Used to store data from a CheatManager once a preview level expires
// Contains data and functionality for use in the gameplay portion of a cheated level
export default class CheatRecord {
  unseenTableIds: number[]
  dynamicObjectsByTableId: DynamicObject[]
  levelManager: LevelManager

  constructor(
    unseenTableIds: number[],
    dynamicObjectsByTableId: DynamicObject[],
    levelManager: LevelManager
  ) {
    this.unseenTableIds = unseenTableIds
    this.dynamicObjectsByTableId = dynamicObjectsByTableId
    this.levelManager = levelManager
  }

  validateObjectById(objId: number) {
    const tableId = this.getTableIdForObj(objId)

    if (!this.unseenTableIds.includes(tableId)) {
      this.ordinaryValidation(objId, tableId)
    } else {
      if (this.countUnseenAndEmptyTables() > 2) {
        this.guaranteeValidValidation(objId, tableId)
      } else {
        this.guaranteeInvalidValidation(objId, tableId)
      }
    }
  }

  getTableIdForObj(objId: number) {
    for (const tableId in this.levelManager.triggerInventories) {
      if (this.levelManager.triggerInventories[tableId].has(objId)) {
        return parseInt(tableId)
      }
    }
    return -1
  }

  countUnseenAndEmptyTables() {
    let out = 0
    for (const unseen of this.unseenTableIds) {
      if (
        this.levelManager.checkedInventories[unseen.toString() as any].size ===
        0
      ) {
        out += 1
      }
    }
    return out
  }

  ordinaryValidation(objId: number, tableId: number) {
    console.log('We would do an ordinary validation in this case')
  }

  guaranteeValidValidation(objId: number, tableId: number) {
    console.log('We would guarantee valid in this case')
  }

  guaranteeInvalidValidation(objId: number, tableId: number) {
    console.log('We would guarantee invalid in this case')
  }
}
