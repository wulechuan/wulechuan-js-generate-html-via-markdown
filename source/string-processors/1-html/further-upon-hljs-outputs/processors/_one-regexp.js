const {
    splitRegExpASTByBraketPairs,
} = require('../ast/ast-splitters-for-regexp')
const parseASTSubTreeIntoSingleString = require('../ast/parse-ast-sub-tree-into-single-string')


const defaultCSSClassNamesRegExp = {
    // `ccn` means (C)SS (C)lass (N)ame

    ccnIllegal:                        'wlc-regexp-illegal',

    ccnQuote:                          'regexp-quote',
    ccnQuoteOpen:                      'regexp-open-quote',
    ccnQuoteClose:                     'regexp-close-quote',

    ccnBody:                           'regexp-body',
    ccnOptions:                        'regexp-options', // g, i

    ccnInputBeginSign:                 'regexp-selector-input-begin',
    ccnInputEndSign:                   'regexp-selector-input-end',

    ccnEscapeChar:                     'wlc-escape-char',
    ccnEscapeCharSlash:                'slash',
    ccnEscapeCharTheEscapedChar:       'escaped-char',

    ccnControlChar:                    'regexp-control-char',
    ccnControlCharSpecificNamePrefix:  'regexp-control',
    ccnControlCharTheChar:             'control-char',

    ccnSelectorChar:                   'regexp-selector-char',
    ccnSelectorCharSpecificNamePrefix: 'regexp-selector',
    ccnSelectorCharTheChar:            'selector-char',

    ccnLiteral:                        'regexp-literal-char',
    ccnLiteralSpecificNamePrefix:      'regexp-literal',
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
        char: '^', // with the help of AST splitter, this one also treated as "single" meaning char.
        cssClassNameKeyword: 'caret',
        cssClassNameExtra:   '',
    },
    {
        char: '$',
        cssClassNameKeyword: 'dollar',
        cssClassNameExtra:   '',
    },
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

const regexpSelectorChars = [
    { char: '\\w', cssClassNameKeyword: 'word' },
    { char: '\\W', cssClassNameKeyword: 'non-word' },
    { char: '\\d', cssClassNameKeyword: 'digit' },
    { char: '\\D', cssClassNameKeyword: 'non-digit' },
    { char: '\\s', cssClassNameKeyword: 'whitespace' },
    { char: '\\S', cssClassNameKeyword: 'non-whitespace' },
    { char: '\\b', cssClassNameKeyword: 'boundary' },
    { char: '\\B', cssClassNameKeyword: 'non-boundary' },
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




module.exports = function parseOnRegExpIntoHTML(astNodeForRegExpBody) {
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
        ccnSelectorChar,
        ccnSelectorCharSpecificNamePrefix,
        ccnSelectorCharTheChar,
        ccnLiteral,
        ccnLiteralSpecificNamePrefix,
    } = cssClassNames


    const htmlSnippetSlashChar = `<span class="${ccnEscapeCharSlash}">\\</span>`


    let { content: contentForRegExpBody } = astNodeForRegExpBody

    let regexpOpen = ''
    let regexpClose = ''
    let regexpOptions = ''
    let regexpBothQuotesPresent = true


    const matchingResult1 = contentForRegExpBody.match(/^(\/)/)
    if (matchingResult1) {
        const [
            ,
            regexpOpenMark, // in case an illegal regexp provided, without open mark
        ] = matchingResult1

        contentForRegExpBody = contentForRegExpBody.slice(regexpOpenMark.length)

        if (regexpOpenMark) {
            regexpOpen = `<span class="${ccnQuote} ${ccnQuoteOpen}">${regexpOpenMark}</span>`
        } else {
            regexpBothQuotesPresent = false
        }
    }


    const matchingResult2 = contentForRegExpBody.match(/(\/)([a-z]*)$/)
    if (matchingResult2) {
        const [
            tailIncludingRegexpCloseMark, // in case an illegal regexp provided, without close mark
            regexpCloseMark,              // in case an illegal regexp provided, without close mark
            regexpOptionsRaw,
        ] = matchingResult2

        contentForRegExpBody = contentForRegExpBody.slice(0, -tailIncludingRegexpCloseMark.length)

        if (regexpCloseMark) {
            regexpClose = `<span class="${ccnQuote} ${ccnQuoteClose}">${regexpCloseMark}</span>`
        } else {
            regexpBothQuotesPresent = false
        }

        regexpOptions = `<span class="${ccnOptions}">${regexpOptionsRaw}</span>`
    }


    if (!regexpBothQuotesPresent) {
        astNodeForRegExpBody.openMark = `<span class="hljs-regexp ${ccnIllegal}">`
    }




    if (contentForRegExpBody) {
        // '\\' This is ALWAYS the first escape char to deal with.
        contentForRegExpBody = contentForRegExpBody.replace(
            new RegExp('\\\\\\\\', 'g'),
            [
                `<span class="${ccnLiteral} ${ccnLiteralSpecificNamePrefix}-backward-slash">`,
                htmlSnippetSlashChar,
                `<span class="${ccnEscapeCharTheEscapedChar}">\\</span>`,
                '</span>',
            ].join('')
        )


        const regExpBodyASTNode = {
            isEnclosured: true,
            openMark: '/',
            closeMark: '/',
            content: contentForRegExpBody,
        }

        const {
            nodesEnclosured:    astNodesInsideBraketPairs,
            nodesNotEnclosured: astNodesOutsideBraketPairs,
        } = splitRegExpASTByBraketPairs(regExpBodyASTNode)


        const astNodesForContentsInsideBraketPairs = astNodesInsideBraketPairs.reduce((astNodesForContents, astNode) => {
            const { content } = astNode

            astNodesInsideBraketPairs.openMark  = [
                `<span class="${ccnControlChar} ${ccnControlCharSpecificNamePrefix}-braket braket-open"></span>`,
            ]

            astNodesInsideBraketPairs.closeMark = [
                `<span class="${ccnControlChar} ${ccnControlCharSpecificNamePrefix}-braket braket-close"></span>`,
            ]


            if (content.match(/^\^/)) {
                const astNode1 = {
                    isEnclosured: false,
                    openMark: '',
                    closeMark: '',
                    content:                 [
                        `<span class="${ccnControlChar} ${ccnControlCharSpecificNamePrefix}-invert">`,
                        `<span class="${ccnControlCharTheChar}">^</span>`,
                        '</span>',
                    ].join(''),
                }

                const astNode2 = {
                    isEnclosured: true,
                    openMark: '',
                    closeMark: '',
                    content: parseAllRangingDashesInsideBraketsPairs(
                        content.slice(1)
                    ),
                }

                astNode.content = [
                    astNode1,
                    astNode2,
                ]

                astNodesForContents.push(astNode2)
            } else {
                astNodesForContents.push(astNode)
            }

            return astNodesForContents
        }, [])


        astNodesForContentsInsideBraketPairs.forEach(astNode => {
            let { content } = astNode
            content = parseAllEscapedControlChars(content)
            content = parseAllSelectorChars(content)
            astNode.content = content
        })

        astNodesOutsideBraketPairs.forEach(astNode => {
            let { content } = astNode
            content = parseAllEscapedControlChars(content)
            content = parseAllSelectorChars(content)
            astNode.content = content
        })











        // signleMeaningControlChars.filter(ccib => !ccib.shouldSkipProcessingInsideBraketsPair)
        //     .forEach(ccib => { // when inside [] pairs, they are literals
        //         const {
        //             char,
        //             cssClassNameKeyword: ck,
        //             cssClassNameExtra: ce,
        //         } = ccib

        //         // Should be a literal char inside []
        //         content = content.replace(
        //             new RegExp(`(\\[[^\\]]*(\\\\\\])?[^\\]]*)\\${char}`, 'g'),
        //             `$1<span class="${ccnLiteral} ${ccnLiteralSpecificNamePrefix}-${ck}${ce}">${char}</span>`
        //         )
        //     })



        signleMeaningControlChars.forEach(ccib => { // outside [] pairs, they are control chars
            const {
                char,
                cssClassNameKeyword: ck,
                cssClassNameExtra: ce,
            } = ccib

            contentForRegExpBody = contentForRegExpBody.replace(
                new RegExp(`\\${char}`, 'g'),
                [
                    `<span class="${ccnControlChar} ${ccnControlCharSpecificNamePrefix}-${ck}${ce}">`,
                    `<span class="${ccnControlCharTheChar}">${char}</span>`,
                    '</span>',
                ].join('')
            )
        })






        // '\$'
        contentForRegExpBody = contentForRegExpBody.replace(
            new RegExp('\\\\\\$', 'g'),
            [
                `<span class="${ccnEscapeChar} ${ccnLiteral} ${ccnLiteralSpecificNamePrefix}-dollar">`,
                htmlSnippetSlashChar,
                `<span class="${ccnEscapeCharTheEscapedChar}">$</span>`,
                '</span>',
            ].join('')
        )

        // '$' as regexp end sign
        contentForRegExpBody = contentForRegExpBody.replace(
            new RegExp('([^>])\\$', 'g'),
            `$1<span class="${ccnInputEndSign}">$</span>`
        )


        // // ['^'
        // content = content.replace(
        //     new RegExp('\\[\\^', 'g'),
        //     [
        //         '[',
        //         `<span class="${ccnControlChar} ${ccnControlCharSpecificNamePrefix}-invert">`,
        //         `<span class="${ccnControlCharTheChar}">^</span>`,
        //         '</span>',
        //     ].join('')
        // )

        // '\^'
        contentForRegExpBody = contentForRegExpBody.replace(
            new RegExp('\\\\\\^', 'g'),
            [
                `<span class="${ccnEscapeChar} ${ccnLiteral} ${ccnLiteralSpecificNamePrefix}-caret">`,
                htmlSnippetSlashChar,
                `<span class="${ccnEscapeCharTheEscapedChar}">^</span>`,
                '</span>',
            ].join('')
        )

        // '^' as regexp begin sign
        contentForRegExpBody = contentForRegExpBody.replace(
            new RegExp('([^>])\\^', 'g'),
            [
                '$1',
                `<span class="${ccnInputBeginSign}">^</span>`,
            ].join('')
        )












        // regexpEscapedLiteralChars.forEach(relc => {
        //     const char = relc.escapedChar

        //     content = content.replace(
        //         new RegExp(`\\\\<span class="${relc.unwantedControlCssClassName}"><span class="control-char">\\${char}</span></span>`, 'g'),
        //         `<span class="wlc-escape-char ${relc.cssClassName}"><span class="slash">\\</span><span class="escaped-char">${
        //             char
        //         }</span></span>`
        //     )
        // })

        // content = content.replace(
        //     new RegExp('\\\\&lt;', 'g'),
        //     '<span class="wlc-escape-char regexp-literal-less-than-mark">\\<span class="escaped-char"><</span></span>'
        // )

        // content = content.replace(
        //     /(^|[^\\])\^/g,
        //     '$1<span class="regexp-selector-input-begin">^</span>'
        // )

        // content = content.replace(
        //     /([^\\])\$/g,
        //     '$1<span class="regexp-selector-input-end">$</span>'
        // )


        // // recover standalone literal +
        // content = content.replace(
        //     /<span class="regexp-literal-plus-sign"><span class="regexp-control-char regexp-control-plus-sign">\+<\/span><\/span>/g,
        //     '<span class="regexp-literal-plus-sign">+</span>'
        // )

        // // recover standalone literal *
        // content = content.replace(
        //     /<span class="regexp-literal-asterisk"><span class="regexp-control-char regexp-control-asterisk">\*<\/span><\/span>/g,
        //     '<span class="regexp-literal-asterisk">*</span>'
        // )

        // // recover '\+'
        // content = content.replace(
        //     /\\<span class="regexp-control-char regexp-control-asterisk"><span class="regexp-control-char regexp-control-asterisk">\*<\/span><\/span>/g,
        //     '<span class="wlc-escape-char regexp-literal-asterisk"><span class="slash">\\</span><span class="escaped-char">*</span></span>'
        // )

        // // recover '\*'
        // content = content.replace(
        //     /\\<span class="regexp-control-char regexp-control-asterisk"><span class="regexp-control-char regexp-control-asterisk">\*<\/span><\/span>/g,
        //     '<span class="wlc-escape-char regexp-literal-asterisk"><span class="slash">\\</span><span class="escaped-char">*</span></span>'
        // )

        // // recover '\$'
        // content = content.replace(
        //     /<span class="escaped-char"><span class="regexp-selector-input-end">\$<\/span><\/span>/g,
        //     '<span class="escaped-char">$</span>'
        // )

        // // recover '\^' as exp begin sign
        // content = content.replace(
        //     /<span class="escaped-char"><span class="regexp-selector-input-begin">\^<\/span><\/span>/g,
        //     '<span class="escaped-char">^</span>'
        // )

        // // recover '\^' as exp begin sign, again
        // content = content.replace(
        //     /<span class="escaped-char"><span class="regexp-control-char regexp-control-invert"><span class="control-char"><span class="regexp-selector-input-begin">\^<\/span><\/span><\/span><\/span>/g,
        //     '<span class="escaped-char">^</span>'
        // )

        // // recover ['^'
        // content = content.replace(
        //     /<span class="regexp-control-char regexp-control-invert"><span class="control-char"><span class="regexp-selector-input-begin">\^<\/span><\/span><\/span>/g,
        //     '<span class="regexp-control-char regexp-control-invert"><span class="control-char">^</span></span>'
        // )

        contentForRegExpBody = contentForRegExpBody.replace(
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


        contentForRegExpBody = parseASTSubTreeIntoSingleString(regExpBodyASTNode.content)
    }


    astNodeForRegExpBody.content = [
        regexpOpen,
        `<span class="${ccnBody}">`,
        contentForRegExpBody,
        '</span>',
        regexpClose,
        regexpOptions,
    ].join('')




    function parseAllRangingDashesInsideBraketsPairs(content) {
        // '-' as char range control
        return content.replace(
            /([a-z])-([a-z])/g,
            [
                '$1',
                `<span class="${ccnControlChar} ${ccnControlCharSpecificNamePrefix}-range-sign">`,
                '-',
                '</span>',
                '$2',
            ].join('')
        ).replace(
            /([A-Z])-([A-Z])/g,
            [
                '$1',
                `<span class="${ccnControlChar} ${ccnControlCharSpecificNamePrefix}-range-sign">`,
                '-',
                '</span>',
                '$2',
            ].join('')
        ).replace(
            /([0-9])-([0-9])/g,
            [
                '$1',
                `<span class="${ccnControlChar} ${ccnControlCharSpecificNamePrefix}-range-sign">`,
                '-',
                '</span>',
                '$2',
            ].join('')
        )
    }

    function parseAllEscapedControlChars(content) {
        signleMeaningControlChars.forEach(ccib => { // escaped chars as literals
            const {
                char,
                cssClassNameKeyword: ck,
                cssClassNameExtra: ce,
            } = ccib

            content = content.replace(
                new RegExp(`\\\\\\${char}`, 'g'),
                [
                    `<span class="${ccnEscapeChar} ${ccnLiteral} ${ccnLiteralSpecificNamePrefix}-${ck}${ce}">`,
                    htmlSnippetSlashChar,
                    `<span class="${ccnEscapeCharTheEscapedChar}">${char}</span>`,
                    '</span>',
                ].join('')
            )
        })

        return content
    }

    function parseAllSelectorChars(content) {
        ccnSelectorChar,
        ccnSelectorCharSpecificNamePrefix,
        ccnSelectorCharTheChar,

        // { char: '.',   cssClassName: 'regexp-selector-char regexp-selector-any-char' },

        regexpSelectorChars.forEach(rcc => {
            const { char } = rcc
            const isEscapeChar = char.startsWith('\\')
            const coreChar = isEscapeChar ? char.slice(1) : char

            content = content.replace(
                new RegExp(`\\${char}`, 'g'),
                [
                    '<span class="',
                    `${ccnControlChar} ${ccnSelectorChar}`,
                    isEscapeChar ? ` ${ccnEscapeChar}` : '',
                    '">',
                    isEscapeChar ? htmlSnippetSlashChar : '',
                    `<span class="${ccnControlCharTheChar}">${coreChar}</span>`,
                    '</span>',
                ].join('')
            )
        })

        return content
    }
}
