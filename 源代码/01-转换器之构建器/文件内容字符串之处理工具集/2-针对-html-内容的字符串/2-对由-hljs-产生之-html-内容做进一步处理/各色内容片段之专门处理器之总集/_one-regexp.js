const createErrorMessageBuildersFor = require('@wulechuan/meaningful-error-messages')

const {
    splitRegExpASTByBraketPairs,
} = require('../ast/ast-splitters-for-regexp')

const splitASTForEscapeChars = require('../ast/ast-splitter-for-escape-chars-in-string-or-regexp')



const DEFAULT_CSS_CLASS_NAMES_FOR_REGEXPS = {
    // `ccn` means (C)SS (C)lass (N)ame

    ccnIllegal:                              'regexp-illegal',

    ccnQuote:                                'regexp-quote',
    ccnQuoteOpen:                            'regexp-open-quote',
    ccnQuoteClose:                           'regexp-close-quote',

    ccnBody:                                 'regexp-body',
    ccnOptions:                              'regexp-options', // g, i

    ccnInputBeginSign:                       'regexp-selector-input-begin',
    ccnInputEndSign:                         'regexp-selector-input-end',

    ccnEscapeChar:                           'escape-char',
    ccnEscapeCharSlash:                      'slash',
    ccnEscapeCharTheEscapedChar:             'escaped-char',

    ccnControlChar:                          'regexp-control-char',
    ccnControlCharSpecificNamePrefix:        'regexp-control',
    ccnControlCharTheChar:                   'control-char',

    ccnSelectorChar:                         'regexp-selector-char',
    ccnSelectorCharSpecificNamePrefix:       'regexp-selector',
    ccnSelectorCharTheChar:                  'selector-char',

    ccnCharRange:                            'regexp-char-range',
    ccnCharRangeStartChar:                   'regexp-char-range-start-char',
    ccnCharRangeEndChar:                     'regexp-char-range-end-char',

    ccnLiteral:                              'regexp-literal-char',
    ccnLiteralSpecificNamePrefix:            'regexp-literal',

    ccnCountingRangeBetweenCurlyBraces:      'digit-pair-between-curly-braces',
    ccnCountingRangeBetweenCurlyBracesDigit: 'digit',
}

// const CSS_CLASS_NAME_OF_LITERAL_FORWARD_SLASH  = 'forward-slash'
// const CSS_CLASS_NAME_OF_LITERAL_BACKWARD_SLASH = 'backward-slash'

const CSS_CLASS_NAME_OF_BRAKET_AS_A_CONTROL   = 'candidate-chars'
const CSS_CLASS_NAME_OF_BRAKET_AS_A_LITERAL   = 'braket'
const CSS_CLASS_NAME_OF_OPEN_BRAKET_SPECIFIC  = 'open-braket'
const CSS_CLASS_NAME_OF_CLOSE_BRAKET_SPECIFIC = 'close-braket'

const CSS_CLASS_NAME_OF_PERIOD_SIGN_AS_A_LITERAL        = 'period'
const CSS_CLASS_NAME_OF_PERIOD_SIGN_AS_A_SELECTOR       = 'any-char'
const CSS_CLASS_NAME_OF_MINUS_SIGN_AS_A_RANGE_CONTROL   = 'range-sign'
const CSS_CLASS_NAME_OF_CARET_SIGN_AS_AN_INVERT_CONTROL = 'invert'

const REGEXP_REGULAR_CHARS_BUT_MUST_MATCH_VIA_ITS_HTML_ENTITY = [
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

const REGEXP_CONTROL_CHARS_THAT_MUST_NOT_ESCAPE = [
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
            extra:      'open-parenthesis',
        },
    },
    {
        char: ')',
        // htmlEntity: '',
        cssClassNames: {
            asALiteral: 'parenthesis',
            asAControl: 'capture',
            extra:      'close-parenthesis',
        },
    },
    {
        char: '[',
        // htmlEntity: '',
        cssClassNames: {
            asALiteral: CSS_CLASS_NAME_OF_BRAKET_AS_A_LITERAL,
            asAControl: CSS_CLASS_NAME_OF_BRAKET_AS_A_CONTROL,
            extra:      CSS_CLASS_NAME_OF_OPEN_BRAKET_SPECIFIC,
        },
    },
    {
        char: ']',
        // htmlEntity: '',
        cssClassNames: {
            asALiteral: CSS_CLASS_NAME_OF_BRAKET_AS_A_LITERAL,
            asAControl: CSS_CLASS_NAME_OF_BRAKET_AS_A_CONTROL,
            extra:      CSS_CLASS_NAME_OF_CLOSE_BRAKET_SPECIFIC,
        },
    },
    {
        char: '{',
        // htmlEntity: '',
        cssClassNames: {
            asALiteral: 'curly-brace',
            asAControl: 'curly-brace',
            extra:      'open-curly-brace',
        },
    },
    {
        char: '}',
        // htmlEntity: '',
        cssClassNames: {
            asALiteral: 'curly-brace',
            asAControl: 'curly-brace',
            extra:      'close-curly-brace',
        },
    },
]

const REGEXP_CONTROL_CHARS_THAT_MUST_ESCAPE = [
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





const {
    buildErrorMessage,
    // buildErrorMessageSaysThatSomethingMustBe,
} = createErrorMessageBuildersFor('@wulechuan/regexp-to-html')

module.exports = function parseOneRegExpASTNodeIntoHTML(astNodeForRegExp, options = {}) {
    const {
        cssClassNames: customizedCSSClassNames = {},
    } = options

    const cssClassNames = {
        ...DEFAULT_CSS_CLASS_NAMES_FOR_REGEXPS,
        ...customizedCSSClassNames,
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
        ccnCharRange,
        ccnCharRangeStartChar,
        ccnCharRangeEndChar,
        ccnLiteral,
        ccnLiteralSpecificNamePrefix,
        ccnCountingRangeBetweenCurlyBraces,
        ccnCountingRangeBetweenCurlyBracesDigit,
    } = cssClassNames



    // Prepare some constantly used HTML snippets here.
    const htmlSnippetSlashChar = `<span class="${ccnEscapeCharSlash}">\\</span>`

    let regexpIsIllegal = false



    const {
        regexpOpen,
        regexpClose,
        regexpOptions,
        regexpBothQuotesPresent,
        contentForRegExpBody,
    } = extractTopLevelPartsOfOneRegExp(astNodeForRegExp.content)

    regexpIsIllegal = !regexpBothQuotesPresent // eslint-disable-line prefer-const



    const regExpBodyASTNode = {
        isEnclosured: true,
        openMark: `<span class="${ccnBody}">`,
        closeMark: '</span>',
        content: contentForRegExpBody,
    }

    astNodeForRegExp.content = [
        { // the '/' at beginning
            isEnclosured: true,
            openMark:  `<span class="${ccnQuote} ${ccnQuoteOpen}">`,
            closeMark: '</span>',
            content: regexpOpen,
        },

        regExpBodyASTNode, // everything between the two '/' chars

        { // the '/' at end
            isEnclosured: true,
            openMark:  `<span class="${ccnQuote} ${ccnQuoteClose}">`,
            closeMark: '</span>',
            content: regexpClose,
        },

        {
            isEnclosured: true,
            openMark:  `<span class="${ccnOptions}">`,
            closeMark: '</span>',
            content: regexpOptions, // 'g', 'i' or 'gi'
        },
    ]



    parseMainContentOfOneRegExp(regExpBodyASTNode)



    if (regexpIsIllegal) {
        astNodeForRegExp.openMark = `<span class="hljs-regexp ${ccnIllegal}">`
    }





    function extractTopLevelPartsOfOneRegExp(regexpFullContentWithOptions) {
        let regexpOpen = ''
        let regexpClose = ''
        let regexpOptions = ''
        let regexpBothQuotesPresent = true

        let contentForRegExpBody = regexpFullContentWithOptions

        const matchingResultOfRegExpOpenMark = contentForRegExpBody.match(/^(\/)/)
        if (matchingResultOfRegExpOpenMark) {
            const [
                ,
                regexpOpenMark, // in case an illegal regexp provided, without open mark
            ] = matchingResultOfRegExpOpenMark

            contentForRegExpBody = contentForRegExpBody.slice(regexpOpenMark.length)

            if (regexpOpenMark === '/') {
                regexpOpen = regexpOpenMark
            } else {
                regexpBothQuotesPresent = false
            }
        }



        const matchingResultOfRegExpCloseMark = contentForRegExpBody.match(/(\/)([a-z]*)$/)
        if (matchingResultOfRegExpCloseMark) {
            const [
                tailIncludingRegexpCloseMark, // in case an illegal regexp provided, without close mark
                regexpCloseMark,              // in case an illegal regexp provided, without close mark
                regexpOptionsRaw,
            ] = matchingResultOfRegExpCloseMark

            contentForRegExpBody = contentForRegExpBody.slice(0, -tailIncludingRegexpCloseMark.length)

            if (regexpCloseMark === '/') {
                regexpClose = regexpCloseMark
            } else {
                regexpBothQuotesPresent = false
            }

            regexpOptions = regexpOptionsRaw
        }

        return {
            regexpOpen,
            regexpClose,
            regexpOptions,
            regexpBothQuotesPresent,
            contentForRegExpBody,
        }
    }



    function parseMainContentOfOneRegExp(regExpBodyASTNode) {
        if (!regExpBodyASTNode.content) { return }


        const {
            nodesEnclosured:    astNodesInsideBraketPairs,
            nodesNotEnclosured: astNodesOutsideBraketPairs,
        } = splitRegExpASTByBraketPairs(regExpBodyASTNode)





        const astNodesForContentsInsideBraketPairs = astNodesInsideBraketPairs.reduce((astNodesForContents, astNode) => {
            astNode.openMark  = [
                `<span class="${
                    ccnControlChar
                } ${
                    ccnControlCharSpecificNamePrefix}-${CSS_CLASS_NAME_OF_BRAKET_AS_A_CONTROL
                } ${
                    CSS_CLASS_NAME_OF_OPEN_BRAKET_SPECIFIC
                }">[</span>`,
            ]


            astNode.closeMark = [
                `<span class="${
                    ccnControlChar
                } ${
                    ccnControlCharSpecificNamePrefix}-${CSS_CLASS_NAME_OF_OPEN_BRAKET_SPECIFIC
                } ${
                    CSS_CLASS_NAME_OF_CLOSE_BRAKET_SPECIFIC
                }">]</span>`,
            ]


            const { content } = astNode

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
                            ccnControlCharSpecificNamePrefix}-${CSS_CLASS_NAME_OF_CARET_SIGN_AS_AN_INVERT_CONTROL
                        }">`,
                        `<span class="${ccnControlCharTheChar}">^</span>`,
                        '</span>',
                    ].join(''),
                }

                const astNode2 = {
                    isEnclosured: true,
                    openMark: '',
                    closeMark: '',
                    content: content.slice(1),
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
            } = splitASTForEscapeChars(astNode)

            astNodesForEscapedChars.forEach(astNodeForAnEscapedChar => {
                markAllEscapedControlCharsThatMustNotEscapeToTakeEffect(astNodeForAnEscapedChar)
                markAllEscapedControlCharsThatMustEscapeToTakeEffect(astNodeForAnEscapedChar)
                markAllEscapedPeriodSigns(astNodeForAnEscapedChar)
                markAllEscapedRegularChars(astNodeForAnEscapedChar)
            })

            astNodesForNonEscapedSegments.forEach((astNodeForNonEscapedSegment) => {
                markAllRangingDashesInsideBraketsPairs(astNodeForNonEscapedSegment)
                markAllUnescapedPeriodSigns(astNodeForNonEscapedSegment)
            })
        })





        astNodesOutsideBraketPairs.forEach(astNode => {
            const {
                nodesEnclosured:    astNodesForEscapedChars,
                nodesNotEnclosured: astNodesForNonEscapedSegments,
            } = splitASTForEscapeChars(astNode)

            astNodesForEscapedChars.forEach(astNodeForAnEscapedChar => {
                markAllEscapedControlCharsThatMustNotEscapeToTakeEffect(astNodeForAnEscapedChar)
                markAllEscapedControlCharsThatMustEscapeToTakeEffect(astNodeForAnEscapedChar)
                markAllEscapedPeriodSigns(astNodeForAnEscapedChar)
                markAllEscapedRegularChars(astNodeForAnEscapedChar)
            })

            astNodesForNonEscapedSegments.forEach((astNodeForNonEscapedSegment) => {
                markAllRepeatingTimeRanges(astNodeForNonEscapedSegment)
                markAllControlCharsOfInputBeginOrEnd(astNodeForNonEscapedSegment)
                markAllUnescapedPeriodSigns(astNodeForNonEscapedSegment)
                markAllUnescapedControlCharsThatMustNotEscape(astNodeForNonEscapedSegment)
            })
        })
    }



    function markAllRangingDashesInsideBraketsPairs(astNodeInsideBraketPair) {
        // '-' as char range control

        const { content } = astNodeInsideBraketPair
        if (!content) { return }

        if (typeof content !== 'string') {
            console.log(content)
        }

        const cssClassNames = [
            ccnControlChar,
            `${ccnControlCharSpecificNamePrefix}-${CSS_CLASS_NAME_OF_MINUS_SIGN_AS_A_RANGE_CONTROL}`,
        ].join(' ')

        const replacement = [
            `<span class="${ccnCharRange}">`,
            `<span class="${ccnCharRangeStartChar}">$1</span>`,
            `<span class="${cssClassNames}">-</span>`,
            `<span class="${ccnCharRangeEndChar}">$2</span>`,
            '</span>',
        ].join('')

        astNodeInsideBraketPair.content = content
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
        // console.log('escapedchar:', '"' + escapedChar + '"')

        const cssClassNames = [
            ccnEscapeChar,
            ccnLiteral,
            `${ccnLiteralSpecificNamePrefix}-${CSS_CLASS_NAME_OF_PERIOD_SIGN_AS_A_LITERAL}`,
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

        const matchedConfigs = REGEXP_REGULAR_CHARS_BUT_MUST_MATCH_VIA_ITS_HTML_ENTITY.filter(rccConfig => {
            return rccConfig.char === escapedChar || rccConfig.htmlEntity === escapedChar
        })

        if (matchedConfigs.length > 1) {
            throw new Error(buildErrorMessage([
                'For content "' + escapedChar + '" more than one parsing configs matched!',
            ]))
        }

        astNode.openMarkBackup = astNode.openMark // which should ALWASY be '\\'
        astNode.openMark = '' // clear the '\\'

        if (matchedConfigs.length === 1) {
            const [ rccConfig ] = matchedConfigs

            const {
                char,
                cssClassNames: {
                    asALiteral: cl,
                    extra: ce,
                },
            } = rccConfig

            if (cl === undefined) {
                throw new Error(buildErrorMessage([
                    `Char "${char}" expects a CSS class name when acts as a literal.`,
                ]))
            }

            astNode.content = [
                `<span class="${ccnEscapeChar} ${ccnLiteral} ${ccnLiteralSpecificNamePrefix}-${cl}${ce || ''}">`,
                htmlSnippetSlashChar, // here is the '\\', wrapped by a <span>.
                `<span class="${ccnEscapeCharTheEscapedChar}">${char}</span>`,
                '</span>',
            ].join('')


            astNode.asAnEscapedCharThisHasBeenProcessed = true
        } else {
            astNode.content = [
                `<span class="${ccnEscapeChar}">`,
                htmlSnippetSlashChar, // here is the '\\', wrapped by a <span>.
                `<span class="${ccnEscapeCharTheEscapedChar}">${escapedChar}</span>`,
                '</span>',
            ].join('')

            astNode.asAnEscapedCharThisHasBeenProcessed = true
        }

        // console.log('escapedchar:', '"' + escapedChar + '"')
        // console.log(astNode.content)
        // console.log('^'.repeat(79))
    }



    function markAllEscapedControlCharsThatMustNotEscapeToTakeEffect(astNode) {
        if (astNode.asAnEscapedCharThisHasBeenProcessed) {
            return
        }

        const escapedChar = astNode.content

        const matchedConfigs = REGEXP_CONTROL_CHARS_THAT_MUST_NOT_ESCAPE.filter(rccConfig => {
            return rccConfig.char === escapedChar || rccConfig.htmlEntity === escapedChar
        })

        if (matchedConfigs.length > 1) {
            throw new Error(buildErrorMessage([
                'For content "' + escapedChar + '" more than one parsing configs matched!',
            ]))
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
                throw new Error(buildErrorMessage([
                    `Char "${char}" expects a CSS class name when acts as a literal.`,
                ]))
            }

            astNode.openMarkBackup = astNode.openMark // which should ALWASY be '\\'
            astNode.openMark = '' // clear the '\\'
            astNode.content = [
                `<span class="${ccnEscapeChar} ${ccnLiteral} ${ccnLiteralSpecificNamePrefix}-${cl}${ce || ''}">`,
                htmlSnippetSlashChar, // here is the '\\', wrapped by a <span>.
                `<span class="${ccnEscapeCharTheEscapedChar}">${char}</span>`,
                '</span>',
            ].join('')

            // console.log('escapedchar:', '"' + escapedChar + '"')
            // console.log(astNode.content)
            // console.log('^'.repeat(79))

            astNode.asAnEscapedCharThisHasBeenProcessed = true
        })
    }



    function markAllEscapedControlCharsThatMustEscapeToTakeEffect(astNode) {
        if (astNode.asAnEscapedCharThisHasBeenProcessed) {
            return
        }

        const escapedChar = astNode.content

        const matchedConfigs = REGEXP_CONTROL_CHARS_THAT_MUST_ESCAPE.filter(rccConfig => {
            return rccConfig.char === escapedChar || rccConfig.htmlEntity === escapedChar
        })

        if (matchedConfigs.length > 1) {
            throw new Error(buildErrorMessage([
                'For content "' + escapedChar + '" more than one parsing configs matched!',
            ]))
        }

        // Since "matchedConfigs" might be zero lengthed array,
        // the astNode might NOT be modified at all.
        matchedConfigs.forEach(rccConfig => {
            const {
                char,
                thisControlIsASelector,
                cssClassNames: {
                    asAControl: cc,
                    asASelector: cs,
                    extra: ce,
                },
            } = rccConfig

            if (cc === undefined && cs === undefined) {
                throw new Error(buildErrorMessage([
                    `Char "${char}" expects a CSS class name when acts as a control char.`,
                ]))
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

            // console.log('escapedchar:', '"' + escapedChar + '"')
            // console.log(astNode.content)
            // console.log('^'.repeat(79))

            astNode.asAnEscapedCharThisHasBeenProcessed = true
        })
    }



    function markAllUnescapedControlCharsThatMustNotEscape(astNode) {
        let { content } = astNode
        if (!content) { return }

        REGEXP_CONTROL_CHARS_THAT_MUST_NOT_ESCAPE.forEach(rccConfig => {
            const {
                char,
                thisControlIsASelector,
                cssClassNames: {
                    asAControl: cc,
                    asASelector: cs,
                    extra: ce,
                },
            } = rccConfig



            if (cc === undefined && cs === undefined) {
                throw new Error(buildErrorMessage([
                    `Char "${char}" expects a CSS class name when acts as a control char.`,
                ]))
            }

            if (content.indexOf(char) > -1) {
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
            }

            astNode.content = content
        })
    }



    function markAllUnescapedPeriodSigns(astNode) {
        // '.'

        const { content } = astNode
        if (!content) { return }

        const cssClassNames = [
            ccnSelectorChar,
            `${ccnSelectorCharSpecificNamePrefix}-${CSS_CLASS_NAME_OF_PERIOD_SIGN_AS_A_SELECTOR}`,
        ].join(' ')

        astNode.content = content.replace(
            /\./g,
            `<span class="${cssClassNames}">.</span>`
        )
    }



    function markAllRepeatingTimeRanges(astNode) {
        const { content } = astNode
        if (!content) { return }

        astNode.content = content.replace(
            /(\{)(\d+)((,)(\d*))?(\})/g,
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
