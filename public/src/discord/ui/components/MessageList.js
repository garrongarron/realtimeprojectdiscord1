import { getNick } from "../../../voicechat/Nick.js"
import localDatabase from "../../objects/LocalDatabase.js"
import profile from "../../objects/Profile.js"
import userlist from "../../objects/UserList.js"
import messageListObject from "./messagelist/MessageListObject.js"

function Element({ message, from, classes }) {
    let name = userlist.getName(from) || from
    name = (profile.peerId == name && name != null) ? getNick() : (name || from)
    return `<li ${classes ? `class="${classes}"` : ''}> <span>${name || 'GodFather'}: </span>${message}</li>`
}

function ListItems() {
    this.enableSubComponents({ Element })
    messageListObject.setRefreshMessages(this.reRender)
    const objects = messageListObject.getItems()
    const items = Object.values(objects).slice(-localDatabase.maxMsgList)
    return `<ul >
        ${items.map(msg => `<Element from="${msg.messageTo.from}" message="${msg.messageTo.message}" />`)}
    </ul>`
}

export default function MessageList() {
    this.enableSubComponents({ ListItems })
    this.enableEvents(['keyup'])
    setTimeout(() => {
        const ul = document.querySelector('.message-list ul')
        ul?.scrollTo(0, ul.scrollHeight);
    }, 100);
    let message = JSON.parse(localStorage.getItem('messageTo') || '{}')
    const address = messageListObject.getAddress()
    message = message.hasOwnProperty(address) ? message[address] : ''
    messageListObject.setRefreshChatComponent(this.reRender)
    this.update = (e) => {
        let message = JSON.parse(localStorage.getItem('messageTo') || '{}')
        message[address] = e.target.value
        if (e.keyCode == 13) {
            messageListObject.sendMessage(e.target.value)
            e.currentTarget.value = ''
            message[address] = ''
            const ul = document.querySelector('.message-list ul')
            ul.scrollTo(0, ul.scrollHeight);
        }
        localStorage.setItem('messageTo', JSON.stringify(message))
    }
    return `
    <ul class="message-list">
        <ListItems ></ListItems>
        <div>
            <input type="text" value="${message}" keyup="update" placeholder="Your message here...">
        </div>
    </ul>`
}