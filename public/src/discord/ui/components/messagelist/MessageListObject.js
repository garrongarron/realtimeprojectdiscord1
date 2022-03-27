import eventBus from "../../../../EventBus.js";
import { addMessageListener } from "../../../../peer-implementation/PeerJsPeerConnection.js";
import peerjsConnectionHandler from "../../../../realtime/peerjs/PeerjsConnectionHandler.js";
import localDatabase from "../../../objects/LocalDatabase.js";
import profile from "../../../objects/Profile.js";

class MessageListClass {
    constructor() {
        this.items = [
            `Welcome to the fake discor of the comunity.`,
            `Feel free to write anything to anyone.`,
        ]
        this.items = this.items.map(message => {
            return this.createMessage(message)
        })
        console.log(this.items);
        this.address = null
        this.refreshChatComponentCallback = null
        eventBus.subscribe('messages', ({ messages, address }) => {
            this.setItems(messages)
            this.setAddress(address)
            this.refreshChatComponent()
        })
        addMessageListener('messageListClass', (message) => {
            if (!message.hasOwnProperty('messageTo')) return
            this.addItem(message)
        })
    }
    createMessage(message, channel, from, when) {
        const channelP2P = localDatabase.getChannelNameBetween(this.address, profile.peerId)
        console.log(channelP2P);
        const msg = {
            'messageTo': {
                message: message || 'emtpy message',
                channel: channel || channelP2P,
                when: when || new Date().getTime(),
                from: from || profile.peerId
            }
        }
        return msg
    }
    getItems() {
        return this.items
    }
    setItems(items) {
        this.items = items
    }

    addItem(item) {
        this.items.push(item)
        localDatabase.updateChat(item.messageTo.channel, this.items)
        this.refreshMessages()
    }
    setAddress(address) {
        console.log('address', address);
        this.address = address
    }
    getAddress() {
        return this.address
    }
    refreshChatComponent() {
        if (this.refreshChatComponentCallback) this.refreshChatComponentCallback()
    }
    setRefreshChatComponent(callback) {
        this.refreshChatComponentCallback = callback
    }
    setRefreshMessages(callback) {
        this.refreshMessagesCallback = callback
    }
    refreshMessages() {
        if (this.refreshMessagesCallback) this.refreshMessagesCallback()
    }
    sendMessage(message) {
        const item = this.createMessage(message)
        this.addItem(item)
        //todo send menssage
        if (this.address) {
            peerjsConnectionHandler.getPeer(this.address).send(item)
        } else {
            const item = this.createMessage('Sorry, I am not connected. F', null, 'GodFather')
            this.addItem(item)
        }

    }
}

const messageListObject = new MessageListClass()

export default messageListObject