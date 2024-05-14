<template>
  <div class="GamepadView">
    <ArcJoystick
      id="move"
      class="GamepadView__move"
      label="move"
      @update="sendStickMove(JOYSTICK_TYPE.MOVE, $event)"
    />

    <ArcJoystick
      id="look"
      class="GamepadView__look"
      label="look"
      @update="sendStickMove(JOYSTICK_TYPE.LOOK, $event)"
    />

    <button class="GamepadView__secondary">Secondary</button>
    <button class="GamepadView__primary">Primary</button>
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
</script>

<style
  lang="scss"
  scoped
>
.GamepadView {
  display: grid;
  grid-template-areas:
   "move move secondary primary"
   "move move look look";
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
  }

  &__secondary {
    grid-area: secondary;
  }
}
</style>

<style>
body {
  overflow: hidden;
}
</style>
