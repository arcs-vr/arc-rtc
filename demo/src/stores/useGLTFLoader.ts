import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { defineStore } from './defineStore.ts'

export const useGLTFLoader = defineStore(() => {
  const loader = new GLTFLoader()
  const dracoLoader = new DRACOLoader()

  dracoLoader.setDecoderPath(`${import.meta.env.BASE_URL}draco/`)
  dracoLoader.preload()
  loader.setDRACOLoader(dracoLoader)

  async function loadModel (url: string) {
    return await loader.loadAsync(`${import.meta.env.BASE_URL}${url}`)
  }

  function dispose () {
    dracoLoader.dispose()
  }

  return {
    loadModel,
    dispose
  }
})
