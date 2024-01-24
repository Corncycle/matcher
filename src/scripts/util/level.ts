import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import {
  PredefinedObjects,
  TestShapes,
  createDynamicBall,
  createDynamicBox,
  createDynamicObject,
  createPredefinedDynamicObject,
  createStaticBox,
  createStaticFloor,
  createStaticTable,
  createStaticWall,
  createTableWithTrigger,
} from './objects'
import SpaceManager from '../classes/Space'
import { TestColors } from './materials'

// offset to make sure tables are pushed up against walls
const TABLE_FIXER = 0.18

export const menuCameraPos = new THREE.Vector3(1.19, 0.75, 2.2)
export const menuCameraQuat = new THREE.Quaternion(
  -0.005989410996304606,
  -0.8387082217636656,
  -0.00922616256429222,
  0.5444699474041562
)

// specify the spawn coordinates of the player
export const spawnSpec = {
  0: [3, 4],
  1: [3, 5],
  2: [3, 5],
  3: [6.5, 4.5],
}

// h = hall length in level 3
const h = 4
// specify the walls for the level
const wallSpec = {
  0: [
    [1, 3, 6, 0.5, 1.5, 4],
    [1, 3, 6, 7.5, 1.5, 4],
    [6, 3, 1, 4, 1.5, 0.5],
    [6, 3, 1, 4, 1.5, 7.5],
  ],
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
  3: [
    [3, 3, 3, 2.5, 1.5, 2.5],
    [1, 3, 1, 0.5, 1.5, 4.5],
    [3, 3, 1, 2.5, 1.5, 5.5],
    [2, 3, 3, 5, 1.5, 7.5],
    [1, 3, 1, 6.5, 1.5, 9.5],
    [2, 3, 3, 8, 1.5, 7.5],
    [3, 3, 1, 10.5, 1.5, 5.5],
    [1, 3, 1, 12.5, 1.5, 4.5],
    [3, 3, 3, 10.5, 1.5, 2.5],
    [5, 3, 1, 6.5, 1.5, 0.5],
    [3, 3, 1, 6.5, 1.5, 1.5],
  ],
}

const floorSpec = {
  0: [1, 1, 7, 7],
  1: [1, 1, 7, 7],
  2: [1, 1, 8, 8],
  3: [1, 1, 12, 9],
}

// specify the position/rotation of the tables in the level
export const tableSpec = {
  1: [
    [1.5, 6.5 + TABLE_FIXER, 0],
    [2.5, 1.5 - TABLE_FIXER, Math.PI],
    [6.5 + TABLE_FIXER, 3.5, (3 * Math.PI) / 2],
  ],
  2: [
    [1.5, 7.5 + TABLE_FIXER, 0],
    [2.5, 1.5 - TABLE_FIXER, Math.PI],
    [7, 4.5 + TABLE_FIXER, Math.PI],
    [7.5 + TABLE_FIXER, 1.5, (3 * Math.PI) / 2],
  ],
  3: [
    [6.5, 8.5 + TABLE_FIXER, 0],
    [11.5 + TABLE_FIXER, 4.5, Math.PI / 2],
    [8.5, 1.5 - TABLE_FIXER, Math.PI],
    [4.5, 1.5 - TABLE_FIXER, Math.PI],
    [1.5 - TABLE_FIXER, 4.5, -Math.PI / 2],
  ],
}

// specify the objects to be used in the level. must have the same length as the corresponding tableSpec
export const objectSpec = {
  1: [
    PredefinedObjects.WATERMELON,
    PredefinedObjects.BANANA,
    PredefinedObjects.MANGO,
  ],
  2: [
    PredefinedObjects.WATERMELON,
    PredefinedObjects.APPLE,
    PredefinedObjects.ORANGE,
    PredefinedObjects.BANANA,
  ],
  3: [
    PredefinedObjects.WATERMELON,
    PredefinedObjects.APPLE,
    PredefinedObjects.MANGO,
    PredefinedObjects.BANANA,
    PredefinedObjects.ORANGE,
  ],
}

// this function should only really be used by LevelManager, because it keeps track of triggers/objects
export function loadLevel(
  space: SpaceManager,
  levelNumber: number = 1,
  isPreview: boolean = false,
  objSpec: string[]
) {
  const walls = createWalls(space, levelNumber)
  const floor = createFloor(space, levelNumber)
  const lights = createLights(space, levelNumber)
  const tables = createTables(space, levelNumber, isPreview)
  const puzzleObjects = createPuzzleObjects(
    space,
    levelNumber,
    isPreview,
    objSpec
  )
  for (const obj of puzzleObjects) {
    space.addDynamicObject(obj)
  }
  setCameraPosition(space, levelNumber)

  // space.cameraControls.body.position = new CANNON.Vec3(4, 2, 6)

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
      parseInt(i)
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
  isPreview: boolean = false,
  spec: string[]
) {
  const objects = []

  for (const i in spec) {
    if (isPreview) {
      let trigX = tableSpec[levelNumber as 1][i][0]
      let trigZ = tableSpec[levelNumber as 1][i][1]

      objects.push(
        createPredefinedDynamicObject(
          trigX,
          0.75,
          trigZ,
          spec[i] as PredefinedObjects,
          parseInt(i),
          !isPreview
        )
      )
    } else {
      objects.push(
        createPredefinedDynamicObject(
          spawnSpec[levelNumber as 1][0] +
            Math.sin(
              (0.3 * 2 * Math.PI * parseInt(i)) / spec.length + 0.8 * Math.PI
            ) *
              1.5,
          0.25,
          spawnSpec[levelNumber as 1][1] +
            Math.cos(
              (0.3 * 2 * Math.PI * parseInt(i)) / spec.length + 0.8 * Math.PI
            ) *
              1.5,
          spec[i] as PredefinedObjects,
          parseInt(i),
          !isPreview
        )
      )
    }
  }
  return objects
}

function setCameraPosition(space: SpaceManager, levelNumber: number = 1) {}
