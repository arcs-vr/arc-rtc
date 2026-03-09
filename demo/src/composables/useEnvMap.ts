import { HalfFloatType, PMREMGenerator, Texture, WebGLRenderer } from 'three'
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader'

export async function useEnvMap (renderer: WebGLRenderer, url: string): Promise<Texture> {
  const pmremGenerator = new PMREMGenerator(renderer)
  const rgbeLoader = new HDRLoader()

  pmremGenerator.compileEquirectangularShader()
  const texture = await rgbeLoader
    .setDataType(HalfFloatType)
    .loadAsync(url)

  const envMap = pmremGenerator.fromEquirectangular(texture).texture

  texture.dispose()
  pmremGenerator.dispose()

  return envMap
}
