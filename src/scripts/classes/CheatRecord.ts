import * as THREE from 'three'
import DynamicObject from './DynamicObject'
import LevelManager from './LevelManager'
import { CheckStates } from './ObjectChecker'

// Used to store data from a CheatManager once a preview level expires
// Contains data and functionality for use in the gameplay portion of a cheated level
export default class CheatRecord {
  unseenTableIds: number[]
  dynamicObjectIdsByTableId: number[]
  levelManager: LevelManager

  constructor(
    unseenTableIds: number[],
    dynamicObjectsByTableId: number[],
    levelManager: LevelManager
  ) {
    this.unseenTableIds = unseenTableIds
    this.dynamicObjectIdsByTableId = dynamicObjectsByTableId
    this.levelManager = levelManager

    console.log(this.dynamicObjectIdsByTableId)
  }

  validateObjectById(objId: number) {
    const tableId = this.getTableIdForObj(objId)

    if (
      !this.unseenTableIds.includes(tableId) ||
      !this.unseenTableIds.includes(
        this.dynamicObjectIdsByTableId.indexOf(objId)
      )
    ) {
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
    console.log('ordinary validation')
    const obj = this.levelManager.space.dynamicObjects.find(
      (dynObj) => dynObj.id === objId
    )
    if (obj) {
      this.levelManager.checkedInventories[tableId].add(objId)
      if (this.dynamicObjectIdsByTableId[tableId] === objId) {
        obj.setCheckerState(CheckStates.VALID)
      } else {
        obj.setCheckerState(CheckStates.INVALID)
      }
    }
  }

  guaranteeValidValidation(objId: number, tableId: number) {
    console.log('guarantee validation')
    const obj = this.levelManager.space.dynamicObjects.find(
      (dynObj) => dynObj.id === objId
    )
    if (obj) {
      this.levelManager.checkedInventories[tableId].add(objId)
      obj.setCheckerState(CheckStates.VALID)
    }
  }

  guaranteeInvalidValidation(objId: number, tableId: number) {
    console.log('guarantee invalidation')
    const obj = this.levelManager.space.dynamicObjects.find(
      (dynObj) => dynObj.id === objId
    )
    if (obj) {
      this.levelManager.checkedInventories[tableId].add(objId)
      obj.setCheckerState(CheckStates.INVALID)
    }
  }
}
