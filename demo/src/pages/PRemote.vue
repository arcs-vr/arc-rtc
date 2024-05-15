<template>
  <div class="PRemote">
    <Transition name="fade">
      <GamepadView
        v-if="status === PEER_STATUS.CONNECTED"
        @send="onSendEvent"
      />

      <div
        v-else
        class="PRemote__scanner"
      >
        <h1>Remote Gamepad</h1>
        <p>Scan the QR Code on your desktop or laptop.</p>
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

const secret = shallowRef<string>()
const qrCamera = shallowRef<HTMLVideoElement>()
let qrScanner: QrScanner

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

async function startScanning () {
  await QrScanner.listCameras(true)

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
    secret.value = url.searchParams.get('id')
    connect()
    return true
  }

  return false
}

function onQRScanned (result) {
  if (checkUrl(result.data)) {
    qrScanner?.stop()
    qrScanner.destroy()
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
  if (peer) {
    peer.destroy()
  }

  peer = new Peer({ secure: true })

  peer.on('open', () => {
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

function onSendEvent ({ eventName, details }) {
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
  }

  &__video {
    height: 80vmin;
    object-fit: cover;
    width: 80vmin;
  }
}
</style>
