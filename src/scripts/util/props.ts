import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

// this file is for loading in models for props

const loader = new GLTFLoader()

export let statue2: THREE.Group | undefined

loader.load('assets/models/mino2.glb', (gltf) => {
  statue2 = gltf.scene
  statue2.scale.set(0.1, 0.1, 0.1)
})

// function loadProp(path: string) {
//   let out
//   loader.load(path, (gltf) => {
//     out = gltf.scene
//   })
//   return out
// }
