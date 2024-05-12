import { Scene } from 'three'
import { useCompressedGLTFLoader } from './useCompressedGLTFLoader.ts'
import { useSign, Vector3Params } from './useSign.ts'

import signGltfUrl from '../assets/models/arc-sign-floor/arc-sign-floor.gltf?url'

let gltf: Scene|undefined


export async function useFloorSign(position: Vector3Params, rotation: Vector3Params, url) {
  const loader = useCompressedGLTFLoader()

  if(!gltf) {
    gltf = await loader.loadAsync(signGltfUrl)
    gltf.scene.scale.set(.8, .8, .8)
  }

  return useSign(position, rotation, gltf, url)
}
