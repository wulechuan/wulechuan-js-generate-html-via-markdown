const chalk                         = require('chalk')
const createErrorMessageBuildersFor = require('@wulechuan/meaningful-error-messages')
const splitASTForEscapeChars        = require('../ast/ast-splitter-for-escape-chars-in-string-or-regexp')



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

    ccnLiteral:                              'string-literal-char',
    ccnLiteralSpecificNamePrefix:            'string-literal',
}



const SPECIAL_ESPACED_CHARS_IN_STRINGS = [
    { escapedChar: '\\',      /* htmlEntity: '', */ cssClassNames: 'backward-slash' },
    { escapedChar: 'n',       /* htmlEntity: '', */ cssClassNames: 'new-line' },
    { escapedChar: 'r',       /* htmlEntity: '', */ cssClassNames: 'carriage-return' },
    { escapedChar: 't',       /* htmlEntity: '', */ cssClassNames: 'tab' },
    { escapedChar: '\'',      /* htmlEntity: '', */ cssClassNames: 'single-quote' },
    { escapedChar: '&#x27;', /* htmlEntity: '', */ cssClassNames: 'single-quote' },
    { escapedChar: '"',       /* htmlEntity: '', */ cssClassNames: 'double-quote' },
    { escapedChar: '/',       /* htmlEntity: '', */ cssClassNames: 'forward-mark' },
]



const REGULAR_CHARS_BUT_MUST_MATCH_VIA_ITS_HTML_ENTITY = [
    { char: '<', htmlEntity: '&lts;', cssClassNames: 'less-than-sign' },
    { char: '>', htmlEntity: '&gts;', cssClassNames: 'greater-than-sign' },
]



const {
    buildErrorMessage,
    // buildErrorMessageSaysThatSomethingMustBe,
} = createErrorMessageBuildersFor('@wulechuan/hljs-plus')



module.exports = function parseOneStringASTNodeIntoHTML(rootASTNodeForOneString, options = {}) {
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

        ccnLiteral,
        ccnLiteralSpecificNamePrefix,
    } = DEFAULT_CSS_CLASS_NAMES_FOR_STRINGS

    const {
        不应将代码块中的换行符替换成BR标签,
    } = options

    // Prepare some constantly used HTML snippets here.
    const htmlSnippetSlashChar = `<span class="${ccnEscapeCharSlash}">\\</span>`





    let stringIsIllegal = false

    const {
        decidedOpenQuoteSign,
        decidedCloseQuoteSign,
        decidedContent,
        restPartCarriedByOriginalIllegalString,
        isEmptyString,
        isTemplatedString,
    } = preprocessStringRootASTNode(rootASTNodeForOneString)

    const astNodeForStringBody = {
        isEnclosured: true,
        openMark: `<span class="${ccnBody}">`,
        closeMark: '</span>',
        content: decidedContent,
    }



    if (isTemplatedString) {
        parseOneTemplatedString(astNodeForStringBody)
    } else {
        parseOneStringLiteralOrOnePureSegmentOfOneTemplatedString(astNodeForStringBody)
    }



    const cssClassNamesForRootOpenMark = `${
        'hljs-string'
    }${
        isEmptyString   ? ` ${ccnEmpty}`   : ''
    }${
        stringIsIllegal ? ` ${ccnIllegal}` : ''
    }`

    rootASTNodeForOneString.openMark = `<span class="${cssClassNamesForRootOpenMark}">`
    // rootASTNodeForOneString.closeMark = '</span>'

    rootASTNodeForOneString.content = [
        {
            isEnclosured: true,
            openMark: `<span class="${ccnQuote} ${ccnQuoteOpen}">`,
            closeMark: '</span>',
            content: decidedOpenQuoteSign,
        },

        astNodeForStringBody,

        {
            isEnclosured: true,
            openMark: `<span class="${ccnQuote} ${ccnQuoteClose}">`,
            closeMark: '</span>',
            content: decidedCloseQuoteSign,
        },
    ]



    if (restPartCarriedByOriginalIllegalString) {
        const astNotForLegalString = {
            ...rootASTNodeForOneString,
        }

        const astNodeForCarriedExtraContent = {
            isEnclosured: false,
            openMark: '',
            closeMark: '',
            content: restPartCarriedByOriginalIllegalString,
        }

        rootASTNodeForOneString.openMark = ''
        rootASTNodeForOneString.closeMark = ''
        rootASTNodeForOneString.content = [
            astNotForLegalString,
            astNodeForCarriedExtraContent,
        ]

        return [ astNodeForCarriedExtraContent ]
    }

    return





    function preprocessStringRootASTNode(astNode) {
        const { content, openMark, closeMark } = astNode
        // const decidedOpenQuoteSign = openMark.slice(-1)
        const decidedOpenQuoteSign = openMark.replace(/.*>([^>]+)$/, '$1')

        let decidedCloseMark = closeMark
        let restPartCarriedByOriginalIllegalString = ''

        const isTemplatedString = decidedOpenQuoteSign === '`'

        let decidedCloseQuoteSign
        let decidedContent = content

        if (isTemplatedString) {
            decidedCloseQuoteSign = closeMark.slice(0, 1)
            if (decidedCloseQuoteSign === '`') {
                decidedCloseMark = decidedCloseMark.slice(1)
            }
        } else {
            // decidedCloseQuoteSign = content.slice(-1)
            decidedCloseQuoteSign = closeMark.replace(/^([^<]+)<.+/, '$1')
            decidedCloseMark = closeMark.slice(decidedCloseQuoteSign.length)
            if (
                decidedCloseQuoteSign === '\'' ||
                decidedCloseQuoteSign === '&#x27;' ||
                decidedCloseQuoteSign === '"' ||
                decidedCloseQuoteSign === '&quot;'
            ) {
                // decidedContent = decidedContent.slice(0, -1)
            } else {
                decidedCloseQuoteSign = ''
            }
        }

        // console.log('decideQuoteSignPair', [ decidedOpenQuoteSign, decidedCloseQuoteSign ])

        if (decidedOpenQuoteSign !== decidedCloseQuoteSign) {
            stringIsIllegal = true
            console.log(new Error(buildErrorMessage([
                'Different opening/closing quote marks of a single string.',
                '    opening: ' + decidedOpenQuoteSign,
                '    closing: ' + decidedCloseQuoteSign,
                '    string: "' + chalk.green(content) + '"',
            ])))
        }

        astNode.openMark  = openMark
        astNode.closeMark = decidedCloseMark

        if (!isTemplatedString) {
            const lineBreakMatchingString = 不应将代码块中的换行符替换成BR标签 ? '\n' : '<br\n>'

            if (content.match(lineBreakMatchingString)) {
                console.log(new Error (buildErrorMessage([
                    'String literal can not be multi-lined!',
                    '    string: "' + chalk.green(content) + '"',
                ])))

                const lines = content.split(lineBreakMatchingString)
                const firstLine = lines.shift()

                restPartCarriedByOriginalIllegalString = lines.join(lineBreakMatchingString)

                // console.log(restPartCarriedByOriginalIllegalString)
                // console.log('-'.repeat(79))

                decidedContent = firstLine
                decidedCloseQuoteSign = lineBreakMatchingString
            }
        }

        const isEmptyString = !decidedContent

        return {
            decidedOpenQuoteSign,
            decidedCloseQuoteSign,
            decidedContent,
            restPartCarriedByOriginalIllegalString,
            isEmptyString,
            isTemplatedString,
        }
    }

    function parseOneStringLiteralOrOnePureSegmentOfOneTemplatedString(astNode) {
        const {
            nodesEnclosured:    astNodesForEscapedChars,
            // nodesNotEnclosured: astNodesForNonEscapedSegments,
        } = splitASTForEscapeChars(astNode)

        // if (astNodesForEscapedChars && astNodesForEscapedChars.length > 0) {
        //     console.log('astNodesForEscapedChars', astNodesForEscapedChars)
        // }

        astNodesForEscapedChars.forEach(astNodeForAnEscapedChar => {
            markAllSpecialEscapeChars(astNodeForAnEscapedChar) // They have extra CSS specifical class names.
            markAllRegularEscapeChars(astNodeForAnEscapedChar) // They have less CSS class names.
        })
    }

    function parseOneTemplatedString(/* astNode */) {
        // const { content } = astNode
        // astNode.content = content.replace(
        //     /\${/g,
        //     [
        //         '<span class="string-template-interpolation-begin">',
        //         '<span class="dollar-sign">$</span>',
        //         '<span class="punctuation curly-brace open-curly-brace">{</span>',
        //         '</span>',
        //     ].join('')
        // )
    }

    function markAllSpecialEscapeChars(astNode) {
        if (astNode.asAnEscapedCharThisHasBeenProcessed) {
            return
        }

        const escapedChar = astNode.content

        const matchedConfigs = SPECIAL_ESPACED_CHARS_IN_STRINGS.filter(secConfig => {
            return secConfig.char === escapedChar || secConfig.htmlEntity === escapedChar
        })

        if (matchedConfigs.length > 1) {
            throw new Error(buildErrorMessage([
                'For content "' + escapedChar + '" more than one parsing configs matched!',
            ]))
        }



        // Since "matchedConfigs" might be zero lengthed array,
        // the astNode might NOT be modified at all.
        matchedConfigs.forEach(secConfig => {
            const {
                char,
                cssClassNames,
            } = secConfig

            const cssClassNamesToUse = `${ccnEscapeChar} ${ccnLiteral} ${ccnLiteralSpecificNamePrefix}-${cssClassNames}`

            astNode.openMarkBackup = astNode.openMark // which should ALWASY be '\\'
            astNode.openMark = '' // clear the '\\'

            astNode.content = [
                `<span class="${cssClassNamesToUse}">`,
                htmlSnippetSlashChar, // here is the '\\', wrapped by a <span>.
                `<span class="${ccnEscapeCharTheEscapedChar}">${char}</span>`,
                '</span>',
            ].join('')

            astNode.asAnEscapedCharThisHasBeenProcessed = true
        })
    }

    function markAllRegularEscapeChars(astNode) {
        if (astNode.asAnEscapedCharThisHasBeenProcessed) {
            return
        }

        const escapedChar = astNode.content

        const matchedConfigs = REGULAR_CHARS_BUT_MUST_MATCH_VIA_ITS_HTML_ENTITY.filter(secConfig => {
            return secConfig.char === escapedChar || secConfig.htmlEntity === escapedChar
        })

        if (matchedConfigs.length > 1) {
            throw new Error(buildErrorMessage([
                'For content "' + escapedChar + '" more than one parsing configs matched!',
            ]))
        }



        let printingChar
        let cssClassNamesToUse

        if (matchedConfigs.length === 1) {
            const [ secConfig ] = matchedConfigs

            const {
                char,
                cssClassNames,
            } = secConfig

            printingChar       = char
            cssClassNamesToUse = `${ccnEscapeChar} ${ccnLiteral} ${ccnLiteralSpecificNamePrefix}-${cssClassNames}`
        } else {
            printingChar       = escapedChar
            cssClassNamesToUse = ccnEscapeChar
        }



        astNode.openMarkBackup = astNode.openMark // which should ALWASY be '\\'
        astNode.openMark = '' // clear the '\\'

        astNode.content = [
            `<span class="${cssClassNamesToUse}">`,
            htmlSnippetSlashChar, // here is the '\\', wrapped by a <span>.
            `<span class="${ccnEscapeCharTheEscapedChar}">${printingChar}</span>`,
            '</span>',
        ].join('')

        astNode.asAnEscapedCharThisHasBeenProcessed = true
    }
}
