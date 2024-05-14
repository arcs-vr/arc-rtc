import type { Camera, Mesh } from 'three'
import { Raycaster, Vector2 } from 'three'
import { shallowRef, watchEffect } from 'vue'
import { defineStore } from './defineStore.ts'
import { useCursor } from './useCursor.ts'

type InteractiveObjectConfig = {
  maxDistance: number
  onClick: () => {}
  iconPrimary?: string
  iconSecondary?: string
}

export const useRaycastPointer = defineStore(async () => {
  const { setIcon, clearIcon } = await useCursor()
  const raycaster = new Raycaster(undefined, undefined, 0, 200)
  raycaster.firstHitOnly = true

  let domElement: HTMLElement
  const intersections = []
  const objectsMap = new Map<Mesh, InteractiveObjectConfig>
  let objectsToIntersect = []
  const intersectedObjectConfig = shallowRef<InteractiveObjectConfig>()

  const cameraCenter = new Vector2(0, 0)

  function clear () {
    intersectedObjectConfig.value = undefined
  }

  function update (camera: Camera) {
    camera.updateMatrixWorld()
    raycaster.setFromCamera(cameraCenter, camera)

    intersections.length = 0
    raycaster.intersectObjects(objectsToIntersect, false, intersections)

    if (intersections.length === 0) {
      clear()
      return
    }

    const { object, distance } = intersections[0]
    const config = objectsMap.get(object)

    if (distance > config.maxDistance) {
      clear()
      return
    }

    intersectedObjectConfig.value = config
  }

  watchEffect(() => {
    intersectedObjectConfig.value?.iconPrimary
      ? setIcon('primary', intersectedObjectConfig.value.iconPrimary)
      : clearIcon('primary')

    intersectedObjectConfig.value?.iconSecondary
      ? setIcon('secondary', intersectedObjectConfig.value.iconSecondary)
      : clearIcon('secondary')
  })

  function addObject (object: Mesh, config: InteractiveObjectConfig) {
    object.geometry.computeBoundsTree()
    objectsMap.set(object, config)
    objectsToIntersect = Array.from(objectsMap.keys())
  }

  function onClick () {
    intersectedObjectConfig.value?.onClick?.()
  }

  function connect (element: HTMLElement) {
    domElement = element
    domElement.addEventListener('click', onClick)
  }

  function dispose () {
    intersections.length = 0
    objectsToIntersect.length = 0
    objectsMap.clear()
    domElement.removeEventListener('click', onClick)
    domElement = null
  }

  return {
    connect,
    dispose,
    update,
    addObject,
    onClick
  }
})
