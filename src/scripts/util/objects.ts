import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import {
  TestColors,
  c_basicMaterial,
  t_floorMaterial,
  t_lambertMaterial,
  t_normalMaterial,
  t_tableLegMaterial,
  t_tabletopMaterial,
  t_wallMaterial,
  testColoredMaterials,
} from './materials'
import DynamicObject from '../classes/DynamicObject'
import PuzzleTrigger from '../classes/PuzzleTrigger'

export enum TestShapes {
  BALL = 'ball',
  BOX = 'box',
}

const ballGeometry = new THREE.SphereGeometry(1)
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

export function createStaticFloor(
  xStart: number,
  zStart: number,
  xEnd: number,
  zEnd: number
) {
  console.log(`creating floor from ${xStart}, ${zStart} to ${xEnd}, ${zEnd}`)
  const planeMesh = new THREE.Mesh(planeGeometry, t_floorMaterial)
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
  z: number
) {
  const boxMesh = new THREE.Mesh(cubeGeometry, t_lambertMaterial)
  boxMesh.scale.set(width, height, length)
  boxMesh.position.set(x, y, z)
  boxMesh.castShadow = true
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

export function createStaticWall(
  width: number,
  height: number,
  length: number,
  x: number,
  y: number,
  z: number
) {
  const boxMesh = new THREE.Mesh(cubeGeometry, t_wallMaterial)
  boxMesh.scale.set(width, height, length)
  boxMesh.position.set(x, y, z)
  boxMesh.castShadow = true
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

export function createDynamicBall(
  r: number,
  x: number,
  y: number,
  z: number,
  mass: number = 1,
  color: TestColors = TestColors.MAGENTA,
  id: number = -1
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

  return new DynamicObject(ballMesh, ballBody, true, color, id)
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
  id: number = -1
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

  return new DynamicObject(boxMesh, boxBody, true, color, id)
}

export function createDynamicObject(
  x: number,
  y: number,
  z: number,
  shape: TestShapes = TestShapes.BALL,
  color: TestColors = TestColors.RED,
  id: number = -1
) {
  switch (shape) {
    case TestShapes.BALL:
      return createDynamicBall(0.15, x, y, z, 1, color, id)
    case TestShapes.BOX:
    default:
      return createDynamicBox(0.15, 0.15, 0.15, x, y, z, 1, color, id)
  }
}

export function createStaticTable(x: number, z: number, rotation: number) {
  const t_axis = new THREE.Vector3(0, 1, 0)
  const c_axis = new CANNON.Vec3(0, 1, 0)

  const tableGroup = new THREE.Group()

  const leg1 = new THREE.Mesh(cubeGeometry, t_tableLegMaterial)
  leg1.scale.set(0.1, 0.4, 0.1)
  leg1.position.set(-0.3, -0.25, -0.2)
  tableGroup.add(leg1)

  const leg2 = new THREE.Mesh(cubeGeometry, t_tableLegMaterial)
  leg2.scale.set(0.1, 0.4, 0.1)
  leg2.position.set(0.3, -0.25, -0.2)
  tableGroup.add(leg2)

  const leg3 = new THREE.Mesh(cubeGeometry, t_tableLegMaterial)
  leg3.scale.set(0.1, 0.4, 0.1)
  leg3.position.set(-0.3, -0.25, 0.2)
  tableGroup.add(leg3)

  const leg4 = new THREE.Mesh(cubeGeometry, t_tableLegMaterial)
  leg4.scale.set(0.1, 0.4, 0.1)
  leg4.position.set(0.3, -0.25, 0.2)
  tableGroup.add(leg4)

  const tabletop = new THREE.Mesh(cubeGeometry, t_tabletopMaterial)
  tabletop.scale.set(0.8, 0.1, 0.6)
  tableGroup.add(tabletop)

  tableGroup.position.set(x, 0.45, z)
  tableGroup.quaternion.setFromAxisAngle(t_axis, rotation)

  const tableBody = new CANNON.Body({ material: c_basicMaterial })
  tableBody.addShape(
    new CANNON.Box(new CANNON.Vec3(0.05, 0.2, 0.05)),
    new CANNON.Vec3(-0.3, -0.25, -0.2)
  )
  tableBody.addShape(
    new CANNON.Box(new CANNON.Vec3(0.05, 0.2, 0.05)),
    new CANNON.Vec3(0.3, -0.25, -0.2)
  )
  tableBody.addShape(
    new CANNON.Box(new CANNON.Vec3(0.05, 0.2, 0.05)),
    new CANNON.Vec3(-0.3, -0.25, 0.2)
  )
  tableBody.addShape(
    new CANNON.Box(new CANNON.Vec3(0.05, 0.2, 0.05)),
    new CANNON.Vec3(0.3, -0.25, 0.2)
  )

  tableBody.addShape(new CANNON.Box(new CANNON.Vec3(0.4, 0.05, 0.3)))

  tableBody.quaternion.setFromAxisAngle(c_axis, rotation)

  tableBody.position = new CANNON.Vec3(x, 0.45, z)

  return { mesh: tableGroup, body: tableBody }
}

export function createTableWithTrigger(
  x: number,
  z: number,
  rotation: number,
  id: number = -1
) {
  const { mesh, body } = createStaticTable(x, z, rotation)
  const trigger = new PuzzleTrigger(0.7, 0.1, 0.5, x, 0.55, z, rotation, id)
  return { mesh, body, trigger }
}
