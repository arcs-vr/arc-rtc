<template>
  <div
    ref="root"
    class="ParcourCanvas"
    @lock="showStartButton = false"
    @unlock="showStartButton = true"
  >
    <Transition name="fade">
      <button
        v-if="!isLocked"
        class="ParcourCanvas__startButton"
        type="button"
        @click="start"
      >
        Start
      </button>
    </Transition>

    <div style="position: absolute; top: 0; left: 0; padding: 1rem; background: white; color: black; z-index: 10000">
      <p>{{ intersectedObjectName ?? 'no object' }}</p>
      <p>{{ intersectedMaterialName ?? 'no material' }}</p>
    </div>
  </div>
</template>

<script
  lang="ts"
  setup
>
import '../bvh-raycasting.ts'
import { nextTick, onMounted, shallowRef } from 'vue'
import { useEnvMap } from '../composables/useEnvMap.ts'
import envMapUrl from '../assets/envmap/brown_photostudio_02_1k.hdr?url'
import { Clock, Scene } from 'three'
import { update as updateAllTweens } from '@tweenjs/tween.js'
import { useUserControls } from '../composables/useUserControls.ts'
import { useFloorSign } from '../composables/useFloorSign.ts'
import { useWallSign } from '../composables/useWallSign.ts'
import { DEG2RAD } from 'three/src/math/MathUtils'

import roomsGltfUrl from '../assets/models/numbers/rooms.gltf?url'
import connectPosterUrl from '../assets/posters/connect_arcs.png?url'
import gazeNavPosterUrl from '../assets/posters/gaze_navigation.png?url'
import thankYouPosterUrl from '../assets/posters/thank_you.png?url'
import findTheCodePosterUrl from '../assets/posters/find_the_code.png?url'
import secondaryToJumpPosterUrl from '../assets/posters/secondary_to_jump.png?url'
import { useResizingRenderer } from '../composables/useResizingRenderer.ts'
import { usePathfinding } from '../composables/usePathfinding.ts'
import { PLAYER_HEIGHT } from '../config.ts'
import { useNumpadLockedDoor } from '../composables/useNumpadLockedDoor.ts'
import { useCursor } from '../composables/useCursor.ts'
import { useRaycastPointer } from '../composables/useRaycastPointer.ts'
import { CompressedGLTFLoader } from '../tools/CompressedGTLFLoader.ts'

const root = shallowRef<HTMLDivElement>()

const canvas = document.createElement('canvas')
canvas.classList.add('ParcourCanvas__canvas')

const clock = new Clock()
let animationFrameID: number | undefined = undefined

const { camera, renderer } = useResizingRenderer(canvas)

const { setup: setupPathfinding } = usePathfinding()
await setupPathfinding()

const {
  isLocked,
  lookControls,
  moveControls,
  update: updateControls
} = useUserControls(camera, root)

camera.position.set(60, PLAYER_HEIGHT, 5)
camera.rotation.set(0, -90 * DEG2RAD, 0)

const envMap = await useEnvMap(renderer, envMapUrl)
const scene = new Scene()
scene.environment = envMap
scene.add(camera)

const { cursor, iconMeshes } = useCursor()
const {
  setup: setupRaycastPointer,
  update: updateIntersections,
  intersectedObjectName,
  intersectedMaterialName,
} = useRaycastPointer(true)
await setupRaycastPointer()

camera.add(
  cursor,
  iconMeshes.primary,
  iconMeshes.secondary
)

scene.add(
  (await CompressedGLTFLoader.loadAsync(roomsGltfUrl)).scene,

  await useFloorSign([-116, 0, -2], [0, -70 * DEG2RAD, 0], gazeNavPosterUrl),
  await useFloorSign([-116, 0, 2], [0, -120 * DEG2RAD, 0], connectPosterUrl),
  await useFloorSign([216, 0, -2], [0, -70 * DEG2RAD, 0], thankYouPosterUrl),
  await useFloorSign([8, 0, 0], [0, -90 * DEG2RAD, 0], secondaryToJumpPosterUrl),
  await useWallSign([-103, 0, 8], [0, -90 * DEG2RAD, 0], findTheCodePosterUrl),
  await useNumpadLockedDoor([-102, 0, 0], '303909', 'door_1'),
  await useNumpadLockedDoor([0, 0, 0], '271828', 'door_2'),
  await useNumpadLockedDoor([102, 0, 0], '314159', 'door_3'),
  await useNumpadLockedDoor([204, 0, 0], '161803', 'door_4'),
)

function render (time: number) {
  const delta = clock.getDelta()
  updateAllTweens(time)
  updateControls(time, delta)
  updateIntersections(camera)
  renderer.render(scene, camera)
  animationFrameID = window.requestAnimationFrame(render)
}

onMounted(async () => {
  await nextTick()

  root.value?.appendChild(canvas)

  render()
})

function start () {
  animationFrameID = window.requestAnimationFrame(render)
  lookControls.value.lock()
  moveControls.value.start()
}
</script>

<style
  lang="scss"
  scoped
>
.ParcourCanvas {
  display: flex;
  flex-flow: column nowrap;
  gap: var(--spacer);
  height: 100vh;
  position: relative;
  width: 100vw;

  :deep(&__canvas) {
    inset: 0;
    position: absolute;
    z-index: -1;
  }

  &__startButton {
    background-color: var(--color-primary);
    left: 50%;
    padding: var(--spacer);
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
  }
}
</style>

<style>
body {
  overflow: hidden;
}
</style>
