import profile from "../discord/objects/Profile.js";
import userlist from "../discord/objects/UserList.js";
import { data as userConnection } from "../discord/ui/components/P2pCall.js";
import eventBus from "../EventBus.js";
import mediaFactory from "../voicechat/MediaFactory.js"
import userState from "../voicechat/UserState.js";
import eventSoundHandler, { soundList } from "./EventSoundHandler.js";

const peerJsServerDataHandler = (data) => {
    // console.log(data);
    if (data.type == "DISCONNECTED") {
        console.log(data);
        userlist.setState(data.peerId, userState.disconnected)
        if ((profile.getState() == userState.onCall ||
            profile.getState() == userState.incomingCall ||
            profile.getState() == userState.ongoingCall
        ) && userConnection.address == data.peerId) {
            profile.setState(userState.connected)
            eventBus.dispatch('phone-call', {
                address: null
            })
            eventSoundHandler.play(soundList.decline)
        }
        mediaFactory.destroyAudio(data.peerId)
        eventBus.dispatch('update-left-column', null)
    }
    if (data.type == "OPEN") {
        // userlist.init()
        console.log(data);
    }
    // 
}

export default peerJsServerDataHandler