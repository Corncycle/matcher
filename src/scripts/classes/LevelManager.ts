import { loadLevel } from '../util/level'
import DynamicObject from './DynamicObject'
import SpaceManager from './Space'

export default class LevelManager {
  levelNumber: number
  puzzleObjects: DynamicObject[]

  constructor(space: SpaceManager, levelNumber: number) {
    this.levelNumber = levelNumber
    this.puzzleObjects = []
    loadLevel(space, levelNumber)
  }
}
