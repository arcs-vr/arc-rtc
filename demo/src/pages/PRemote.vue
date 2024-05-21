<template>
  <div class="PRemote">
    <Transition name="fade">
      <template v-if="status === PEER_STATUS.CONNECTED">
        <GamepadView
          v-if="isLandscape"
          @send="onSendEvent"
        />

        <div v-else>
          Please rotate your phone to landscape mode.
        </div>
      </template>

      <div
        v-else
        class="PRemote__scanner"
      >
        <div
          class="PRemote__animation"
          data-logo-target
        ></div>

        <div>
          <h1>Remote Gamepad</h1>
          <p>Scan the QR Code on your desktop or laptop.</p>
        </div>

        <video
          ref="qrCamera"
          class="PRemote__video"
        ></video>
      </div>
    </Transition>
  </div>
</template>

<script
  lang="ts"
  setup
>
import { nextTick, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
import QrScanner from 'qr-scanner'
import GamepadView from '../components/GamepadView.vue'
import { PEER_STATUS } from '../config.ts'
import { useMediaQuery } from '../composables/useMediaQuery.ts'
import { usePeerEmitter } from '../composables/usePeerEmitter.ts'

const secret = shallowRef<string>()
const qrCamera = shallowRef<HTMLVideoElement>()
let qrScanner: QrScanner | null = null

const { matches: isLandscape } = useMediaQuery('(orientation: landscape)')
const { status, connect, send, destroy: destroyPeerEmitter } = usePeerEmitter()

watch(status, async (newStatus) => {
  if (newStatus === PEER_STATUS.NOT_CONNECTED) {
    return startScanning()
  }
})

onMounted(async () => {
  if (checkUrl(window.location.href)) {
    return
  }

  await nextTick()
  return startScanning()
})

onBeforeUnmount(() => {
  qrScanner?.destroy()
  qrScanner = null
  destroyPeerEmitter()
})

async function startScanning () {
  await QrScanner.listCameras(true)

  if (!qrCamera.value) {
    return
  }

  qrScanner = new QrScanner(
    qrCamera.value,
    onQRScanned,
    {},
  )

  return qrScanner.start()
}

function checkUrl (urlString: string) {
  const url = new URL(urlString)
  if (url.searchParams.has('id')) {
    secret.value = url.searchParams.get('id') ?? undefined

    if (secret.value) {
      connect(secret.value)
      return true
    }
  }

  return false
}

function onQRScanned (result: QrScanner.ScanResult) {
  if (checkUrl(result.data)) {
    qrScanner?.stop()
    qrScanner?.destroy()
    qrScanner = null
  }
}

function onSendEvent ({ eventName, details }: { eventName: string, details: unknown }) {
  send(eventName, details)
}
</script>

<style
  lang="scss"
  scoped
>
.PRemote {

  &__animation {
    width: 250px;
    aspect-ratio: var(--logo-aspect-ratio);
  }

  &__scanner {
    display: flex;
    flex-flow: column nowrap;
    gap: var(--spacer-5);
    align-items: center;
    justify-content: center;
    text-align: center;
    position: fixed;
    inset: 0;

    @media screen and (orientation: landscape) and (max-width: 1920px) {
      flex-flow: row nowrap;
    }
  }

  &__video {
    height: min(80dvmin, 500px);
    object-fit: cover;
    width: min(80dvmin, 500px);
    background-color: var(--color-dark-25p-lighter);
  }
}
</style>
