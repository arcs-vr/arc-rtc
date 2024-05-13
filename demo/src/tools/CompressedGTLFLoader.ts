import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

const CompressedGLTFLoader = new GLTFLoader()

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath(`${import.meta.env.BASE_URL}draco/`)
dracoLoader.preload()

CompressedGLTFLoader.setDRACOLoader(dracoLoader)

export {
  CompressedGLTFLoader
}
