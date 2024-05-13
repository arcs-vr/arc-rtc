import { Scene } from 'three'
import { useSign, Vector3Params } from './useSign.ts'

import signGltfUrl from '../assets/models/arc-sign-floor/arc-sign-floor.gltf?url'
import { CompressedGLTFLoader } from '../tools/CompressedGTLFLoader.ts'

let gltf: Scene | undefined

export async function useFloorSign (position: Vector3Params, rotation: Vector3Params, url) {
  if (!gltf) {
    gltf = await CompressedGLTFLoader.loadAsync(signGltfUrl)
    gltf.scene.scale.set(.8, .8, .8)
  }

  return useSign(position, rotation, gltf, url)
}
