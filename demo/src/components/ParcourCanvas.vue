<template>
  <div
    class="ParcourCanvas"
    ref="root"
    @lock="showStartButton = false"
    @unlock="showStartButton = true"
  >
    <Transition name="fade">
      <button
        v-if="!isLocked"
        type="button"
        @click="start"
        class="ParcourCanvas__startButton"
      >
        Start
      </button>
    </Transition>
  </div>
</template>

<script
  setup
  lang="ts"
>
import '../bvh-raycasting.ts'
import { nextTick, onMounted, shallowRef } from 'vue'
import { useEnvMap } from '../composables/useEnvMap.ts'
import envMapUrl from '../assets/envmap/brown_photostudio_02_1k.hdr?url'
import { Clock, Scene } from 'three'
import { update as updateAllTweens } from '@tweenjs/tween.js'
import { useCompressedGLTFLoader } from '../composables/useCompressedGLTFLoader.ts'
import { useUserControls } from '../composables/useUserControls.ts'
import { useFloorSign } from '../composables/useFloorSign.ts'
import { useWallSign } from '../composables/useWallSign.ts'
import { DEG2RAD } from 'three/src/math/MathUtils'

import roomsGltfUrl from '../assets/models/numbers/rooms.gltf?url'
import roomsNavMeshUrl from '../assets/models/numbers/nav_mesh.gltf?url'
import connectPosterUrl from '../assets/posters/connect_arcs.png?url'
import gazeNavPosterUrl from '../assets/posters/gaze_navigation.png?url'
import thankYouPosterUrl from '../assets/posters/thank_you.png?url'
import findTheCodePosterUrl from '../assets/posters/find_the_code.png?url'
import secondaryToJumpPosterUrl from '../assets/posters/secondary_to_jump.png?url'
import { useResizingRenderer } from '../composables/useResizingRenderer.ts'
import { usePathfinding } from '../composables/usePathfinding.ts'

const root = shallowRef<HTMLDivElement>()


const canvas = document.createElement('canvas')
canvas.classList.add('ParcourCanvas__canvas')

const clock = new Clock()
let animationFrameID: number|undefined = undefined

const { camera, renderer } = useResizingRenderer(canvas)

const pathfinding = await usePathfinding(roomsNavMeshUrl)
const { isLocked, lookControls, moveControls } = useUserControls(camera, root, pathfinding)

camera.position.set(-120, 1.7, 0)
camera.rotation.set(0, -90 * DEG2RAD, 0);

const envMap = await useEnvMap(renderer, envMapUrl)
const scene = new Scene()
scene.environment = envMap
scene.add(camera)

const gltfLoader = useCompressedGLTFLoader()

scene.add(
  (await gltfLoader.loadAsync(roomsGltfUrl)).scene,

  await useFloorSign([-116, 0, -2], [0, -70 * DEG2RAD, 0], gazeNavPosterUrl),
  await useFloorSign([-116, 0, 2], [0, -120 * DEG2RAD, 0], connectPosterUrl),
  await useFloorSign([216, 0, -2], [0, -70 * DEG2RAD, 0], thankYouPosterUrl),
  await useFloorSign([8, 0, 0], [0, -90 * DEG2RAD, 0], secondaryToJumpPosterUrl),
  await useWallSign([-103, 0, 8], [0, -90 * DEG2RAD, 0], findTheCodePosterUrl)
)

function render (time: number) {
  const delta = clock.getDelta()
  updateAllTweens(time)
  moveControls.value.update(time, delta)
  renderer.render(scene, camera)
  animationFrameID = window.requestAnimationFrame(render)
}

onMounted(async () => {
  await nextTick()

  root.value?.appendChild(canvas)

  render()
})

function start() {
  animationFrameID = window.requestAnimationFrame(render)
  lookControls.value.lock()
  moveControls.value.start()
}
</script>

<style scoped lang="scss">
.ParcourCanvas {
  display: flex;
  flex-flow: column nowrap;
  gap: var(--spacer);
  width: 100vw;
  height: 100vh;
  position: relative;

  :deep(&__canvas) {
    position: absolute;
    inset: 0;
    z-index: -1;
  }

  &__startButton {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: var(--spacer);
    background-color: var(--color-primary);
    z-index: 10;
  }
}
</style>
