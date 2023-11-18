import * as THREE from 'three'
import CameraControls from './scripts/CameraControls'
import { AxesHelper } from 'three'

import { createBasicBoxMesh } from './scripts/threeUtil'
import { createEmptyLevel } from './scripts/game/map'

// ***** BEGIN SETUP *****
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.y = 1
camera.position.z = 10

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const cameraControls = new CameraControls(renderer.domElement, camera)
// ****** END SETUP ******

const axesHelper = new AxesHelper(5)
scene.add(axesHelper)

const room = createEmptyLevel()
scene.add(room)

// const geometry = new THREE.BoxGeometry()
// const material = new THREE.MeshBasicMaterial({
//   color: 0x00ff00,
//   wireframe: true,
// })

// const cube = new THREE.Mesh(geometry, material)
// scene.add(cube)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  render()
}

function animate() {
  requestAnimationFrame(animate)

  //   cube.rotation.x += 0.01
  //   cube.rotation.y += 0.01

  cameraControls.processKeyboardInput()

  render()
}

function render() {
  renderer.render(scene, camera)
}

animate()
