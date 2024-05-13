<template>
  <div class="PRemote">
    <p>remote</p>

    <Transition name="fade">
      <span v-if="secret">{{ secret }}</span>

      <video
        v-else
        ref="qrCamera"
        class="PRemote__video"
      ></video>
    </Transition>
  </div>
</template>

<script
  lang="ts"
  setup
>
import { nextTick, onBeforeUnmount, onMounted, shallowRef } from 'vue'
import { Peer } from 'peerjs'
import QrScanner from 'qr-scanner'

const secret = shallowRef<string>()
const qrCamera = shallowRef<HTMLVideoElement>()
const qrScanner = shallowRef<QrScanner>()

onMounted(async () => {
  await nextTick()

  const cameras = await QrScanner.listCameras(true)

  qrScanner.value = new QrScanner(
    qrCamera.value,
    onQRScanned,
    {},
  )

  return qrScanner.value.start()
})

onBeforeUnmount(() => {
  qrScanner.value?.destroy()
  qrScanner.value = null
})

function onQRScanned (result) {
  secret.value = result.data
  qrScanner.value.stop()
  connect()
}

const peer = shallowRef<Peer>()

function connect () {
  if (!peer.value) {
    peer.value = new Peer({ secure: true, debug: 3 })
  }

  const conn = peer.connect(secret.value)
  // on open will be launch when you successfully connect to PeerServer
  conn.on('open', function (id) {
    console.info(id, conn)
    // here you have conn.id
    conn.send('remote connected')
  })
}
</script>

<style
  lang="scss"
  scoped
>
.PRemote {

  &__video {
    height: 80vw;
    object-fit: cover;
    width: 80vw;
  }
}
</style>
