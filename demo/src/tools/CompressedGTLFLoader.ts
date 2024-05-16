import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { defineStore } from '../stores/defineStore.ts'

export const useGLTFLoader = defineStore(() => {
  const loader = new GLTFLoader()
  const dracoLoader = new DRACOLoader()

  dracoLoader.setDecoderPath(`${import.meta.env.BASE_URL}draco/`)
  dracoLoader.preload()
  loader.setDRACOLoader(dracoLoader)

  async function loadModel (url: string) {
    const parsedURL = new URL(url, import.meta.url)
    const lastSeparatorIndex = parsedURL.href.lastIndexOf('/')
    const baseUrl = parsedURL.href.substring(0, lastSeparatorIndex)

    const response = await fetch(url)
    const data = await response.json()

    return await loader.parseAsync(data, baseUrl + '/')
  }

  return {
    loadModel
  }
})
