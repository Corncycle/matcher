import * as THREE from 'three'
import {
  CEIL_HEIGHT,
  PredefinedObjects,
  createPredefinedDynamicObject,
  createStaticCeiling,
  createStaticFloor,
  createStaticWall,
  createTableWithTrigger,
} from './objects'
import SpaceManager from '../classes/Space'
import {
  t_wpGreenMaterial,
  t_wpPinkMaterial,
  t_wpPurpleMaterial,
} from './materials'
import {
  PropTypes,
  createArmchairBlueProp,
  createArmchairProp,
  createChandelierProp,
  createClockProp,
  createCouchProp,
  createDresserProp,
  createLampProp,
  createNightstandProp,
  createRugProp,
  createStatueProp,
} from './props'

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

// first 3 = positions of both lights, next 3 = target of shad light, last 3 = target of no shad light
export const lightSpec = {
  0: [4, 6, 5, 4, 0, 5, 10, 0, 6],
  1: [4, 6, 4, 3.5, 0, 4.5, 5, 0, 0],
  2: [4, 6, 4, 3.5, 0, 4.5, 5, 0, 0],
  3: [6, 6, 4, 5.5, 0, 4.5, 7, 0, 0],
}

// h = hall length in level 3 (DO NOT CHANGE)
const h = 4
// specify the walls for the level
const wallSpec = {
  0: [
    [1, CEIL_HEIGHT, 6, 0.5, CEIL_HEIGHT / 2, 4],
    [1, CEIL_HEIGHT, 6, 7.5, CEIL_HEIGHT / 2, 4],
    [6, CEIL_HEIGHT, 1, 4, CEIL_HEIGHT / 2, 0.5],
    [6, CEIL_HEIGHT, 1, 4, CEIL_HEIGHT / 2, 7.5],
  ],
  1: [
    [1, CEIL_HEIGHT, 6, 0.5, CEIL_HEIGHT / 2, 4],
    [1, CEIL_HEIGHT, 6, 7.5, CEIL_HEIGHT / 2, 4],
    [6, CEIL_HEIGHT, 1, 4, CEIL_HEIGHT / 2, 0.5],
    [6, CEIL_HEIGHT, 1, 4, CEIL_HEIGHT / 2, 7.5],
  ],
  2: [
    [1, CEIL_HEIGHT, 7, 0.5, CEIL_HEIGHT / 2, 4.5],
    [4, CEIL_HEIGHT, 1, 3, CEIL_HEIGHT / 2, 8.5],
    [7, CEIL_HEIGHT, 1, 4.5, CEIL_HEIGHT / 2, 0.5],
    [3, CEIL_HEIGHT, 3, 6.5, CEIL_HEIGHT / 2, 6.5],
    [1, CEIL_HEIGHT, 4, 8.5, CEIL_HEIGHT / 2, 3],
  ],
  3: [
    [3, CEIL_HEIGHT, 3, 2.5, CEIL_HEIGHT / 2, 2.5],
    [1, CEIL_HEIGHT, 1, 0.5, CEIL_HEIGHT / 2, 4.5],
    [3, CEIL_HEIGHT, 1, 2.5, CEIL_HEIGHT / 2, 5.5],
    [2, CEIL_HEIGHT, 3, 5, CEIL_HEIGHT / 2, 7.5],
    [1, CEIL_HEIGHT, 1, 6.5, CEIL_HEIGHT / 2, 9.5],
    [2, CEIL_HEIGHT, 3, 8, CEIL_HEIGHT / 2, 7.5],
    [3, CEIL_HEIGHT, 1, 10.5, CEIL_HEIGHT / 2, 5.5],
    [1, CEIL_HEIGHT, 1, 12.5, CEIL_HEIGHT / 2, 4.5],
    [3, CEIL_HEIGHT, 3, 10.5, CEIL_HEIGHT / 2, 2.5],
    [5, CEIL_HEIGHT, 1, 6.5, CEIL_HEIGHT / 2, 0.5],
    [3, CEIL_HEIGHT, 1, 6.5, CEIL_HEIGHT / 2, 1.5],
  ],
}

const wallMaterialSpec = {
  0: t_wpPinkMaterial,
  1: t_wpGreenMaterial,
  2: t_wpPurpleMaterial,
  3: t_wpPinkMaterial,
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
    [7.5, 4.5 + TABLE_FIXER, Math.PI],
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
    PredefinedObjects.APPLE,
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

export const propSpec = {
  0: [],
  1: [
    { type: PropTypes.ARMCHAIR_BLUE, x: 4, z: 6.65, rotation: Math.PI },
    { type: PropTypes.ARMCHAIR_BLUE, x: 5.2, z: 6.65, rotation: Math.PI },
    { type: PropTypes.GRANDFATHER_CLOCK, x: 4.6, z: 6.8, rotation: Math.PI },
    { type: PropTypes.ARMCHAIR_BLUE, x: 5.7, z: 1.35, rotation: 0 },
    { type: PropTypes.NIGHTSTAND, x: 5, z: 1.3, rotation: 0 },
    { type: PropTypes.RUG, x: 4, z: 4, rotation: 0, color: 'blue' },
  ],
  2: [
    { type: PropTypes.COUCH, x: 4.27, z: 7.1, rotation: -Math.PI / 2 },
    { type: PropTypes.MINO_STATUE, x: 5.5, z: 4.64, rotation: Math.PI },
    {
      type: PropTypes.GRANDFATHER_CLOCK,
      x: 3.2,
      z: 7.8,
      rotation: Math.PI,
    },
    { type: PropTypes.DRESSER, x: 1.2, z: 6, rotation: Math.PI / 2 },
    { type: PropTypes.ARMCHAIR, x: 1.6, z: 1.35, rotation: 0 },
    { type: PropTypes.CHANDELIER, x: 3.5, z: 3.5, rotation: 0 },
    { type: PropTypes.LAMP, x: 1.5, z: 4, rotation: 0 },
    { type: PropTypes.RUG, x: 5.7, z: 3, rotation: 0, color: 'red' },
  ],
  3: [],
  // level 4 doesn't exist, just putting this here to have a list of valid objects to use
  4: [
    { type: PropTypes.MINO_STATUE, x: 4.5, z: 1.3, rotation: 0 },
    { type: PropTypes.ARMCHAIR, x: 4.5, z: 3, rotation: 0 },
    { type: PropTypes.COUCH, x: 2, z: 2.5, rotation: 0 },
    { type: PropTypes.DRESSER, x: 2, z: 6, rotation: Math.PI / 2 },
    { type: PropTypes.GRANDFATHER_CLOCK, x: 3, z: 7, rotation: Math.PI },
    { type: PropTypes.CHANDELIER, x: 3, z: 3, rotation: 0 },
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
  const props = createProps(space, levelNumber)
  const ceil = createCeilings(space, levelNumber)
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
    const { meshGroup, body } = createStaticWall(
      ...(wall as [number, number, number, number, number, number]),
      true,
      wallMaterialSpec[levelNumber as 1]
    )
    space.addObject({ meshGroup, body })
    walls.push({ meshGroup, body })
  }

  return walls
}

function createCeilings(space: SpaceManager, levelNumber: number = 1) {
  const { mesh, body } = createStaticCeiling(
    ...(floorSpec[levelNumber as 1] as [number, number, number, number])
  )
  space.addObject({ mesh, body })

  return [{ mesh, body }]
}

function createFloor(space: SpaceManager, levelNumber: number = 1) {
  const { mesh, body } = createStaticFloor(
    ...(floorSpec[levelNumber as 1] as [number, number, number, number])
  )
  space.addObject({ mesh, body })

  return [{ mesh, body }]
}

function createLights(space: SpaceManager, levelNumber: number = 1) {
  const AMB_LIGHT_INTENSITY = 1
  const DIR_LIGHT_INTENSITY = 1.5
  // SHADOW_PROPORTION = how much intense, relative to fully accurate shadows, should shadow intensity be
  const SHADOW_PROPORTION = 0.6

  const LIGHT_COLOR = 0xffedd6

  space.scene.add(new THREE.AmbientLight(LIGHT_COLOR, AMB_LIGHT_INTENSITY))

  const dirLight = new THREE.DirectionalLight(
    LIGHT_COLOR,
    DIR_LIGHT_INTENSITY * (1 - SHADOW_PROPORTION)
  )
  const shadDirLight = new THREE.DirectionalLight(
    LIGHT_COLOR,
    DIR_LIGHT_INTENSITY * SHADOW_PROPORTION
  )
  const shadtarget = new THREE.Object3D()
  shadtarget.position.set(
    lightSpec[levelNumber as 1][3],
    lightSpec[levelNumber as 1][4],
    lightSpec[levelNumber as 1][5]
  )
  const noshadtarget = new THREE.Object3D()
  noshadtarget.position.set(
    lightSpec[levelNumber as 1][6],
    lightSpec[levelNumber as 1][7],
    lightSpec[levelNumber as 1][8]
  )
  space.scene.add(shadtarget)
  space.scene.add(noshadtarget)
  for (const l of [dirLight, shadDirLight]) {
    l.position.set(
      lightSpec[levelNumber as 1][0],
      lightSpec[levelNumber as 1][1],
      lightSpec[levelNumber as 1][2]
    )
    l.shadow.camera.left = -8
    l.shadow.camera.right = 8
    l.shadow.camera.bottom = -8
    l.shadow.camera.top = 8

    space.scene.add(l)
  }
  shadDirLight.target = shadtarget
  dirLight.target = noshadtarget

  shadDirLight.castShadow = true
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

function createProps(space: SpaceManager, levelNumber: number = 1) {
  for (const prop of propSpec[levelNumber as 1]) {
    let meshGroup, body
    switch (prop.type) {
      case PropTypes.MINO_STATUE:
        ;({ meshGroup, body } = createStatueProp(
          prop.x,
          0.8,
          prop.z,
          prop.rotation ?? 0
        ))
        break
      case PropTypes.ARMCHAIR:
        ;({ meshGroup, body } = createArmchairProp(
          prop.x,
          0,
          prop.z,
          prop.rotation ?? 0
        ))
        break
      case PropTypes.COUCH:
        ;({ meshGroup, body } = createCouchProp(
          prop.x,
          0,
          prop.z,
          prop.rotation ?? 0
        ))
        break
      case PropTypes.DRESSER:
        ;({ meshGroup, body } = createDresserProp(
          prop.x,
          0,
          prop.z,
          prop.rotation ?? 0
        ))
        break
      case PropTypes.GRANDFATHER_CLOCK:
        ;({ meshGroup, body } = createClockProp(
          prop.x,
          0,
          prop.z,
          prop.rotation ?? 0
        ))
        break
      case PropTypes.CHANDELIER:
        ;({ meshGroup, body } = createChandelierProp(
          prop.x,
          CEIL_HEIGHT,
          prop.z,
          prop.rotation ?? 0
        ))
        break
      case PropTypes.ARMCHAIR_BLUE:
        ;({ meshGroup, body } = createArmchairBlueProp(
          prop.x,
          0,
          prop.z,
          prop.rotation ?? 0
        ))
        break
      case PropTypes.NIGHTSTAND:
        ;({ meshGroup, body } = createNightstandProp(
          prop.x,
          0,
          prop.z,
          prop.rotation ?? 0
        ))
        break
      case PropTypes.LAMP:
        ;({ meshGroup, body } = createLampProp(
          prop.x,
          0,
          prop.z,
          prop.rotation ?? 0
        ))
        break
      case PropTypes.RUG:
        ;({ meshGroup } = createRugProp(
          prop.x,
          0.01,
          prop.z,
          (prop as any).color ?? 'red',
          prop.rotation ?? 0
        ))
        body = null
    }
    space.addObject({ body, meshGroup })
  }
}

function createPuzzleObjects(
  space: SpaceManager,
  levelNumber: number = 1,
  isPreview: boolean = false,
  spec: string[]
) {
  const objects = []

  // randomize the spawn positions in the second phase
  const permuteArray = []
  for (const i in spec) {
    permuteArray.push(i)
  }
  permuteArray.sort((a, b) => 0.5 - Math.random())

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
              (0.3 * 2 * Math.PI * parseInt(permuteArray[i])) / spec.length +
                0.8 * Math.PI
            ) *
              1.5,
          0.25,
          spawnSpec[levelNumber as 1][1] +
            Math.cos(
              (0.3 * 2 * Math.PI * parseInt(permuteArray[i])) / spec.length +
                0.8 * Math.PI
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
