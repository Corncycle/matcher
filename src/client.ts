import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import CameraControls from './scripts/CameraControls'
import { AxesHelper } from 'three'

import { createEmptyLevel } from './scripts/game/map'

import CannonDebugRenderer from './scripts/util/cannonDebugRenderer'
import { SLIPPERY_GROUND, SLIPPERY_SLIPPERY } from './scripts/util/worldUtil'

// ***** BEGIN SETUP *****
const scene = new THREE.Scene()
const world = new CANNON.World()
// an array of { mesh, shape } pairs for use updating meshes in the rendering loop
const renderedShapes: Array<{ mesh: THREE.Mesh; shape: CANNON.Body }> = []
world.gravity.set(0, -9.8, 0)

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

camera.position.x = 4
camera.position.y = 1
camera.position.z = 6

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const cameraControls = new CameraControls(
  renderer.domElement,
  camera,
  scene,
  world
)

world.addContactMaterial(SLIPPERY_GROUND)
world.addContactMaterial(SLIPPERY_SLIPPERY)

// ****** END SETUP ******

const axesHelper = new AxesHelper(5)
scene.add(axesHelper)

createEmptyLevel(scene, world)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  render()
}

const cannonDebugRenderer = new CannonDebugRenderer(scene, world)

const clock = new THREE.Clock()
let delta

function animate() {
  render()

  requestAnimationFrame(animate)

  delta = Math.min(clock.getDelta(), 0.1)
  world.step(delta)

  cameraControls.processKeyboardInput()
  // cameraControls.moveToBody()

  for (const object of renderedShapes) {
    const { mesh, shape } = object
    mesh.position.set(shape.position.x, shape.position.y, shape.position.z)
    mesh.quaternion.set(
      shape.quaternion.x,
      shape.quaternion.y,
      shape.quaternion.z,
      shape.quaternion.w
    )
  }

  cannonDebugRenderer.update()
}

function render() {
  renderer.render(scene, camera)
}

animate()
