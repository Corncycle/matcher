import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import {
  c_basicBasicContactMaterial,
  c_playerBasicContactMaterial,
} from '../util/materials'
import CameraControls from './CameraControls'
import DynamicObject from './DynamicObject'

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
  dynamicObjects: DynamicObject[]

  constructor() {
    this.clock = new THREE.Clock()
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.scene.add(this.camera)

    this.camera.position.y = 2
    this.camera.position.z = 3

    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this.renderer.domElement)

    this.world = new CANNON.World({ gravity: new CANNON.Vec3(0, -6, 0) })
    this.world.quatNormalizeSkip = 0
    this.world.addContactMaterial(c_playerBasicContactMaterial)
    this.world.addContactMaterial(c_basicBasicContactMaterial)

    this.cameraControls = new CameraControls(
      this.renderer.domElement,
      this.camera,
      this.scene,
      this.world
    )
    this.cameraControls.space = this

    this.dynamicObjects = []

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.1))

    const light = new THREE.SpotLight(0xffffff, 2)
    light.position.x = 4
    light.position.y = 6
    light.position.z = 4
    this.scene.add(light)

    const spotlightTarget = new THREE.Object3D()
    spotlightTarget.position.x = 4
    spotlightTarget.position.y = 0
    spotlightTarget.position.z = 4
    this.scene.add(spotlightTarget)
    light.target = spotlightTarget
    light.power = 70

    // const helper = new THREE.SpotLightHelper(light)
    // this.scene.add(helper)
  }

  updateCameraControls() {
    this.cameraControls.setVelocityFromCurrentInput()
    this.cameraControls.moveCameraToBody()
    this.cameraControls.updateHeldObject()
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

  addObject(obj: { mesh: THREE.Mesh | THREE.Group; body: CANNON.Body }) {
    this.scene.add(obj.mesh)
    this.world.addBody(obj.body)
  }

  addDynamicObject(obj: DynamicObject) {
    this.addObject(obj)
    this.dynamicObjects.push(obj)
  }

  addTrigger(body: CANNON.Body) {
    this.world.addBody(body)
  }

  getDynamicObjectIfHoldable(intersection: THREE.Intersection | undefined) {
    if (intersection === undefined) {
      return null
    }

    for (const obj of this.dynamicObjects) {
      if (obj.mesh === intersection.object) {
        return obj
      }
    }
    return null
  }

  render() {
    for (const object of this.dynamicObjects) {
      object.updateMeshTransform()
    }

    this.renderer.render(this.scene, this.camera)
  }

  deleteCanvas() {
    document.body.replaceChildren()
  }

  reset() {
    this.clock = new THREE.Clock()
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.scene.add(this.camera)

    this.camera.position.y = 2
    this.camera.position.z = 3

    // this.renderer = new THREE.WebGLRenderer()
    // this.renderer.setSize(window.innerWidth, window.innerHeight)
    // document.body.appendChild(this.renderer.domElement)

    this.world = new CANNON.World({ gravity: new CANNON.Vec3(0, -6, 0) })
    this.world.quatNormalizeSkip = 0
    this.world.addContactMaterial(c_playerBasicContactMaterial)
    this.world.addContactMaterial(c_basicBasicContactMaterial)

    this.cameraControls = new CameraControls(
      this.renderer.domElement,
      this.camera,
      this.scene,
      this.world
    )
    this.cameraControls.space = this

    this.dynamicObjects = []

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.1))

    const light = new THREE.SpotLight(0xffffff, 2)
    light.position.x = 4
    light.position.y = 6
    light.position.z = 4
    this.scene.add(light)

    const spotlightTarget = new THREE.Object3D()
    spotlightTarget.position.x = 4
    spotlightTarget.position.y = 0
    spotlightTarget.position.z = 4
    this.scene.add(spotlightTarget)
    light.target = spotlightTarget
    light.power = 70

    // const helper = new THREE.SpotLightHelper(light)
    // this.scene.add(helper)
  }
}
