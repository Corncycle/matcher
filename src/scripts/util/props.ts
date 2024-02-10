import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { createStaticBox } from './objects'
import {
  c_basicMaterial,
  t_tableLegMaterial,
  t_tabletopMaterial,
} from './materials'

// this file is for loading in models for props

const loader = new GLTFLoader()

export let statue2: THREE.Group | undefined

loader.load('assets/models/mino2.glb', (gltf) => {
  statue2 = gltf.scene
  statue2.scale.set(0.25, 0.25, 0.25)
})

// function loadProp(path: string) {
//   let out
//   loader.load(path, (gltf) => {
//     out = gltf.scene
//   })
//   return out
// }

export enum PropTypes {
  MINO_STATUE = 'minotaur',
}

export function createStatueProp(
  x: number,
  y: number,
  z: number,
  rotationAboutVertical: number = 0
) {
  const plinthOffsetX = 0.15 / 4
  const plinthOffsetY = -2.5 / 4
  const plinthOffsetZ = 0 / 4

  const g = new THREE.Group()
  const s = statue2!.clone()
  // s.children[0].castShadow = true
  // s.receiveShadow = true
  const { mesh: plinthMesh } = createStaticBox(
    3.5 / 4,
    1.5 / 4,
    2.5 / 4,
    plinthOffsetX,
    plinthOffsetY,
    plinthOffsetZ,
    t_tabletopMaterial
  )

  const plinthBody = new CANNON.Body({ mass: 0, material: c_basicMaterial })
  const cubeShape = new CANNON.Box(new CANNON.Vec3(3.5 / 8, 1.5 / 8, 2.5 / 8))
  const statueBlocker = new CANNON.Box(new CANNON.Vec3(3.5 / 8, 0.5, 2.5 / 8))
  plinthBody.addShape(
    cubeShape,
    new CANNON.Vec3(0 + plinthOffsetX, 0 + plinthOffsetY, 0 + plinthOffsetZ)
  )
  plinthBody.addShape(
    statueBlocker,
    new CANNON.Vec3(0 + plinthOffsetX, 0.7 + plinthOffsetY, 0 + plinthOffsetZ)
  )

  g.add(plinthMesh)
  g.add(s)

  g.position.set(x, y, z)
  plinthBody.position.set(x, y, z)

  rotateAboutVertical(g, plinthBody, rotationAboutVertical)

  return { meshGroup: g, body: plinthBody }
}

function rotateAboutVertical(
  group: THREE.Group,
  body: CANNON.Body,
  rotation: number
) {
  if (rotation) {
    group.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), rotation)
    body.quaternion.copy(group.quaternion as any)
  }
}
