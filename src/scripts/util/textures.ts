import * as THREE from 'three'

const loader = new THREE.TextureLoader()

export const wallTexture = loader.load(
  'assets/textures/Brick/Brick_07-128x128.png'
)

export const tabletopTexture = loader.load(
  'assets/textures/Wood/Wood_03-128x128.png'
)

export const tableLegTexture = loader.load(
  'assets/textures/Wood/Wood_07-128x128.png'
)

export const floorTexture = loader.load(
  'assets/textures/Metal/Metal_07-128x128.png'
)

wallTexture.wrapS = THREE.RepeatWrapping
wallTexture.wrapT = THREE.RepeatWrapping
wallTexture.repeat = new THREE.Vector2(4, 4)
