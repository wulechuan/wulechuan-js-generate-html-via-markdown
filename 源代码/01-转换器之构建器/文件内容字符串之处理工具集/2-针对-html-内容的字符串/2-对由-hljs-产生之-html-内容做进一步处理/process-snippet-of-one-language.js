const chalk                              = require('chalk')
const splitOneASTNodeByOpenAndCloseMarks = require('./ast/ast-generic-simple-splitter')

const {
    代码语种系以下之任一,    // eslint-disable-line no-unused-vars
    代码语种非以下之任一, // eslint-disable-line no-unused-vars
} = require('./代码语种称谓比对之工具集')



const processAllLineBreaksAndLeadingWhitespaces = require(
    './各色内容片段之专门处理器之总集/__line-breaks-and-leading-whitespaces'
)



const {
    parseVeryCommonPunctuationsInAnASTNodeIntoHTML,
    parseAllRestPunctuationsInAnASTNodeIntoHTML,
} = require(
    './各色内容片段之专门处理器之总集/__punctuations'
)



const parseOneASTNodeOfCommentIntoHTML = require(
    './各色内容片段之专门处理器之总集/_one-comment'
)



const parseOneRegExpASTNodeIntoHTML = require(
    './各色内容片段之专门处理器之总集/_one-regexp'
)



const parseOneStringASTNodeIntoHTML = require(
    './各色内容片段之专门处理器之总集/_one-string'
)



const {
    parseCSSFamilyStuffsInAnASTNodeIntoHTMLBeforeProcessingPunctuations,
    parseCSSFamilyStuffsInAnASTNodeIntoHTMLAfterProcessingPunctuations,
} = require(
    './各色内容片段之专门处理器之总集/针对特定语族之层叠样式表语族者'
)



const {
    parseAnHTMLSnippetASTNode,
} = require(
    './各色内容片段之专门处理器之总集/针对特定语种之超文本标记语言者'
)



const parseJavascriptFamilyStuffsInAnASTNodeIntoHTML = require(
    './各色内容片段之专门处理器之总集/针对特定语族之-javascript-语族者'
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
            let additionalCSSClassName = content
                .replace(/["'\s.<>[\]`~!#$%^&*()+:;/?\\]/g, '_')

            const shouldLogTip = additionalCSSClassName !== content

            additionalCSSClassName = additionalCSSClassName
                .replace(/^@/g, 'at_')
                .replace(/@/g, '_at_')

            astNode.openMark = `<span class="hljs-${hljsTokenName} ${additionalCSSClassName}">`

            if (shouldLogTip) {
                console.log(`@wulechuan/generate-html-via-markdown:\nCSS class names of tag "${
                    chalk.red(`.hljs-${hljsTokenName}`)
                }" with content\n    "${
                    chalk.green(content)
                }"\nhave been adjusted to:\n    "${
                    chalk.yellow(`.hljs-${hljsTokenName}.${additionalCSSClassName}`)
                }"\n`)
            }
        }
    )
}


module.exports = function processHTMLStringThatMightContainSubLanguages(astNode, options = {}) {
    const errorContext = 'processHTMLStringThatMightContainSubLanguages' // eslint-disable-line no-unused-vars

    const {
        codeLanguage,
    } = astNode

    const {
        不应将代码块中的换行符替换成BR标签,
    } = options

    const allASTNodesEachOfOnePureLanguage = []
    const allRestASTNodesMightContainSubLanguages = []

    if (astNode.isOfPureCodeLanguage) {
        allASTNodesEachOfOnePureLanguage.push(astNode)
    } else if (代码语种非以下之任一(codeLanguage, [
        'html',
        'xml',
    ])) {
        astNode.isOfPureCodeLanguage = true
        allASTNodesEachOfOnePureLanguage.push(astNode)
    } else {
        // HTML & XML

        // separate css, aka <style></style>s into pure language snippets.
        let restASTNodes = processASTNodesAndCollectUnprocessedOnes(
            [ astNode ],
            '<span class="css">',
            '</span><span class="hljs-tag">&lt;/<span class="hljs-name">style</span>&gt;</span>',
            'css',
            astNode => {
                astNode.isOfPureCodeLanguage = true
                allASTNodesEachOfOnePureLanguage.push(astNode)
            },
            null
        )

        // separate javascript, aka <script></script>s into pure language snippets.
        restASTNodes = processASTNodesAndCollectUnprocessedOnes(
            restASTNodes,
            '<span class="javascript">',
            '</span><span class="hljs-tag">&lt;/<span class="hljs-name">script</span>&gt;</span>',
            'javascript',
            astNode => {
                astNode.isOfPureCodeLanguage = true
                allASTNodesEachOfOnePureLanguage.push(astNode)
            },
            null
        )

        // separate javascript, aka <script></script>s into pure language snippets.
        // sometimes, hljs treat javascript as actionscript.
        restASTNodes = processASTNodesAndCollectUnprocessedOnes(
            restASTNodes,
            '<span class="actionscript">',
            '</span><span class="hljs-tag">&lt;/<span class="hljs-name">script</span>&gt;</span>',
            'javascript',
            astNode => {
                astNode.isOfPureCodeLanguage = true
                allASTNodesEachOfOnePureLanguage.push(astNode)
            },
            null
        )

        // mark the rest parts of HTML as pure language snippets, they are html.
        restASTNodes.forEach(astNode => {
            astNode.isOfPureCodeLanguage = true
            allASTNodesEachOfOnePureLanguage.push(astNode)
        })
    }

    allASTNodesEachOfOnePureLanguage.forEach(astNoteForOnePureLanguage => {
        processHTMLStringOfOnePureCodeLanguage(
            astNoteForOnePureLanguage,
            {
                不应将代码块中的换行符替换成BR标签,
            }
        )
    })
    allRestASTNodesMightContainSubLanguages.forEach(processHTMLStringThatMightContainSubLanguages)
}


function processHTMLStringOfOnePureCodeLanguage(astNode, options = {}) {
    const errorContext = 'processHTMLStringOfOnePureCodeLanguage' // eslint-disable-line no-unused-vars

    const { codeLanguage } = astNode

    const {
        不应将代码块中的换行符替换成BR标签,
    } = options

    const {
        nodesEnclosured: astNodesForComments,
        nodesNotEnclosured: astNodesForNonComments,
    } = splitOneASTNodeByOpenAndCloseMarks(
        astNode,
        '<span class="hljs-comment">',
        '</span>'
    )

    astNodesForComments.forEach(parseOneASTNodeOfCommentIntoHTML)

    if (!不应将代码块中的换行符替换成BR标签) {
        astNodesForNonComments.forEach(processAllLineBreaksAndLeadingWhitespaces)
    }



    let astNodesRest = astNodesForNonComments



    if (代码语种系以下之任一(codeLanguage, [
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



    if (代码语种系以下之任一(codeLanguage, [
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
        代码语种系以下之任一(codeLanguage, [
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

    if (代码语种系以下之任一(codeLanguage, [
        'css',
        'stylus',
        'sass',
        'less',
    ])) {
        astNodesRest.forEach(parseCSSFamilyStuffsInAnASTNodeIntoHTMLBeforeProcessingPunctuations)
    }

    if (代码语种系以下之任一(codeLanguage, [
        'xml',
        'html',
    ])) {
        astNodesRest.forEach(parseAnHTMLSnippetASTNode)
    } else {
        astNodesRest = processASTNodesAndCollectUnprocessedOnes(
            astNodesRest,
            '<span class="hljs-string">\'', // single quote
            '\'</span>',
            null,
            astNodeForOneString => {
                parseOneStringASTNodeIntoHTML(
                    astNodeForOneString,
                    {
                        不应将代码块中的换行符替换成BR标签,
                    }
                )
            }
        )

        astNodesRest = processASTNodesAndCollectUnprocessedOnes(
            astNodesRest,
            '<span class="hljs-string">&#x27;', // single quote
            '&#x27;</span>',
            null,
            astNodeForOneString => {
                parseOneStringASTNodeIntoHTML(
                    astNodeForOneString,
                    {
                        不应将代码块中的换行符替换成BR标签,
                    }
                )
            }
        )

        astNodesRest = processASTNodesAndCollectUnprocessedOnes(
            astNodesRest,
            '<span class="hljs-string">"', // double quotes
            '</span>',
            null,
            astNodeForOneString => {
                parseOneStringASTNodeIntoHTML(
                    astNodeForOneString,
                    {
                        不应将代码块中的换行符替换成BR标签,
                    }
                )
            }
        )

        astNodesRest = processASTNodesAndCollectUnprocessedOnes(
            astNodesRest,
            '<span class="hljs-string">&quot;', // double quotes
            '&quot;</span>',
            null,
            astNodeForOneString => {
                parseOneStringASTNodeIntoHTML(
                    astNodeForOneString,
                    {
                        不应将代码块中的换行符替换成BR标签,
                    }
                )
            }
        )

        astNodesRest = processASTNodesAndCollectUnprocessedOnes(
            astNodesRest,
            '<span class="hljs-string">`', // grave accent quote
            '`</span>',
            null,
            astNodeForOneString => {
                parseOneStringASTNodeIntoHTML(
                    astNodeForOneString,
                    {
                        不应将代码块中的换行符替换成BR标签,
                    }
                )
            },
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

    if (代码语种非以下之任一(codeLanguage, [
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

    if (代码语种系以下之任一(codeLanguage, [
        'css',
        'stylus',
        'sass',
        'less',
    ])) {
        astNodesRest.forEach(parseCSSFamilyStuffsInAnASTNodeIntoHTMLAfterProcessingPunctuations)
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



    if (代码语种非以下之任一(codeLanguage, [
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



    // '{', '}', '[', ']', '(', ')', ',', ';', '.', etc.
    astNodesRest.forEach(parseVeryCommonPunctuationsInAnASTNodeIntoHTML)



    astNodesRest = processASTNodesAndCollectUnprocessedOnes(
        astNodesRest,
        '<span class="punctuation',
        '</span>'
    )

    astNodesRest.forEach(parseAllRestPunctuationsInAnASTNodeIntoHTML)



    if (代码语种系以下之任一(codeLanguage, [
        'javascript',
        'typescript',
    ])) {
        astNodesRest.forEach(parseJavascriptFamilyStuffsInAnASTNodeIntoHTML)
    }
}
