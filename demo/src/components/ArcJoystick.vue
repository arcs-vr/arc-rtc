<template>
  <div
    ref="root"
    class="ArcJoystick"
  >
    <div class="ArcJoystick__root">
      <span class="ArcJoystick__center"/>
      <div
        :id="id"
        ref="cursor"
        :data-animated="(cursorX === 0 && cursorY === 0) || undefined"
        :style="cursorTransform"
        class="ArcJoystick__cursor"
        @touchstart.passive="startMovement"
        @touchmove.passive="updateMovement"
        @touchend.passive="stopMovement"
      />
    </div>
    <span class="ArcJoystick__label">{{ label }}</span>
  </div>
</template>

<script
  lang="ts"
  setup
>
import { computed, shallowRef } from 'vue'

const props = defineProps<{
  label: string
  id: string,
  easing: (amount: number) => number
}>()

const emit = defineEmits<{
  update: [xy: number[]]
}>()

const cursor = shallowRef<HTMLElement>()
const root = shallowRef<HTMLElement>()
let currentStart = null
let currentHold = null
let currentBound = null
const cursorX = shallowRef(0)
const cursorY = shallowRef(0)
const cursorTransform = computed(() => `transform: translate(${cursorX.value}px, ${cursorY.value}px)`)
const gradientPoints = 10
const gradient = computed(() => `radial-gradient(closest-side, ${Array(gradientPoints).fill(0).map((_, i) => `hsl(0deg 0% ${props.easing(i / (gradientPoints - 1)) * 20}%)`).join(', ')})`)

function startMovement () {
  const cursorRect = cursor.value.getBoundingClientRect()
  const boundaryRect = root.value.getBoundingClientRect()

  currentStart = {
    clientX: Math.round(cursorRect.left + (cursorRect.width / 2)),
    clientY: Math.round(cursorRect.top + (cursorRect.height / 2))
  }

  currentBound = {
    width: Math.floor(boundaryRect.width / 2) - 20,
    height: Math.floor(boundaryRect.height / 2) - 20
  }
}

function absMin (first, second) {
  const negation = (first < 0 || second < 0) ? -1 : 1
  const min = Math.min(Math.abs(first), Math.abs(second))

  return negation * min
}

function updateMovement (event) {
  currentHold = Array.from(event.touches).find(event => event.target.id === props.id)
  cursorX.value = absMin(currentHold.clientX - currentStart.clientX, currentBound.width)
  cursorY.value = absMin(currentHold.clientY - currentStart.clientY, currentBound.height)

  emit(
    'update',
    [
      props.easing(cursorX.value / currentBound.width),
      props.easing(cursorY.value / currentBound.height)
    ]
  )
}

function stopMovement () {
  cursorX.value = 0
  cursorY.value = 0
  currentStart = null
  currentHold = null

  emit('update', [0, 0])
}
</script>

<style
  lang="scss"
  scoped
>
@use "sass:math";

.ArcJoystick {
  $cursor-base: 50vmin;
  $cursor-base-third: math.div($cursor-base, 3);

  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  position: relative;
  width: 100%;
  text-align: center;
  background-image: v-bind(gradient);

  &__layer {
    height: 100%;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
  }

  &__root {
    display: block;
    height: $cursor-base;
    position: relative;
    width: $cursor-base;
  }

  &__center {
    background-color: var(--color-light-75p-opaque);
    border-radius: 50%;
    height: $cursor-base-third;
    left: 50%;
    pointer-events: none;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: $cursor-base-third;
  }

  &__cursor {
    background-color: var(--color-light-50p-opaque);
    background-image: url("@arcs/design/images/joystick_arrows.svg");
    border: 2px solid var(--color-light-25p-opaque);
    border-radius: 50%;
    display: block;
    height: $cursor-base;
    width: $cursor-base;

    &[data-animated] {
      transition: transform .2s ease;
    }
  }

  &__label {
    left: 50%;
    pointer-events: none;
    position: absolute;
    top: 1rem;
    transform: translateX(-50%);
    width: 90%;
  }
}
</style>
