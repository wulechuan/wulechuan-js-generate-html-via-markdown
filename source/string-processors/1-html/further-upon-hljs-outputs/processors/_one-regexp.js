const defaultCSSClassNamesRegExp = { // eslint-disable-line no-unused-vars
    // `ccn` means (C)SS (C)lass (N)ame

    ccnIllegal:                       'wlc-regexp-illegal',

    ccnQuote:                         'regexp-quote',
    ccnQuoteOpen:                     'regexp-open-quote',
    ccnQuoteClose:                    'regexp-close-quote',

    ccnBody:                          'regexp-body',
    ccnOptions:                       'regexp-options', // g, i

    ccnInputBeginSign:                'regexp-selector-input-begin',
    ccnInputEndSign:                  'regexp-selector-input-end',

    ccnEscapeChar:                    'wlc-escape-char',
    ccnEscapeCharSlash:               'slash',
    ccnEscapeCharTheEscapedChar:      'escaped-char',

    ccnControlChar:                   'regexp-control-char',
    ccnControlCharSpecificNamePrefix: 'regexp-control',
    ccnControlCharTheChar:            'control-char',

    ccnLiteral:                       'regexp-literal-char',
    ccnLiteralSpecificNamePrefix:     'regexp-literal',
}


/*
    Single meaning control chars,
    and don't require a '\' to act as literal inside [] pairs.
    Note that
        1. '\' should escape other chars.
        2. ']' does require a '\' inside [] pairs.
        3. '^' has two meanings.
        4. '-' meaning depends on surroundings.
*/
const signleMeaningControlChars = [
    {
        char: '?',
        cssClassNameKeyword: 'question-mark',
        cssClassNameExtra:   '',
    },
    {
        char: '*',
        cssClassNameKeyword: 'asterisk',
        cssClassNameExtra:   '',
    },
    {
        char: '+',
        cssClassNameKeyword: 'plus-sign',
        cssClassNameExtra:   '',
    },
    {
        char: '|',
        cssClassNameKeyword: 'pipe',
        cssClassNameExtra:   '',
    },
    {
        char: '.',
        cssClassNameKeyword: 'period',
        cssClassNameExtra:   '',
    },
    {
        char: '(',
        cssClassNameKeyword: 'parenthesis',
        cssClassNameExtra:   ' parenthesis-open',
    },
    {
        char: ')',
        cssClassNameKeyword: 'parenthesis',
        cssClassNameExtra:   ' parenthesis-close',
    },
    {
        char: '[',
        cssClassNameKeyword: 'square-bracket',
        cssClassNameExtra:   ' square-bracket-open',
    },
    {
        char: ']',
        shouldSkipProcessingInsideBraketsPair: true,
        cssClassNameKeyword: 'square-bracket',
        cssClassNameExtra:   ' square-bracket-close',
    },
    {
        char: '{',
        cssClassNameKeyword: 'curly-brace',
        cssClassNameExtra:   ' curly-brace-open',
    },
    {
        char: '}',
        cssClassNameKeyword: 'curly-brace',
        cssClassNameExtra:   ' curly-brace-close',
    },
]

const regexpControlChars = [
    // // { char: '+',   cssClassName: 'regexp-control-char regexp-control-plus-sign' },
    // // { char: '*',   cssClassName: 'regexp-control-char regexp-control-asterisk' },
    // { char: '?',   cssClassName: 'regexp-control-char regexp-control-question-mark' },
    // // { char: '^',   cssClassName: 'regexp-control-char regexp-control-invert' },
    // { char: '(',   cssClassName: 'regexp-control-char regexp-control-parenthesis parenthesis-open' },
    // { char: ')',   cssClassName: 'regexp-control-char regexp-control-parenthesis parenthesis-close' },
    // { char: '[',   cssClassName: 'regexp-control-char regexp-control-square-bracket square-bracket-open' },
    // { char: ']',   cssClassName: 'regexp-control-char regexp-control-square-bracket square-bracket-close' },
    // { char: '{',   cssClassName: 'regexp-control-char regexp-control-curly-brace curly-brace-open' },
    // { char: '}',   cssClassName: 'regexp-control-char regexp-control-curly-brace curly-brace-close' },
    // { char: '|',   cssClassName: 'regexp-control-char regexp-control-logic-or' },

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


// TODO:
const regexpEscapedLiteralChars = [ //eslint-disable-line no-unused-vars
    {
        escapedChar: '-',
        cssClassName: 'regexp-literal-minus-sign',
        unwantedControlCssClassName: 'regexp-control-char regexp-control-range-sign',
    },
    // {
    //     escapedChar: '^',
    //     cssClassName: 'regexp-literal-caret',
    //     unwantedControlCssClassName: 'regexp-control-char regexp-control-invert',
    // },
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



module.exports = function parseOnRegExpIntoHTML(astNode) {
    const cssClassNames = {
        ...defaultCSSClassNamesRegExp,
    }

    const {
        ccnIllegal,
        ccnQuote,
        ccnQuoteOpen,
        ccnQuoteClose,
        ccnBody,
        ccnOptions,
        ccnInputBeginSign,
        ccnInputEndSign,
        ccnEscapeChar,
        ccnEscapeCharSlash,
        ccnEscapeCharTheEscapedChar,
        ccnControlChar,
        ccnControlCharSpecificNamePrefix,
        ccnControlCharTheChar,
        ccnLiteral,
        ccnLiteralSpecificNamePrefix,
    } = cssClassNames


    let { content } = astNode

    let regexpOpen = ''
    let regexpClose = ''
    let regexpOptions = ''
    let regexpBothQuotesPresent = true


    const matchingResult1 = content.match(/^(\/)/)
    if (matchingResult1) {
        const [
            ,
            regexpOpenMark, // in case an illegal regexp provided, without open mark
        ] = matchingResult1

        content = content.slice(regexpOpenMark.length)

        if (regexpOpenMark) {
            regexpOpen = `<span class="${ccnQuote} ${ccnQuoteOpen}">${regexpOpenMark}</span>`
        } else {
            regexpBothQuotesPresent = false
        }
    }


    const matchingResult2 = content.match(/(\/)([a-z]*)$/)
    if (matchingResult2) {
        const [
            tailIncludingRegexpCloseMark, // in case an illegal regexp provided, without close mark
            regexpCloseMark,              // in case an illegal regexp provided, without close mark
            regexpOptionsRaw,
        ] = matchingResult2

        content = content.slice(0, -tailIncludingRegexpCloseMark.length)

        if (regexpCloseMark) {
            regexpClose = `<span class="${ccnQuote} ${ccnQuoteClose}">${regexpCloseMark}</span>`
        } else {
            regexpBothQuotesPresent = false
        }

        regexpOptions = `<span class="${ccnOptions}">${regexpOptionsRaw}</span>`
    }


    if (!regexpBothQuotesPresent) {
        astNode.openMark = `<span class="hljs-regexp ${ccnIllegal}">`
    }


    let regexpBody = content

    if (regexpBody) {
        // '-' as char range control
        regexpBody = regexpBody.replace(
            /(\[[^a-z\]]*(\\\])?[^a-z\]]*[a-z])-([a-z])/g,
            [
                '$1',
                `<span class="${ccnControlChar} ${ccnControlCharSpecificNamePrefix}-range-sign">`,
                '-',
                '</span>',
                '$3',
            ].join('')
        ).replace(
            /(\[[^A-Z\]]*(\\\])?[^A-Z\]]*[A-Z])-([A-Z])/g,
            [
                '$1',
                `<span class="${ccnControlChar} ${ccnControlCharSpecificNamePrefix}-range-sign">`,
                '-',
                '</span>',
                '$3',
            ].join('')
        ).replace(
            /(\[[^0-9\]]*(\\\])?[^0-9\]]*[0-9])-([0-9])/g,
            [
                '$1',
                `<span class="${ccnControlChar} ${ccnControlCharSpecificNamePrefix}-range-sign">`,
                '-',
                '</span>',
                '$3',
            ].join('')
        )


        // '\\' This is ALWAYS the first escape char to deal with.
        regexpBody = regexpBody.replace(
            new RegExp('\\\\\\\\', 'g'),
            [
                `<span class="${ccnLiteral} ${ccnLiteralSpecificNamePrefix}-backward-slash">`,
                `<span class="${ccnEscapeCharSlash}">\\</span>`,
                `<span class="${ccnEscapeCharTheEscapedChar}">\\</span>`,
                '</span>',
            ].join('')
        )






        signleMeaningControlChars.filter(ccib => !ccib.shouldSkipProcessingInsideBraketsPair)
            .forEach(ccib => { // when inside [] pairs, they are literals
                const {
                    char,
                    cssClassNameKeyword: ck,
                    cssClassNameExtra: ce,
                } = ccib

                // Should be a literal char inside []
                regexpBody = regexpBody.replace(
                    new RegExp(`(\\[[^\\]]*(\\\\\\])?[^\\]]*)\\${char}`, 'g'),
                    `$1<span class="${ccnLiteral} ${ccnLiteralSpecificNamePrefix}-${ck}${ce}">${char}</span>`
                )
            })



        signleMeaningControlChars.forEach(ccib => { // outside [] pairs, they are control chars
            const {
                char,
                cssClassNameKeyword: ck,
                cssClassNameExtra: ce,
            } = ccib

            regexpBody = regexpBody.replace(
                new RegExp(`\\${char}`, 'g'),
                [
                    `<span class="${ccnControlChar} ${ccnControlCharSpecificNamePrefix}-${ck}${ce}">`,
                    `<span class="${ccnControlCharTheChar}">${char}</span>`,
                    '</span>',
                ].join('')
            )
        })


        signleMeaningControlChars.forEach(ccib => { // escaped chars as literals
            const {
                char,
                cssClassNameKeyword: ck,
                cssClassNameExtra: ce,
            } = ccib

            regexpBody = regexpBody.replace(
                new RegExp(`\\\\\\${char}`, 'g'),
                [
                    `<span class="${ccnEscapeChar} ${ccnLiteral} ${ccnLiteralSpecificNamePrefix}-${ck}${ce}">`,
                    `<span class="${ccnEscapeCharSlash}">\\</span>`,
                    `<span class="${ccnEscapeCharTheEscapedChar}">${char}</span>`,
                    '</span>',
                ].join('')
            )
        })



        // '\$'
        regexpBody = regexpBody.replace(
            new RegExp('\\\\\\$', 'g'),
            [
                `<span class="${ccnEscapeChar} ${ccnLiteral} ${ccnLiteralSpecificNamePrefix}-dollar">`,
                `<span class="${ccnEscapeCharSlash}">\\</span>`,
                `<span class="${ccnEscapeCharTheEscapedChar}">$</span>`,
                '</span>',
            ].join('')
        )

        // '$' as regexp end sign
        regexpBody = regexpBody.replace(
            new RegExp('([^>])\\$', 'g'),
            `$1<span class="${ccnInputEndSign}">$</span>`
        )


        // ['^'
        regexpBody = regexpBody.replace(
            new RegExp('\\[\\^', 'g'),
            [
                '[',
                `<span class="${ccnControlChar} ${ccnControlCharSpecificNamePrefix}-invert">`,
                `<span class="${ccnControlCharTheChar}">^</span>`,
                '</span>',
            ].join('')
        )

        // '\^'
        regexpBody = regexpBody.replace(
            new RegExp('\\\\\\^', 'g'),
            [
                `<span class="${ccnEscapeChar} ${ccnLiteral} ${ccnLiteralSpecificNamePrefix}-caret">`,
                `<span class="${ccnEscapeCharSlash}">\\</span>`,
                `<span class="${ccnEscapeCharTheEscapedChar}">^</span>`,
                '</span>',
            ].join('')
        )

        // '^' as regexp begin sign
        regexpBody = regexpBody.replace(
            new RegExp('([^>])\\^', 'g'),
            [
                '$1',
                `<span class="${ccnInputBeginSign}">^</span>`,
            ].join('')
        )












        regexpControlChars.forEach(rcc => {
            const { char } = rcc
            const isEscapeChar = char.startsWith('\\')
            const coreChar = isEscapeChar ? char.slice(1) : char

            regexpBody = regexpBody.replace(
                new RegExp(`\\${char}`, 'g'),
                `<span class="${ccnControlChar} ${rcc.cssClassName}${ isEscapeChar ? ` ${ccnEscapeChar}` : '' }">${
                    isEscapeChar ? `<span class="${ccnEscapeCharSlash}">\\</span>` : ''
                }<span class="${ccnControlCharTheChar}${ isEscapeChar ? ` ${ccnEscapeCharTheEscapedChar}` : '' }">${
                    coreChar
                }</span></span>`
            )
        })

        // regexpEscapedLiteralChars.forEach(relc => {
        //     const char = relc.escapedChar

        //     regexpBody = regexpBody.replace(
        //         new RegExp(`\\\\<span class="${relc.unwantedControlCssClassName}"><span class="control-char">\\${char}</span></span>`, 'g'),
        //         `<span class="wlc-escape-char ${relc.cssClassName}"><span class="slash">\\</span><span class="escaped-char">${
        //             char
        //         }</span></span>`
        //     )
        // })

        // regexpBody = regexpBody.replace(
        //     new RegExp('\\\\&lt;', 'g'),
        //     '<span class="wlc-escape-char regexp-literal-less-than-mark">\\<span class="escaped-char"><</span></span>'
        // )

        // regexpBody = regexpBody.replace(
        //     /(^|[^\\])\^/g,
        //     '$1<span class="regexp-selector-input-begin">^</span>'
        // )

        // regexpBody = regexpBody.replace(
        //     /([^\\])\$/g,
        //     '$1<span class="regexp-selector-input-end">$</span>'
        // )


        // // recover standalone literal +
        // regexpBody = regexpBody.replace(
        //     /<span class="regexp-literal-plus-sign"><span class="regexp-control-char regexp-control-plus-sign">\+<\/span><\/span>/g,
        //     '<span class="regexp-literal-plus-sign">+</span>'
        // )

        // // recover standalone literal *
        // regexpBody = regexpBody.replace(
        //     /<span class="regexp-literal-asterisk"><span class="regexp-control-char regexp-control-asterisk">\*<\/span><\/span>/g,
        //     '<span class="regexp-literal-asterisk">*</span>'
        // )

        // // recover '\+'
        // regexpBody = regexpBody.replace(
        //     /\\<span class="regexp-control-char regexp-control-asterisk"><span class="regexp-control-char regexp-control-asterisk">\*<\/span><\/span>/g,
        //     '<span class="wlc-escape-char regexp-literal-asterisk"><span class="slash">\\</span><span class="escaped-char">*</span></span>'
        // )

        // // recover '\*'
        // regexpBody = regexpBody.replace(
        //     /\\<span class="regexp-control-char regexp-control-asterisk"><span class="regexp-control-char regexp-control-asterisk">\*<\/span><\/span>/g,
        //     '<span class="wlc-escape-char regexp-literal-asterisk"><span class="slash">\\</span><span class="escaped-char">*</span></span>'
        // )

        // // recover '\$'
        // regexpBody = regexpBody.replace(
        //     /<span class="escaped-char"><span class="regexp-selector-input-end">\$<\/span><\/span>/g,
        //     '<span class="escaped-char">$</span>'
        // )

        // // recover '\^' as exp begin sign
        // regexpBody = regexpBody.replace(
        //     /<span class="escaped-char"><span class="regexp-selector-input-begin">\^<\/span><\/span>/g,
        //     '<span class="escaped-char">^</span>'
        // )

        // // recover '\^' as exp begin sign, again
        // regexpBody = regexpBody.replace(
        //     /<span class="escaped-char"><span class="regexp-control-char regexp-control-invert"><span class="control-char"><span class="regexp-selector-input-begin">\^<\/span><\/span><\/span><\/span>/g,
        //     '<span class="escaped-char">^</span>'
        // )

        // // recover ['^'
        // regexpBody = regexpBody.replace(
        //     /<span class="regexp-control-char regexp-control-invert"><span class="control-char"><span class="regexp-selector-input-begin">\^<\/span><\/span><\/span>/g,
        //     '<span class="regexp-control-char regexp-control-invert"><span class="control-char">^</span></span>'
        // )

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

    astNode.content = [
        regexpOpen,
        `<span class="${ccnBody}">`,
        regexpBody,
        '</span>',
        regexpClose,
        regexpOptions,
    ].join('')
}
