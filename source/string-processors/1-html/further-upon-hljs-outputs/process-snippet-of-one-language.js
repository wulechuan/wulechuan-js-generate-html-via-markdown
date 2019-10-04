const chalk                              = require('chalk')
const splitOneASTNodeByOpenAndCloseMarks = require('./ast/ast-generic-simple-splitter')

const {
    codeLanguageIsOneOf,    // eslint-disable-line no-unused-vars
    codeLanguageIsNotAnyOf, // eslint-disable-line no-unused-vars
} = require('./code-language-matchers')


const processAllLineBreaksAndLeadingWhitespaces = require(
    './processors/__line-breaks-and-leading-whitespaces'
)


const {
    parseVeryCommonPunctuationsInAnASTNodeIntoHTML,
    parseAllRestPunctuationsInAnASTNodeIntoHTML,
} = require(
    './processors/__punctuations'
)


const parseOneASTNodeOfCommentIntoHTML = require(
    './processors/_one-comment'
)


const parseOneRegExpASTNodeIntoHTML = require(
    './processors/_one-regexp'
)


const parseOneStringASTNodeIntoHTML = require(
    './processors/_one-string'
)


const {
    parseCSSFamilyStuffsInAnASTNodeIntoHTMLBeforeProcessingPunctuations,
} = require(
    './processors/language-css-family'
)


const parseJavascriptFamilyStuffsInAnASTNodeIntoHTML = require(
    './processors/language-javascript-family'
)




function processASTNodesAndCollectUnprocessedOnes(astNodes, openMark, closeMark, codeLanguageOfEnclosuredNodes, enclosuredContentsProcessor, optionsForSplitting) {
    return astNodes.reduce((restNodes, astNode) => {
        const {
            nodesEnclosured,
            nodesNotEnclosured,
        } = splitOneASTNodeByOpenAndCloseMarks(astNode, openMark, closeMark, codeLanguageOfEnclosuredNodes, optionsForSplitting)

        if (typeof enclosuredContentsProcessor === 'function') {
            nodesEnclosured.forEach(astNodeEnclosured => {
                const returnedUnprocessedASTNode = enclosuredContentsProcessor(astNodeEnclosured)

                if (returnedUnprocessedASTNode) {
                    returnedUnprocessedASTNode.forEach(n => {
                        if (!n.codeLanguage) {
                            n.codeLanguage = astNodeEnclosured.codeLanguage
                        }
                    })

                    restNodes = [
                        ...restNodes,
                        returnedUnprocessedASTNode,
                    ]
                }
            })
        }

        restNodes = [
            ...restNodes,
            ...nodesNotEnclosured,
        ]

        return restNodes
    }, [])
}

function processASTNodesOfKnownHLJSTokensAndCollectUnprocessedOnes(astNodes, hljsTokenName) {
    return processASTNodesAndCollectUnprocessedOnes(
        astNodes,
        `<span class="hljs-${hljsTokenName}">`,
        '</span>',
        null,
        astNode => {
            const { content } = astNode
            if (!content.match(/["'\s.<>[\]`~!@#$%^&*()+:;/?\\]/)) {
                astNode.openMark = `<span class="hljs-${hljsTokenName} ${content}">`
            } else {
                console.log(`WARNING: content of an "${
                    chalk.red(`.hljs-${hljsTokenName}`)
                }" has been modified into:\n    "${
                    chalk.yellow(content)
                }"\n`)
            }
        }
    )
}


module.exports = function processHTMLStringThatMightContainSubLanguages(astNode) {
    const errorContext = 'processHTMLStringThatMightContainSubLanguages' // eslint-disable-line no-unused-vars

    const {
        codeLanguage,
    } = astNode

    const allASTNodesEachOfOnePureLanguage = []
    const allRestASTNodesMightContainSubLanguages = []

    if (astNode.isOfPureCodeLanguage) {
        allASTNodesEachOfOnePureLanguage.push(astNode)
    } else if (codeLanguageIsNotAnyOf(codeLanguage, [
        'html',
        'xml',
    ])) {
        astNode.isOfPureCodeLanguage = true
        allASTNodesEachOfOnePureLanguage.push(astNode)
    } else {
        if (codeLanguageIsOneOf(codeLanguage, [
            'html',
            'xml',
        ])) {
            let restASTNodes = processASTNodesAndCollectUnprocessedOnes(
                [ astNode ],
                '<span class="hljs-tag">&lt;<span class="hljs-name">style</span>&gt;</span><span class="css">',
                '</span><span class="hljs-tag">&lt;/<span class="hljs-name">style</span>&gt;</span>',
                'css',
                astNode => {
                    astNode.isOfPureCodeLanguage = true
                    allASTNodesEachOfOnePureLanguage.push(astNode)
                },
                null
            )

            restASTNodes = processASTNodesAndCollectUnprocessedOnes(
                restASTNodes,
                '<span class="hljs-tag">&lt;<span class="hljs-name">script</span>&gt;</span><span class="javascript">',
                '</span><span class="hljs-tag">&lt;/<span class="hljs-name">script</span>&gt;</span>',
                'javascript',
                astNode => {
                    astNode.isOfPureCodeLanguage = true
                    allASTNodesEachOfOnePureLanguage.push(astNode)
                },
                null
            )

            restASTNodes.forEach(astNode => {
                astNode.isOfPureCodeLanguage = true
                allASTNodesEachOfOnePureLanguage.push(astNode)
            })
        }
    }

    allASTNodesEachOfOnePureLanguage.forEach(processHTMLStringOfOnePureCodeLanguage)
    allRestASTNodesMightContainSubLanguages.forEach(processHTMLStringThatMightContainSubLanguages)
}


function processHTMLStringOfOnePureCodeLanguage(astNode) {
    const errorContext = 'processHTMLStringOfOnePureCodeLanguage' // eslint-disable-line no-unused-vars

    const { codeLanguage } = astNode

    const {
        nodesEnclosured: astNodesForComments,
        nodesNotEnclosured: astNodesForNonComments,
    } = splitOneASTNodeByOpenAndCloseMarks(
        astNode,
        '<span class="hljs-comment">',
        '</span>'
    )

    astNodesForComments.forEach(parseOneASTNodeOfCommentIntoHTML)
    astNodesForNonComments.forEach(processAllLineBreaksAndLeadingWhitespaces)



    let astNodesRest = astNodesForNonComments


    if (codeLanguageIsOneOf(codeLanguage, [
        'xml',
        'html',
    ])) {
        astNodesRest = processASTNodesAndCollectUnprocessedOnes(
            astNodesRest,
            '<span class="hljs-meta">', // html: <!DOCTYPE html>, css: !important, etc.
            '</span>'
        )

        astNodesRest = processASTNodesAndCollectUnprocessedOnes(
            astNodesRest,
            '<span class="hljs-tag">&lt;/<span class="hljs-name">',
            '</span>&gt;</span>'
        )
    }


    if (codeLanguageIsOneOf(codeLanguage, [
        'css',
        'stylus',
        'sass',
        'less',
    ])) {
        astNodesRest = processASTNodesAndCollectUnprocessedOnes(
            astNodesRest,
            '<span class="hljs-selector-attr">',
            '</span>',
            null,
            astNode => {
                let { content } = astNode

                content = content.replace(
                    /^(\[)([\w\d-]+)([\^*~$|]=)(["']?)([^"'\]])*(["']?)(\])$/g,
                    [
                        '<span class="punctuation braket open-braket">$1</span>',
                        '<span class="hljs-attr">$2</span>',
                        '<span class="punctuation assertion">$3</span>',
                        '<span class="hljs-string">',
                        '<span class="string-quote string-opening-quote">$4</span>',
                        '<span class="string-body">$5</span>',
                        '<span class="string-quote string-closing-quote">$6</span>',
                        '</span>',
                        '<span class="punctuation braket close-braket">$7</span>',
                    ].join('')
                ).replace(
                    /^(\[)([\w\d-]+)(=)(["']?)([^"'\]])*(["']?)(\])$/g,
                    [
                        '<span class="punctuation braket open-braket">$1</span>',
                        '<span class="hljs-attr">$2</span>',
                        '<span class="punctuation assertion">$3</span>',
                        '<span class="hljs-string">',
                        '<span class="string-quote string-opening-quote">$4</span>',
                        '<span class="string-body">$5</span>',
                        '<span class="string-quote string-closing-quote">$6</span>',
                        '</span>',
                        '<span class="punctuation braket close-braket">$7</span>',
                    ].join('')
                )

                astNode.content = content
            }
        )
    }




    if (true || // eslint-disable-line no-constant-condition
        codeLanguageIsOneOf(codeLanguage, [
            'javascript',
            'typescript',
            'python',
            'java',
        ])
    ) {
        astNodesRest = processASTNodesAndCollectUnprocessedOnes(
            astNodesRest,
            '<span class="hljs-regexp">',
            '</span>',
            'regexp',
            parseOneRegExpASTNodeIntoHTML
        )
    }

    if (codeLanguageIsOneOf(codeLanguage, [
        'css',
        'stylus',
        'sass',
        'less',
    ])) {
        astNodesRest.forEach(astNode => {
            parseCSSFamilyStuffsInAnASTNodeIntoHTMLBeforeProcessingPunctuations(astNode)
        })
    }

    if (codeLanguageIsNotAnyOf(codeLanguage, [
        'xml',
        'html',
    ])) {
        astNodesRest = processASTNodesAndCollectUnprocessedOnes(
            astNodesRest,
            '<span class="hljs-string">\'', // single quote
            '</span>',
            null,
            parseOneStringASTNodeIntoHTML
        )

        astNodesRest = processASTNodesAndCollectUnprocessedOnes(
            astNodesRest,
            '<span class="hljs-string">"', // double quote
            '</span>',
            null,
            parseOneStringASTNodeIntoHTML
        )

        astNodesRest = processASTNodesAndCollectUnprocessedOnes(
            astNodesRest,
            '<span class="hljs-string">`', // grave accent quote
            '`</span>',
            null,
            parseOneStringASTNodeIntoHTML,
            {
                splittingResultValidator: content => {
                    const countOfSpans      = (content.match(/<span(\s|$)/g)     || []).length
                    const countOfSlashSpans = (content.match(/<\/span(\s|>|$)/g) || []).length
                    return countOfSpans === countOfSlashSpans
                },
            }
        )
    }

    astNodesRest = processASTNodesOfKnownHLJSTokensAndCollectUnprocessedOnes(
        astNodesRest,
        'keyword'
    )

    astNodesRest = processASTNodesOfKnownHLJSTokensAndCollectUnprocessedOnes(
        astNodesRest,
        'literal'
    )

    if (codeLanguageIsNotAnyOf(codeLanguage, [
        'css',
        'stylus',
        'sass',
        'less',
    ])) {
        // Among CSS standard font families, there is one named "math".
        // Among Javascript built-in objects, there is one named "Math".
        astNodesRest = processASTNodesOfKnownHLJSTokensAndCollectUnprocessedOnes(
            astNodesRest,
            'built_in'
        )
    }

    astNodesRest = processASTNodesAndCollectUnprocessedOnes(
        astNodesRest,
        '<span class="hljs-number">',
        '</span>',
        null,
        astNode => {
            let { content } = astNode

            content = content.replace(
                /-/g,
                '<span class="punctuation negative-sign">-</span>'
            ).replace(
                /\+/g,
                '<span class="punctuation positive-sign">+</span>'
            )

            astNode.content = content
        }
    )


    if (codeLanguageIsNotAnyOf(codeLanguage, [
        'css',
        'stylus',
        'sass',
        'less',
        'ini',
        'json',
    ])) {
        astNodesRest.forEach(astNode => {
            let { content } = astNode

            content = content.replace(
                /([\w_$][\w_$\d]*)(\s*=\s*<span class="hljs-function)/g,
                '<span class="wlc-function-name hljs-title wlc-var-name">$1</span>$2'
            )

            astNode.content = content
        })
    }


    astNodesRest.forEach(astNode => {
        // '{', '}', '[', ']', '(', ')', ',', ';', '.', etc.
        parseVeryCommonPunctuationsInAnASTNodeIntoHTML(astNode, codeLanguage)
    })


    astNodesRest = processASTNodesAndCollectUnprocessedOnes(
        astNodesRest,
        '<span class="punctuation',
        '</span>'
    )

    astNodesRest.forEach(astNode => {
        parseAllRestPunctuationsInAnASTNodeIntoHTML(astNode, codeLanguage)
    })


    if (codeLanguageIsOneOf(codeLanguage, [
        'javascript',
        'typescript',
    ])) {
        astNodesRest.forEach(astNode => {
            parseJavascriptFamilyStuffsInAnASTNodeIntoHTML(astNode, codeLanguage)
        })
    }
}
