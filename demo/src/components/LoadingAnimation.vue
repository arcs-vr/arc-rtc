<template>
  <div
    :data-small="small || undefined"
    class="LoadingAnimation"
    v-html="arcLogo"
  />
</template>

<script
  lang="ts"
  setup
>
import arcLogo from '@arcs/design/images/arc-logo.svg?raw'

defineProps<{
  small?: boolean
}>()
</script>

<style>
@import "@arcs/design/src/logo-animation.scss";

.LoadingAnimation {
  width: min(500px, 80vw);
  height: min(500px, 80vw);

  &[data-small] {
    width: min(250px, 40vw);
    height: min(250px, 40vw);
  }
}
</style>
