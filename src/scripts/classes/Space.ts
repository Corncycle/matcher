import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { playerBasicContactMaterial } from '../util/materials'
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
  // `dynamicObjects` must be stored so that after the physics simulation is ran,
  // we can sync up all meshes with their associated bodies. only need
  // to store dynamic objects that are in both the three scene and cannon
  // world, otherwise three and cannon handle everything themselves
  dynamicObjects: Array<{ mesh: THREE.Mesh; body: CANNON.Body }>

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

    this.world = new CANNON.World({ gravity: new CANNON.Vec3(0, -6, 0) })
    this.world.quatNormalizeSkip = 0
    this.world.addContactMaterial(playerBasicContactMaterial)

    this.cameraControls = new CameraControls(
      this.renderer.domElement,
      this.camera,
      this.scene,
      this.world
    )

    this.dynamicObjects = []
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

  addStaticObject(obj: { mesh: THREE.Mesh; body: CANNON.Body }) {
    this.world.addBody(obj.body)
    this.scene.add(obj.mesh)
  }

  addDynamicObject(obj: { mesh: THREE.Mesh; body: CANNON.Body }) {
    this.addStaticObject(obj)
    this.dynamicObjects.push(obj)
  }

  render() {
    for (const object of this.dynamicObjects) {
      const { mesh, body } = object

      mesh.position.x = body.position.x
      mesh.position.y = body.position.y
      mesh.position.z = body.position.z

      mesh.quaternion.x = body.quaternion.x
      mesh.quaternion.y = body.quaternion.y
      mesh.quaternion.z = body.quaternion.z
      mesh.quaternion.w = body.quaternion.w
    }

    this.renderer.render(this.scene, this.camera)
  }
}
