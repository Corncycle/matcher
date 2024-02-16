import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { createStaticBox } from './objects'
import { c_basicMaterial, t_tabletopMaterial } from './materials'

// this file is for loading in models for props

const loader = new GLTFLoader()

export let statue2: THREE.Group | undefined
export let armchair: THREE.Group | undefined
export let couch: THREE.Group | undefined
export let dresser: THREE.Group | undefined
export let grandfatherClock: THREE.Group | undefined

loader.load('assets/models/mino2.glb', (gltf) => {
  statue2 = gltf.scene
  statue2.scale.set(0.25, 0.25, 0.25)
})

loader.load('assets/models/armchair-c4.glb', (gltf) => {
  armchair = gltf.scene
  armchair.scale.set(1.05, 1.05, 1.05)
})

loader.load('assets/models/couch-c4.glb', (gltf) => {
  couch = gltf.scene
  couch.scale.set(1.05, 1.05, 1.05)
})

loader.load('assets/models/dresser.glb', (gltf) => {
  dresser = gltf.scene
  dresser.scale.set(1.05, 1.05, 1.05)
})

loader.load('assets/models/grandfather-clock.glb', (gltf) => {
  grandfatherClock = gltf.scene
  // grandfatherClock.scale.set(1.05, 1.05, 1.05)
})

export enum PropTypes {
  MINO_STATUE = 'minotaur',
  ARMCHAIR = 'armchair',
  COUCH = 'couch',
  DRESSER = 'dresser',
  GRANDFATHER_CLOCK = 'grandfatherClock',
}

function rotateAboutVertical(
  group: THREE.Group,
  body: CANNON.Body,
  rotation: number
) {
  if (rotation) {
    group.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), rotation)
    body.quaternion.copy(group.quaternion as any)
  }
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

export function createStatueProp(
  x: number,
  y: number,
  z: number,
  rotationAboutVertical: number = 0
) {
  const plinthOffsetX = 0.15 / 4
  const plinthOffsetY = -2.5 / 4
  const plinthOffsetZ = 0 / 4

  const g = new THREE.Group()
  const s = statue2!.clone()
  // s.children[0].castShadow = true
  // s.receiveShadow = true
  const { mesh: plinthMesh } = createStaticBox(
    3.5 / 4,
    1.5 / 4,
    2.5 / 4,
    plinthOffsetX,
    plinthOffsetY,
    plinthOffsetZ,
    t_tabletopMaterial
  )

  const plinthBody = new CANNON.Body({ mass: 0, material: c_basicMaterial })
  const cubeShape = new CANNON.Box(new CANNON.Vec3(3.5 / 8, 1.5 / 8, 2.5 / 8))
  const statueBlocker = new CANNON.Box(new CANNON.Vec3(3.5 / 8, 0.5, 2.5 / 8))
  plinthBody.addShape(
    cubeShape,
    new CANNON.Vec3(0 + plinthOffsetX, 0 + plinthOffsetY, 0 + plinthOffsetZ)
  )
  plinthBody.addShape(
    statueBlocker,
    new CANNON.Vec3(0 + plinthOffsetX, 0.7 + plinthOffsetY, 0 + plinthOffsetZ)
  )

  g.add(plinthMesh)
  g.add(s)

  g.position.set(x, y, z)
  plinthBody.position.set(x, y, z)

  rotateAboutVertical(g, plinthBody, rotationAboutVertical)

  return { meshGroup: g, body: plinthBody }
}

export function createArmchairProp(
  x: number,
  y: number,
  z: number,
  rotationAboutVertical: number = 0
) {
  const g = new THREE.Group()
  const propMesh = armchair!.clone()
  for (const child of propMesh.children) {
    child.castShadow = true
    child.receiveShadow = true
  }
  propMesh.children[0].castShadow = true
  propMesh.receiveShadow = true

  const body = new CANNON.Body({ mass: 0, material: c_basicMaterial })
  addCannonBoxToBody(body, 0.62, 0.64, 0.47, 0, 0, 0)
  addCannonBoxToBody(body, 0.1, 0.2, 0.48, -0.26, 0.37, 0)
  addCannonBoxToBody(body, 0.1, 0.2, 0.48, 0.26, 0.37, 0)
  addCannonBoxToBody(body, 0.62, 0.45, 0.1, 0, 0.52, -0.24)

  g.add(propMesh)

  g.position.set(x, y, z)
  body.position.set(x, y, z)

  rotateAboutVertical(g, body, rotationAboutVertical)

  return { meshGroup: g, body: body }
}

export function createCouchProp(
  x: number,
  y: number,
  z: number,
  rotationAboutVertical: number = 0
) {
  const g = new THREE.Group()
  const propMesh = couch!.clone()
  for (const child of propMesh.children) {
    child.castShadow = true
    child.receiveShadow = true
  }
  propMesh.children[0].castShadow = true
  propMesh.receiveShadow = true

  const body = new CANNON.Body({ mass: 0, material: c_basicMaterial })
  addCannonBoxToBody(body, 1.74, 0.62, 0.4, -0.03, 0, -0.2)
  addCannonBoxToBody(body, 0.5, 0.62, 0.7, 0.55, 0, 0.3)
  addCannonBoxToBody(body, 0.11, 1, 1.25, 0.79, 0.11, 0)
  addCannonBoxToBody(body, 1.7, 1, 0.25, -0.02, 0.11, -0.55)
  addCannonBoxToBody(body, 0.13, 1, 0.6, -0.835, 0.11, -0.3)

  g.add(propMesh)

  g.position.set(x, y, z)
  body.position.set(x, y, z)

  rotateAboutVertical(g, body, rotationAboutVertical)

  return { meshGroup: g, body: body }
}

export function createDresserProp(
  x: number,
  y: number,
  z: number,
  rotationAboutVertical: number = 0
) {
  const g = new THREE.Group()
  const propMesh = dresser!.clone()
  for (const child of propMesh.children) {
    child.castShadow = true
    child.receiveShadow = true
  }
  propMesh.children[0].castShadow = true
  propMesh.receiveShadow = true

  const body = new CANNON.Body({ mass: 0, material: c_basicMaterial })
  addCannonBoxToBody(body, 1.01, 0.67, 0.29, 0, 0.3, 0)
  addCannonBoxToBody(body, 1.08, 0.018, 0.35, 0, 0.648, 0)

  g.add(propMesh)

  g.position.set(x, y, z)
  body.position.set(x, y, z)

  rotateAboutVertical(g, body, rotationAboutVertical)

  return { meshGroup: g, body: body }
}

export function createClockProp(
  x: number,
  y: number,
  z: number,
  rotationAboutVertical: number = 0
) {
  const g = new THREE.Group()
  const propMesh = grandfatherClock!.clone()
  for (const child of propMesh.children) {
    child.castShadow = true
    child.receiveShadow = true
  }
  propMesh.children[0].castShadow = true
  propMesh.receiveShadow = true

  const body = new CANNON.Body({ mass: 0, material: c_basicMaterial })
  addCannonBoxToBody(body, 0.3, 1.35, 0.22, 0, 0.675, -0.04)

  g.add(propMesh)

  g.position.set(x, y, z)
  body.position.set(x, y, z)

  rotateAboutVertical(g, body, rotationAboutVertical)

  return { meshGroup: g, body: body }
}
