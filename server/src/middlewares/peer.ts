import { PeerServer } from 'peer'

export function createPeerServer(path: string) {
  const peerServer = PeerServer({
    path,
  })

  peerServer.on('connection', (client) => {
    console.log('Client connected:', client.getId())
  })

  peerServer.on('disconnect', (client) => {
    console.log('Client disconnected:', client.getId())
  })

  peerServer.on('error', (err) => {
    console.error('PeerJS error:', err)
  })

  return peerServer
}