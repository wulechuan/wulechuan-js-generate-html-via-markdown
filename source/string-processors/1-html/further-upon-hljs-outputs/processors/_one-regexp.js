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

// const regexpSelectorChars = [
//     { char: '\\w', cssClassNameKeyword: 'word' },
//     { char: '\\W', cssClassNameKeyword: 'non-word' },
//     { char: '\\d', cssClassNameKeyword: 'digit' },
//     { char: '\\D', cssClassNameKeyword: 'non-digit' },
//     { char: '\\s', cssClassNameKeyword: 'whitespace' },
//     { char: '\\S', cssClassNameKeyword: 'non-whitespace' },
//     { char: '\\b', cssClassNameKeyword: 'boundary' },
//     { char: '\\B', cssClassNameKeyword: 'non-boundary' },
// ]


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


function regExpASTSplitter(astNode) {
    const { content } = astNode

    const segs = content.split('[')
    const subASTs = []

    const seg1 = segs.shift()

    let lastSegEndsWithBackwardsSlash = seg1.slice(-1) === '\\'
    let openMarksCountInsideOneBraketPair = 0
    let closeMarksCountInsideOneBraketPair = 0
    let currentMergedSeg = seg1

    let braketsPairOpened = false
    let closeMarksCountBeforeBraketsPairStart = 0

    for (let i = 0; i < segs.length; i++) {
        /*
            A new '[' presents at begininig of each loop pass,
            because the segs array was splitted by '[', plus
            the first member of the array has already been `shift()`
            before hand, outside this `for` loop block.
        */

        if (!braketsPairOpened) {

            if (lastSegEndsWithBackwardsSlash) {

                // A literal '[' is meet, because it is escaped.
                currentMergedSeg += '[' // A literal '['
                openMarksCountInsideOneBraketPair++

            } else {

                braketsPairOpened = true
                openMarksCountInsideOneBraketPair = 0
                closeMarksCountInsideOneBraketPair = 0

                if (currentMergedSeg) { // We have things outside the just opening brakets pair.
                    subASTs.push({
                        isEnclosured: false,
                        openMark: '',
                        closeMark: '',
                        content: currentMergedSeg,
                    })

                    currentMergedSeg = ''
                }

            }

        } else {

            // braketsPair already opened in previous loop pass
            // A literal '[' is meet, no matter it is escaped or not
            currentMergedSeg += '[' // A literal '['
            openMarksCountInsideOneBraketPair++

        }

        const currentSeg = segs[i]
        lastSegEndsWithBackwardsSlash = currentSeg.slice(-1) === '\\'

        const segParts = currentSeg.split(']')


        if (!braketsPairOpened) {
            const unescapedCloseMarksCount = segParts.slice(-1).reduce((c, s) => {
                if (s.slice(-1) !== '\\') {
                    c++
                }
                return c
            }, 0)

            closeMarksCountBeforeBraketsPairStart += unescapedCloseMarksCount
            if (closeMarksCountBeforeBraketsPairStart > 0) {
                throw new Error('@wulechuan/regexp-to-html: closing braket present before opening braket.')
            }

            currentMergedSeg += currentSeg

            continue
        }


        const firstSegPart = segParts.shift()

        currentMergedSeg += firstSegPart

        let lastSegPartEndsWithBackwardsSlash = firstSegPart.slice(-1) === '\\'

        for (let j = 0; j < segParts.length; j++) {
            const segPart = segParts[j]

            if (lastSegPartEndsWithBackwardsSlash) {
                // a literal `]`, that is a '\]'
                currentMergedSeg += ']'
                closeMarksCountInsideOneBraketPair++

                if (closeMarksCountInsideOneBraketPair > 2) {
                    console.log('too many closemarks:', closeMarksCountInsideOneBraketPair)
                    console.log('too many closemarks:', segParts)
                    throw new Error('@wulechuan/regexp-to-html: [] not pairing well.')
                }

                currentMergedSeg += segPart

                continue
            }


            // A valid closing braket, aka a ']', presents

            if (braketsPairOpened) {
                subASTs.push({
                    isEnclosured: true,
                    openMark:  '[',
                    closeMark: ']',
                    content: currentMergedSeg,
                })

                currentMergedSeg = ''
                braketsPairOpened = false
            } else {
                // Brackets pare already closed,
                // but another non escaped `]` presents
                closeMarksCountBeforeBraketsPairStart++
            }

            currentMergedSeg += segPart

            lastSegPartEndsWithBackwardsSlash = segPart.slice(-1) === '\\'
        }

        // if (currentMergedSegIsPairedCorrectly) {

        //     console.log(i, 'paired!')

        //     if (currentMergedSeg) { // paired correctly, and have tail string outside the [] pair.
        //         console.log('    has tail:"' + currentMergedSeg + '"')

        //         if (currentMergedSeg.slice(-1) === '\\') {
        //             // The tail ends will a '\\'.
        //             // So The splitter behide this seg was a literal `[`, and was escaped.

        //             currentMergedSeg += '['
        //             openMarksCountInsideOneBraketPair++

        //         } else {
        //             // The tail does NOT end will a '\\'.
        //             // So the next(in the next loop) '[' will be a begining of a new [] pair.
        //             subASTs.push({
        //                 isEnclosured: false,
        //                 openMark: '',
        //                 closeMark: '',
        //                 content: currentMergedSeg,
        //             })
        //             currentMergedSegIsPairedCorrectly = false
        //         }
        //     } else {
        //         // Paired and no tail. Clean.
        //         console.log('    no tail content')
        //     }
        // }

        if (openMarksCountInsideOneBraketPair > 1) {
            throw new Error('@wulechuan/regexp-to-html: Too many "[" within on pair of "[]".')
        }

        // console.log('RegExp AST:')
        // subASTs.filter(a => a.isEnclosured).forEach(a => console.log(a))
        // console.log('-'.repeat(59))

        astNode.content = subASTs
    }

    if (currentMergedSeg) {
        subASTs.push({
            isEnclosured: false,
            openMark: '',
            closeMark: '',
            content: currentMergedSeg,
        })

        currentMergedSeg = ''
    }
}


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
        // ccnSelectorChar,
        // ccnSelectorCharSpecificNamePrefix,
        // ccnSelectorCharTheChar,
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




    const regExpBodyASTNode = {
        isEnclosured: true,
        openMark: '/',
        closeMark: '/',
        content,
    }

    if (content) {
        regExpASTSplitter(regExpBodyASTNode)

        console.log('RegExp AST:')
        console.log(regExpBodyASTNode)
        console.log('-'.repeat(59))

        let regexpBody = content


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

            // All control chars have been incorrectly treated as control chars
            // even if they are escaped.
            const incorrectInputRegExpBody = [
                '\\\\',
                `<span class="${ccnControlChar} ${ccnControlCharSpecificNamePrefix}-${ck}${ce}">`,
                `<span class="${ccnControlCharTheChar}">\\${char}<\\/span>`,
                '<\\/span>',
            ].join('')

            // Now lets recover them back to escaped literals.
            regexpBody = regexpBody.replace(
                new RegExp(incorrectInputRegExpBody, 'g'),
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










        // { char: '.',   cssClassName: 'regexp-selector-char regexp-selector-any-char' },


        // regexpSelectorChars.forEach(rcc => {
        //     const { char } = rcc
        //     const isEscapeChar = char.startsWith('\\')
        //     const coreChar = isEscapeChar ? char.slice(1) : char

        //     regexpBody = regexpBody.replace(
        //         new RegExp(`\\${char}`, 'g'),
        //         `<span class="${ccnControlChar} ${rcc.cssClassName}${ isEscapeChar ? ` ${ccnEscapeChar}` : '' }">${
        //             isEscapeChar ? `<span class="${ccnEscapeCharSlash}">\\</span>` : ''
        //         }<span class="${ccnControlCharTheChar}${ isEscapeChar ? ` ${ccnEscapeCharTheEscapedChar}` : '' }">${
        //             coreChar
        //         }</span></span>`
        //     )
        // })

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
        regExpBodyASTNode.content,
        '</span>',
        regexpClose,
        regexpOptions,
    ].join('')
}
