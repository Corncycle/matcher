import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import {
  c_basicBasicContactMaterial,
  c_playerBasicContactMaterial,
} from '../util/materials'
import CameraControls from './CameraControls'
import DynamicObject from './DynamicObject'
import LevelManager from './LevelManager'
import { clamp } from '../util/util'

// A space manager holds graphical + physical data for a world
// ie a three scene + camera + renderer, cannon world, etc
// with utility functions for managing and coordinating them
export default class SpaceManager {
  clock!: THREE.Clock
  scene!: THREE.Scene
  camera!: THREE.PerspectiveCamera
  menuCamera!: THREE.PerspectiveCamera
  cameraControls!: CameraControls
  renderer: THREE.WebGLRenderer
  world!: CANNON.World
  // `dynamicObjects` must be stored so that after the physics simulation is ran,
  // we can sync up all meshes with their associated bodies. only need
  // to store dynamic objects that are in both the three scene and cannon
  // world, otherwise three and cannon handle everything themselves
  dynamicObjects!: DynamicObject[]
  levelManager?: LevelManager

  constructor() {
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this.renderer.domElement)

    this.initialize()
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
      this.world.step(clamp(delta / deltaSubdivisions, 0.0001, 0.1)) // if a value <= 0 is passed into this.world.step we can get NaN positions on bodies
    }
  }

  addObject(obj: {
    mesh?: THREE.Mesh | THREE.Group
    body: CANNON.Body | CANNON.Body[] | null
    meshGroup?: THREE.Group
  }) {
    if (obj.mesh) {
      this.scene.add(obj.mesh)
    }
    if (obj.meshGroup) {
      this.scene.add(obj.meshGroup)
    }
    if (!obj.body) {
      return
    }
    if (Array.isArray(obj.body)) {
      for (const b of obj.body) {
        this.world.addBody(b)
      }
    } else {
      this.world.addBody(obj.body)
    }
  }

  addDynamicObject(obj: DynamicObject) {
    this.addObject(obj)
    this.dynamicObjects.push(obj)
  }

  addTrigger(body: CANNON.Body) {
    this.world.addBody(body)
  }

  getDynamicObjectByBody(body: CANNON.Body) {
    for (const obj of this.dynamicObjects) {
      if (obj.body === body) {
        return obj
      }
    }
    return null
  }

  getDynamicObjectIfHoldable(intersection: THREE.Intersection | undefined) {
    if (intersection === undefined) {
      return null
    }

    for (const obj of this.dynamicObjects) {
      if (
        (obj.mesh === intersection.object ||
          (obj.meshGroup &&
            obj.meshGroup.children.includes(intersection.object))) &&
        obj.isHoldable
      ) {
        return obj
      }
    }
    return null
  }

  render() {
    for (const object of this.dynamicObjects) {
      object.updateMeshTransform()
      if (this.levelManager) {
        if (object.mesh.children) {
          for (const child of object.mesh.children) {
            child.lookAt(this.camera.position)
          }
        }
      }
    }

    if (this.levelManager) {
      this.levelManager.updateCheatingResources()
    }

    this.cameraControls.updateReticle()

    if (this.levelManager?.inMenu) {
      this.renderer.render(this.scene, this.menuCamera)
    } else {
      this.renderer.render(this.scene, this.camera)
    }
  }

  deleteCanvas() {
    document.body.replaceChildren()
  }

  initialize() {
    this.renderer.shadowMap.enabled = true
    this.clock = new THREE.Clock()
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    )
    this.menuCamera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    )
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.menuCamera.aspect = window.innerWidth / window.innerHeight
      this.menuCamera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    })
    this.scene.add(this.camera)
    this.scene.add(this.menuCamera)

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
  }

  reset(spawnX: number = 2, spawnZ: number = 2) {
    this.clock = new THREE.Clock()
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    )
    this.menuCamera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    )
    this.scene.add(this.camera)
    this.scene.add(this.menuCamera)

    this.world = new CANNON.World({ gravity: new CANNON.Vec3(0, -6, 0) })
    this.world.quatNormalizeSkip = 0
    this.world.addContactMaterial(c_playerBasicContactMaterial)
    this.world.addContactMaterial(c_basicBasicContactMaterial)

    this.cameraControls.space = this

    this.cameraControls.reset(
      this.scene,
      this.camera,
      this.world,
      0.2,
      spawnX,
      spawnZ
    )

    this.dynamicObjects = []
  }
}
