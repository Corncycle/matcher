import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import DynamicObject from './DynamicObject'

export enum CheckStates {
  UNSET = 'unset',
  CHECKING = 'checking',
  VALID = 'valid',
  INVALID = 'invalid',
}

export default class ObjectChecker {
  parent: DynamicObject

  // 0 <= checkingProgress <= 1
  checkingProgress: number
  checkingIntervalId: ReturnType<typeof setInterval> | undefined

  validatingMaterial: THREE.MeshBasicMaterial
  validMaterial: THREE.MeshBasicMaterial
  invalidMaterial: THREE.MeshBasicMaterial

  state: CheckStates
  ringMesh: THREE.Mesh
  checkMesh?: THREE.Mesh
  xMesh?: THREE.Mesh

  // a function to be run when the checker progress is completed
  // a LevelManager should assign this and pay attention to when the function is called
  alertFunction?: Function

  constructor(parent: DynamicObject) {
    this.state = CheckStates.UNSET
    this.parent = parent
    this.checkingProgress = 0

    const ringGeometry = this.getRingGeometry(0)
    const validatingMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      side: THREE.DoubleSide,
      opacity: 0.5,
      transparent: true,
    })
    this.validatingMaterial = validatingMaterial

    const validMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      side: THREE.DoubleSide,
      opacity: 0.7,
      transparent: true,
    })
    this.validMaterial = validMaterial

    const invalidMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide,
      opacity: 0.7,
      transparent: true,
    })
    this.invalidMaterial = invalidMaterial

    validatingMaterial.depthTest = false
    validMaterial.depthTest = false
    invalidMaterial.depthTest = false
    this.ringMesh = new THREE.Mesh(ringGeometry, validatingMaterial)
  }

  setState(state: CheckStates) {
    if (this.checkingIntervalId) {
      clearInterval(this.checkingIntervalId)
    }

    for (let i = this.parent.mesh.children.length - 1; i >= 0; i--) {
      this.parent.mesh.remove(this.parent.mesh.children[i])
    }

    switch (state) {
      case CheckStates.UNSET:
        return
      case CheckStates.CHECKING:
        this.setRingProgress(0)
        this.ringMesh.material = this.validatingMaterial
        this.parent.mesh.add(this.ringMesh)
        this.checkingIntervalId = setInterval(() => {
          this.setRingProgress(this.checkingProgress + 0.01)
          if (this.checkingProgress >= 1) {
            if (this.alertFunction) {
              this.alertFunction(this.parent.id)
              // at this point, the LevelManager should invoke `setState` and
              // the interval should be cleared
            }
          }
        }, 1000 / 144)
        return
      case CheckStates.INVALID:
        this.setRingProgress(1)
        this.ringMesh.material = this.invalidMaterial
        this.parent.mesh.add(this.ringMesh)
        return
      case CheckStates.VALID:
        this.setRingProgress(1)
        this.ringMesh.material = this.validMaterial
        this.parent.mesh.add(this.ringMesh)
        return
      default:
        return
    }
  }

  // 0 <= progress <= 1
  getRingGeometry(progress: number) {
    return new THREE.RingGeometry(1.2, 1.6, 32, 1, 0, progress * 2 * Math.PI)
  }

  setRingProgress(progress: number) {
    this.checkingProgress = progress
    const newGeometry = this.getRingGeometry(this.checkingProgress)
    this.ringMesh.geometry.dispose()
    this.ringMesh.geometry = newGeometry
  }
}
