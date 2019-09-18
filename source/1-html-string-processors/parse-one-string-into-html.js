const STANDARD_ESPACED_CHARS_IN_STRING_LITERALS = [
    { escapedChar: '\\\\', cssClassName: 'backward-slash' },
    { escapedChar: 'n',    cssClassName: 'new-line' },
    { escapedChar: 'r',    cssClassName: 'carriage-return' },
    { escapedChar: 't',    cssClassName: 'tab' },
    { escapedChar: '\'',   cssClassName: 'single-quote' },
    { escapedChar: '"',    cssClassName: 'double-quote' },
    { escapedChar: '/',    cssClassName: 'forward-mark' },
]


module.exports = function parseOneStringASTNodeIntoHTML(stringASTNode) {
    let { content } = stringASTNode

    STANDARD_ESPACED_CHARS_IN_STRING_LITERALS.forEach(sec => {
        const char = sec.escapedChar
        const coreChar = char.startsWith('\\') ? char.slice(1) : char
        content = content.replace(
            new RegExp(`(\\\\${char})`, 'g'),
            `<span class="wlc-escape-char ${sec.cssClassName}"><span class="slash">\\</span><span class="escaped-char">${coreChar}</span></span>`
        )
    })

    return content
}
