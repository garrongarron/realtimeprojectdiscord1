const urlParams = new URLSearchParams(window.location.search);
let nick = (urlParams.get('name')) ? urlParams.get('name') : 'someone'

const setNick = (name) => {
    nick = name
}
const getNick = () =>{
    return nick
}   


export default nick

export { setNick, getNick }