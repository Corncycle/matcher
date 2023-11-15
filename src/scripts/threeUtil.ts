import * as THREE from 'three'

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial = new THREE.MeshNormalMaterial()

export const createBasicBoxMesh = (
  xStart: number,
  xEnd: number,
  yStart: number,
  yEnd: number,
  zStart: number,
  zEnd: number
) => {
  const mesh = new THREE.Mesh(cubeGeometry, cubeMaterial)
  mesh.scale.x = xEnd - xStart
  mesh.scale.y = yEnd - yStart
  mesh.scale.z = zEnd - zStart

  mesh.position.x = (xStart + xEnd) / 2
  mesh.position.y = (yStart + yEnd) / 2
  mesh.position.z = (zStart + zEnd) / 2

  return mesh
}
