import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import CameraControls from './scripts/CameraControls'
import CannonDebugRenderer from './scripts/util/cannonDebugRenderer'
import { basicContactMaterial, basicMaterial } from './scripts/util/materials'

// ***** BEGIN SETUP *****

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

camera.position.y = 2
camera.position.z = 3

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -2, 0) })
world.quatNormalizeSkip = 0
world.addContactMaterial(basicContactMaterial)

const cameraControls = new CameraControls(
  renderer.domElement,
  camera,
  scene,
  world
)

const cannonDebugRenderer = new CannonDebugRenderer(scene, world)

const clock = new THREE.Clock()
let delta

// ****** END SETUP ******

// !!!!!!!! TEMPORARY OBJECT SETUP !!!!!!!!

const planeGeometry = new THREE.PlaneGeometry(25, 25)
const planeMesh = new THREE.Mesh(planeGeometry, new THREE.MeshNormalMaterial())
planeMesh.position.y = -0.01
planeMesh.rotateX(-Math.PI / 2)
planeMesh.receiveShadow = true
scene.add(planeMesh)
const planeShape = new CANNON.Plane()
const planeBody = new CANNON.Body({ mass: 0, material: basicMaterial })
planeBody.addShape(planeShape)
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
world.addBody(planeBody)

const cubeGeometry = new THREE.BoxGeometry(1, 3, 1)
const cubeMesh = new THREE.Mesh(cubeGeometry, new THREE.MeshNormalMaterial())
cubeMesh.position.x = -2
cubeMesh.position.y = 1
cubeMesh.position.z = -2
cubeMesh.castShadow = true
scene.add(cubeMesh)
const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 1.5, 0.5))
const cubeBody = new CANNON.Body({ mass: 0, material: basicMaterial })
cubeBody.addShape(cubeShape)
cubeBody.position.x = cubeMesh.position.x
cubeBody.position.y = cubeMesh.position.y
cubeBody.position.z = cubeMesh.position.z
world.addBody(cubeBody)

// !!!!!!!! TEMPORARY OBJECT SETUP !!!!!!!!

const fidelity = 3
function animate() {
  requestAnimationFrame(animate)

  // console.log(cameraControls.body.position)

  cameraControls.setVelocityFromCurrentInput()
  delta = Math.min(clock.getDelta(), 0.1)
  for (let i = 0; i < fidelity; i++) {
    world.step(delta / fidelity)
  }

  cameraControls.camera.position.set(
    cameraControls.body.position.x,
    cameraControls.body.position.y,
    cameraControls.body.position.z
  )

  //cannonDebugRenderer.update()

  renderer.render(scene, camera)
}

animate()
