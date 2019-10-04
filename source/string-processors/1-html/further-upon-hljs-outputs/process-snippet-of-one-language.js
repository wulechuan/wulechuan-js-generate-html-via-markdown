const splitOneASTNodeByOpenAndCloseMarks = require('./ast/ast-generic-simple-splitter')

const {
    codeLanguageIsOneOf,    // eslint-disable-line no-unused-vars
    codeLanguageIsNotAnyOf, // eslint-disable-line no-unused-vars
} = require('./code-language-matchers')


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
    parseVeryCommonPunctuationsInAnASTNodeIntoHTML,
    parseAllRestPunctuationsInAnASTNodeIntoHTML,
} = require(
    './processors/_all-punctuations'
)


const {
    parseCSSFamilyStuffsInAnASTNodeIntoHTMLBeforeProcessingPunctuations,
} = require(
    './processors/language-css-family'
)


const parseJavascriptFamilyStuffsInAnASTNodeIntoHTML = require(
    './processors/language-javascript-family'
)




function processASTNodesAndCollectUnprocessedOnes(astNodes, openMark, closeMark, enclosuredContentsProcessor, optionsForSplitting) {
    return astNodes.reduce((restNodes, astNode) => {
        const {
            nodesEnclosured,
            nodesNotEnclosured,
        } = splitOneASTNodeByOpenAndCloseMarks(astNode, openMark, closeMark, optionsForSplitting)

        if (typeof enclosuredContentsProcessor === 'function') {
            nodesEnclosured.forEach(astNode => {
                let returnedUnprocessedASTNode
                try {
                    returnedUnprocessedASTNode = enclosuredContentsProcessor(astNode)
                } catch (err) {
                    console.log('ERROR:', astNode)
                    console.log('RAW ERROR:', err)
                }

                if (returnedUnprocessedASTNode) {
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
                astNode => {
                    astNode.codeLanguage = 'css'
                    astNode.isOfPureCodeLanguage = true
                    allASTNodesEachOfOnePureLanguage.push(astNode)
                },
                null
            )

            restASTNodes = processASTNodesAndCollectUnprocessedOnes(
                restASTNodes,
                '<span class="hljs-tag">&lt;<span class="hljs-name">script</span>&gt;</span><span class="javascript">',
                '</span><span class="hljs-tag">&lt;/<span class="hljs-name">script</span>&gt;</span>',
                astNode => {
                    astNode.codeLanguage = 'javascript'
                    astNode.isOfPureCodeLanguage = true
                    allASTNodesEachOfOnePureLanguage.push(astNode)
                },
                null
            )

            restASTNodes.forEach(astNode => {
                astNode.codeLanguage = codeLanguage
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

    astNodesForNonComments.forEach(astNode => {
        astNode.content = astNode.content.replace(
            /(\n+)(\s+)/g,
            '$1<span class="inline-pre-whitespaces indentation">$2</span>'
        ).replace(
            /\n/g,
            '<br>'
        )
    })



    let astNodesRest = astNodesForNonComments


    if (codeLanguageIsOneOf(codeLanguage, [
        'xml',
        'html',
    ])) {
        astNodesRest = processASTNodesAndCollectUnprocessedOnes(
            astNodesRest,
            '<span class="hljs-meta">', // html: <!DOCTYPE html>, css: !important, etc.
            '</span>',
            null
        )

        astNodesRest = processASTNodesAndCollectUnprocessedOnes(
            astNodesRest,
            '<span class="hljs-tag">&lt;/<span class="hljs-name">',
            '</span>&gt;</span>',
            null
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



    astNodesRest.forEach(astNode => {
        parseCSSFamilyStuffsInAnASTNodeIntoHTMLBeforeProcessingPunctuations(astNode)
    })





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
            parseOneRegExpASTNodeIntoHTML
        )
    }


    if (codeLanguageIsNotAnyOf(codeLanguage, [
        'xml',
        'html',
    ])) {
        astNodesRest = processASTNodesAndCollectUnprocessedOnes(
            astNodesRest,
            '<span class="hljs-string">\'', // single quote
            '</span>',
            parseOneStringASTNodeIntoHTML
        )

        astNodesRest = processASTNodesAndCollectUnprocessedOnes(
            astNodesRest,
            '<span class="hljs-string">"', // double quote
            '</span>',
            parseOneStringASTNodeIntoHTML
        )

        astNodesRest = processASTNodesAndCollectUnprocessedOnes(
            astNodesRest,
            '<span class="hljs-string">`', // grave accent quote
            '`</span>',
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

    astNodesRest = processASTNodesAndCollectUnprocessedOnes(
        astNodesRest,
        '<span class="hljs-keyword">',
        '</span>',
        astNode => {
            const { content } = astNode
            astNode.openMark = `<span class="hljs-keyword ${content}">`
        }
    )

    astNodesRest = processASTNodesAndCollectUnprocessedOnes(
        astNodesRest,
        '<span class="hljs-built_in">',
        '</span>',
        astNode => {
            const { content } = astNode
            astNode.openMark = `<span class="hljs-built_in ${content}">`
        }
    )

    astNodesRest = processASTNodesAndCollectUnprocessedOnes(
        astNodesRest,
        '<span class="hljs-literal">',
        '</span>',
        astNode => {
            const { content } = astNode
            astNode.openMark = `<span class="hljs-literal ${content}">`
        }
    )

    astNodesRest = processASTNodesAndCollectUnprocessedOnes(
        astNodesRest,
        '<span class="hljs-number">',
        '</span>',
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
        '</span>',
        null
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


    if (codeLanguageIsOneOf(codeLanguage, [
        'html',
        'xml',
    ])) {
        astNodesRest.forEach(astNode => {
            parseJavascriptFamilyStuffsInAnASTNodeIntoHTML(astNode, codeLanguage)
        })
    }
}
