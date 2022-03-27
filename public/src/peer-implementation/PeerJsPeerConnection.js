import localDatabase from "../discord/objects/LocalDatabase.js";
import profile from "../discord/objects/Profile.js";
import userlist from "../discord/objects/UserList.js";
import eventBus from "../EventBus.js";
import peerjsConnectionHandler from "../realtime/peerjs/PeerjsConnectionHandler.js";
import answerManager from "../voicechat/AnswerManager.js";
import { getNick } from "../voicechat/Nick.js";
import userState from "../voicechat/UserState.js";
import eventSoundHandler, { soundList } from "./EventSoundHandler.js";
import peerJsAudioHandler from "./PeerJsAudioHandler.js";
import peerJsCallHandler from "./PeerJsCallHandler.js";

const host = location.host || 'localhost'
const port = 443

const messageListener = {}
const addMessageListener = (name, listener) => {
    messageListener[name] = listener
}
export { addMessageListener }
const peerJsPeerConnection = ({ peer, peerId }) => {
    console.log('My peer ID is: ' + peerId);
    profile.setPeerId(peerId)
    profile.setState(userState.connected)
    eventSoundHandler.play(soundList.serverConnection)
    //My own info
    peerjsConnectionHandler.setPeer(peer)

    peerJsAudioHandler.start(peerJsCallHandler)//audio


    const firstMessage = (conn, peerId) => {
        const sendMyNick = () => {
            const channel = localDatabase.getChannelNameBetween(peerId, profile.peerId)
            const chat = localDatabase.getChatChannel(channel)
            conn.send({
                user: getNick(),
                chat
            })
        }
        let i = 0
        let n = setInterval(() => {
            if(i>1) clearInterval(n)
            sendMyNick()
        }, 1000);
        sendMyNick()
        console.log('Incoming connection from ' + peerId + 'and sending my nick');
        userlist.addUser(peerId)
        eventBus.dispatch('update-left-column', null)
        // userlist.setState(peerId, userState.connected)
    }

    //Incoming CONNECTION
    peerjsConnectionHandler.setConnectionHandler(({ conn, peerId }) => {
        firstMessage(conn, peerId)// to send my nick
    })

    //Incoming DATA
    peerjsConnectionHandler.setDataHandler((data, peerId) => {
        // console.log(`Received from ${peerId}: ${JSON.stringify(data)}`);
        if (data.hasOwnProperty('user')) {
            userlist.addUser(peerId)
            userlist.setName(peerId, data.user)
            userlist.setState(peerId, userState.connected)
            localDatabase.mergeChat(peerId, data)
            eventBus.dispatch('update-left-column', null)
        }
        if (data.hasOwnProperty('voiceChatAnswer')) {
            answerManager.incomingAnswer(peerId, data)
        }
        Object.values(messageListener).forEach(listener => {
            listener(data)
        })
    })


    //outgoing CONNECTION with all server connected
    fetch('https://' + host + ':' + port + '/peerjs/myapp/asd/peers').then(response => response.json()).then(list => {
        console.log('gettin user LIST');
        list.forEach(somePeerId => {
            if (somePeerId == peerId) return
            console.log('somePeerId', somePeerId);
            peerjsConnectionHandler.connectTo(somePeerId).then(conn => {
                firstMessage(conn, somePeerId)// to send my nick
            })
        });
    })


}
export default peerJsPeerConnection