import profile from "../discord/objects/Profile.js"
import eventBus from "../EventBus.js"
import userState from "../voicechat/UserState.js"
import eventSoundHandler, { soundList } from "./EventSoundHandler.js"

const peerJsCallHandler = (peerId, peerJsAudioHandler) => {
    if (profile.getState() == userState.connected) {
        const reconecingToUser = localStorage.getItem('phone-call')
        if(reconecingToUser && reconecingToUser == peerId){
            // localStorage.getItem('phone-call')
            // peerJsAudioHandler.answer(peerId) 
            console.log("ACEPTING RECONNECTION FROM "+peerId);
            profile.setState(userState.onCall)
            eventBus.dispatch('phone-call', {address:peerId})
            peerJsAudioHandler.answer(peerId)
            peerJsAudioHandler.call(peerId)
        } else{
            profile.setState(userState.incomingCall)
            eventBus.dispatch('phone-call', {address:peerId}) 
            eventSoundHandler.play(soundList.incomingCall, true)
            // blueBar.setState(userState.incomingCall)
            // userlist.setState(peerId, userState.incomingCall)//incoming calling'
        }
        
    } else if (profile.getState() == userState.ongoingCall /*&& peerId == this.other*/) {
        profile.setState(userState.onCall)
        peerJsAudioHandler.answer(peerId) 
        eventSoundHandler.play(soundList.incommingMessage)
        // redBar.show(peerId)
        // eventBus.dispatch('phone-call', {
        //     address: null,
        //     content: null
        // })
        // userlist.setState(peerId, userState.onCall)

    } else {
        // answerManager.answer(peerId, blueBar.getState())
    }
}
export default peerJsCallHandler