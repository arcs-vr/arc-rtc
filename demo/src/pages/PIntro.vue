<template>
  <div class="PIntro">
    <LoadingAnimation small/>
    <h1>Arbitrary Remote Control System</h1>
    <p>This demo contains a <strong>3D experience</strong> and the accompanying <em>gamepad
      controller</em>.</p>
    <p>It uses <b>WebRTC</b> to create a <b>Peer-To-Peer</b> connection and securely transmit your input between two
      devices.</p>

    <p>If you only want to experience it with one device, you can control it using a mouse and keyboard.</p>

    <div class="PIntro__buttons">
      <RouterLink
        v-slot="{ navigate, href }"
        :to="{ name: ROUTE_PARCOUR }"
        custom
      >
        <ThemedButton
          :href="href"
          @click="navigate"
        >
          <img
            alt=""
            height="32"
            src="../assets/icons/baseline_directions_run_black_18dp.png"
            width="32"
          >
          Open Parcour
        </ThemedButton>
      </RouterLink>

      <RouterLink
        v-slot="{ navigate, href }"
        :to="{ name: ROUTE_REMOTE }"
        custom
      >
        <ThemedButton
          :href="href"
          secondary
          @click="navigate"
        >
          <img
            alt=""
            height="32px"
            src="../assets/icons/videogame_asset-24px.svg"
            width="32px"
          >
          Open Remote
        </ThemedButton>
      </RouterLink>
    </div>
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

<style
  lang="scss"
  scoped
>
.PIntro {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-5);
  text-align: center;
  align-items: center;
  font-size: 1.2rem;
  max-width: 500px;

  &__buttons {
    display: flex;
    gap: var(--spacer-3);
    justify-content: center;
  }
}
</style>
