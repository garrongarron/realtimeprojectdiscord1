import logo from "./ui/components/Logo.js"

let active = false
let error = null
let chainId = null
let account = null
let callback = null


const handleAddresses = addresses => {
    if (addresses.length > 0) {
        account = addresses[0];
        active = true
        if (callback) {
            chainId = window.ethereum.chainId
            callback()
        }
    } else {
        active = false
        chainId = null
        callback()
        error = 'Wallet disconected"'
    }
}

const activate = () => {
    if (!window.hasOwnProperty('ethereum'))
        return new Promise((res, rej) => {
            rej()
        })
    return new Promise((res, rej) => {
        window.ethereum.request({
            method: 'eth_requestAccounts'
        }).then((addresses) => {
            error = null
            setTimeout(() => {
                handleAddresses(addresses)
            }, 1000);
            res()
        }).catch(
            obj => {
                error = obj.message
                avtive = false
                callback()
                res()
            }
        )
    })
}

if (!window.hasOwnProperty('ethereum')) {
    error = `<div>We could not find a wallet. Please, install a 
    wallet extension in this browser to continue.</div>
    A popular wallet you can use is: 
    <a href="https://metamask.io/" target="_blank" class="metamask-link">${logo}</a>`
    +`<br><a href="javascript:location.reload()">I have MetaMasck already installed</a>`
} else {
    setTimeout(() => {
        window.ethereum.on('accountsChanged', async (addresses) => {
            handleAddresses(addresses)
        });
    }, 5000);
}

const deactivate = () => {
    active = false
    callback(active)
}

const useEthereum = (component) => {
    if (component) {
        callback = component.reRender
    }

    const out = {
        activate,
        active,
        deactivate,
        error,
        account,
        chainId
    }
    error = null
    return out
}

export default useEthereum
