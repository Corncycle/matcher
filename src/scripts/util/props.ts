import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { createStaticBox } from './objects'
import {
  c_basicMaterial,
  t_blueRugMaterial,
  t_redRugMaterial,
  t_tabletopMaterial,
} from './materials'

// this file is for loading in models for props

const loader = new GLTFLoader()

export let statue2: THREE.Group | undefined
export let armchair: THREE.Group | undefined
export let couch: THREE.Group | undefined
export let dresser: THREE.Group | undefined
export let grandfatherClock: THREE.Group | undefined
export let chandelier: THREE.Group | undefined
export let armchairBlue: THREE.Group | undefined
export let nightstand: THREE.Group | undefined
export let lamp: THREE.Group | undefined
export let armchairPink: THREE.Group | undefined
export let dresserWashed: THREE.Group | undefined
export let nightstandWashed: THREE.Group | undefined

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
})

loader.load('assets/models/chandelier.glb', (gltf) => {
  chandelier = gltf.scene
})

loader.load('assets/models/armchair-blue.glb', (gltf) => {
  armchairBlue = gltf.scene
  armchairBlue.scale.set(1.05, 1.05, 1.05)
})

loader.load('assets/models/nightstand.glb', (gltf) => {
  nightstand = gltf.scene
  nightstand.scale.set(0.5, 0.5, 0.5)
})

loader.load('assets/models/lamp.glb', (gltf) => {
  lamp = gltf.scene
  lamp.scale.set(0.4, 0.4, 0.4)
})

loader.load('assets/models/armchair-pink.glb', (gltf) => {
  armchairPink = gltf.scene
  armchairPink.scale.set(1.05, 1.05, 1.05)
})

loader.load('assets/models/dresser-washed.glb', (gltf) => {
  dresserWashed = gltf.scene
  dresserWashed.scale.set(1.05, 1.05, 1.05)
})

loader.load('assets/models/nightstand-washed.glb', (gltf) => {
  nightstandWashed = gltf.scene
  nightstandWashed.scale.set(0.5, 0.5, 0.5)
})

export enum PropTypes {
  MINO_STATUE = 'minotaur',
  ARMCHAIR = 'armchair',
  COUCH = 'couch',
  DRESSER = 'dresser',
  GRANDFATHER_CLOCK = 'grandfatherClock',
  CHANDELIER = 'chandelier',
  NIGHTSTAND = 'nightstand',
  LAMP = 'lamp',
  RUG = 'rug',
}

function rotateAboutVertical(
  group: THREE.Group,
  body: CANNON.Body | null,
  rotation: number
) {
  if (rotation) {
    group.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), rotation)
    if (body) {
      body.quaternion.copy(group.quaternion as any)
    }
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

function addCannonCylinderToBody(
  b: CANNON.Body,
  x: number,
  y: number,
  z: number,
  r: number,
  h: number,
  segments: number = 8
) {
  const cyl = new CANNON.Cylinder(r, r, h, segments)
  b.addShape(cyl, new CANNON.Vec3(x, y, z))
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
  rotationAboutVertical: number = 0,
  color?: 'blue' | 'pink'
) {
  const g = new THREE.Group()
  let propMesh
  if (color) {
    switch (color) {
      case 'blue':
        propMesh = armchairBlue!.clone()
        break
      case 'pink':
        propMesh = armchairPink!.clone()
        break
    }
  } else {
    propMesh = armchair!.clone()
  }
  for (const child of propMesh.children) {
    child.castShadow = true
    child.receiveShadow = true
  }
  propMesh.children[0].castShadow = true
  propMesh.receiveShadow = true

  // If a body has multiple shapes, jump-refreshing can fail in cases like the following:
  // Suppose the body has two shapes forming an L shape. If the player jumps into the
  // vertical part of the body, a collision is detected. If the player fails to separate from
  // the vertical "wall", then no collision is detected when landing on the horizontal part
  // (because the player never stopped colliding with the body). Colliding with the vertical
  // did not refresh the jump, so the player does not receive a jump even when landing on
  // the horizontal, because no collision is registered when landing on the horizontal

  // As a hacky fix, we separate bodies with shapes at multiple y-levels into separate bodies
  // Our implementation for adding objects to the world allows `body` to be an array of bodies
  const body1 = new CANNON.Body({ mass: 0, material: c_basicMaterial })
  addCannonBoxToBody(body1, 0.62, 0.64, 0.47, 0, 0, 0)
  const body2 = new CANNON.Body({ mass: 0, material: c_basicMaterial })
  addCannonBoxToBody(body2, 0.1, 0.2, 0.48, -0.26, 0.37, 0)
  addCannonBoxToBody(body2, 0.1, 0.2, 0.48, 0.26, 0.37, 0)
  const body3 = new CANNON.Body({ mass: 0, material: c_basicMaterial })
  addCannonBoxToBody(body3, 0.62, 0.45, 0.1, 0, 0.52, -0.24)
  const bodies = [body1, body2, body3]

  g.add(propMesh)

  g.position.set(x, y, z)

  for (const b of bodies) {
    b.position.set(x, y, z)
    rotateAboutVertical(g, b, rotationAboutVertical)
  }

  return { meshGroup: g, body: bodies }
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

  const body1 = new CANNON.Body({ mass: 0, material: c_basicMaterial })
  addCannonBoxToBody(body1, 1.74, 0.62, 0.4, -0.03, 0, -0.2)
  addCannonBoxToBody(body1, 0.5, 0.62, 0.7, 0.55, 0, 0.3)
  const body2 = new CANNON.Body({ mass: 0, material: c_basicMaterial })
  addCannonBoxToBody(body2, 0.11, 1, 1.25, 0.79, 0.11, 0)
  addCannonBoxToBody(body2, 1.7, 1, 0.25, -0.02, 0.11, -0.55)
  addCannonBoxToBody(body2, 0.13, 1, 0.6, -0.835, 0.11, -0.3)
  const bodies = [body1, body2]

  g.add(propMesh)

  g.position.set(x, y, z)

  for (const b of bodies) {
    b.position.set(x, y, z)
    rotateAboutVertical(g, b, rotationAboutVertical)
  }

  return { meshGroup: g, body: bodies }
}

export function createDresserProp(
  x: number,
  y: number,
  z: number,
  rotationAboutVertical: number = 0,
  color?: 'washed'
) {
  const g = new THREE.Group()
  let propMesh
  if (color === 'washed') {
    propMesh = dresserWashed!.clone()
  } else {
    propMesh = dresser!.clone()
  }
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

export function createChandelierProp(
  x: number,
  y: number,
  z: number,
  rotationAboutVertical: number = 0
) {
  const g = new THREE.Group()
  const propMesh = chandelier!.clone()

  const body = new CANNON.Body({ mass: 0, material: c_basicMaterial })
  addCannonBoxToBody(body, 0.55, 0.2, 0.55, 0, -0.4, 0)
  addCannonBoxToBody(body, 0.55, 0.2, 0.55, 0, -0.4, 0, Math.PI / 4)
  addCannonBoxToBody(body, 0.12, 1, 0.2, 0, -0.14, 0)

  g.add(propMesh)

  g.position.set(x, y, z)
  body.position.set(x, y, z)

  rotateAboutVertical(g, body, rotationAboutVertical)

  return { meshGroup: g, body: body }
}

export function createNightstandProp(
  x: number,
  y: number,
  z: number,
  rotationAboutVertical: number = 0,
  color?: 'washed'
) {
  const g = new THREE.Group()
  let propMesh
  if (color === 'washed') {
    propMesh = nightstandWashed!.clone()
  } else {
    propMesh = nightstand!.clone()
  }
  for (const child of propMesh.children[0].children) {
    child.castShadow = true
    child.receiveShadow = true
  }
  propMesh.children[0].castShadow = true
  propMesh.receiveShadow = true

  const body = new CANNON.Body({ mass: 0, material: c_basicMaterial })
  addCannonBoxToBody(body, 0.4, 0.46, 0.4, 0, 0.23, 0)
  addCannonBoxToBody(body, 0.47, 0.02, 0.47, 0, 0.461, 0)

  g.add(propMesh)

  g.position.set(x, y, z)
  body.position.set(x, y, z)

  rotateAboutVertical(g, body, rotationAboutVertical)

  return { meshGroup: g, body: body }
}

export function createLampProp(
  x: number,
  y: number,
  z: number,
  rotationAboutVertical: number = 0
) {
  const g = new THREE.Group()
  const propMesh = lamp!.clone()
  for (const child of propMesh.children) {
    child.castShadow = true
    child.receiveShadow = true
  }
  propMesh.children[0].castShadow = true
  propMesh.receiveShadow = true

  const body = new CANNON.Body({ mass: 0, material: c_basicMaterial })
  addCannonCylinderToBody(body, 0, 0.55, 0, 0.02, 1.1)
  addCannonCylinderToBody(body, 0, 1.04, 0, 0.16, 0.28)

  g.add(propMesh)

  g.position.set(x, y, z)
  body.position.set(x, y, z)

  rotateAboutVertical(g, body, rotationAboutVertical)

  return { meshGroup: g, body: body }
}

export function createRugProp(
  x: number,
  y: number,
  z: number,
  color: 'red' | 'blue',
  rotationAboutVertical: number = 0
) {
  const g = new THREE.Group()
  const planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    color === 'blue' ? t_blueRugMaterial : t_redRugMaterial
  )
  planeMesh.receiveShadow = true
  planeMesh.castShadow = true
  g.add(planeMesh)
  g.position.set(x, y, z)
  if (color === 'red') {
    g.scale.set(3, 1, 2.25)
  } else {
    g.scale.set(4, 1, 3)
  }
  planeMesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI / 2)

  rotateAboutVertical(g, null, rotationAboutVertical)

  return { meshGroup: g }
}
