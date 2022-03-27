import peerjsClient from "../realtime/peerjs/PeerjsClient.js"
import peerJsPeerConnection from "./PeerJsPeerConnection.js"
import peerJsServerDataHandler from "./PeerJsServerDataHandler.js"

const host = location.host || 'localhost'
const port = 443

// peerjsClient.setPeerId(nick)
// peerjsClient.setHost('localhost')
peerjsClient.setHost(host)
peerjsClient.setPort(port)
peerjsClient.setAsSecure()
peerjsClient.setPath('/peerjs/myapp')


const peerJsImplementation = (address) => {
    peerjsClient.setPeerId(address)
    peerjsClient.open(peerJsServerDataHandler).then(peerJsPeerConnection)
}

export default peerJsImplementation