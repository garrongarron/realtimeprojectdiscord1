import getComponent from "../js/FunctionalComponent.js"
import App from "./discord/ui/components/App.js"
import loader from "./discord/ui/Loader.js"
loader('/src/discord/ui/components/style.css', 'css')



if (sessionStorage.getItem('session') !== localStorage.getItem('session') && sessionStorage.getItem('session') == null) {
    document.body.innerHTML = `<div class="main-error">Hay otra pestania abierta! cierrela y luego intente nuevamente.</div>`
} else {
    const session = new Date().getTime()
    sessionStorage.setItem('session', session)
    localStorage.setItem('session', session)
    getComponent(App).kiwiSelector('body')
}
window.onbeforeunload = function(){
    localStorage.removeItem('previouslyConnected')
    localStorage.removeItem('session')
}
