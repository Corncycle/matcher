import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import CannonDebugRenderer from './scripts/util/cannonDebugRenderer'
import { basicMaterial } from './scripts/util/materials'
import SpaceManager from './scripts/classes/Space'

// ***** BEGIN SETUP *****

const space = new SpaceManager()

const cannonDebugRenderer = new CannonDebugRenderer(space.scene, space.world)

const clock = new THREE.Clock()
let delta

// ****** END SETUP ******

// !!!!!!!! TEMPORARY OBJECT SETUP !!!!!!!!

const planeGeometry = new THREE.PlaneGeometry(25, 25)
const planeMesh = new THREE.Mesh(planeGeometry, new THREE.MeshNormalMaterial())
planeMesh.position.y = -0.01
planeMesh.rotateX(-Math.PI / 2)
planeMesh.receiveShadow = true
space.scene.add(planeMesh)
const planeShape = new CANNON.Plane()
const planeBody = new CANNON.Body({ mass: 0, material: basicMaterial })
planeBody.addShape(planeShape)
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
space.world.addBody(planeBody)

const cubeGeometry = new THREE.BoxGeometry(1, 3, 1)
const cubeMesh = new THREE.Mesh(cubeGeometry, new THREE.MeshNormalMaterial())
cubeMesh.position.x = -2
cubeMesh.position.y = 1
cubeMesh.position.z = -2
cubeMesh.castShadow = true
space.scene.add(cubeMesh)
const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 1.5, 0.5))
const cubeBody = new CANNON.Body({ mass: 0, material: basicMaterial })
cubeBody.addShape(cubeShape)
cubeBody.position.x = cubeMesh.position.x
cubeBody.position.y = cubeMesh.position.y
cubeBody.position.z = cubeMesh.position.z
space.world.addBody(cubeBody)

// !!!!!!!! TEMPORARY OBJECT SETUP !!!!!!!!

function animate() {
  requestAnimationFrame(animate)

  space.updateCameraControls()
  space.physicsStep(3)
  space.render()

  //cannonDebugRenderer.update()
}

animate()
