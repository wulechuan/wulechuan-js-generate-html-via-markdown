const STANDARD_ESPACED_CHARS_IN_STRING_LITERALS = [
    { escapedChar: '\\\\', cssClassName: 'backward-slash' },
    { escapedChar: 'n',    cssClassName: 'new-line' },
    { escapedChar: 'r',    cssClassName: 'carriage-return' },
    { escapedChar: 't',    cssClassName: 'tab' },
    { escapedChar: '\'',   cssClassName: 'single-quote' },
    { escapedChar: '"',    cssClassName: 'double-quote' },
    { escapedChar: '/',    cssClassName: 'forward-mark' },
]


module.exports = function parseOneStringASTNodeIntoHTML(astNode) {
    let { content, openMark, closeMark } = astNode

    const stringIsEmpty = !!content

    if (!stringIsEmpty) {
        STANDARD_ESPACED_CHARS_IN_STRING_LITERALS.forEach(sec => {
            const char = sec.escapedChar
            const coreChar = char.startsWith('\\') ? char.slice(1) : char
            content = content.replace(
                new RegExp(`(\\\\${char})`, 'g'),
                `<span class="wlc-escape-char ${sec.cssClassName}"><span class="slash">\\</span><span class="escaped-char">${coreChar}</span></span>`
            )
        })
    }

    const quoteSign = openMark.slice(-1)

    if (quoteSign !== closeMark.slice(0, 1)) {
        throw new Error('@wulechuan/hljs-plus: Different opening/closing marks of a single string.')
    }

    openMark = `<span class="hljs-string${
        stringIsEmpty ? ' empty-string' : ''
    }"><span class="wlc-string-quote open-quote">${quoteSign}</span>`

    closeMark = `<span class="wlc-string-quote close-quote">${quoteSign}</span>${closeMark.slice(1)}`

    astNode.openMark  = openMark
    astNode.content = `<span class="wlc-string-body">${content}</span>`
    astNode.closeMark = closeMark
}
