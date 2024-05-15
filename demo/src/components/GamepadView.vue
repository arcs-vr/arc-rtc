<template>
  <div class="GamepadView">
    <ArcJoystick
      id="move"
      :easing="moveEasing"
      class="GamepadView__move"
      label="move"
      @update="sendStickMove(JOYSTICK_TYPE.MOVE, $event)"
    />

    <ArcJoystick
      id="look"
      :easing="lookEasing"
      class="GamepadView__look"
      label="look"
      @update="sendStickMove(JOYSTICK_TYPE.LOOK, $event)"
    />

    <button
      class="GamepadView__secondary"
      @click="sendSecondary"
    >Secondary
    </button>
    <button
      class="GamepadView__primary"
      @click="sendPrimary"
    >Primary
    </button>
  </div>
</template>

<script
  lang="ts"
  setup
>

import ArcJoystick from './ArcJoystick.vue'
import { JOYSTICK_TYPE } from '../config.ts'

const emit = defineEmits<{
  send: [eventName: string, details: unknown]
}>()

function sendStickMove (type: JOYSTICK_TYPE, [x, y]: number[]) {
  emit('send', { eventName: 'stickmove', details: [type, x, y] })
}

function sendPrimary () {
  emit('send', { eventName: 'primary' })
}

function sendSecondary () {
  emit('send', { eventName: 'secondary' })
}

function moveEasing (a: number) {
  return (a < 0 ? -1 : 1) * a ** 2
}

function lookEasing (a: number) {
  return a ** 3
}
</script>

<style
  lang="scss"
  scoped
>
.GamepadView {
  display: grid;
  grid-template-areas:
   "move move secondary look look"
   "move move primary look look";
  gap: var(--spacer-1);
  background-color: var(--color-light);

  position: fixed;
  inset: 0;

  &__move,
  &__look,
  &__primary,
  &__secondary {
    background-color: var(--color-dark);
    overflow: hidden;
    color: var(--color-light);
    text-transform: uppercase;
  }

  &__move {
    grid-area: move;
  }

  &__look {
    grid-area: look;
  }

  &__primary {
    grid-area: primary;
    background-color: var(--color-primary);
    color: var(--color-dark);
  }

  &__secondary {
    grid-area: secondary;
    background-color: var(--color-secondary);
    color: var(--color-dark);
  }
}
</style>

<style>
body {
  overflow: hidden;
}
</style>
