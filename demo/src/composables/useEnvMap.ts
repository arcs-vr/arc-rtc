import { HalfFloatType, PMREMGenerator, Texture, WebGLRenderer } from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

export async function useEnvMap (renderer: WebGLRenderer, url: string): Promise<Texture> {
  const pmremGenerator = new PMREMGenerator(renderer)
  const rgbeLoader = new RGBELoader()

  pmremGenerator.compileEquirectangularShader()
  const texture = await rgbeLoader
    .setDataType(HalfFloatType)
    .loadAsync(url)

  const envMap = pmremGenerator.fromEquirectangular(texture).texture

  texture.dispose()
  pmremGenerator.dispose()

  return envMap
}
