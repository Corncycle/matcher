import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import CameraControls from './CameraControls'
import { tableSpec } from '../util/level'
import LevelManager from './LevelManager'
import { CheckStates } from './ObjectChecker'

// Used to track the player's vision of objects and swap them on level 3,
// with logic to guarantee that not all objects can be placed correctly
export default class CheatManager {
  cameraControls: CameraControls
  tableToPlayer: THREE.Vector3[]
  tablePositions: THREE.Vector3[]
  tableColors: string[]
  levelManager: LevelManager
  // only call object switches on foundChange
  foundChange: boolean

  constructor(cameraControls: CameraControls, levelManager: LevelManager) {
    this.cameraControls = cameraControls
    this.levelManager = levelManager
    this.foundChange = false

    this.tableToPlayer = [
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]

    this.tablePositions = tableSpec[3].map(
      (tab) => new THREE.Vector3(tab[0], 1, tab[1])
    )

    this.tableColors = ['magenta', 'cyan', 'green', 'blue', 'red']
  }

  getGuaranteedNotVisibleTables() {
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
        out.add(this.tableColors[i])
      }
      if (dist < 2) {
        // if we're very close to a table, we won't be able to see the ones near us
        const leftNeighbor = (parseInt(i) + 4) % 5
        const rightNeighbor = (parseInt(i) + 1) % 5
        out.add(this.tableColors[leftNeighbor])
        out.add(this.tableColors[rightNeighbor])
      }
    }
    for (const color of this.tableColors) {
      if (out.has(color)) {
        const i = this.tableColors.indexOf(color as string)
        this.levelManager.space.dynamicObjects[i].checker.setState(
          CheckStates.VALID
        )
      } else {
        const i = this.tableColors.indexOf(color as string)
        this.levelManager.space.dynamicObjects[i].checker.setState(
          CheckStates.INVALID
        )
      }
    }

    if ([...out].length < 2) {
      console.log('OH NO')
    }
    return [...out]
  }
}
