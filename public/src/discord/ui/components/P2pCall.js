import eventBus from "../../../EventBus.js"
import eventSoundHandler, { soundList } from "../../../peer-implementation/EventSoundHandler.js"
import peerJsAudioHandler from "../../../peer-implementation/PeerJsAudioHandler.js"
import answerManager from "../../../voicechat/AnswerManager.js"
import mediaFactory from "../../../voicechat/MediaFactory.js"
import userState from "../../../voicechat/UserState.js"
import profile from "../../objects/Profile.js"
import userlist from "../../objects/UserList.js"
let refresh = null
let data = {
    address: null,
    content: null
}
export { data }
eventBus.subscribe('phone-call', (payload) => {
    payload.content = userlist.getName(payload.address)
    data = payload
    if (refresh) refresh()
})

export default function P2pCall() {
    refresh = this.reRender
    const state = profile.getState()
    this.cancel = () => {
        localStorage.removeItem('phone-call')
        const state = profile.getState()
        const myState = (state == userState.onCall) ? userState.hungUp
            : (state == userState.incomingCall) ? userState.rejectCall
                : (state == userState.ongoingCall) ? userState.hungUp
                    : 9999999//??
        answerManager.answer(data.address, myState)
        mediaFactory.destroyAudio(data.address)
        eventBus.dispatch('phone-call', {
            address: null
        })
        profile.setState(userState.connected)
        eventSoundHandler.play(soundList.decline)
        console.log('cancel');
    }
    this.enableEvents(['click'])
    this.accept = () => {
        profile.setState(userState.onCall)
        peerJsAudioHandler.answer(data.address)
        peerJsAudioHandler.call(data.address)
        localStorage.setItem('phone-call', data.address)
        refresh()
        eventSoundHandler.play(soundList.incommingMessage)
    }
    return data.address ? `<div class="p2p-call" >
        <div class="avatar"></div>
        <div class="name">${data?.content || data.address.slice(0,6)+'...'+data.address.slice(-4) }</div>
        <div class="buttons">
            ${state == userState.incomingCall ? '<button class="btn ok" click="accept">✔️</button>' : ''}
            <button class="btn reject" click="cancel">❌</button>
        </div>
    </div>`: '<div></div>'
}