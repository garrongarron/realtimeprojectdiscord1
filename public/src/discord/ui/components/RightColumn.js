function Element({ item, classes}) {
    return `<li ${classes? `class="${classes}"`: ''}>${item}</li>`
}

export default function RightColumn() {
    this.enableSubComponents({ Element })
    const items = [1, 2]
    return `<ul class="right-column">
        <Element item="Lista de placeholder" classes="list-title" />
    ${items.map(item => `<Element item="${'Placeholder '+item}" />`)}
    </ul>`
}