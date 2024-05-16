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
import { DataConnection, Peer } from 'peerjs'
import QrScanner from 'qr-scanner'
import GamepadView from '../components/GamepadView.vue'
import { eventNameToId, PEER_STATUS } from '../config.ts'
import { useMediaQuery } from '../composables/useMediaQuery.ts'

const secret = shallowRef<string>()
const qrCamera = shallowRef<HTMLVideoElement>()
let qrScanner: QrScanner | null = null

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
})

const { matches: isLandscape } = useMediaQuery('(orientation: landscape)')

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
    connect()
    return true
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

let peer: Peer
let conn: DataConnection
const status = shallowRef<PEER_STATUS>(PEER_STATUS.NOT_CONNECTED)

watch(status, async (newStatus) => {
  if (newStatus === PEER_STATUS.NOT_CONNECTED) {
    return startScanning()
  }
})

function connect () {
  peer?.destroy()
  peer = new Peer({ secure: true })

  peer.on('open', () => {
    if (!secret.value) {
      return
    }

    conn = peer.connect(secret.value)

    conn.on('open', function () {
      status.value = PEER_STATUS.CONNECTED
    })

    conn.on('error', function (err) {
      status.value = PEER_STATUS.NOT_CONNECTED
      console.error(err)
    })

    conn.on('disconnected', function () {
      status.value = PEER_STATUS.NOT_CONNECTED
    })
  })
}

function onSendEvent ({ eventName, details }: { eventName: string, details: unknown }) {
  const id = eventNameToId.get(eventName)
  conn?.send({ i: id, d: details })
}
</script>

<style
  lang="scss"
  scoped
>
.PRemote {

  &__scanner {
    display: flex;
    flex-flow: column nowrap;
    gap: var(--spacer-5);
    align-items: center;
    justify-content: center;
    text-align: center;
    position: fixed;
    inset: 0;

    @media screen and (orientation: landscape) {
      flex-flow: row nowrap;
    }
  }

  &__video {
    height: 80dvmin;
    object-fit: cover;
    width: 80dvmin;
  }
}
</style>
