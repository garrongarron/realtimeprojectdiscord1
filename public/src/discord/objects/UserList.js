class UserList {
    constructor() {
        this.userlist = {}
        this.userState = {}
    }
    init() { 
        // document.body.appendChild(this.domElement)
    }
    getUsers(){
        return this.userlist
    }
    addUser(peerId) {
        if (this.userlist[peerId]) return
        this.userlist[peerId] = peerId
    }
    
    removeUser(peerId) {
        delete this.userlist[peerId]
    }
    addIcons(peerId, element) {

    }
    setState(peerId, state) {
        this.userState[peerId] = state
    }
    getState(peerId) {
        if(!this.userState.hasOwnProperty(peerId)) return null
        return this.userState[peerId]
    }
    setName(peerId, name) {
        this.userlist[peerId] = name
    }
    getName(peerId){
        if(!this.userlist.hasOwnProperty(peerId)) return null
        return this.userlist[peerId]
    }
}


const userlist = new UserList()

export default userlist

export { UserList }