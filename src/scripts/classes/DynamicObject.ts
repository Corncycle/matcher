import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { TestColors, testColoredMaterials } from '../util/materials'

export default class DynamicObject {
  mesh: THREE.Mesh
  body: CANNON.Body
  isHoldable: boolean
  nativeColor: TestColors | ''

  id: number

  checkerLines: THREE.LineSegments

  constructor(
    mesh: THREE.Mesh,
    body: CANNON.Body,
    isHoldable: boolean = true,
    nativeColor: TestColors | '',
    id: number = -1
  ) {
    this.mesh = mesh
    this.body = body
    this.isHoldable = isHoldable
    this.nativeColor = nativeColor
    this.id = id

    const checkerPoints = []
    checkerPoints.push(new THREE.Vector3(0, -1, 0))
    checkerPoints.push(new THREE.Vector3(0, 1, 0))
    checkerPoints.push(new THREE.Vector3(-1, 0, 0))
    checkerPoints.push(new THREE.Vector3(1, 0, 0))

    const checkerGeometry = new THREE.BufferGeometry().setFromPoints(
      checkerPoints
    )

    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      opacity: 1,
      transparent: true,
    })
    material.depthTest = false

    this.checkerLines = new THREE.LineSegments(checkerGeometry, material)
  }

  updateAsHeldObject(parent: THREE.Object3D, destination: THREE.Vector3) {
    this.body.velocity.x = (destination.x - this.body.position.x) * 10
    this.body.velocity.y = (destination.y - this.body.position.y) * 10
    this.body.velocity.z = (destination.z - this.body.position.z) * 10

    this.body.angularVelocity.x = 0
    this.body.angularVelocity.y = 0
    this.body.angularVelocity.z = 0

    this.body.quaternion.x = parent.quaternion.x
    this.body.quaternion.y = parent.quaternion.y
    this.body.quaternion.z = parent.quaternion.z
    this.body.quaternion.w = parent.quaternion.w
  }

  updateMeshTransform() {
    this.mesh.position.x = this.body.position.x
    this.mesh.position.y = this.body.position.y
    this.mesh.position.z = this.body.position.z

    this.mesh.quaternion.x = this.body.quaternion.x
    this.mesh.quaternion.y = this.body.quaternion.y
    this.mesh.quaternion.z = this.body.quaternion.z
    this.mesh.quaternion.w = this.body.quaternion.w
  }

  setColor(color: TestColors | 'native') {
    if (color === 'native') {
      if (!this.nativeColor) {
        this.mesh.material = testColoredMaterials['red']
      } else {
        this.mesh.material = testColoredMaterials[this.nativeColor]
      }
    } else {
      this.mesh.material = testColoredMaterials[color]
    }
  }

  showChecker() {
    this.mesh.add(this.checkerLines)
  }

  hideChecker() {
    this.mesh.remove(this.checkerLines)
  }
}
