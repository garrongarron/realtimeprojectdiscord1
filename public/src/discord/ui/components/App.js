
import Discord from './Discord.js'
import ButtonMetaMask from './ButtonMetaMask.js'
import useEthereum from '../../../ethereum/useEthereum.js'
import peerJsImplementation from '../../../peer-implementation/PeerImplementation.js'


export default function App() {
    this.enableSubComponents({ Discord, ButtonMetaMask })
    this.enableEvents(['click'])
    const { activate, active, error, account } = useEthereum(this)
    this.useEffect(() => {
        setTimeout(() => {
            if (localStorage.getItem('previouslyConnected') === 'true') this.connect()
        }, 3000);
    }, [])

    this.connect = () => {
        activate().then(ok => {
            this.reRender()
            localStorage.setItem('previouslyConnected', true)
        }).catch(fail => {
            this.reRender()
        })
    }

    if (active) {
        peerJsImplementation(account)
    }
    if (error) {
        return `<div class="main-error">${error}</div>`
    }

    return `<div>
                ${active ? `<Discord />` : `<ButtonMetaMask  />`}
            <div>`
}