<template>
  <Transition
    mode="out-in"
    name="fade"
  >
    <Suspense @resolve="emit('loaded')">
      <ParcourCanvas/>

      <template #fallback>
        <div
          class="PParcour__animation"
          data-logo-target
        ></div>
      </template>
    </Suspense>
  </Transition>

  <Transition name="fade">
    <ConnectionModal
      v-if="isConnectionModalOpen && qrData"
      :qr-data="qrData"
      :status="status"
      @close="onConnectionModalClose"
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
      src="../assets/icons/videogame_asset-24px.svg"
      width="48px"
    >
  </button>
</template>

<script
  lang="ts"
  setup
>
import ParcourCanvas from '../components/ParcourCanvas.vue'
import ConnectionModal from '../components/ConnectionModal.vue'
import { shallowRef, watch } from 'vue'
import { usePeerReceiver } from '../composables/usePeerReceiver.ts'
import { PEER_STATUS } from '../config.ts'
import { useQRCode } from '../composables/useQRCode.ts'

const emit = defineEmits<{ 'loaded': [] }>()

const isConnectionModalOpen = shallowRef(false)

const {
  status,
  url,
  connect,
  disconnect,
  destroy
} = usePeerReceiver()

const qrData = useQRCode(url)

watch(status, (newStatus) => {
  if (newStatus === PEER_STATUS.CONNECTED && isConnectionModalOpen.value) {
    setTimeout(() => { isConnectionModalOpen.value = false }, 1_000)
  }
})

function openModal () {
  isConnectionModalOpen.value = true
  connect()
}

function onConnectionModalClose () {
  isConnectionModalOpen.value = false

  if (status.value !== PEER_STATUS.CONNECTED) {
    destroy()
    return
  }

  disconnect()
}
</script>

<style
  lang="scss"
  scoped
>
.PParcour {

  &__animation {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    aspect-ratio: var(--logo-aspect-ratio);
  }

  &__connectButton {
    bottom: var(--spacer);
    position: fixed;
    right: var(--spacer);
  }
}
</style>
