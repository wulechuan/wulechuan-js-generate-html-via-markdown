const DEFAULT_CSS_CLASS_NAMES_FOR_STRINGS = {
    // `ccn` means (C)SS (C)lass (N)ame

    ccnIllegal:                              'string-illegal',
    ccnEmpty:                                'empty-string',

    ccnQuote:                                'string-quote',
    ccnQuoteOpen:                            'string-open-quote',
    ccnQuoteClose:                           'string-close-quote',

    ccnBody:                                 'string-body',

    ccnEscapeChar:                           'escape-char',
    ccnEscapeCharSlash:                      'slash',
    ccnEscapeCharTheEscapedChar:             'escaped-char',

    ccnLiteral:                              'regexp-literal-char',
    ccnLiteralSpecificNamePrefix:            'regexp-literal',
}


const STANDARD_ESPACED_CHARS_IN_STRING_LITERALS = [
    { escapedChar: '\\\\', cssClassName: 'backward-slash' },
    { escapedChar: 'n',    cssClassName: 'new-line' },
    { escapedChar: 'r',    cssClassName: 'carriage-return' },
    { escapedChar: 't',    cssClassName: 'tab' },
    { escapedChar: '\'',   cssClassName: 'single-quote' },
    { escapedChar: '"',    cssClassName: 'double-quote' },
    { escapedChar: '/',    cssClassName: 'forward-mark' },
]


module.exports = function parseOneStringASTNodeIntoHTML(astNode/* , codeLanguae */) {
    const {
        ccnIllegal,
        ccnEmpty,

        ccnQuote,
        ccnQuoteOpen,
        ccnQuoteClose,

        ccnBody,

        ccnEscapeChar,
        ccnEscapeCharSlash,
        ccnEscapeCharTheEscapedChar,

        // ccnLiteral,
        // ccnLiteralSpecificNamePrefix,
    } = DEFAULT_CSS_CLASS_NAMES_FOR_STRINGS


    let stringIsIllegal = false

    let { content, openMark, closeMark } = astNode
    const quoteSign = openMark.slice(-1)

    const isTemplatedString = quoteSign === '`'
    const stringIsEmpty = !content

    if (quoteSign !== closeMark.slice(0, 1)) {
        stringIsIllegal = true
        throw new Error('@wulechuan/hljs-plus: Different opening/closing marks of a single string.')
    }

    openMark = `<span class="hljs-string${
        stringIsEmpty ? ` ${ccnEmpty}` : ''
    }${
        stringIsIllegal ? ` ${ccnIllegal}` : ''
    }"><span class="${ccnQuote} ${ccnQuoteOpen}">${quoteSign}</span>`

    closeMark = `<span class="${ccnQuote} ${ccnQuoteClose}">${quoteSign}</span>${closeMark.slice(1)}`

    astNode.openMark  = openMark
    astNode.closeMark = closeMark

    content = parseOneStringOfEitherType(content) // templated or not templated

    if (isTemplatedString) {
        content = parseOneTemplatedString(content)
    }

    astNode.content = `<span class="${ccnBody}">${content}</span>`






    function parseOneStringOfEitherType(content) {
        STANDARD_ESPACED_CHARS_IN_STRING_LITERALS.forEach(sec => {
            const char = sec.escapedChar
            const coreChar = char.startsWith('\\') ? char.slice(1) : char
            content = content.replace(
                new RegExp(`(\\\\${char})`, 'g'),
                [
                    `<span class="${ccnEscapeChar} ${sec.cssClassName}">`,
                    `<span class="${ccnEscapeCharSlash}">\\</span>`,
                    `<span class="${ccnEscapeCharTheEscapedChar}">${coreChar}</span>`,
                    '</span>',
                ]
            )
        })

        return content
    }


    function parseOneTemplatedString(content) {
        // content = content.replace(
        //     /\${/g,
        //     [
        //         '<span class="string-template-interpolation-begin">',
        //         '<span class="dollar-sign">$</span>',
        //         '<span class="wlc-punctuation wlc-curly-brace wlc-curly-brace-open">{</span>',
        //         '</span>',
        //     ].join('')
        // )
        return content
    }
}
