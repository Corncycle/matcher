import * as THREE from 'three'

export const wallTexture = new THREE.TextureLoader().load(
  '../../assets/textures/Brick/Brick_07-128x128.png'
)

export const setTexture = (
  material: THREE.MeshToonMaterial,
  texture: THREE.Texture
) => {
  material.map = texture
}
