import { computed, shallowRef } from 'vue'
import { Peer } from 'peerjs'
import { useQRCode } from './useQRCode.ts'
import { eventIdToName, PEER_STATUS } from '../config.ts'

export function usePeerReceiver () {
  const id = shallowRef(`arcs-rtc-${crypto.randomUUID()}`)
  const url = computed(() => `${window.location.origin}/remote?id=${id.value}`)
  const status = shallowRef<PEER_STATUS>(PEER_STATUS.NOT_CONNECTED)
  let peer: Peer

  const qrData = useQRCode(url)

  function connect () {
    peer = new Peer(id.value, { secure: true, debug: 3 })

    peer.on('open', () => {
      status.value = PEER_STATUS.READY_TO_CONNECT
    })

    peer.on('connection', function (conn) {
      status.value = PEER_STATUS.CONNECTED

      conn.on('data', function (data: { i: number, d: unknown }) {
        const eventName = eventIdToName.get(data.i)
        if (!eventName) {
          return
        }

        document.dispatchEvent(new CustomEvent(eventName, { detail: data.d }))
      })
    })

    peer.on('disconnected', () => {
      status.value = PEER_STATUS.NOT_CONNECTED
    })

    peer.on('error', () => {
      status.value = PEER_STATUS.NOT_CONNECTED
    })
  }

  return {
    qrData,
    status,
    connect
  }
}
