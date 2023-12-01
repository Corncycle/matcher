import { loadLevel } from '../util/level'
import PuzzleObject from './PuzzleObject'
import SpaceManager from './Space'

export default class LevelManager {
  levelNumber: number
  puzzleObjects: Array<PuzzleObject>

  constructor(space: SpaceManager, levelNumber: number) {
    this.levelNumber = levelNumber
    this.puzzleObjects = []
    loadLevel(space, levelNumber)
  }
}
