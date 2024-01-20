import * as THREE from 'three'
import CameraControls from './CameraControls'
import { tableSpec } from '../util/level'
import LevelManager from './LevelManager'
import SpaceManager from './Space'
import DynamicObject from './DynamicObject'

// Used to track the player's vision of objects and swap them on level 3,
// with logic to guarantee that not all objects can be placed correctly
export default class CheatManager {
  cameraControls: CameraControls
  space: SpaceManager
  tableToPlayer: THREE.Vector3[]
  tablePositions: THREE.Vector3[]
  tableColors: string[]
  levelManager: LevelManager

  dynamicObjectsByTableId: DynamicObject[]

  notVisibleTableIds: number[]
  // only call object switches on foundChange
  foundChange: boolean

  // it's expensive to compute when we should swap objects, so only actually
  // do an update to notVisibleTableIds every `updateCallsBuffer` times we attempt
  updateCalls: number
  updateCallsBuffer = 10

  constructor(
    cameraControls: CameraControls,
    levelManager: LevelManager,
    space: SpaceManager
  ) {
    this.cameraControls = cameraControls
    this.levelManager = levelManager
    this.space = space

    this.notVisibleTableIds = []
    this.foundChange = false

    this.updateCalls = -1

    this.tableToPlayer = [
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]

    this.dynamicObjectsByTableId = [...this.space.dynamicObjects]

    this.tablePositions = tableSpec[3].map(
      (tab) => new THREE.Vector3(tab[0], 1, tab[1])
    )

    this.tableColors = ['magenta', 'cyan', 'green', 'blue', 'red']
  }

  updateNotVisibleToTableIdsWithBuffer() {
    this.foundChange = false

    this.updateCalls += 1
    this.updateCalls = this.updateCalls % this.updateCallsBuffer

    if (this.updateCalls === 0) {
      this.updateNotVisibleTableIds()
    }
  }

  updateNotVisibleTableIds() {
    const newIds = this.getGuaranteedNotVisibleTableIds()

    this.foundChange = false
    if (newIds.length !== this.notVisibleTableIds.length) {
      this.foundChange = true
    } else {
      for (let i = 0; i < newIds.length; i++) {
        if (newIds[i] !== this.notVisibleTableIds[i]) {
          this.foundChange = true
          break
        }
      }
    }

    this.notVisibleTableIds = newIds
  }

  doNotVisibleSwap() {
    if (this.notVisibleTableIds.length > 1) {
      const pool = [...this.notVisibleTableIds].sort(() => Math.random() - 0.5)
      const [i, j] = [pool[0], pool[1]]
      const [obji, objj] = [
        this.dynamicObjectsByTableId[i],
        this.dynamicObjectsByTableId[j],
      ]
      const [ix, iz] = [obji.body.position.x, obji.body.position.z]
      const [jx, jz] = [objj.body.position.x, objj.body.position.z]

      obji.body.position.x = jx
      obji.body.position.z = jz
      objj.body.position.x = ix
      objj.body.position.z = iz

      this.dynamicObjectsByTableId[j] = obji
      this.dynamicObjectsByTableId[i] = objj
    }
  }

  getGuaranteedNotVisibleTableIds() {
    const out = new Set()

    for (const i in this.tableToPlayer) {
      this.tableToPlayer[i].subVectors(
        this.cameraControls.camera.position,
        this.tablePositions[i]
      )
      const dist = this.tableToPlayer[i].length()
      this.tableToPlayer[i].normalize()
      const dot = this.tableToPlayer[i].dot(
        this.cameraControls.horizontalNormal
      )

      if (dot > 0.1 || (dist > 1 && dot > 0) || (dist > 3 && dot > -0.4)) {
        // if the table is out of our line of sight, we won't be able to see it
        out.add(parseInt(i))
      }
      if (dist < 2) {
        // if we're very close to a table, we won't be able to see the ones adjacent to us (because of walls)
        out.add((parseInt(i) + 4) % 5)
        out.add((parseInt(i) + 1) % 5)
      }
    }

    // stupid hack to prevent only one object being not visible sometimes, it's pretty hard to see the center "corridor" table
    if (
      this.cameraControls.camera.position.x < 4.5 ||
      this.cameraControls.camera.position.x > 8.5
    ) {
      out.add(0)
    }

    return [...out].sort() as number[]
  }
}
