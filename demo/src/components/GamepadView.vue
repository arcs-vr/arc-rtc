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
      @touchstart.passive="sendSecondary"
    >Secondary
    </button>
    <button
      class="GamepadView__primary"
      @touchstart.passive="sendPrimary"
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
import { Easing } from '@tweenjs/tween.js'

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
  return (a < 0 ? -1 : 1) * Easing.Sinusoidal.In(a)
}
</script>

<style
  lang="scss"
  scoped
>
.GamepadView {
  background-color: var(--color-light);
  display: grid;
  gap: var(--spacer-1);
  grid-template-areas:
    "move move secondary look look"
    "move move primary look look";
  position: fixed;
  inset: 0;

  &__move,
  &__look,
  &__primary,
  &__secondary {
    background-color: var(--color-dark);
    color: var(--color-light);
    overflow: hidden;
    text-transform: uppercase;
    user-select: none;
  }

  &__move {
    grid-area: move;
  }

  &__look {
    grid-area: look;
  }

  &__primary,
  &__secondary {
    color: var(--color-dark);
  }

  &__primary {
    background-color: var(--color-primary);
    grid-area: primary;
  }

  &__secondary {
    background-color: var(--color-secondary);
    grid-area: secondary;
  }
}
</style>

<style>
body {
  overflow: hidden;
}
</style>
