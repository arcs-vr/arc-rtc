import { DataConnection, Peer } from 'peerjs'
import { eventNameToId, PEER_STATUS } from '../config.ts'
import { shallowRef } from 'vue'

export function usePeerEmitter () {
  let peer: Peer
  let conn: DataConnection
  const status = shallowRef<PEER_STATUS>(PEER_STATUS.NOT_CONNECTED)

  function connect (secret: string) {
    peer?.destroy()
    peer = new Peer({ secure: true })

    peer.on('open', () => {
      status.value = PEER_STATUS.READY_TO_CONNECT

      conn = peer.connect(secret)

      conn.on('open', function () {
        status.value = PEER_STATUS.CONNECTED
      })

      conn.on('error', function (err) {
        status.value = PEER_STATUS.NOT_CONNECTED
        console.error(err)
      })

      conn.on('close', function () {
        status.value = PEER_STATUS.NOT_CONNECTED
      })
    })
  }

  function send (eventName: string, details: unknown) {
    const id = eventNameToId.get(eventName)
    conn?.send({ i: id, d: details })
  }

  function destroy () {
    peer?.destroy()
    peer = null
  }

  return {
    status,
    connect,
    destroy,
    send
  }
}
