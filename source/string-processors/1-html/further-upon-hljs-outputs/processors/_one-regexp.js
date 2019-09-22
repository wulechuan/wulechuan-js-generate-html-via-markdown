const {
    splitRegExpASTByBraketPairs,
    splitRegExpASTForEscapeChars,
} = require('../ast/ast-splitters-for-regexp')
const parseASTSubTreeIntoSingleString = require('../ast/parse-ast-sub-tree-into-single-string')


const defaultCSSClassNamesRegExp = {
    // `ccn` means (C)SS (C)lass (N)ame

    ccnIllegal:                         'wlc-regexp-illegal',

    ccnQuote:                           'regexp-quote',
    ccnQuoteOpen:                       'regexp-open-quote',
    ccnQuoteClose:                      'regexp-close-quote',

    ccnBody:                            'regexp-body',
    ccnOptions:                         'regexp-options', // g, i

    ccnInputBeginSign:                  'regexp-selector-input-begin',
    ccnInputEndSign:                    'regexp-selector-input-end',

    ccnEscapeChar:                      'wlc-escape-char',
    ccnEscapeCharSlash:                 'slash',
    ccnEscapeCharTheEscapedChar:        'escaped-char',

    ccnControlChar:                     'regexp-control-char',
    ccnControlCharSpecificNamePrefix:   'regexp-control',
    ccnControlCharTheChar:              'control-char',

    ccnSelectorChar:                    'regexp-selector-char',
    ccnSelectorCharSpecificNamePrefix:  'regexp-selector',
    ccnSelectorCharTheChar:             'selector-char',

    ccnLiteral:                         'regexp-literal-char',
    ccnLiteralSpecificNamePrefix:       'regexp-literal',

    ccnCountingRangeBetweenCurlyBraces: 'wlc-digit-pair-between-curly-braces',
    ccnCountingRangeBetweenCurlyBracesDigit: 'digit',
}

// const cssClassNameOfLiteralForwardSlash  = 'forward-slash'
// const cssClassNameOfLiteralBackwardSlash = 'backward-slash'
const cssClassNameOfBraketAsALiteral    = 'braket'
const cssClassNameOfBraketAsAControl    = 'candidate-chars'
const cssClassNameOfOpenBraketSpecific  = 'open-braket'
const cssClassNameOfCloseBraketSpecific = 'close-braket'

const cssClassNameOfPeriodSignAsALiteral  = 'period'
const cssClassNameOfPeriodSignAsASelector = 'any-char'
const cssClassNameOfMinusSignAsARangeControl = 'range-sign'
const cssClassNameOfCaretSignAsAnInvertControl = 'invert'

const regexpRegularCharsButMustMatchViaItsHTMLEntity = [
    {
        char: '<',
        htmlEntity: '&lts;',
        cssClassNames: {
            asALiteral: 'less-than-sign',
            extra:      '',
        },
    },
    {
        char: '>',
        htmlEntity: '&gts;',
        cssClassNames: {
            asALiteral: 'greater-than-sign',
            extra:      '',
        },
    },
]

const regexpControlCharsThatMustNotEscape = [
    /*
        If `thisControlIsASelector` is true,
        we use 'regexp-selector-' as CSS class name prefix, instead of `regexp-control-`
    */

    {
        char: '?',
        // htmlEntity: '',
        cssClassNames: {
            asALiteral: 'question-mark',
            asAControl: 'question-mark', // maybe 'present-none-or-single'? way too wordy.
            extra:      '',
        },
    },
    {
        char: '*',
        // htmlEntity: '',
        cssClassNames: {
            asALiteral: 'asterisk',
            asAControl: 'asterisk', // 'present-none-or-any'?
            extra:      '',
        },
    },
    {
        char: '+',
        // htmlEntity: '',
        cssClassNames: {
            asALiteral: 'plus-sign',
            asAControl: 'plus-sign',
            extra:      '',
        },
    },
    {
        char: '|',
        // htmlEntity: '',
        cssClassNames: {
            asALiteral: 'pipe',
            asAControl: 'logic-or',
            extra:      '',
        },
    },
    {
        char: '(',
        // htmlEntity: '',
        cssClassNames: {
            asALiteral: 'parenthesis',
            asAControl: 'capture',
            extra:      ' parenthesis-open',
        },
    },
    {
        char: ')',
        // htmlEntity: '',
        cssClassNames: {
            asALiteral: 'parenthesis',
            asAControl: 'capture',
            extra:      ' parenthesis-close',
        },
    },
    {
        char: '[',
        // htmlEntity: '',
        cssClassNames: {
            asALiteral: cssClassNameOfBraketAsALiteral,
            asAControl: cssClassNameOfBraketAsAControl,
            extra:      ` ${cssClassNameOfOpenBraketSpecific}`,
        },
    },
    {
        char: ']',
        // htmlEntity: '',
        cssClassNames: {
            asALiteral: cssClassNameOfBraketAsALiteral,
            asAControl: cssClassNameOfBraketAsAControl,
            extra:      ` ${cssClassNameOfCloseBraketSpecific}`,
        },
    },
    {
        char: '{',
        // htmlEntity: '',
        cssClassNames: {
            asALiteral: 'curly-brace',
            asAControl: '',
            extra:      ' curly-brace-open',
        },
    },
    {
        char: '}',
        // htmlEntity: '',
        cssClassNames: {
            asALiteral: 'curly-brace',
            asAControl: '',
            extra:      ' curly-brace-close',
        },
    },
]

const regexpControlCharsThatMustEscape = [
    /*
        If `thisControlIsASelector` is true,
        we use 'regexp-selector-' as CSS class name prefix, instead of `regexp-control-`
    */

    { char: 'w', thisControlIsASelector: true, cssClassNames: { asASelector: 'word' } },
    { char: 'W', thisControlIsASelector: true, cssClassNames: { asASelector: 'non-word' } },
    { char: 'd', thisControlIsASelector: true, cssClassNames: { asASelector: 'digit' } },
    { char: 'D', thisControlIsASelector: true, cssClassNames: { asASelector: 'non-digit' } },
    { char: 's', thisControlIsASelector: true, cssClassNames: { asASelector: 'whitespace' } },
    { char: 'S', thisControlIsASelector: true, cssClassNames: { asASelector: 'non-whitespace' } },
    { char: 'b', thisControlIsASelector: true, cssClassNames: { asASelector: 'boundary' } },
    { char: 'B', thisControlIsASelector: true, cssClassNames: { asASelector: 'non-boundary' } },
]



module.exports = function parseOneRegExpASTNodeIntoHTML(astNodeForRegExp) {
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
        ccnCountingRangeBetweenCurlyBraces,
        ccnCountingRangeBetweenCurlyBracesDigit,
    } = cssClassNames


    // Prepare some constantly used HTML snippets here.
    const htmlSnippetSlashChar = `<span class="${ccnEscapeCharSlash}">\\</span>`


    let regexpOpen = ''
    let regexpClose = ''
    let regexpOptions = ''
    let regexpBothQuotesPresent = true
    let contentForRegExpBody = astNodeForRegExp.content

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
        astNodeForRegExp.openMark = `<span class="hljs-regexp ${ccnIllegal}">`
    }




    if (contentForRegExpBody) {
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
                    ccnControlCharSpecificNamePrefix}-${cssClassNameOfBraketAsAControl
                } ${
                    cssClassNameOfOpenBraketSpecific
                }">[</span>`,
            ]

            astNode.closeMark = [
                `<span class="${
                    ccnControlChar
                } ${
                    ccnControlCharSpecificNamePrefix}-${cssClassNameOfOpenBraketSpecific
                } ${
                    cssClassNameOfCloseBraketSpecific
                }">]</span>`,
            ]


            // If there is a '^' at the very begining of the content inside a braket pair,
            // we treat it as a control, and split the AST node further into 2 sub AST nodes.
            if (content.match(/^\^/)) {
                const astNode1 = {
                    isEnclosured: false,
                    openMark: '',
                    closeMark: '',
                    content:                 [
                        `<span class="${
                            ccnControlChar
                        } ${
                            ccnControlCharSpecificNamePrefix}-${cssClassNameOfCaretSignAsAnInvertControl
                        }">`,
                        `<span class="${ccnControlCharTheChar}">^</span>`,
                        '</span>',
                    ].join(''),
                }

                const astNode2 = {
                    isEnclosured: true,
                    openMark: '',
                    closeMark: '',
                    content: markAllRangingDashesInsideBraketsPairs(
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
                markAllEscapedControlCharsThatMustNotEscapeToTakeEffect(astNodeForAnEscapedChar)
                markAllEscapedControlCharsThatMustEscapeToTakeEffect(astNodeForAnEscapedChar)
                markAllEscapedPeriodSigns(astNodeForAnEscapedChar)
                markAllEscapedRegularChars(astNodeForAnEscapedChar)
            })

            astNodesForNonEscapedSegments.forEach((astNodeForNonEscapedSegment) => {
                markAllUnescapedPeriodSigns(astNodeForNonEscapedSegment)
                markAllNonEscapedControlCharsThatMustNotEscape(astNodeForNonEscapedSegment)
            })
        })





        astNodesOutsideBraketPairs.forEach(astNode => {
            const {
                nodesEnclosured:    astNodesForEscapedChars,
                nodesNotEnclosured: astNodesForNonEscapedSegments,
            } = splitRegExpASTForEscapeChars(astNode)

            astNodesForEscapedChars.forEach(astNodeForAnEscapedChar => {
                markAllEscapedControlCharsThatMustNotEscapeToTakeEffect(astNodeForAnEscapedChar)
                markAllEscapedControlCharsThatMustEscapeToTakeEffect(astNodeForAnEscapedChar)
                markAllEscapedPeriodSigns(astNodeForAnEscapedChar)
                markAllEscapedRegularChars(astNodeForAnEscapedChar)
            })

            astNodesForNonEscapedSegments.forEach((astNodeForNonEscapedSegment) => {
                markAllControlCharsOfInputBeginOrEnd(astNodeForNonEscapedSegment)
                markAllRepeatingTimeRanges(astNodeForNonEscapedSegment)
                markAllUnescapedPeriodSigns(astNodeForNonEscapedSegment)
                markAllNonEscapedControlCharsThatMustNotEscape(astNodeForNonEscapedSegment)
            })
        })




        contentForRegExpBody = parseASTSubTreeIntoSingleString(regExpBodyASTNode.content)
    }


    astNodeForRegExp.content = [
        regexpOpen,
        `<span class="${ccnBody}">`,
        contentForRegExpBody,
        '</span>',
        regexpClose,
        regexpOptions,
    ].join('')




    function markAllRangingDashesInsideBraketsPairs(content) {
        // '-' as char range control

        const cssClassNames = [
            ccnControlChar,
            `${ccnControlCharSpecificNamePrefix}-${cssClassNameOfMinusSignAsARangeControl}`,
        ].join(' ')

        const replacement = `$1<span class="${cssClassNames}">-</span>$2`

        return content
            .replace(/([a-z])-([a-z])/g, replacement)
            .replace(/([A-Z])-([A-Z])/g, replacement)
            .replace(/([0-9])-([0-9])/g, replacement)
    }

    function markAllControlCharsOfInputBeginOrEnd(astNodeForASegment) {
        let { content } = astNodeForASegment

        // '$' as regexp end sign
        content = content.replace(
            new RegExp('\\$', 'g'),
            `<span class="${ccnInputEndSign}">$</span>`
        )

        // '^' as regexp begin sign
        content = content.replace(
            new RegExp('\\^', 'g'),
            `<span class="${ccnInputBeginSign}">^</span>`
        )

        astNodeForASegment.content = content
    }

    function markAllEscapedPeriodSigns(astNode) {
        // '\\.'

        if (astNode.asAnEscapedCharThisHasBeenProcessed) {
            return
        }

        const escapedChar = astNode.content
        if (escapedChar !== '.') { return }
        console.log('escapedchar:', '"' + escapedChar + '"')

        const cssClassNames = [
            ccnEscapeChar,
            ccnLiteral,
            `${ccnLiteralSpecificNamePrefix}-${cssClassNameOfPeriodSignAsALiteral}`,
        ].join(' ')

        astNode.openMarkBackup = astNode.openMark // which should ALWASY be '\\'
        astNode.openMark = '' // clear the '\\'
        astNode.content = [
            `<span class="${cssClassNames}">`,
            htmlSnippetSlashChar, // here is the '\\', wrapped by a <span>.
            `<span class="${ccnEscapeCharTheEscapedChar}">.</span>`,
            '</span>',
        ].join('')

        astNode.asAnEscapedCharThisHasBeenProcessed = true
    }

    function markAllEscapedRegularChars(astNode) {
        if (astNode.asAnEscapedCharThisHasBeenProcessed) {
            return
        }

        const escapedChar = astNode.content
        console.log('escapedchar:', '"' + escapedChar + '"')

        const matchedConfigs = regexpRegularCharsButMustMatchViaItsHTMLEntity.filter(rccConfig => {
            return rccConfig.char === escapedChar || rccConfig.htmlEntity === escapedChar
        })

        if (matchedConfigs.length > 1) {
            throw new Error('@wulechuan/regexp-to-html: For content "' + escapedChar + '" more than one escaped controlling chars matched!')
        }

        // Since "matchedConfigs" might be zero lengthed array,
        // the astNode might NOT be modified at all.
        matchedConfigs.forEach(rccConfig => {
            const {
                char,
                cssClassNames: {
                    asALiteral: cl,
                    extra: ce,
                },
            } = rccConfig

            if (cl === undefined) {
                throw new Error('@wulechuan/regexp-to-html: char "' + char + '" has no CSS class name as a literal.')
            }

            astNode.openMarkBackup = astNode.openMark // which should ALWASY be '\\'
            astNode.openMark = '' // clear the '\\'
            astNode.content = [
                `<span class="${ccnEscapeChar} ${ccnLiteral} ${ccnLiteralSpecificNamePrefix}-${cl}${ce || ''}">`,
                htmlSnippetSlashChar, // here is the '\\', wrapped by a <span>.
                `<span class="${ccnEscapeCharTheEscapedChar}">${char}</span>`,
                '</span>',
            ].join('')

            astNode.asAnEscapedCharThisHasBeenProcessed = true
        })
    }

    function markAllEscapedControlCharsThatMustNotEscapeToTakeEffect(astNode) {
        if (astNode.asAnEscapedCharThisHasBeenProcessed) {
            return
        }

        const escapedChar = astNode.content
        console.log('escapedchar:', '"' + escapedChar + '"')

        const matchedConfigs = regexpControlCharsThatMustNotEscape.filter(rccConfig => {
            return rccConfig.char === escapedChar || rccConfig.htmlEntity === escapedChar
        })

        if (matchedConfigs.length > 1) {
            throw new Error('@wulechuan/regexp-to-html: For content "' + escapedChar + '" more than one escaped controlling chars matched!')
        }

        // Since "matchedConfigs" might be zero lengthed array,
        // the astNode might NOT be modified at all.
        matchedConfigs.forEach(rccConfig => {
            const {
                char,
                cssClassNames: {
                    asALiteral: cl,
                    extra: ce,
                },
            } = rccConfig

            if (cl === undefined) {
                throw new Error('@wulechuan/regexp-to-html: char "' + char + '" has no CSS class name as a literal.')
            }

            astNode.openMarkBackup = astNode.openMark // which should ALWASY be '\\'
            astNode.openMark = '' // clear the '\\'
            astNode.content = [
                `<span class="${ccnEscapeChar} ${ccnLiteral} ${ccnLiteralSpecificNamePrefix}-${cl}${ce || ''}">`,
                htmlSnippetSlashChar, // here is the '\\', wrapped by a <span>.
                `<span class="${ccnEscapeCharTheEscapedChar}">${char}</span>`,
                '</span>',
            ].join('')

            astNode.asAnEscapedCharThisHasBeenProcessed = true
        })
    }

    function markAllEscapedControlCharsThatMustEscapeToTakeEffect(astNode) {
        if (astNode.asAnEscapedCharThisHasBeenProcessed) {
            return
        }

        const escapedChar = astNode.content
        console.log('escapedchar:', '"' + escapedChar + '"')

        const matchedConfigs = regexpControlCharsThatMustEscape.filter(rccConfig => {
            return rccConfig.char === escapedChar || rccConfig.htmlEntity === escapedChar
        })

        if (matchedConfigs.length > 1) {
            throw new Error('@wulechuan/regexp-to-html: For content "' + escapedChar + '" more than one escaped controlling chars matched!')
        }

        // Since "matchedConfigs" might be zero lengthed array,
        // the astNode might NOT be modified at all.
        matchedConfigs.forEach(rccConfig => {
            const {
                char,
                thisControlIsASelector,
                cssClassNames: {
                    // asALiteral: cl,
                    asAControl: cc,
                    asASelector: cs,
                    extra: ce,
                },
            } = rccConfig

            if (cc === undefined && cs === undefined) {
                throw new Error('@wulechuan/regexp-to-html: char "' + char + '" has no CSS class name as a control.')
            }

            const cssClassNames = [
                ccnEscapeChar,
                thisControlIsASelector ? ccnSelectorChar : ccnControlChar,
                thisControlIsASelector
                    ? `${ccnSelectorCharSpecificNamePrefix}-${cs}`
                    : `${ccnControlCharSpecificNamePrefix}-${cc}`,
                ce || '',
            ].join(' ')

            astNode.openMarkBackup = astNode.openMark // which should ALWASY be '\\'
            astNode.openMark = '' // clear the '\\'
            astNode.content = [
                `<span class="${cssClassNames}">`,

                htmlSnippetSlashChar, // here is the '\\', wrapped by a <span>.

                '<span class="',
                [
                    ccnEscapeCharTheEscapedChar,
                    thisControlIsASelector ? ccnSelectorCharTheChar : ccnControlCharTheChar,
                ].join(' '),
                '">',
                `${char}</span>`,

                '</span>',
            ].join('')

            astNode.asAnEscapedCharThisHasBeenProcessed = true
        })
    }

    function markAllNonEscapedControlCharsThatMustNotEscape(astNode) {
        let { content } = astNode
        regexpControlCharsThatMustNotEscape.forEach(ccib => {
            const {
                char,
                thisControlIsASelector,
                cssClassNames: {
                    // asALiteral: cl,
                    asAControl: cc,
                    asASelector: cs,
                    extra: ce,
                },
            } = ccib

            if (cc === undefined && cs === undefined) {
                throw new Error('@wulechuan/regexp-to-html: char "' + char + '" has no CSS class name as a control.')
            }

            const cssClassNames = [
                thisControlIsASelector ? ccnSelectorChar : ccnControlChar,
                thisControlIsASelector
                    ? `${ccnSelectorCharSpecificNamePrefix}-${cs}`
                    : `${ccnControlCharSpecificNamePrefix}-${cc}`,
                ce || '',
            ].join(' ')

            content = content.replace(
                new RegExp(`\\${char}`, 'g'),
                [
                    `<span class="${cssClassNames}">`,

                    `<span class="${
                        thisControlIsASelector ? ccnSelectorCharTheChar : ccnControlCharTheChar
                    }">${char}</span>`,

                    '</span>',
                ].join('')
            )
        })

        return content
    }

    function markAllUnescapedPeriodSigns(astNode) {
        // '.'

        const { content } = astNode

        if (content) {
            const cssClassNames = [
                ccnSelectorChar,
                `${ccnSelectorCharSpecificNamePrefix}-${cssClassNameOfPeriodSignAsASelector}`,
            ].join(' ')

            astNode.content = content.replace(
                /\\./g,
                `<span class="${cssClassNames}">.</span>`
            )
        }
    }

    function markAllRepeatingTimeRanges(astNode) {
        astNode.content = astNode.content.replace(
            /(<span class="regexp-control-char regexp-control-curly-brace curly-brace-open"><span class="control-char">\{<\/span><\/span>)(\d+)((,)(\d*))?(<span class="regexp-control-char regexp-control-curly-brace curly-brace-close"><span class="control-char">\}<\/span><\/span>)/g,
            [
                '$1',
                `<span class="${ccnCountingRangeBetweenCurlyBraces}">`,
                `<span class="${ccnCountingRangeBetweenCurlyBracesDigit} ${ccnCountingRangeBetweenCurlyBracesDigit}-1">$2</span>`,
                `<span class="${'comma'}">$4</span>`,
                `<span class="${ccnCountingRangeBetweenCurlyBracesDigit} ${ccnCountingRangeBetweenCurlyBracesDigit}-2">$5</span>`,
                '</span>',
                '$6',
            ].join('')
        )
    }
}
