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
  'assets/textures/custom/256-ccarpet-diffuse-bl-90.jpg'
)
carpetTexture.magFilter = THREE.NearestFilter
carpetTexture.wrapS = THREE.RepeatWrapping
carpetTexture.wrapT = THREE.RepeatWrapping

export const carpetNormalTexture = loader.load(
  'assets/textures/custom/256-ccarpet-normal-bl-90.jpg'
)
carpetNormalTexture.magFilter = THREE.NearestFilter
carpetNormalTexture.wrapS = THREE.RepeatWrapping
carpetNormalTexture.wrapT = THREE.RepeatWrapping

export const plasterTexture = loader.load(
  'assets/textures/custom/256-plaster-diffuse-nn-90.jpg'
)
carpetTexture.magFilter = THREE.NearestFilter
plasterTexture.wrapS = THREE.RepeatWrapping
plasterTexture.wrapT = THREE.RepeatWrapping

export const plasterNormalTexture = loader.load(
  'assets/textures/custom/256-plaster-normal-nn-90.jpg'
)
plasterNormalTexture.magFilter = THREE.NearestFilter
plasterNormalTexture.wrapS = THREE.RepeatWrapping
plasterNormalTexture.wrapT = THREE.RepeatWrapping

export const wpPinkTexture = loader.load(
  'assets/textures/custom/256-wallpaper-pink-diffuse-bl-90.jpg'
)
wpPinkTexture.magFilter = THREE.NearestFilter
wpPinkTexture.wrapS = THREE.RepeatWrapping
wpPinkTexture.wrapT = THREE.RepeatWrapping

export const wpPinkNormalTexture = loader.load(
  'assets/textures/custom/256-wallpaper-pink-normal-bl-90.jpg'
)
wpPinkNormalTexture.magFilter = THREE.NearestFilter
wpPinkNormalTexture.wrapS = THREE.RepeatWrapping
wpPinkNormalTexture.wrapT = THREE.RepeatWrapping

export const wpGreenTexture = loader.load(
  'assets/textures/custom/256-wallpaper-green-diffuse-bl-90.jpg'
)
wpGreenTexture.magFilter = THREE.NearestFilter
wpGreenTexture.wrapS = THREE.RepeatWrapping
wpGreenTexture.wrapT = THREE.RepeatWrapping

export const wpGreenNormalTexture = loader.load(
  'assets/textures/custom/256-wallpaper-green-normal-bl-90.jpg'
)
wpGreenNormalTexture.magFilter = THREE.NearestFilter
wpGreenNormalTexture.wrapS = THREE.RepeatWrapping
wpGreenNormalTexture.wrapT = THREE.RepeatWrapping

export const wpPurpleTexture = loader.load(
  'assets/textures/custom/256-wallpaper-purple-diffuse-bl-90.jpg'
)
wpPurpleTexture.magFilter = THREE.NearestFilter
wpPurpleTexture.wrapS = THREE.RepeatWrapping
wpPurpleTexture.wrapT = THREE.RepeatWrapping

export const wpPurpleNormalTexture = loader.load(
  'assets/textures/custom/256-wallpaper-purple-normal-bl-90.jpg'
)
wpPurpleNormalTexture.magFilter = THREE.NearestFilter
wpPurpleNormalTexture.wrapS = THREE.RepeatWrapping
wpPurpleNormalTexture.wrapT = THREE.RepeatWrapping
