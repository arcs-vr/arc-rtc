<template>
  <div
      :id="id"
      ref="root"
      class="ArcJoystick"
      @touchstart.passive="updateMovement"
      @touchmove.passive="updateMovement"
      @touchend.passive="stopMovement"
  >
    <div class="ArcJoystick__root">
      <span
          v-once
          class="ArcJoystick__center"
      />

      <div
          ref="cursor"
          :data-animated="cursorPosition[0] === 0 && cursorPosition[1] === 0"
          class="ArcJoystick__cursor"
      />
    </div>

    <span
        v-once
        class="ArcJoystick__label"
    >{{ label }}</span>
  </div>
</template>

<script
    lang="ts"
    setup
>
import { computed, nextTick, onBeforeUnmount, onMounted, shallowRef } from 'vue'

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

let centerOfJoystick: { clientX: number, clientY: number } | null = null
let joystickBounds: { width: number, height: number } | null = null

let currentHold: Touch | null = null
const cursorPosition = shallowRef([0, 0])
const gradient = computed(() => {
  const gradientPoints = 10
  const points = Array(gradientPoints)
      .fill(0)
      .map((_, i) => `hsl(0deg 0% ${props.easing(i / (gradientPoints - 1)) * 20}%)`)
      .join(', ')

  return `radial-gradient(closest-side, ${points})`
})

let resizeObserver: ResizeObserver | null = null

onMounted(async () => {
  await nextTick()

  resizeObserver = new ResizeObserver(() => {
    const cursorRect = cursor.value.getBoundingClientRect()
    const boundaryRect = root.value.getBoundingClientRect()
    centerOfJoystick = {
      clientX: Math.round(cursorRect.left + (cursorRect.width / 2)),
      clientY: Math.round(cursorRect.top + (cursorRect.height / 2))
    }

    joystickBounds = {
      width: Math.floor(boundaryRect.width / 2) - 20,
      height: Math.floor(boundaryRect.height / 2) - 20
    }
  })

  resizeObserver.observe(cursor.value)
  resizeObserver.observe(root.value)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
})

function absMin (first: number, second: number) {
  return ((first < 0 || second < 0) ? -1 : 1) * Math.min(Math.abs(first), Math.abs(second))
}

function updateMovement (event: TouchEvent) {
  for (const touch of event.touches) {
    if ((event.target as HTMLElement).id !== props.id) {
      continue
    }

    currentHold = touch
    updateTransform(
      absMin(currentHold.clientX - centerOfJoystick.clientX, joystickBounds.width),
      absMin(currentHold.clientY - centerOfJoystick.clientY, joystickBounds.height)
    )
  }
}

function stopMovement () {
  updateTransform(0, 0)
  emit('update', [0, 0])
}

function updateTransform(x: number, y: number) {
  cursorPosition.value = [x, y]
  cursor.value.style.transform = `translate3d(${x}px, ${y}px, 0)`
  emit(
      'update',
      [
        props.easing(x / joystickBounds.width),
        props.easing(y / joystickBounds.height)
      ]
  )
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
  background-image: v-bind(gradient);
  display: flex;
  height: 100%;
  justify-content: center;
  position: relative;
  text-align: center;
  width: 100%;

  &__root {
    display: block;
    height: $cursor-base;
    position: relative;
    width: $cursor-base;
    pointer-events: none;
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
    background-image: url("../assets/icons/joystick_arrows.svg");
    border-radius: 50%;
    border: 2px solid var(--color-light-25p-opaque);
    display: block;
    height: $cursor-base;
    width: $cursor-base;
    pointer-events: none;

    &[data-animated="true"] {
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
