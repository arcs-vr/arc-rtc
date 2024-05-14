<template>
  <div
    class="LoadingAnimation"
    v-html="arcLogo"
  />
</template>

<script
  lang="ts"
  setup
>
import arcLogo from '@arcs/design/images/arc-logo.svg?raw'
</script>

<style>
@import "@arcs/design/src/logo-animation.scss";

.LoadingAnimation {
  width: min(500px, 80vw);
  height: min(500px, 80vw);
}
</style>
