import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import * as CANNON from 'cannon-es'
import {
  TestColors,
  c_basicMaterial,
  t_carpetMaterial,
  t_lambertMaterial,
  t_normalMaterial,
  t_plasterMaterial,
  t_tableLegMaterial,
  t_tabletopMaterial,
  t_woodTrimMaterial,
  t_wpGreenMaterial,
  t_wpPinkMaterial,
  t_wpPurpleMaterial,
  testColoredMaterials,
} from './materials'
import DynamicObject from '../classes/DynamicObject'
import PuzzleTrigger from '../classes/PuzzleTrigger'

export const CEIL_HEIGHT = 1.8

export enum TestShapes {
  BALL = 'ball',
  BOX = 'box',
}

export enum PredefinedObjects {
  WATERMELON = 'watermelon',
  APPLE = 'apple',
  ORANGE = 'orange',
  PEAR = 'pear',
  MANGO = 'mango',
  BANANA = 'banana',
}

const loader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
loader.setDRACOLoader(dracoLoader)

export let watermelonGroup: THREE.Group | undefined
export let appleGroup: THREE.Group | undefined
export let orangeGroup: THREE.Group | undefined
export let bananaGroup: THREE.Group | undefined
export let mangoGroup: THREE.Group | undefined
loader.load('assets/models/watermelon-webp.glb', (gltf) => {
  watermelonGroup = gltfLoaderHelper(gltf, 0, 0.56)
})
loader.load('assets/models/apple-webp.glb', (gltf) => {
  appleGroup = gltfLoaderHelper(gltf, 2, 0.8)
})
loader.load('assets/models/orange-webp.glb', (gltf) => {
  orangeGroup = gltfLoaderHelper(gltf, 0, 0.6)
})
loader.load('assets/models/banana-webp.glb', (gltf) => {
  bananaGroup = gltfLoaderHelper(gltf, 0, 0.7)
})
loader.load('assets/models/mango-webp.glb', (gltf) => {
  mangoGroup = gltfLoaderHelper(gltf, 0, 0.7)
  // yeah this is definitely how you should do this.
  mangoGroup.children[0].rotateX(Math.PI / 2)
  mangoGroup.children[0].rotateZ(Math.PI / 4)
})
const gltfLoaderHelper = (
  gltf: GLTF,
  centerIndex: number,
  scaleFactor?: number
) => {
  const group = new THREE.Group()
  // const centerObj = gltf.scene.children[centerIndex] as THREE.Mesh
  // const center = new THREE.Vector3()
  // centerObj.geometry.computeBoundingBox()
  // centerObj.geometry.boundingBox!.getCenter(center).negate()
  for (const child of gltf.scene.children) {
    const newChild = (child as THREE.Mesh).clone()
    newChild.castShadow = true
    // newChild.geometry.translate(center.x, center.y, center.z)
    group.add(newChild)
  }
  if (scaleFactor) {
    group.scale.set(scaleFactor, scaleFactor, scaleFactor)
  }
  return group
}

const ballGeometry = new THREE.SphereGeometry(1, 7, 7)
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const planeGeometry = new THREE.PlaneGeometry(1, 1)

export function createStaticGround(y: number) {
  const planeMesh = new THREE.Mesh(planeGeometry, t_normalMaterial)
  // planeMesh.position.y = y
  planeMesh.position.y = -2
  planeMesh.rotateX(-Math.PI / 2)
  planeMesh.receiveShadow = true
  const planeShape = new CANNON.Plane()
  const planeBody = new CANNON.Body({ mass: 0, material: c_basicMaterial })
  planeBody.addShape(planeShape)
  planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)

  return { mesh: planeMesh, body: planeBody }
}

export function createStaticCeiling(
  xStart: number,
  zStart: number,
  xEnd: number,
  zEnd: number
) {
  const planeMesh = new THREE.Mesh(planeGeometry.clone(), t_plasterMaterial)
  const pos = planeMesh.geometry.getAttribute('position')
  const uv = planeMesh.geometry.getAttribute('uv')
  const tileFactor = 0.5

  for (let i = 0; i < pos.count; i++) {
    uv.setXY(
      i,
      tileFactor * (xEnd - xStart) * pos.getX(i) + 0.5,
      tileFactor * (zEnd - zStart) * pos.getY(i) + 0.5
    )
  }

  planeMesh.scale.set(xEnd - xStart, zEnd - zStart, 1)
  planeMesh.position.set((xEnd + xStart) / 2, CEIL_HEIGHT, (zEnd + zStart) / 2)
  planeMesh.rotateX(Math.PI / 2)
  planeMesh.receiveShadow = true

  const planeShape = new CANNON.Box(new CANNON.Vec3(16, 1, 16))
  const planeBody = new CANNON.Body({ mass: 0, material: c_basicMaterial })
  planeBody.addShape(planeShape, new CANNON.Vec3(0, CEIL_HEIGHT + 1, 0))

  return { mesh: planeMesh, body: planeBody }
}

export function createStaticFloor(
  xStart: number,
  zStart: number,
  xEnd: number,
  zEnd: number
) {
  const planeMesh = new THREE.Mesh(planeGeometry.clone(), t_carpetMaterial)
  const pos = planeMesh.geometry.getAttribute('position')
  const uv = planeMesh.geometry.getAttribute('uv')
  const tileFactor = 0.5

  for (let i = 0; i < pos.count; i++) {
    uv.setXY(
      i,
      tileFactor * (xEnd - xStart) * pos.getX(i) + 0.5,
      tileFactor * (zEnd - zStart) * pos.getY(i) + 0.5
    )
  }

  planeMesh.scale.set(xEnd - xStart, zEnd - zStart, 1)
  planeMesh.position.set((xEnd + xStart) / 2, 0, (zEnd + zStart) / 2)
  planeMesh.rotateX(-Math.PI / 2)
  planeMesh.receiveShadow = true

  const planeShape = new CANNON.Plane()
  const planeBody = new CANNON.Body({ mass: 0, material: c_basicMaterial })
  planeBody.addShape(planeShape)
  planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)

  return { mesh: planeMesh, body: planeBody }
}

export function createStaticBox(
  width: number,
  height: number,
  length: number,
  x: number,
  y: number,
  z: number,
  t_material?: THREE.Material
) {
  const boxMesh = new THREE.Mesh(cubeGeometry, t_material || t_lambertMaterial)
  boxMesh.scale.set(width, height, length)
  boxMesh.position.set(x, y, z)
  boxMesh.castShadow = true
  boxMesh.receiveShadow = true
  const cubeShape = new CANNON.Box(
    new CANNON.Vec3(width / 2, height / 2, length / 2)
  )
  const boxBody = new CANNON.Body({ mass: 0, material: c_basicMaterial })
  boxBody.addShape(cubeShape)
  boxBody.position.x = x
  boxBody.position.y = y
  boxBody.position.z = z

  return { mesh: boxMesh, body: boxBody }
}

export function createUvMappedCubeGeometry(
  width: number,
  height: number,
  length: number,
  tileFactor: number = 0.5
) {
  const newGeometry = cubeGeometry.clone()
  const pos = newGeometry.getAttribute('position')
  const uv = newGeometry.getAttribute('uv')
  for (let i = 0; i < pos.count; i++) {
    if (i < 8) {
      uv.setXY(
        i,
        tileFactor * length * (pos.getZ(i) + 0.5),
        tileFactor * height * (pos.getY(i) + 0.5)
      ) // TODO: these should probably be width, height, length instead of x, y, z
    } else if (i < 16) {
      uv.setXY(
        i,
        tileFactor * width * (pos.getX(i) + 0.5),
        tileFactor * length * (pos.getZ(i) + 0.5)
      )
    } else {
      uv.setXY(
        i,
        tileFactor * width * (pos.getX(i) + 0.5),
        tileFactor * height * (pos.getY(i) + 0.5)
      )
    }
  }
  return newGeometry
}

function wallMeshHelper(
  width: number,
  height: number,
  length: number,
  x: number,
  y: number,
  z: number,
  tileFactor: number = 0.5,
  material: THREE.Material,
  castShadow?: boolean
) {
  const wallGeometry = createUvMappedCubeGeometry(
    width,
    height,
    length,
    tileFactor
  )

  const mesh = new THREE.Mesh(wallGeometry, material)
  mesh.scale.set(width, height, length)
  mesh.position.set(x, y, z)

  if (castShadow) {
    mesh.castShadow = true
  }
  mesh.receiveShadow = true

  return mesh
}

export function createStaticWall(
  width: number,
  height: number,
  length: number,
  x: number,
  y: number,
  z: number,
  castShadow?: boolean,
  wallMaterial: THREE.Material = t_wpPinkMaterial
) {
  const tileFactor = 0.5

  // proportion of the wall taken up by the wooden panel
  const panelProportion = 0.2
  // length of trim protruding from wall
  const trimDepth = 0.045

  const wallMesh = wallMeshHelper(
    width,
    height,
    length,
    x,
    y,
    z,
    tileFactor,
    wallMaterial,
    false
  )
  const topTrim = wallMeshHelper(
    width + 2 * trimDepth,
    height / 32,
    length + 2 * trimDepth,
    x,
    y + height / 2 - height / 64,
    z,
    tileFactor * 2,
    t_woodTrimMaterial,
    false
  )
  const midTrim = wallMeshHelper(
    width + 2 * trimDepth,
    height / 32,
    length + 2 * trimDepth,
    x,
    y - height / 2 + panelProportion * height,
    z,
    tileFactor * 2,
    t_woodTrimMaterial,
    castShadow
  )
  const botTrim = wallMeshHelper(
    width + 2 * trimDepth,
    height / 32,
    length + 2 * trimDepth,
    x,
    y - height / 2 + height / 64,
    z,
    tileFactor * 2,
    t_woodTrimMaterial,
    castShadow
  )
  const panel = wallMeshHelper(
    width + 0.02,
    height * panelProportion,
    length + 0.02,
    x,
    y - height / 2 + (height * panelProportion) / 2,
    z,
    tileFactor * 2,
    t_woodTrimMaterial,
    castShadow
  )

  const mg = new THREE.Group()
  mg.add(wallMesh, topTrim, panel, botTrim, midTrim)

  const cubeShape = new CANNON.Box(
    new CANNON.Vec3(width / 2, height / 2, length / 2)
  )
  const boxBody = new CANNON.Body({ mass: 0, material: c_basicMaterial })
  boxBody.addShape(cubeShape)
  boxBody.position.x = x
  boxBody.position.y = y
  boxBody.position.z = z

  return { meshGroup: mg, body: boxBody }
}

export function createDynamicBall(
  r: number,
  x: number,
  y: number,
  z: number,
  mass: number = 1,
  color: TestColors = TestColors.MAGENTA,
  id: number = -1,
  isHoldable: boolean = true
) {
  const ballMesh = new THREE.Mesh(
    ballGeometry,
    testColoredMaterials[color as 'green']
  )
  ballMesh.scale.set(r, r, r)
  const ballShape = new CANNON.Sphere(r)
  const ballBody = new CANNON.Body({ mass, material: c_basicMaterial })

  // balls need angular damping otherwise they roll forever without slowing down
  // (they're modeled as ideal spheres which don't experience friction)
  // this number was determined by. making it up.
  ballBody.angularDamping = 0.96

  ballBody.position = new CANNON.Vec3(x, y, z)
  ballBody.addShape(ballShape)

  return new DynamicObject(ballMesh, ballBody, isHoldable, color, id)
}

export function createDynamicBox(
  width: number,
  height: number,
  length: number,
  x: number,
  y: number,
  z: number,
  mass: number = 1,
  color: TestColors = TestColors.CYAN,
  id: number = -1,
  isHoldable: boolean = true
) {
  const boxMesh = new THREE.Mesh(
    cubeGeometry,
    testColoredMaterials[color as 'green']
  )
  boxMesh.scale.set(width, length, height)
  const boxShape = new CANNON.Box(
    new CANNON.Vec3(width / 2, height / 2, length / 2)
  )
  const boxBody = new CANNON.Body({ mass, material: c_basicMaterial })
  boxBody.position = new CANNON.Vec3(x, y, z)
  boxBody.addShape(boxShape)

  return new DynamicObject(boxMesh, boxBody, isHoldable, color, id)
}

function addCannonSphereToBody(
  b: CANNON.Body,
  x: number,
  y: number,
  z: number,
  r: number
) {
  const sph = new CANNON.Sphere(r)
  b.addShape(sph, new CANNON.Vec3(x, y, z))
}

function addCannonBoxToBody(
  b: CANNON.Body,
  width: number,
  height: number,
  length: number,
  x: number,
  y: number,
  z: number,
  zRotate?: number
) {
  const box = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, length / 2))
  let q
  if (zRotate) {
    q = new CANNON.Quaternion()
    q.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), zRotate)
  }
  b.addShape(box, new CANNON.Vec3(x, y, z), q)
}

export function createPredefinedDynamicObject(
  x: number,
  y: number,
  z: number,
  identifier: PredefinedObjects,
  id: number = -1,
  isHoldable: boolean = true
) {
  let naiveMesh
  let body
  switch (identifier) {
    case PredefinedObjects.WATERMELON:
      // naiveMesh will be empty here, HOWEVER, due to some... awesome implementations
      // elsewhere, naiveMesh will be populated with the meshes used to display the
      // check / X indicators when placing the object on tables. so the scale here
      // determines the size of the checker and we fit it to the fruit size manually
      naiveMesh = new THREE.Mesh()
      naiveMesh.scale.multiplyScalar(0.26)
      body = new CANNON.Body({ mass: 10, material: c_basicMaterial })
      addCannonSphereToBody(body, -0.08, 0, 0, 0.18)
      addCannonSphereToBody(body, 0.08, 0, 0, 0.18)
      addCannonSphereToBody(body, 0, 0, 0, 0.21)
      body.position = new CANNON.Vec3(x, y, z)
      // balls need angular damping otherwise they roll forever without slowing down
      // (they're modeled as ideal spheres which don't experience friction)
      // this number was determined by. making it up.
      body.angularDamping = 0.96
      return new DynamicObject(
        naiveMesh,
        body,
        isHoldable,
        '',
        id,
        watermelonGroup!.clone()
      )
    case PredefinedObjects.APPLE:
      naiveMesh = new THREE.Mesh()
      naiveMesh.scale.multiplyScalar(0.2)
      body = new CANNON.Body({ mass: 7, material: c_basicMaterial })
      addCannonSphereToBody(body, 0, 0.01, 0, 0.11)
      addCannonSphereToBody(body, 0.01, 0.118, 0, 0.01)
      addCannonBoxToBody(body, 0.16, 0.03, 0.16, 0, -0.09, 0)
      body.position = new CANNON.Vec3(x, y, z)
      body.angularDamping = 0.96
      return new DynamicObject(
        naiveMesh,
        body,
        isHoldable,
        '',
        id,
        appleGroup!.clone()
      )
    case PredefinedObjects.ORANGE:
      naiveMesh = new THREE.Mesh()
      naiveMesh.scale.multiplyScalar(0.2)
      body = new CANNON.Body({ mass: 7, material: c_basicMaterial })
      addCannonSphereToBody(body, 0, 0, 0, 0.13)
      body.position = new CANNON.Vec3(x, y, z)
      body.angularDamping = 0.96
      return new DynamicObject(
        naiveMesh,
        body,
        isHoldable,
        '',
        id,
        orangeGroup!.clone()
      )
    case PredefinedObjects.BANANA:
      naiveMesh = new THREE.Mesh()
      naiveMesh.scale.multiplyScalar(0.24)
      body = new CANNON.Body({ mass: 7, material: c_basicMaterial })
      addCannonBoxToBody(body, 0.25, 0.08, 0.08, 0, -0.03, 0)
      addCannonSphereToBody(body, -0.25, 0.16, 0, 0.01)
      addCannonSphereToBody(body, -0.15, 0.03, 0, 0.04)
      addCannonSphereToBody(body, 0.25, 0.07, 0, 0.01)
      addCannonSphereToBody(body, 0.15, 0, 0, 0.04)
      body.position = new CANNON.Vec3(x, y, z)
      body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 4)
      // body.angularDamping = 0.96
      return new DynamicObject(
        naiveMesh,
        body,
        isHoldable,
        '',
        id,
        bananaGroup!.clone()
      )
    case PredefinedObjects.MANGO:
      naiveMesh = new THREE.Mesh()
      naiveMesh.scale.multiplyScalar(0.2)
      body = new CANNON.Body({ mass: 7, material: c_basicMaterial })
      addCannonSphereToBody(body, 0.09, 0, -0.07, 0.055)
      addCannonSphereToBody(body, 0, 0, 0, 0.085)
      addCannonSphereToBody(body, -0.055, 0.01, 0.037, 0.075)
      body.position = new CANNON.Vec3(x, y, z)
      body.angularDamping = 0.96
      return new DynamicObject(
        naiveMesh,
        body,
        isHoldable,
        '',
        id,
        mangoGroup!.clone()
      )
  }
  return createDynamicBall(0.1, x, y, z, 1, TestColors.RED, id, isHoldable)
}

export function createDynamicObject(
  x: number,
  y: number,
  z: number,
  shape: TestShapes = TestShapes.BALL,
  color: TestColors = TestColors.RED,
  id: number = -1,
  isHoldable: boolean = true
) {
  switch (shape) {
    case TestShapes.BALL:
      return createDynamicBall(0.15, x, y, z, 1, color, id, isHoldable)
    case TestShapes.BOX:
    default:
      return createDynamicBox(
        0.15,
        0.15,
        0.15,
        x,
        y,
        z,
        1,
        color,
        id,
        isHoldable
      )
  }
}

function tableHelper(
  group: THREE.Group,
  body: CANNON.Body,
  width: number,
  height: number,
  length: number,
  x: number,
  y: number,
  z: number,
  material: THREE.Material,
  withBlocker: boolean = false
) {
  const mesh = new THREE.Mesh(
    createUvMappedCubeGeometry(width, height, length, 1),
    material
  )
  mesh.scale.set(width, height, length)
  mesh.position.set(x, y, z)
  mesh.castShadow = true
  mesh.receiveShadow = true
  group.add(mesh)

  body.addShape(
    new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, length / 2)),
    new CANNON.Vec3(x, y, z)
  )

  if (withBlocker) {
    body.addShape(
      new CANNON.Box(
        new CANNON.Vec3(width / 2 + 0.02, height / 2, length / 2 + 0.02)
      ),
      new CANNON.Vec3(x, y + 0.7, z)
    )
  }
}

export function createStaticTable(
  x: number,
  z: number,
  rotation: number,
  withBlocker: boolean = false
) {
  const t_axis = new THREE.Vector3(0, 1, 0)
  const c_axis = new CANNON.Vec3(0, 1, 0)

  const gp = new THREE.Group()
  const body = new CANNON.Body({ material: c_basicMaterial })

  // legs
  tableHelper(gp, body, 0.07, 0.4, 0.07, -0.3, -0.25, -0.2, t_tableLegMaterial)
  tableHelper(gp, body, 0.07, 0.4, 0.07, 0.3, -0.25, -0.2, t_tableLegMaterial)
  tableHelper(gp, body, 0.07, 0.4, 0.07, -0.3, -0.25, 0.2, t_tableLegMaterial)
  tableHelper(gp, body, 0.07, 0.4, 0.07, 0.3, -0.25, 0.2, t_tableLegMaterial)

  // supports
  tableHelper(gp, body, 0.02, 0.05, 0.4, -0.3, -0.35, 0, t_tableLegMaterial)
  tableHelper(gp, body, 0.02, 0.05, 0.4, 0.3, -0.35, 0, t_tableLegMaterial)
  tableHelper(gp, body, 0.6, 0.05, 0.02, 0, -0.35, 0, t_tableLegMaterial)

  // tabletop
  tableHelper(gp, body, 0.8, 0.1, 0.6, 0, 0, 0, t_tabletopMaterial, withBlocker)

  gp.position.set(x, 0.45, z)
  gp.quaternion.setFromAxisAngle(t_axis, rotation)

  body.quaternion.setFromAxisAngle(c_axis, rotation)

  body.position = new CANNON.Vec3(x, 0.45, z)

  return { mesh: gp, body: body }
}

export function createTableWithTrigger(
  x: number,
  z: number,
  rotation: number,
  id: number = -1,
  withBlocker: boolean = false
) {
  const { mesh, body } = createStaticTable(x, z, rotation, withBlocker)
  const trigger = new PuzzleTrigger(0.7, 0.1, 0.5, x, 0.55, z, rotation, id)
  return { mesh, body, trigger }
}
