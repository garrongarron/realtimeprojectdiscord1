import useEthereum from "../../../ethereum/useEthereum.js"

export default function HeadBar(){
    this.enableEvents(['click'])
    const { deactivate, account } = useEthereum()
    this.disconnect = () => {
        deactivate()
        localStorage.removeItem('previouslyConnected')
    }
    // 
    return `<ul class="head-bar">
    <li click="disconnect">Disconnect</li>
    <li>${account.slice(0,6)+'...'+account.slice(-4)}</li>
    <li>Placeholder</li>
</ul>`
} 