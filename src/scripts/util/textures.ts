import * as THREE from 'three'

const loader = new THREE.TextureLoader()

export const wallTexture = loader.load(
  'assets/textures/Brick/Brick_07-128x128.png'
)
wallTexture.magFilter = THREE.NearestFilter

export const tabletopTexture = loader.load(
  'assets/textures/Wood/Wood_03-128x128.png'
)
tabletopTexture.magFilter = THREE.NearestFilter

export const tableLegTexture = loader.load(
  'assets/textures/Wood/Wood_07-128x128.png'
)
tableLegTexture.magFilter = THREE.NearestFilter

export const floorTexture = loader.load(
  'assets/textures/Metal/Metal_07-128x128.png'
)
floorTexture.magFilter = THREE.NearestFilter

wallTexture.wrapS = THREE.RepeatWrapping
wallTexture.wrapT = THREE.RepeatWrapping
// wallTexture.repeat = new THREE.Vector2(4, 4)

floorTexture.wrapS = THREE.RepeatWrapping
floorTexture.wrapT = THREE.RepeatWrapping
