import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { basicContactMaterial } from '../util/materials'
import CameraControls from './CameraControls'

// A space manager holds graphical + physical data for a world
// ie a three scene + camera + renderer, cannon world, etc
// with utility functions for managing and coordinating them
export default class SpaceManager {
  clock: THREE.Clock
  scene: THREE.Scene
  camera: THREE.Camera
  cameraControls: CameraControls
  renderer: THREE.Renderer
  world: CANNON.World

  constructor() {
    this.clock = new THREE.Clock()
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )

    this.camera.position.y = 2
    this.camera.position.z = 3

    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this.renderer.domElement)

    this.world = new CANNON.World({ gravity: new CANNON.Vec3(0, -2, 0) })
    this.world.quatNormalizeSkip = 0
    this.world.addContactMaterial(basicContactMaterial)

    this.cameraControls = new CameraControls(
      this.renderer.domElement,
      this.camera,
      this.scene,
      this.world
    )
  }

  updateCameraControls() {
    this.cameraControls.setVelocityFromCurrentInput()
    this.cameraControls.moveCameraToBody()
  }

  physicsStep(deltaSubdivisions: number) {
    // deltaSubdivisions indicates how many times we break up delta for better simulation
    // eg if delta === 0.3 and deltaSubdivisions === 3 then we do 3 world steps with a
    // new delta of 0.1 each
    const delta = Math.min(this.clock.getDelta(), 0.1)
    for (let i = 0; i < deltaSubdivisions; i++) {
      this.world.step(delta / deltaSubdivisions)
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }
}
