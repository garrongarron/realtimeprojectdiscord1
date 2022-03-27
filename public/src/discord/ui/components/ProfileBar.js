import { getNick } from "../../../voicechat/Nick.js";

export default function ProfileBar(){
    return `<ul class="profile-bar">
        <li class="img"></li>
        <li class="nick">${getNick()}</li>

    </ul>`
}

/*
        <li>.</li>
        <li>.</li>
        <li>.</li>
 */