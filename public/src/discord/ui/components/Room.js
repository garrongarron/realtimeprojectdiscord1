function Element({ item, classes }) {
    return `<li ${classes ? `class="${classes}"` : ''}>
        <span>${item}</span>
        <div>Placeholder</div>
        </li>`
}


export default function Room() {
    this.enableSubComponents({ Element })
    const items = [1, 2, 3,4,5,6,7,8]
    const autoTimes = items.length < 3 ? 'auto'
        : items.length < 5
            ? 'auto auto '
            : 'auto auto auto'
    return `<div class="room" >
        <ul style="grid-template-columns: ${autoTimes};">
            ${items.map(item => `<Element item=${item} />`)}
        </ul>
    </div>`
}