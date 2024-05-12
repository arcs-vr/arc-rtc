<template>
  <div class="PIntro">
    <h1>ARCS</h1>
    <p>WebRTC demo</p>

    <RouterLink :to="{ name: ROUTE_PARCOUR }">Parcour</RouterLink>
    <RouterLink :to="{ name: ROUTE_REMOTE }">Remote</RouterLink>
  </div>
</template>

<script
  lang="ts"
  setup
>
import {ROUTE_PARCOUR, ROUTE_REMOTE} from '../routes.ts'
</script>

<style scoped>

</style>
