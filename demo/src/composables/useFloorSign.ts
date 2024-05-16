import { Scene } from 'three'
import { useSign, Vector3Params } from './useSign.ts'

import signGltfUrl from '../assets/models/arc-sign-floor/arc-sign-floor.gltf?url'
import { useGLTFLoader } from '../tools/CompressedGTLFLoader.ts'

let gltf: Scene | undefined

export async function useFloorSign (position: Vector3Params, rotation: Vector3Params, url) {
  if (!gltf) {
    const { loadModel } = await useGLTFLoader()
    gltf = await loadModel(signGltfUrl)
    gltf.scene.scale.set(.8, .8, .8)
  }

  return useSign(position, rotation, gltf, url)
}
