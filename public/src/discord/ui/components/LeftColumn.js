import eventBus from "../../../EventBus.js";
import eventSoundHandler, { soundList } from "../../../peer-implementation/EventSoundHandler.js";
import peerJsAudioHandler from "../../../peer-implementation/PeerJsAudioHandler.js";
import userState from "../../../voicechat/UserState.js";
import localDatabase from "../../objects/LocalDatabase.js";
import profile from "../../objects/Profile.js";
import userlist from "../../objects/UserList.js";



function Element({ content, address, classes, toggle }) {
    this.enableEvents(['click'])
    this.switcher = () => {
        eventBus.dispatch('room-toggle')
    }
    this.data = {address}
    this.phoneCall = () =>{
        profile.setState(userState.ongoingCall)
        eventBus.dispatch('phone-call', this.data)
        peerJsAudioHandler.call(this.data.address)
        eventSoundHandler.play(soundList.ongoingCall, true)
    }

    this.message = () =>{
        const channelP2P = localDatabase.getChannelNameBetween(address, profile.peerId)
        const messages =localDatabase.getChatChannel(channelP2P)
        eventBus.dispatch('messages', {messages, address})
    }

    const text = (address == content)?address.slice(0,6)+'...'+address.slice(-4):content
    const status = !address?'':(userlist.getState(address) == userState.connected && address)?"connected":"disconnected"
    return `<li 
        ${toggle === 'toggle' ? 'click="switcher"' : ''} 
        ${classes ? `class="${classes}"` : ''}
        ${address ? `address="${address}"` : ''}
        ><span class="${status}">${text}${address ?`<span class="hash">${'#'+address?.slice(-4)}</span></span>`:''}
            ${address ? 
            `<ul class="emojis">
                <li class="phone" click="phoneCall">📞</li>
                <li class="message" click="message">✉️</li>
                <!-- <li>🔇</li> -->
            </ul>` : ''}
        </li>`
}
let refresh = null
eventBus.subscribe('update-left-column', () => {
    if (refresh) refresh()
})
export default function LeftColumn() { 
    this.enableSubComponents({ Element })
    refresh = this.reRender
    const items = userlist.getUsers()
    return `<ul class="left-column">
        <Element content="Lista de usuarios" classes="list-title" />
        ${Object.keys(items).map(address => `<Element address=${address} content="${items[address]}"/>`)}
    </ul>`
}
/*<Element toggle="toggle" content="Sala de chat" classes="list-title" />*/