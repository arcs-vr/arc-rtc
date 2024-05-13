import { shallowRef } from 'vue'
import { Peer } from 'peerjs'
import { useQRCode } from './useQRCode.ts'

export function usePeerReceiver () {
  const id = shallowRef(`arcs-rtc-${crypto.randomUUID()}`)
  const peer = new Peer(id.value, { secure: true, debug: 3 })

  const qrData = useQRCode(id)

  peer.on('connection', function (conn) {
    conn.on('data', function (data) {
      console.log(data)
    })
  })

  return {
    id,
    peer,
    qrData,
  }
}
