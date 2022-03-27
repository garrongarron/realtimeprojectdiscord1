import profile from "../discord/objects/Profile.js"
import eventBus from "../EventBus.js"
import peerjsConnectionHandler from "../realtime/peerjs/PeerjsConnectionHandler.js"
import audioMixer from "../voicechat/AudioMixer.js"
import localAudioStream from "../voicechat/LocalStreamProvider.js"
import userState from "../voicechat/UserState.js"

class PeerJsAudioHandler {
    constructor() {
        this.myAudioStreaming = null
        this.callContainer = {}
        this.peerJsCallHandler = null
    }
    answer(peerId) {
        if (!this.callContainer.hasOwnProperty(peerId)) return
        localStorage.setItem('phone-call', peerId)
        const call = this.callContainer[peerId]
        call.answer(this.myAudioStreaming);
        call.on('stream', function (incomingStream) {
            audioMixer.connect(peerId, incomingStream)
        });
    }
    call(peerId) {
        peerjsConnectionHandler.peer.call(peerId, this.myAudioStreaming);
        this.other = peerId
        console.log(`calling to 2 ${peerId} ...`, this.myAudioStreaming);
    }
    start(peerJsCallHandler) {
        this.peerJsCallHandler = peerJsCallHandler
        localAudioStream.then(stream => {
            console.log('streaming ok');
            this.#stablishConnection(stream)
        }).catch((a) => {
            console.log('streaming fail');
            this.#stablishConnection()
        })
    }
    #stablishConnection(stream) {
        this.myAudioStreaming = stream
        this.reconnect()
        peerjsConnectionHandler.peer.on('call', (call) => {
            const peerId = call.peer
            this.callContainer[peerId] = call
            console.log(peerId + ' calls me');
            this.peerJsCallHandler(peerId, this)
        });
        console.log('Listening incoming calls 3', this.myAudioStreaming);
    }

    reconnect() {
        const peerId = localStorage.getItem('phone-call')
        if (peerId) {
            setTimeout(() => {
                profile.setState(userState.ongoingCall)
                eventBus.dispatch('phone-call', { address: peerId })
                peerJsAudioHandler.call(peerId)
                console.log('RECONNECTING');
            }, 500);
        }
    }
}

const peerJsAudioHandler = new PeerJsAudioHandler()

export default peerJsAudioHandler