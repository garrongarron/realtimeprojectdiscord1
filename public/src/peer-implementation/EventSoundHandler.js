const soundList = {
    serverConnection: '/sounds/serverConnection.mp3',
    serverDisconected: '/sounds/serverDisconected.mp3',
    ongoingCall: '/sounds/ongoingCall.mp3',
    decline: '/sounds/decline.mp3',
    incomingCall: '/sounds/incomingCall.mp3',
    incommingMessage: '/sounds/incommingMessage.mp3',
}
class EventSoundHandler {
    constructor() {
    }
    play(url, flag = false) {
        this.music?.pause();
        this.music = new Audio(url);
        this.music.play();
        this.music.loop = flag;
        this.music.playbackRate = 1;
    }
    pause() {
        music.pause();
    }
}

const eventSoundHandler = new EventSoundHandler()

export default eventSoundHandler

export { soundList }