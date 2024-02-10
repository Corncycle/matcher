import * as THREE from 'three'

const loader = new THREE.TextureLoader()

export const tabletopTexture = loader.load(
  'assets/textures/Wood/Wood_03-128x128.png'
)
tabletopTexture.magFilter = THREE.NearestFilter

export const tableLegTexture = loader.load(
  'assets/textures/Wood/Wood_07-128x128.png'
)
tableLegTexture.magFilter = THREE.NearestFilter

export const woodTrimTexture = loader.load(
  'assets/textures/Wood/Wood_01-128x128.png'
)
woodTrimTexture.magFilter = THREE.NearestFilter
woodTrimTexture.wrapS = THREE.RepeatWrapping
woodTrimTexture.wrapT = THREE.RepeatWrapping

export const floorTexture = loader.load(
  'assets/textures/Metal/Metal_07-128x128.png'
)
floorTexture.magFilter = THREE.NearestFilter
floorTexture.wrapS = THREE.RepeatWrapping
floorTexture.wrapT = THREE.RepeatWrapping

export const carpetTexture = loader.load(
  'assets/textures/custom/2k-ccarpet-diffuse-bl-90.jpg'
)
// carpetTexture.magFilter = THREE.NearestFilter
carpetTexture.wrapS = THREE.RepeatWrapping
carpetTexture.wrapT = THREE.RepeatWrapping

export const carpetNormalTexture = loader.load(
  'assets/textures/custom/2k-ccarpet-normal-bl-90.jpg'
)
carpetNormalTexture.magFilter = THREE.NearestFilter
carpetNormalTexture.wrapS = THREE.RepeatWrapping
carpetNormalTexture.wrapT = THREE.RepeatWrapping

export const wpPinkTexture = loader.load(
  'assets/textures/custom/2k-wallpaper-pink-diffuse-bl-90.jpg'
)
wpPinkTexture.magFilter = THREE.NearestFilter
wpPinkTexture.wrapS = THREE.RepeatWrapping
wpPinkTexture.wrapT = THREE.RepeatWrapping

export const wpPinkNormalTexture = loader.load(
  'assets/textures/custom/2k-wallpaper-pink-normal-bl-90.jpg'
)
wpPinkNormalTexture.magFilter = THREE.NearestFilter
wpPinkNormalTexture.wrapS = THREE.RepeatWrapping
wpPinkNormalTexture.wrapT = THREE.RepeatWrapping
