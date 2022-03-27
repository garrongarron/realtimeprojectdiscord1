import profile from "./Profile.js"

class LocalDatabase {
    constructor() { 
        this.maxMsgList = 15
    }
    getChatChannel = (channel) => {
        const chat = JSON.parse(localStorage.getItem('chat') || '{}')
        if (chat.hasOwnProperty(channel)) {
            return chat[channel]
        }
        return []
    }

    getChannelNameBetween(address1, address2) {
        return [address1 || 'none', address2 || 'none'].sort().map(adr => adr.slice(-4)).join('-')
    }

    updateChat(channel, items) {
        const chat = JSON.parse(localStorage.getItem('chat') || '{}')
        if (chat.hasOwnProperty(channel)) {
            chat[channel] = items
        } else {
            chat[channel] = items
        }
        localStorage.setItem('chat', JSON.stringify(chat))
    }
    mergeChat(peerId, data) {
        const channel = this.getChannelNameBetween(profile.peerId, peerId)
        const chat = this.getChatChannel(channel)
        const obj = {}
        chat.concat(data.chat).forEach(msg => {
            obj[msg.messageTo.when] = msg
        });
        const newMessageList = Object.keys(obj).sort().map(msg => obj[msg]).slice(-this.maxMsgList)
        this.updateChat(channel, newMessageList)
    }
}

const localDatabase = new LocalDatabase()

export default localDatabase