import profile from "../discord/objects/Profile.js";
import eventBus from "../EventBus.js";
import eventSoundHandler, { soundList } from "../peer-implementation/EventSoundHandler.js";
import peerjsConnectionHandler from "../realtime/peerjs/PeerjsConnectionHandler.js";
import mediaFactory from "./MediaFactory.js";
import userState from "./UserState.js";

class AnswerManager {
    constructor() {
        this.conn = null
    }

    start(conn) {
        this.conn = conn
    }

    answer(peerId, state) {
        console.log('status = ' + state);
        peerjsConnectionHandler.getPeer(peerId).send({
            'voiceChatAnswer': {
                state: state
            }
        })
    }

    incomingAnswer(peerId, data) {
        console.log(data);
        if (data.voiceChatAnswer.state == userState.incomingCall) {
            console.log(peerId + ' is bussy, try to make the call later');
            profile.setState(userState.connected)
            eventBus.dispatch('phone-call', {
                address: null
            })
            eventSoundHandler.play(soundList.decline)
            // peerjsConnectionHandler.getPeer(peerId).close()
            // blueBar.setState(userState.connected)
        }
        if (data.voiceChatAnswer.state == userState.rejectCall) {
            localStorage.removeItem('phone-call')
            console.log(peerId + ' just reject the call, try to make the call later');
            profile.setState(userState.connected)
            eventBus.dispatch('phone-call', {
                address: null
            })
            eventSoundHandler.play(soundList.decline)
            // peerjsConnectionHandler.getPeer(peerId).close()
            // blueBar.setState(userState.connected)
            // redBar.hide()
        }
        if (data.voiceChatAnswer.state == userState.hungUp) {
            localStorage.removeItem('phone-call')
            console.log(peerId + ' just hung up');
            // peerjsConnectionHandler.getPeer(peerId).close()
            if(profile.getState() == userState.onCall){
                mediaFactory.destroyAudio(peerId)
            }
            profile.setState(userState.connected)
            eventBus.dispatch('phone-call', {
                address: null
            })
            eventSoundHandler.play(soundList.decline)

            // if(blueBar.getState() == userState.incomingCall){
            //     greenBar.hide()
            // }
            // blueBar.setState(userState.connected)
            // userlist.setState(peerId, userState.connected)
        }
    }
}

const answerManager = new AnswerManager()

export default answerManager