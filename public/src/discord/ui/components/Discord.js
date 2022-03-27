
import LeftColumn from './LeftColumn.js'
import RightColumn from './RightColumn.js'
import HeadBar from './HeadBar.js'
import ProfileBar from './ProfileBar.js'
import MessageList from './MessageList.js'
import P2pCall from './P2pCall.js'
import Room from './Room.js'
import eventBus from '../../../EventBus.js'

let flag = JSON.parse(localStorage.getItem('inRoom') || 'false')
export default function Discord() {
    flag = JSON.parse(localStorage.getItem('inRoom') || 'false')
    this.enableSubComponents({ LeftColumn, HeadBar, RightColumn, Room, ProfileBar, MessageList, P2pCall })
    this.enableEvents(['clicks'])
    let toogle = () => {
        flag = !flag
        localStorage.setItem('inRoom', flag)
        eventBus.event['room-toggle'] = []
        eventBus.subscribe('room-toggle', toogle)
        this.reRender()
    }
    eventBus.event['room-toggle'] = []
    eventBus.subscribe('room-toggle', toogle)
    return `<div>
        <HeadBar/>
        <LeftColumn switcher="switcher" /> 
        <RightColumn/>
        <ProfileBar/>
        <MessageList/>
        ${flag ? '<Room/>' : ''}
        <P2pCall/>
    </div>`
}

