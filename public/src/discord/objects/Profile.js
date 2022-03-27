import userState from "../../voicechat/UserState.js"

class Profile {
    constructor() {
        this.state = userState.disconnected
        this.peerId = null
    }
    setPeerId(peerId) {
        this.peerId = peerId
    }
    getState() {
        return this.state
    }
    setState(state) {
        this.state = state
    }
}


const profile = new Profile()

export default profile