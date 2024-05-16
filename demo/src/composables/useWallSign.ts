import { Scene } from 'three'
import { useSign } from './useSign.ts'

import { Vector3Params } from '../types.ts'
import { useGLTFLoader } from '../stores/useGLTFLoader.ts'

let gltf: Scene | undefined

export async function useWallSign (position: Vector3Params, rotation: Vector3Params, url) {
  if (!gltf) {
    const { loadModel } = await useGLTFLoader()
    gltf = await loadModel('models/arc-sign-wall/arc-sign-wall.gltf')
  }

  return useSign(position, rotation, gltf, url)
}
