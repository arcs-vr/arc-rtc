import { Color, FrontSide, Mesh, MeshBasicMaterial, PlaneGeometry, RingGeometry, Texture, TextureLoader } from 'three'
import cancelIconUrl from '../assets/icons/baseline_cancel_black_18dp.png'
import runIconUrl from '../assets/icons/baseline_directions_run_black_18dp.png'
import swapIconUrl from '../assets/icons/baseline_swap_horizontal_circle_black_18dp.png'
import touchIconUrl from '../assets/icons/baseline_touch_app_black_18dp.png'
import jumpIconUrl from '../assets/icons/baseline_upgrade_black_18dp.png'
import { defineStore } from './defineStore.ts'
import { Easing, Tween } from '@tweenjs/tween.js'

const ICON_ANIMATION_DURATION = 200
const ICON_EASING = Easing.Cubic.Out
export const useCursor = defineStore(async () => {
  const startColor = new Color(0, 1, 1)
  const interactionColor = new Color(0, 0, 1)
  const textureLoader = new TextureLoader()
  const iconTextures = new Map<string, Texture>

  const geometry = new RingGeometry(0.005, 0.0075, 32)
  const material = new MeshBasicMaterial({
    color: startColor.clone(),
    side: FrontSide,
    transparent: true,
    opacity: 0.75,
    depthTest: false,
    depthWrite: false
  })

  const cursor = new Mesh(geometry, material, { renderOrder: 999 })

  const spriteGeometry = new PlaneGeometry(0.02, 0.02, 1)
  const spriteMaterial = new MeshBasicMaterial({
    transparent: true,
    color: startColor.clone(),
    opacity: 0,
    depthTest: false,
    depthWrite: false
  })

  const iconMeshes = {
    primary: new Mesh(spriteGeometry, spriteMaterial, { renderOrder: 999 }),
    secondary: new Mesh(spriteGeometry, spriteMaterial.clone(), { renderOrder: 999 })
  }

  const iconTweens: Record<string, Tween> = {
    primary: null,
    secondary: null,
  }

  cursor.position.set(0, 0, -0.35)
  iconMeshes.primary.position.set(-0.02, -0.02, -0.35)
  iconMeshes.primary.visible = false
  iconMeshes.secondary.position.set(0.02, -0.02, -0.35)
  iconMeshes.primary.visible = false

  const [
    touchIcon,
    cancelIcon,
    runIcon,
    swapIcon,
    jumpIcon
  ] = await Promise.all(
    [
      textureLoader.loadAsync(touchIconUrl),
      textureLoader.loadAsync(cancelIconUrl),
      textureLoader.loadAsync(runIconUrl),
      textureLoader.loadAsync(swapIconUrl),
      textureLoader.loadAsync(jumpIconUrl)
    ]
  )

  iconTextures.set('touch', touchIcon)
  iconTextures.set('cancel', cancelIcon)
  iconTextures.set('run', runIcon)
  iconTextures.set('swap', swapIcon)
  iconTextures.set('upgrade', jumpIcon)

  function setIcon (which: 'primary' | 'secondary', icon: string | null) {
    const mesh = iconMeshes[which]
    mesh.visible = true
    mesh.material.map = iconTextures.get(icon)
    mesh.material.needsUpdate = true

    iconTweens[which]?.stop()

    iconTweens[which] = new Tween(mesh.material)
      .to({ opacity: 0.75 }, ICON_ANIMATION_DURATION)
      .easing(ICON_EASING)
      .onComplete(() => {
        iconTweens[which] = null
      })
      .start()
  }

  function clearIcon (which: 'primary' | 'secondary') {
    const mesh = iconMeshes[which]
    if (!mesh.visible) {
      return
    }

    iconTweens[which]?.stop()

    iconTweens[which] = new Tween(mesh.material)
      .to({ opacity: 0 }, ICON_ANIMATION_DURATION)
      .easing(ICON_EASING)
      .onComplete(() => {
        mesh.material.map = null
        mesh.material.needsUpdate = true
        mesh.visible = false
        iconTweens[which] = null
      })
      .start()
  }

  return {
    cursor,
    iconMeshes,
    setIcon,
    clearIcon
  }
})
