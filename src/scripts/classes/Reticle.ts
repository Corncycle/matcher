import * as THREE from 'three'

export enum ReticleDisplays {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  HOVER = 'HOVER',
}

export default class Reticle {
  camera: THREE.Camera

  currentMode: ReticleDisplays

  inactiveMaterial: THREE.LineBasicMaterial
  activeMaterial: THREE.LineBasicMaterial
  hoverMaterial: THREE.LineBasicMaterial

  inactiveLines: THREE.LineSegments
  activeLines: THREE.LineSegments
  hoverLines: THREE.LineSegments
  allLines: THREE.LineSegments[] // every time you add a new lines type, add to this array at bottom of constructor

  lines: THREE.LineSegments

  constructor(camera: THREE.Camera) {
    this.currentMode = ReticleDisplays.INACTIVE

    const DISTANCE_FROM_CAMERA = 64

    this.camera = camera

    this.inactiveMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      opacity: 0.25,
      transparent: true,
    })
    this.inactiveMaterial.depthTest = false
    this.activeMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      opacity: 1,
      transparent: true,
    })
    this.activeMaterial.depthTest = false
    this.hoverMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      opacity: 1,
      transparent: true,
    })
    this.hoverMaterial.depthTest = false

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

    const hoverPoints = []
    hoverPoints.push(new THREE.Vector3(0, -1, -DISTANCE_FROM_CAMERA))
    hoverPoints.push(new THREE.Vector3(0, 1, -DISTANCE_FROM_CAMERA))
    hoverPoints.push(new THREE.Vector3(-1, 0, -DISTANCE_FROM_CAMERA))
    hoverPoints.push(new THREE.Vector3(1, 0, -DISTANCE_FROM_CAMERA))

    const hoverGeometry = new THREE.BufferGeometry().setFromPoints(hoverPoints)
    this.hoverLines = new THREE.LineSegments(hoverGeometry, this.hoverMaterial)

    this.allLines = [this.inactiveLines, this.activeLines, this.hoverLines]

    this.lines = this.inactiveLines

    camera.add(this.lines)
  }

  setMode(mode: ReticleDisplays) {
    if (mode === this.currentMode) {
      return
    }
    this.currentMode = mode

    for (const l of this.allLines) {
      this.camera.remove(l)
    }

    switch (mode) {
      case ReticleDisplays.ACTIVE:
        this.camera.add(this.activeLines)
        break
      case ReticleDisplays.INACTIVE:
        this.camera.add(this.inactiveLines)
        break
      case ReticleDisplays.HOVER:
        this.camera.add(this.hoverLines)
        break
      default:
        this.camera.add(this.inactiveLines)
    }
  }
}
