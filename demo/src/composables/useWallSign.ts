import { Scene } from 'three'
import { useSign } from './useSign.ts'

import signGltfUrl from '../assets/models/arc-sign-wall/arc-sign-wall.gltf?url'
import { Vector3Params } from '../types.ts'
import { useGLTFLoader } from '../tools/CompressedGTLFLoader.ts'

let gltf: Scene | undefined

export async function useWallSign (position: Vector3Params, rotation: Vector3Params, url) {
  if (!gltf) {
    const { loadModel } = await useGLTFLoader()
    gltf = await loadModel(signGltfUrl)
  }

  return useSign(position, rotation, gltf, url)
}
