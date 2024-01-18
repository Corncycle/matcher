import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import {
  TestShapes,
  createDynamicBall,
  createDynamicBox,
  createDynamicObject,
  createStaticBox,
  createStaticFloor,
  createStaticTable,
  createStaticWall,
  createTableWithTrigger,
} from './objects'
import SpaceManager from '../classes/Space'
import { TestColors } from './materials'

// specify the walls for the level
const wallSpec = {
  1: [
    [1, 3, 6, 0.5, 1.5, 4],
    [1, 3, 6, 7.5, 1.5, 4],
    [6, 3, 1, 4, 1.5, 0.5],
    [6, 3, 1, 4, 1.5, 7.5],
  ],
  2: [
    [1, 3, 7, 0.5, 1.5, 4.5],
    [4, 3, 1, 3, 1.5, 8.5],
    [7, 3, 1, 4.5, 1.5, 0.5],
    [3, 3, 3, 6.5, 1.5, 6.5],
    [1, 3, 4, 8.5, 1.5, 3],
  ],
}

// specify the position/rotation of the tables in the level
const tableSpec = {
  1: [
    [1.5, 6.5, 0],
    [2.5, 1.5, Math.PI],
    [6.5, 3.5, (3 * Math.PI) / 2],
  ],
  2: [
    [1.5, 7.5, 0],
    [2.5, 1.5, Math.PI],
    [7, 4.5, Math.PI],
    [7.5, 1.5, (3 * Math.PI) / 2],
  ],
}

// specify the objects to be used in the level. must have the same length as the corresponding tableSpec
const objectSpec = {
  1: [
    { color: TestColors.MAGENTA, shape: TestShapes.BALL },
    { color: TestColors.CYAN, shape: TestShapes.BOX },
    { color: TestColors.GREEN, shape: TestShapes.BOX },
  ],
  2: [
    { color: TestColors.MAGENTA, shape: TestShapes.BALL },
    { color: TestColors.CYAN, shape: TestShapes.BOX },
    { color: TestColors.GREEN, shape: TestShapes.BOX },
    { color: TestColors.BLUE, shape: TestShapes.BALL },
  ],
}

// this function should only really be used by LevelManager, because it keeps track of triggers/objects
export function loadLevel(
  space: SpaceManager,
  levelNumber: number = 1,
  isPreview: boolean = false
) {
  const walls = createWalls(space, levelNumber)
  const floor = createFloor(space, levelNumber)
  const lights = createLights(space, levelNumber)
  const tables = createTables(space, levelNumber, isPreview)
  const puzzleObjects = createPuzzleObjects(space, levelNumber, isPreview)
  for (const obj of puzzleObjects) {
    space.addDynamicObject(obj)
  }
  setCameraPosition(space, levelNumber)

  space.cameraControls.body.position = new CANNON.Vec3(4, 2, 6)

  return { walls, floor, lights, tables, puzzleObjects }
}

function createWalls(space: SpaceManager, levelNumber: number = 1) {
  const walls = []
  for (const wall of wallSpec[levelNumber as 1]) {
    const { mesh, body } = createStaticWall(
      ...(wall as [number, number, number, number, number, number])
    )
    space.addObject({ mesh, body })
    walls.push({ mesh, body })
  }

  return walls
}

function createFloor(space: SpaceManager, levelNumber: number = 1) {
  const floorSpec = {
    1: [1, 1, 7, 7],
    2: [1, 1, 8, 8],
  }

  const { mesh, body } = createStaticFloor(
    ...(floorSpec[levelNumber as 1] as [number, number, number, number])
  )
  space.addObject({ mesh, body })

  return [{ mesh, body }]
}

function createLights(space: SpaceManager, levelNumber: number = 1) {
  return null
}

function createTables(
  space: SpaceManager,
  levelNumber: number = 1,
  isPreview: boolean = false
) {
  const tables = []
  for (const i in tableSpec[levelNumber as 1]) {
    const { mesh, body, trigger } = createTableWithTrigger(
      ...(tableSpec[levelNumber as 1][i] as [number, number, number]),
      parseInt(i) + 1
    )
    space.addObject({ mesh, body })
    if (!isPreview) {
      space.addTrigger(trigger.body)
    }
    tables.push({ mesh, body, trigger })
  }

  return tables
}

function createPuzzleObjects(
  space: SpaceManager,
  levelNumber: number = 1,
  isPreview: boolean = false
) {
  const objects = []
  for (const i in objectSpec[levelNumber as 1]) {
    const { color, shape } = objectSpec[levelNumber as 1][i]
    objects.push(
      createDynamicObject(
        4,
        2 + parseInt(i),
        4,
        shape,
        color,
        parseInt(i) + 1,
        !isPreview
      )
    )
  }
  return objects
}

function setCameraPosition(space: SpaceManager, levelNumber: number = 1) {}
