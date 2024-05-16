<template>
  <div class="PIntro">
    <LoadingAnimation small/>
    <h1>ARCS</h1>
    <p>The demon contains a 3D experience and the accompanying gamepad style controller.</p>
    <p>It used WebRTC to create a Peer-To-Peer connection and securely transmit your input between two devices.</p>

    <p>If you only want to experience it with one device, you can control it using a mouse and keyboard.</p>

    <RouterLink
      v-slot="{ navigate, href }"
      :to="{ name: ROUTE_PARCOUR }"
      custom
    >
      <ThemedButton
        :href="href"
        @click="navigate"
      >
        Open Parcour
      </ThemedButton>
    </RouterLink>

    <RouterLink :to="{ name: ROUTE_REMOTE }">Open Remote</RouterLink>
  </div>
</template>

<script
  lang="ts"
  setup
>
import { ROUTE_PARCOUR, ROUTE_REMOTE } from '../routes.ts'
import LoadingAnimation from '../components/LoadingAnimation.vue'
import ThemedButton from '../components/ThemedButton.vue'
</script>

<style scoped>

</style>
