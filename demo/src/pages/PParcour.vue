<template>
  <Suspense>
    <ParcourCanvas/>

    <template #fallback>
      <LoadingAnimation
        height="500px"
        width="500px"
      />
    </template>
  </Suspense>

  <Transition name="fade">
    <ConnectionModal
      v-if="isConnectionModalOpen && qrData"
      :qr-data="qrData"
      :status="status"
      @close="isConnectionModalOpen = false"
    />
  </Transition>

  <button
    class="PParcour__connectButton"
    title="Use phone as gamepad"
    type="button"
    @click="openModal"
  >
    <img
      alt=""
      height="48px"
      src="@arcs/design/images/videogame_asset-24px.svg"
      width="48px"
    >
  </button>
</template>

<script
  lang="ts"
  setup
>
import ParcourCanvas from '../components/ParcourCanvas.vue'
import LoadingAnimation from '../components/LoadingAnimation.vue'
import ConnectionModal from '../components/ConnectionModal.vue'
import { shallowRef, watch } from 'vue'
import { usePeerReceiver } from '../composables/usePeerReceiver.ts'
import { PEER_STATUS } from '../config.ts'

const isConnectionModalOpen = shallowRef(false)

const {
  status,
  qrData,
  connect
} = usePeerReceiver()

watch(status, (newStatus) => {
  if (newStatus === PEER_STATUS.CONNECTED && isConnectionModalOpen.value) {
    setTimeout(() => { isConnectionModalOpen.value = false }, 1_000)
  }
})

function openModal () {
  isConnectionModalOpen.value = true
  connect()
}
</script>

<style
  lang="scss"
  scoped
>
.PParcour {

  &__connectButton {
    position: fixed;
    bottom: var(--spacer);
    right: var(--spacer);
  }
}
</style>
