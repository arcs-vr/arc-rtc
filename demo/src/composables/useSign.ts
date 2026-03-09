import { Mesh, RepeatWrapping, TextureLoader } from 'three'
import { Vector3Params } from '../types.ts'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

let textureLoader = new TextureLoader()

export async function useSign (position: Vector3Params, rotation: Vector3Params, gltf: GLTF, url: string) {
  const newSign = gltf.scene.clone(true)

  newSign.position.set(...position)
  newSign.rotation.set(...rotation)

  const texture = await textureLoader.loadAsync(url)
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping
  texture.flipY = false

  newSign.traverseVisible(child => {
    if (child instanceof Mesh && child.material?.name === 'poster') {
      child.material = child.material.clone()
      child.material.map = texture
      child.material.needsUpdate = true
    }
  })

  return newSign
}
