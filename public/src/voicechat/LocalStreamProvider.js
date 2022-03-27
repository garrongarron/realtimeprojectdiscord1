import getMedia from './Navigator.js'

let audioAbailable = false

const localAudioStream = new Promise((res, rej)=>{
    
    getMedia(
        { video: false, audio: true }, 
        function () {
            console.log(`--- Audio is available`);
            navigator.mediaDevices.getUserMedia({
                video: false,
                audio: true
            }).then(stream => {
                console.log('--- Getting audio stream');
                audioAbailable = true
                res(stream)
            }).catch(e => {
                console.log('fail');
                rej('fail')
            })
        },  function (e) {
            console.error(`Audio is not available`, e);
            audioAbailable = false
            rej(e)
        });
})

export default localAudioStream

export { audioAbailable }
