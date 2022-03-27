import mediaFactory from "./MediaFactory.js"

class AudioMixer{
    constructor(){}
    connect(audioName, stream){
        let  audio  = mediaFactory.createAudio(audioName)
        audio = audio || mediaFactory.getAudio(audioName)
        audio.srcObject = stream
        audio.addEventListener('loadedmetadata', () => {
            audio.play()
        })
    }
    
    disconnect(id){
        mediaFactory.destroyAudio(id)
    }
}

const audioMixer = new AudioMixer()

export default audioMixer

export { AudioMixer }