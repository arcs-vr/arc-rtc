import type { Camera, Mesh } from 'three'
import { Raycaster, Vector2 } from 'three'
import { onBeforeUnmount, onMounted, shallowRef } from 'vue'

type InteractiveObjectConfig = {
  maxDistance: number
  onClick: () => {}
  iconPrimary?: string
  iconSecondary?: string
}

const raycaster = new Raycaster(undefined, undefined, 0, 200)
raycaster.firstHitOnly = true

const intersections = []
const objectsMap = new Map<Mesh, InteractiveObjectConfig>
let objectsToIntersect = []
let intersectedObjectConfig: InteractiveObjectConfig

const cameraCenter = new Vector2(0, 0)
const intersectedObjectName = shallowRef<string>()
const intersectedMaterialName = shallowRef<string>()

function clear () {
  intersectedObjectConfig = undefined
  intersectedObjectName.value = undefined
  intersectedMaterialName.value = undefined
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

  intersectedObjectConfig = config
  intersectedObjectName.value = object.name
  intersectedMaterialName.value = object.material?.name
}

function addObject (object: Mesh, config: InteractiveObjectConfig) {
  object.geometry.computeBoundsTree()
  objectsMap.set(object, config)
  objectsToIntersect = Array.from(objectsMap.keys())
}

function onClick () {
  intersectedObjectConfig?.onClick()
}

function setup () {
  onMounted(() => {
    window.addEventListener('click', onClick)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('click', onClick)
  })
}

export function useRaycastPointer () {

  return {
    setup,
    update,
    addObject,
    intersectedObjectName,
    intersectedMaterialName,
    onClick
  }
}
