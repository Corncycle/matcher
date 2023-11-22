import * as THREE from 'three'
import * as CANNON from 'cannon-es'

export default class HeldObject {
  mesh: THREE.Mesh
  body: CANNON.Body
  parentCamera: THREE.Camera

  constructor(mesh: THREE.Mesh, body: CANNON.Body, parentCamera: THREE.Camera) {
    this.mesh = mesh
    this.body = body
    this.parentCamera = parentCamera
  }
}
