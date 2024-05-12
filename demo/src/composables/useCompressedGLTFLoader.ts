import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

let loader: GLTFLoader|undefined

export function useCompressedGLTFLoader () {
  if(!loader){
    loader = new GLTFLoader()

    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath(`${import.meta.env.BASE_URL}draco/`)
    dracoLoader.preload()

    loader.setDRACOLoader(dracoLoader)
  }

  return loader
}
