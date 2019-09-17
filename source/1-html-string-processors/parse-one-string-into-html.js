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
    const {
        closeMark,
    } = stringASTNode

    let {
        content,
    } = stringASTNode

    if        (content.slice(-1) === '\'' && closeMark.slice(0, 1) === '\'') {
        content = content.slice(0, -1)
    } else if (content.slice(-1) === '"'  && closeMark.slice(0, 1) === '"') {
        content = content.slice(0, -1)
    }

    STANDARD_ESPACED_CHARS_IN_STRING_LITERALS.forEach(sec => {
        const char = sec.escapedChar
        const coreChar = char.startsWith('\\') ? char.slice(1) : char
        content = content.replace(
            new RegExp(`(\\\\${char})`, 'g'),
            `<span class="wlc-escape-char ${sec.cssClassName}">\\<span class="escaped-char">${coreChar}</span></span>`
        )
    })

    // console.log('"'+content+'"')

    return content
}
