import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import {
  createDynamicBall,
  createDynamicBox,
  createStaticBox,
  createStaticFloor,
  createStaticTable,
  createStaticWall,
} from './objects'
import SpaceManager from '../classes/Space'

export function loadLevel(space: SpaceManager, levelNumber: number = 1) {
  const walls = createWalls(space, levelNumber)
  const floor = createFloor(space, levelNumber)
  const lights = createLights(space, levelNumber)
  const tables = createTables(space, levelNumber)
  const checkZones = createCheckZones(space, levelNumber)
  const puzzleObjects = createPuzzleObjects(space, levelNumber)
  setCameraPosition(space, levelNumber)

  space.cameraControls.body.position = new CANNON.Vec3(4, 2, 6)

  space.addDynamicObject(createDynamicBall(0.15, 2, 4, 2))

  space.addDynamicObject(createDynamicBox(0.15, 0.15, 0.15, 4, 0.5, 2))
}

function createWalls(space: SpaceManager, levelNumber: number = 1) {
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

function createTables(space: SpaceManager, levelNumber: number = 1) {
  const tableSpec = {
    1: [
      [1.5, 6.5, 0],
      [2.5, 1.5, Math.PI],
      [5.5, 3.5, (3 * Math.PI) / 2],
    ],
    2: [
      [1.5, 7.5, 0],
      [2.5, 1.5, Math.PI],
      [7, 4.5, Math.PI],
      [7.5, 1.5, (3 * Math.PI) / 2],
    ],
  }

  const tables = []
  for (const table of tableSpec[levelNumber as 1]) {
    const { mesh, body } = createStaticTable(
      ...(table as [number, number, number])
    )
    space.addObject({ mesh, body })
    tables.push({ mesh, body })
  }

  return tables
}

function createCheckZones(space: SpaceManager, levelNumber: number = 1) {
  return null
}

function createPuzzleObjects(space: SpaceManager, levelNumber: number = 1) {
  return null
}

function setCameraPosition(space: SpaceManager, levelNumber: number = 1) {}
