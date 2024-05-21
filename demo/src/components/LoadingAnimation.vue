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

<style lang="scss">
@import "@arcs/design/src/logo-animation.scss";
</style>

<style
  lang="scss"
  scoped
>
.LoadingAnimation {
  align-items: center;
  display: flex;
  justify-content: center;
  aspect-ratio: var(--logo-aspect-ratio);
  --logo-width: 100%;
  --logo-height: auto;
}
</style>
