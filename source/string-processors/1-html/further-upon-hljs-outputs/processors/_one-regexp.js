const {
    splitRegExpASTByBraketPairs,
    splitRegExpASTForEscapeChars,
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
    { char: '.',   cssClassNameKeyword: 'any-char' },
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
        // // '\\' This is ALWAYS the first escape char to deal with.
        // contentForRegExpBody = contentForRegExpBody.replace(
        //     new RegExp('\\\\' + '\\\\', 'g'),
        //     [
        //         `<span class="${ccnEscapeChar} ${ccnLiteral} ${ccnLiteralSpecificNamePrefix}-backward-slash">`,
        //         htmlSnippetSlashChar,
        //         `<span class="${ccnEscapeCharTheEscapedChar}">\\</span>`,
        //         '</span>',
        //     ].join('')
        // )


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


            astNode.openMark  = [
                `<span class="${
                    ccnControlChar
                } ${
                    ccnControlCharSpecificNamePrefix
                }-square-bracket square-bracket-open">[</span>`,
            ]

            astNode.closeMark = [
                `<span class="${
                    ccnControlChar
                } ${
                    ccnControlCharSpecificNamePrefix
                }-square-bracket square-bracket-close">]</span>`,
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
            const {
                nodesEnclosured:    astNodesForEscapedChars,
                nodesNotEnclosured: astNodesForNonEscapedSegments,
            } = splitRegExpASTForEscapeChars(astNode)

            astNodesForEscapedChars.forEach(astNodeForAnEscapedChar => {
                markAllEscapedControlChars(astNodeForAnEscapedChar)
                markAllBackwardSlashLeadingSelectorChars(astNodeForAnEscapedChar)
            })

            astNodesForNonEscapedSegments.forEach((astNodeForNonEscapedSegment) => {
                markAllStandaloneControlChars(astNodeForNonEscapedSegment)
                markAllStandaloneSelectorChars(astNodeForNonEscapedSegment)
            })
        })

        astNodesOutsideBraketPairs.forEach(astNode => {
            const {
                nodesEnclosured:    astNodesForEscapedChars,
                nodesNotEnclosured: astNodesForNonEscapedSegments,
            } = splitRegExpASTForEscapeChars(astNode)

            astNodesForEscapedChars.forEach(astNodeForAnEscapedChar => {
                markAllEscapedControlChars(astNodeForAnEscapedChar)
                markAllBackwardSlashLeadingControlChars(astNodeForAnEscapedChar)
                markAllBackwardSlashLeadingSelectorChars(astNodeForAnEscapedChar)
            })

            astNodesForNonEscapedSegments.forEach((astNodeForNonEscapedSegment) => {
                markAllRepeatingTimeRanges(astNodeForNonEscapedSegment)
                markAllStandaloneControlChars(astNodeForNonEscapedSegment)
                markAllStandaloneSelectorChars(astNodeForNonEscapedSegment)

                let { content } = astNodeForNonEscapedSegment

                // '$' as regexp end sign
                content = content.replace(
                    new RegExp('([^>])\\$', 'g'),
                    `$1<span class="${ccnInputEndSign}">$</span>`
                )

                // '^' as regexp begin sign
                content = content.replace(
                    new RegExp('([^>])\\^', 'g'),
                    [
                        '$1',
                        `<span class="${ccnInputBeginSign}">^</span>`,
                    ].join('')
                )

                astNodeForNonEscapedSegment.content = content
            })
        })









        // content = content.replace(
        //     new RegExp('\\\\&lt;', 'g'),
        //     '<span class="wlc-escape-char regexp-literal-less-than-mark">\\<span class="escaped-char"><</span></span>'
        // )




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

    function markAllEscapedControlChars(astNode) {
        const escapedChar = astNode.content

        const matchedSettings = signleMeaningControlChars.filter(r => {
            return r.char === escapedChar || r.htmlEntity === escapedChar
        })

        if (matchedSettings.length > 1) {
            throw new Error('@wulechuan/regexp-to-html: more than one escaped controlling chars matched!')
        }

        // Since "matchedSettings" might be zero lengthed array,
        // the astNode might NOT be modified at all.
        matchedSettings.forEach(setting => {
            console.log('>>>', escapedChar)
            const {
                char,
                cssClassNameKeyword: ck,
                cssClassNameExtra: ce,
            } = setting

            astNode.openMarkBackup = astNode.openMark // which should ALWASY be '\\'
            astNode.openMark = ''
            astNode.content = [
                `<span class="${ccnEscapeChar} ${ccnLiteral} ${ccnLiteralSpecificNamePrefix}-${ck}${ce}">`,
                htmlSnippetSlashChar,
                `<span class="${ccnEscapeCharTheEscapedChar}">${char}</span>`,
                '</span>',
            ].join('')
        })
    }

    function markAllBackwardSlashLeadingControlChars(astNode) {
        const escapedChar = astNode.content

        const matchedSettings = signleMeaningControlChars.filter(r => {
            return r.char === escapedChar || r.htmlEntity === escapedChar
        })

        if (matchedSettings.length > 1) {
            throw new Error('@wulechuan/regexp-to-html: more than one controlling chars matched!')
        }

        // Since "matchedSettings" might be zero lengthed array,
        // the astNode might NOT be modified at all.
        matchedSettings.forEach(setting => {
            console.log(escapedChar)
            const {
                char,
                cssClassNameKeyword: ck,
                cssClassNameExtra: ce,
            } = setting

            astNode.openMarkBackup = astNode.openMark // which should ALWASY be '\\'
            astNode.openMark = ''
            astNode.content = [
                `<span class="${ccnControlChar} ${ccnControlCharSpecificNamePrefix}-${ck}${ce}">`,
                `<span class="${ccnControlCharTheChar}">${char}</span>`,
                '</span>',
            ].join('')
        })
    }

    function markAllBackwardSlashLeadingSelectorChars(astNode) {
        // { char: '.',   cssClassName: 'regexp-selector-char regexp-selector-any-char' },

        const escapedChar = astNode.content

        const matchedSettings = signleMeaningControlChars.filter(r => {
            return r.char === escapedChar || r.htmlEntity === escapedChar
        })

        if (matchedSettings.length > 1) {
            throw new Error('@wulechuan/regexp-to-html: more than one escape selector chars matched!')
        }

        // Since "matchedSettings" might be zero lengthed array,
        // the astNode might NOT be modified at all.
        matchedSettings.forEach(setting => {
            console.log(escapedChar)
            const { char } = setting
            const isEscapeChar = char.startsWith('\\')
            const coreChar = isEscapeChar ? char.slice(1) : char

            astNode.openMarkBackup = astNode.openMark // which should ALWASY be '\\'
            astNode.openMark = ''
            astNode.content = [
                '<span class="',
                [
                    ccnSelectorChar,
                    `${ccnSelectorCharSpecificNamePrefix}-${'aaaaa'}`,
                    ccnEscapeChar,
                ].join(' '),
                '">',
                `<span class="${ccnEscapeCharTheEscapedChar}">${coreChar}</span>`,
                '</span>',
            ].join('')
        })
    }

    function markAllStandaloneSelectorChars(astNode) {
        let { content } = astNode
        signleMeaningControlChars.forEach(ccib => {
            const {
                char,
                cssClassNameKeyword: ck,
                cssClassNameExtra: ce,
            } = ccib

            content = content.replace(
                new RegExp(`\\${char}`, 'g'),
                [
                    `<span class="${ccnEscapeChar} ${ccnControlCharSpecificNamePrefix}-${ck}${ce}">`,
                    `<span class="${ccnSelectorCharTheChar}">${char}</span>`,
                    '</span>',
                ].join('')
            )
        })

        return content
    }

    function markAllStandaloneControlChars(astNode) {
        let { content } = astNode

        regexpSelectorChars.forEach(rsc => {
            const { char } = rsc
            const isEscapeChar = char.startsWith('\\')
            const coreChar = isEscapeChar ? char.slice(1) : char

            content = content.replace(
                new RegExp(`\\${char}`, 'g'),
                [
                    '<span class="',
                    [
                        ccnControlChar,
                        ccnSelectorChar,
                    ].join(' '),
                    '">',
                    `<span class="${ccnControlCharTheChar}">${coreChar}</span>`,
                    '</span>',
                ].join('')
            )
        })

        astNode.content = content
    }

    function markAllRepeatingTimeRanges(astNode) {
        astNode.content = astNode.content.replace(
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
}
