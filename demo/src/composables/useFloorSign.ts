import { useSign } from './useSign.ts'
import { useGLTFLoader } from '../stores/useGLTFLoader.ts'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { Vector3Params } from '../types.ts'

let gltf: GLTF | undefined

export async function useFloorSign (position: Vector3Params, rotation: Vector3Params, url: string) {
  if (!gltf) {
    const { loadModel } = await useGLTFLoader()
    gltf = await loadModel('models/arc-sign-floor/arc-sign-floor.gltf')
    gltf.scene.scale.set(.8, .8, .8)
  }

  return useSign(position, rotation, gltf, url)
}
