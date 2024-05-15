<template>
  <div
    ref="root"
    class="ParcourCanvas"
    @click="lockPointer"
    @lock="showStartButton = false"
    @unlock="showStartButton = true"
  >
    <Transition name="fade">
      <button
        v-if="canStart && !isLocked && !animationFrameID"
        class="ParcourCanvas__startButton"
        type="button"
        @click="start"
      >
        Start
      </button>
    </Transition>
  </div>
</template>

<script
  lang="ts"
  setup
>
import '../bvh-raycasting.ts'
import { nextTick, onBeforeUnmount, onMounted, shallowRef } from 'vue'
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
import { PLAYER_HEIGHT } from '../config.ts'
import { useNumpadLockedDoor } from '../composables/useNumpadLockedDoor.ts'
import { useCursor } from '../stores/useCursor.ts'
import { useRaycastPointer } from '../stores/useRaycastPointer.ts'
import { CompressedGLTFLoader } from '../tools/CompressedGTLFLoader.ts'

const root = shallowRef<HTMLDivElement>()

const canStart = shallowRef(false)
const canvas = document.createElement('canvas')
canvas.classList.add('ParcourCanvas__canvas')

const clock = new Clock()
let animationFrameID: number | undefined = undefined

const { camera, renderer } = useResizingRenderer(canvas)

const {
  isLocked,
  lockPointer,
  update: updateControls,
  connect: connectControls,
  dispose: disposeControls,
} = await useUserControls(camera, root)

camera.position.set(-120, PLAYER_HEIGHT + 0.1, 0)
camera.rotation.set(0, -90 * DEG2RAD, 0)

const envMap = await useEnvMap(renderer, envMapUrl)
const scene = new Scene()
scene.environment = envMap
scene.add(camera)

const {
  cursor,
  iconMeshes
} = await useCursor()

const {
  connect: connectRaycastPointer,
  dispose: disposeRaycastPointer,
  update: updateRaycastPointer,
} = await useRaycastPointer()

let stats
if (import.meta.env.DEV) {
  const module = await import('stats.js')
  const Stats = module.default
  stats = new Stats()
  stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom)
}

camera.add(
  cursor,
  iconMeshes.primary,
  iconMeshes.secondary
)

scene.add(
  (await CompressedGLTFLoader.loadAsync(roomsGltfUrl)).scene,

  ...await Promise.all([
    useFloorSign([-116, 0, -2], [0, -70 * DEG2RAD, 0], gazeNavPosterUrl),
    useFloorSign([-116, 0, 2], [0, -120 * DEG2RAD, 0], connectPosterUrl),
    useFloorSign([216, 0, -2], [0, -70 * DEG2RAD, 0], thankYouPosterUrl),
    useFloorSign([8, 0, 0], [0, -90 * DEG2RAD, 0], secondaryToJumpPosterUrl),
    useWallSign([-103, 0, 8], [0, -90 * DEG2RAD, 0], findTheCodePosterUrl),
    useNumpadLockedDoor([-102, 0, 0], '303909', 'door_1'),
    useNumpadLockedDoor([0, 0, 0], '271828', 'door_2'),
    useNumpadLockedDoor([102, 0, 0], '314159', 'door_3'),
    useNumpadLockedDoor([204, 0, 0], '161803', 'door_4')
  ]),
)

function render (time: number) {
  stats?.begin()
  const delta = clock.getDelta()
  updateAllTweens(time)
  updateControls(time, delta)
  updateRaycastPointer(camera)
  renderer.render(scene, camera)
  stats?.end()
  animationFrameID = window.requestAnimationFrame(render)
}

onMounted(async () => {
  await nextTick()

  root.value?.appendChild(canvas)

  connectControls(root.value)
  connectRaycastPointer(root.value)

  renderer.render(scene, camera)
  canStart.value = true
})

onBeforeUnmount(() => {
  window.cancelAnimationFrame(animationFrameID)

  disposeControls()
  disposeRaycastPointer()

  renderer.dispose()

  animationFrameID = null
})

function start () {
  lockPointer()
  animationFrameID = window.requestAnimationFrame(render)
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

  :deep(canvas) {
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
