const regexpControlChars = [
    { char: '-',   cssClassName: 'regexp-control-char regexp-control-range-sign' }, // always replace dash first!!!

    { char: '^',   cssClassName: 'regexp-control-char regexp-control-invert' },
    { char: '(',   cssClassName: 'regexp-control-char regexp-control-parenthesis parenthesis-open' },
    { char: ')',   cssClassName: 'regexp-control-char regexp-control-parenthesis parenthesis-close' },
    { char: '[',   cssClassName: 'regexp-control-char regexp-control-square-bracket square-bracket-open' },
    { char: ']',   cssClassName: 'regexp-control-char regexp-control-square-bracket square-bracket-close' },
    { char: '{',   cssClassName: 'regexp-control-char regexp-control-curly-brace curly-brace-open' },
    { char: '}',   cssClassName: 'regexp-control-char regexp-control-curly-brace curly-brace-close' },
    { char: '?',   cssClassName: 'regexp-control-char regexp-control-question-mark' },
    { char: '*',   cssClassName: 'regexp-control-char regexp-control-asterisk' },
    { char: '+',   cssClassName: 'regexp-control-char regexp-control-plus-sign' },
    { char: '|',   cssClassName: 'regexp-control-char regexp-control-logic-or' },

    { char: '.',   cssClassName: 'regexp-selector-char regexp-selector-any-char' },

    { char: '\\w', cssClassName: 'regexp-selector-char regexp-selector-word' },
    { char: '\\W', cssClassName: 'regexp-selector-char regexp-selector-non-word' },
    { char: '\\d', cssClassName: 'regexp-selector-char regexp-selector-digit' },
    { char: '\\D', cssClassName: 'regexp-selector-char regexp-selector-non-digit' },
    { char: '\\s', cssClassName: 'regexp-selector-char regexp-selector-whitespace' },
    { char: '\\S', cssClassName: 'regexp-selector-char regexp-selector-non-whitespace' },
    { char: '\\b', cssClassName: 'regexp-selector-char regexp-selector-boundary' },
    { char: '\\B', cssClassName: 'regexp-selector-char regexp-selector-non-boundary' },
]


const regexpEscapedLiteralChars = [
    {
        escapedChar: '-',
        cssClassName: 'regexp-literal-minus-sign',
        unwantedControlCssClassName: 'regexp-control-char regexp-control-range-sign',
    },
    {
        escapedChar: '^',
        cssClassName: 'regexp-literal-caret',
        unwantedControlCssClassName: 'regexp-control-char regexp-control-invert',
    },
    {
        escapedChar: '?',
        cssClassName: 'regexp-literal-question-mark',
        unwantedControlCssClassName: 'regexp-control-char regexp-control-question-mark',
    },
    {
        escapedChar: '*',
        cssClassName: 'regexp-literal-asterisk',
        unwantedControlCssClassName: 'regexp-control-char regexp-control-asterisk',
    },
    {
        escapedChar: '+',
        cssClassName: 'regexp-literal-plus-sign',
        unwantedControlCssClassName: 'regexp-control-char regexp-control-plus-sign',
    },
    {
        escapedChar: '|',
        cssClassName: 'regexp-literal-pipe',
        unwantedControlCssClassName: 'regexp-control-char regexp-control-logic-or',
    },
    {
        escapedChar: '.',
        cssClassName: 'regexp-literal-period',
        unwantedControlCssClassName: 'regexp-selector-char regexp-selector-any-char',
    },
    {
        escapedChar: '(',
        cssClassName: 'regexp-literal-parenthesis parenthesis-open',
        unwantedControlCssClassName: 'regexp-control-char regexp-control-parenthesis parenthesis-open',
    },
    {
        escapedChar: ')',
        cssClassName: 'regexp-literal-parenthesis parenthesis-close',
        unwantedControlCssClassName: 'regexp-control-char regexp-control-parenthesis parenthesis-close',
    },
    {
        escapedChar: '[',
        cssClassName: 'regexp-literal-square-bracket square-bracket-open',
        unwantedControlCssClassName: 'regexp-control-char regexp-control-square-bracket square-bracket-open',
    },
    {
        escapedChar: ']',
        cssClassName: 'regexp-literal-square-bracket square-bracket-close',
        unwantedControlCssClassName: 'regexp-control-char regexp-control-square-bracket square-bracket-close',
    },
    {
        escapedChar: '{',
        cssClassName: 'regexp-literal-curly-brace curly-brace-open',
        unwantedControlCssClassName: 'regexp-control-char regexp-control-curly-brace curly-brace-open',
    },
    {
        escapedChar: '}',
        cssClassName: 'regexp-literal-curly-brace curly-brace-close',
        unwantedControlCssClassName: 'regexp-control-char regexp-control-curly-brace curly-brace-close',
    },
]


const regexpEscapedLiteralCharsDirectSearch = [
    {
        escapedChar: '\\',
        cssClassName: 'regexp-literal-backward-slash',
    },
    {
        escapedChar: '$',
        cssClassName: 'regexp-literal-dollar',
    },
]




module.exports = function parseOnRegExpIntoHTML(astNode) {
    const { content } = astNode
    const match = content.match(/\/(\^?)([\s\S]*)\/(g|gi|ig|i)?$/)

    // console.log('match[1]', match[1])
    // console.log('match[2]', match[2])
    // console.log('match[3]', match[3])

    const regexpOpen = '<span class="regexp-begin">/</span>'
    const regexpClose = '<span class="regexp-end">/</span>'

    const regexpBeginSelector = match[1] ? `<span class="regexp-selector-input-begin">${match[1]}</span>` : ''
    const regexpOptions       = match[3] ? `<span class="regexp-options">${match[3]}</span>` : ''

    let regexpBody = match[2] || ''

    let regexpEndSelector = ''
    if (regexpBody.slice(-1) === '$') {
        regexpEndSelector = '<span class="regexp-selector-input-end">$</span>'
        regexpBody = regexpBody.slice(0, -1)
    }

    if (regexpBody) {
        regexpControlChars.forEach(rcc => {
            const { char } = rcc
            const isEscapeChar = char.startsWith('\\')
            const coreChar = isEscapeChar ? char.slice(1) : char

            regexpBody = regexpBody.replace(
                new RegExp(`\\${char}`, 'g'),
                `<span class="${rcc.cssClassName}${ isEscapeChar ? ' wlc-escape-char' : '' }">${
                    isEscapeChar ? '<span class="slash">\\</span>' : ''
                }<span class="control-char${ isEscapeChar ? ' escaped-char' : '' }">${
                    coreChar
                }</span></span>`
            )
        })

        regexpEscapedLiteralChars.forEach(relc => {
            const char = relc.escapedChar

            regexpBody = regexpBody.replace(
                new RegExp(`\\\\<span class="${relc.unwantedControlCssClassName}"><span class="control-char">\\${char}</span></span>`, 'g'),
                `<span class="wlc-escape-char ${relc.cssClassName}"><span class="slash">\\</span><span class="escaped-char">${
                    char
                }</span></span>`
            )
        })

        regexpBody = regexpBody.replace(
            new RegExp('\\\\&lt;', 'g'),
            '<span class="wlc-escape-char regexp-literal-less-than-mark">\\<span class="escaped-char"><</span></span>'
        )

        regexpEscapedLiteralCharsDirectSearch.forEach(relcds => {
            const char = relcds.escapedChar

            regexpBody = regexpBody.replace(
                new RegExp(`\\\\\\${char}`, 'g'),
                `<span class="wlc-escape-char ${relcds.cssClassName}"><span class="slash">\\</span><span class="escaped-char">${
                    char
                }</span></span>`
            )

        })


        regexpBody = regexpBody.replace(
            /(<span class="regexp-control-char regexp-control-curly-brace curly-brace-open"><span class="control-char">\{<\/span><\/span>)(\d+)((,)(\d*))?(<span class="regexp-control-char regexp-control-curly-brace curly-brace-close"><span class="control-char">\}<\/span><\/span>)/g,
            [
                '$1',
                '<span class="wlc-digit-pair-between-curly-braces">',
                '<span class="digit digit-1">$2</span>',
                '<span class="comma">$4</span>',
                '<span class="digit digit-2">$5</span>',
                '</span>',
                '$6',
            ].join('')
        )
    }

    return [
        regexpOpen,
        regexpBeginSelector,
        '<span class="regexp-body">',
        regexpBody,
        '</span>',
        regexpEndSelector,
        regexpClose,
        regexpOptions,
    ].join('')
}
