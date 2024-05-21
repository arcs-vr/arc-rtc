import { useResizeListener } from './useResizeListener.ts'
import { PCFSoftShadowMap, PerspectiveCamera, Scene, SRGBColorSpace, WebGLRenderer } from 'three'

export function useResizingRenderer (canvas: HTMLCanvasElement) {
  const renderer = new WebGLRenderer(
    {
      canvas,
      alpha: true,
      antialias: true,
    },
  )

  const camera = new PerspectiveCamera(75, 1, 0.1, 1000)

  renderer.shadowMap.enabled = true
  renderer.outputColorSpace = SRGBColorSpace
  renderer.shadowMap.type = PCFSoftShadowMap

  useResizeListener((width, height) => {
    renderer.setSize(width, height)
    camera.aspect = width / height
    camera.updateProjectionMatrix()

    if (camera.parent instanceof Scene) {
      renderer.render(camera.parent, camera)
    }
  })

  return {
    renderer,
    camera,
  }
}
