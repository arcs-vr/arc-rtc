import { computed, shallowRef } from 'vue'
import { Peer } from 'peerjs'
import { eventIdToName, PEER_STATUS } from '../config.ts'

export function usePeerReceiver () {
  const id = shallowRef(`arcs-rtc-${crypto.randomUUID()}`)
  const url = computed(() => `${window.location.origin}/remote?id=${id.value}`)
  const status = shallowRef<PEER_STATUS>(PEER_STATUS.NOT_CONNECTED)
  let peer: Peer

  async function getSession (): Promise<void> {
    await fetch('/session', {
      credentials: 'include',
      method: 'GET',
    })
  }

  async function connect () {
    await getSession()

    peer = new Peer(id.value, {
      secure: true,
      host: window.location.host,
      path: '/'
    })

    peer.on('error', (err) => {
      console.error('PeerJS error:', err)
      status.value = PEER_STATUS.NOT_CONNECTED
    })

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

      conn.on('error', function (err) {
        status.value = PEER_STATUS.NOT_CONNECTED
        console.error(err)
      })

      conn.on('close', () => {
        status.value = PEER_STATUS.NOT_CONNECTED
      })
    })
  }

  function destroy () {
    peer?.destroy()
    peer = null
  }

  return {
    url,
    status,
    connect,
    destroy
  }
}
