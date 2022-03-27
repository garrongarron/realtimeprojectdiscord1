class MediaFactory {
    constructor() {
        this.audios = {}
        this.prefix = 'audio'
    }
    
    createAudio(id) {
        if(document.querySelector('#'+this.prefix+'-'+id)) return
        let audio = document.createElement('audio')
        audio.id = this.prefix+'-'+id
        audio.setAttribute('controls', 'controls')
        audio.setAttribute('autoplay', 'autoplay')
        audio.style.display = 'none'
        document.body.appendChild(audio)
        this.audios[id] = audio
        return audio
    }

    destroyAudio(id){
        const selector = '#'+this.prefix+'-'+id
        document.querySelectorAll(selector).forEach(element => {
            element.remove()
        });
    }

    getAudio(id) {
        return this.audios[id] || console.error('there is no audio with id : '+id);
    }
}

const mediaFactory = new MediaFactory()

export default mediaFactory

export { MediaFactory } 