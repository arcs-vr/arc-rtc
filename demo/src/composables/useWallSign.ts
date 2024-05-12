import { Scene } from 'three'
import { useCompressedGLTFLoader } from './useCompressedGLTFLoader.ts'
import { useSign, Vector3Params } from './useSign.ts'

import signGltfUrl from '../assets/models/arc-sign-wall/arc-sign-wall.gltf?url'

let gltf: Scene|undefined


export async function useWallSign(position: Vector3Params, rotation: Vector3Params, url) {
  const loader = useCompressedGLTFLoader()

  if(!gltf) {
    gltf = await loader.loadAsync(signGltfUrl)
  }

  return useSign(position, rotation, gltf, url)
}
