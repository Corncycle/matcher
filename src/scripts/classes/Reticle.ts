import * as THREE from 'three'

export default class Reticle {
  camera: THREE.Camera

  inactiveMaterial: THREE.LineBasicMaterial
  activeMaterial: THREE.LineBasicMaterial

  inactiveLines: THREE.LineSegments
  activeLines: THREE.LineSegments

  lines: THREE.LineSegments

  constructor(camera: THREE.Camera) {
    const DISTANCE_FROM_CAMERA = 64

    this.camera = camera

    this.inactiveMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })
    this.inactiveMaterial.depthTest = false
    this.activeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })
    this.activeMaterial.depthTest = false

    const inactivePoints = []
    inactivePoints.push(new THREE.Vector3(0, -1, -DISTANCE_FROM_CAMERA))
    inactivePoints.push(new THREE.Vector3(0, 1, -DISTANCE_FROM_CAMERA))
    inactivePoints.push(new THREE.Vector3(-1, 0, -DISTANCE_FROM_CAMERA))
    inactivePoints.push(new THREE.Vector3(1, 0, -DISTANCE_FROM_CAMERA))

    const inactiveGeometry = new THREE.BufferGeometry().setFromPoints(
      inactivePoints
    )
    this.inactiveLines = new THREE.LineSegments(
      inactiveGeometry,
      this.inactiveMaterial
    )
    // this.lines.renderOrder = 999

    const activePoints = []
    activePoints.push(new THREE.Vector3(0, -1, -DISTANCE_FROM_CAMERA))
    activePoints.push(new THREE.Vector3(0, -0.9, -DISTANCE_FROM_CAMERA))
    activePoints.push(new THREE.Vector3(0, 1, -DISTANCE_FROM_CAMERA))
    activePoints.push(new THREE.Vector3(0, 0.9, -DISTANCE_FROM_CAMERA))
    activePoints.push(new THREE.Vector3(-1, 0, -DISTANCE_FROM_CAMERA))
    activePoints.push(new THREE.Vector3(-0.9, 0, -DISTANCE_FROM_CAMERA))
    activePoints.push(new THREE.Vector3(1, 0, -DISTANCE_FROM_CAMERA))
    activePoints.push(new THREE.Vector3(0.9, 0, -DISTANCE_FROM_CAMERA))

    const activeGeometry = new THREE.BufferGeometry().setFromPoints(
      activePoints
    )
    this.activeLines = new THREE.LineSegments(
      activeGeometry,
      this.activeMaterial
    )
    // this.lines.renderOrder = 999

    this.lines = this.inactiveLines

    camera.add(this.lines)
  }

  setMode(mode: string) {
    for (const l of [this.inactiveLines, this.activeLines]) {
      this.camera.remove(l)
    }

    switch (mode) {
      case 'ACTIVE':
        this.camera.add(this.activeLines)
        break
      case 'INACTIVE':
        this.camera.add(this.inactiveLines)
        break
      default:
        this.camera.add(this.inactiveLines)
    }
  }
}
