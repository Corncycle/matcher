import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { c_basicMaterial, t_normalMaterial } from './materials'

const ballGeometry = new THREE.SphereGeometry(1)
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const planeGeometry = new THREE.PlaneGeometry(25, 25)

export function createStaticGround(y: number) {
  const planeMesh = new THREE.Mesh(planeGeometry, t_normalMaterial)
  planeMesh.position.y = y
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
  const boxMesh = new THREE.Mesh(cubeGeometry, t_normalMaterial)
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
  x: number,
  y: number,
  z: number,
  r: number = 1,
  mass: number = 1
) {
  const ballMesh = new THREE.Mesh(ballGeometry, t_normalMaterial)
  ballMesh.scale.set(r, r, r)
  const ballShape = new CANNON.Sphere(r)
  const ballBody = new CANNON.Body({ mass, material: c_basicMaterial })
  ballBody.position = new CANNON.Vec3(x, y, z)
  ballBody.addShape(ballShape)

  return { mesh: ballMesh, body: ballBody }
}
