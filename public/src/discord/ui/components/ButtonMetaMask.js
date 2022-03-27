import { setNick } from "../../../voicechat/Nick.js";
import useEthereum from "../../../ethereum/useEthereum.js";
import logo from "./Logo.js";


let flag = false
export default function ButtonMetaMask({ connect }) {
    const { activate } = useEthereum()
    this.connect = () => {
        if (!flag) {
            return alert('Your name should be longer than 3 characters')
        }
        activate().then(a => { }).catch(console.log)
        localStorage.setItem('previouslyConnected', true)
    }
    this.keyup = (e) => {
        localStorage.setItem('nick', e.target.value) 
        flag = (e.target.value.length > 3)
        if(flag) setNick(e.target.value)
    }
    this.enableEvents(['click', 'keyup'])
    const name = localStorage.getItem('nick') || ''
    flag = (name.length > 3)
    if(flag) setNick(name)
    return `
    <div  class="landing">
        <h1>Web 3</h1>
        <button click="connect">
            <div>Connect wallet </div>
            ${logo}
        </button>
        <input keyup="keyup" value="${name}" type="text" id="nick" placeholder="Your name here...">
    <div>
    `
}