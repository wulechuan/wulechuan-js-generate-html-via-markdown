const {
    splitOneASTNodeByOpenAndCloseMarks,
    parseASTIntoString,
} = require('./split-string-by-open-and-close-marks')

const {
    codeLanguageIsOneOf,    // eslint-disable-line no-unused-vars
    codeLanguageIsNotAnyOf, // eslint-disable-line no-unused-vars
} = require('./code-language-matchers')


const parseOneASTNodeOfCommentIntoHTML = require(
    './parse-one-comment-into-html'
)


const parseOneRegExpASTNodeIntoHTML = require(
    './parse-one-regexp-into-html'
)


const parseOneStringASTNodeIntoHTML = require(
    './parse-one-string-into-html'
)


const {
    parseVeryCommonPunctuationsInAnASTNodeIntoHTML,
    parseAllRestPunctuationsInAnASTNodeIntoHTML,
} = require(
    './parse-all-punctuations-into-html'
)


const {
    parseCSSFamilyStuffsInAnASTNodeIntoHTMLBeforePunctuations,
    parseCSSFamilyStuffsInAnASTNodeIntoHTMLAfterPunctuations,
} = require(
    './parse-language-specific-stuffs-css-family'
)


const parseJavascriptFamilyStuffsInAnASTNodeIntoHTML = require(
    './parse-language-specific-stuffs-javascript-family'
)



function processASTNodesAndCollectUnprocessedOnes(astNodes, openMark, closeMark, enclosuredContentsProcessor, optionsForSplitting) {
    return astNodes.reduce((restNodes, astNode) => {
        const {
            nodesEnclosured,
            nodesNotEnclosured,
        } = splitOneASTNodeByOpenAndCloseMarks(astNode, openMark, closeMark, optionsForSplitting)

        if (typeof enclosuredContentsProcessor === 'function') {
            nodesEnclosured.forEach(enclosuredContentsProcessor)
        }

        restNodes = [
            ...restNodes,
            ...nodesNotEnclosured,
        ]

        return restNodes
    }, [])
}


module.exports = function processAllContentsOfAllHTMLPreTagsOfHTMLString(html) {
    const rootLevelASTNodes = {
        isRoot: true, // Not used. Maybe use in the future.
        openMark: '',
        closeMark: '',
        content: html,
    }

    const {
        nodesEnclosured: astNodesHTMLPreTag,
    } = splitOneASTNodeByOpenAndCloseMarks(
        rootLevelASTNodes,
        '<pre>',
        '</pre>'
    )



    const astNodesForHTMLCodeTagsWithinAPreTag = astNodesHTMLPreTag.reduce((astNodesForCodeTags, astNodeHTMLPreTag) => {
        const segments = astNodeHTMLPreTag.content.split(/<code class="hljs(\s*)(language-)?([\w_\d-]+)?">/)
        if (segments.length !== 5) {
            throw new Error('Unhandled situation that a <pre> tag contains more than one <code> tags, or zero <code> tags.')
        }

        // console.log(`0:"${segments[0]}"`)
        // console.log(`1:"${segments[1]}"`)
        // console.log(`2:"${segments[2]}"`)
        // console.log(`3:"${segments[3].slice(0, 256)}"`)
        // console.log('-'.repeat(51))

        const [
            contentBeforeHTMLCodeTag,
            optionalSpace,
            optionalLangugaeTypePrefix,
            optionalLangugaeType,
            contentOfHTMLCodeTagWithEndTag,
        ] = segments

        const allASTNodes = []

        if (contentBeforeHTMLCodeTag) {
            allASTNodes.push({
                isEnclosured: false,
                openMark: '',
                closeMark: '',
                content: contentBeforeHTMLCodeTag,
            })
        }

        const contentSegments = contentOfHTMLCodeTagWithEndTag.split(/<\/code>/)
        const [
            contentOfHTMLCodeTag,
            contentAfterHTMLCodeTag,
        ] = contentSegments

        const codeLanguage = `${optionalLangugaeTypePrefix || ''}${optionalLangugaeType || ''}`

        const astNodeForHTMLCodeTag = {
            isHTMLCodeTagWithinAnPreTag: true,
            codeLanguage,
            isEnclosured: true,
            openMark: `<code class="hljs${optionalSpace}${codeLanguage}">`,
            closeMark: '</code>',
            content: contentOfHTMLCodeTag,
        }

        allASTNodes.push(astNodeForHTMLCodeTag)


        if (contentAfterHTMLCodeTag) {
            allASTNodes.push({
                isEnclosured: false,
                openMark: '',
                closeMark: '',
                content: contentAfterHTMLCodeTag,
            })
        }


        // allASTNodes.forEach(ast => {
        //     console.log(ast.codeLanguage)
        //     console.log(ast.content.slice(0, 256))
        // })
        // console.log('-'.repeat(79))


        astNodeHTMLPreTag.content = allASTNodes

        astNodesForCodeTags.push(astNodeForHTMLCodeTag)

        return astNodesForCodeTags
    }, [])



    astNodesForHTMLCodeTagsWithinAPreTag.forEach(astNodeHTMLCodeTag => {
        const {
            codeLanguage,
        } = astNodeHTMLCodeTag


        const {
            nodesEnclosured: astNodesForComments,
            nodesNotEnclosured: astNodesForNonComments,
        } = splitOneASTNodeByOpenAndCloseMarks(
            astNodeHTMLCodeTag,
            '<span class="hljs-comment">',
            '</span>'
        )

        astNodesForComments.forEach(parseOneASTNodeOfCommentIntoHTML)









        let astNodesRest = astNodesForNonComments // eslint-disable-line no-unused-vars


        if (
            codeLanguageIsOneOf(codeLanguage, [
                'xml',
                'html',
            ])
        ) {
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

            astNodesRest = processASTNodesAndCollectUnprocessedOnes(
                astNodesRest,
                '<span class="hljs-tag">&lt;/<span class="hljs-name">',
                '</span>&gt;</span>',
                null
            )
        }


        astNodesRest.forEach(astNode => {
            parseCSSFamilyStuffsInAnASTNodeIntoHTMLBeforePunctuations(astNode, codeLanguage)
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


        astNodesRest = processASTNodesAndCollectUnprocessedOnes(
            astNodesRest,
            '<span class="hljs-string">\'',
            '\'</span>',
            parseOneStringASTNodeIntoHTML
        )

        astNodesRest = processASTNodesAndCollectUnprocessedOnes(
            astNodesRest,
            '<span class="hljs-string">"',
            '"</span>',
            parseOneStringASTNodeIntoHTML
        )

        astNodesRest = processASTNodesAndCollectUnprocessedOnes(
            astNodesRest,
            '<span class="hljs-string">`',
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
                    '<span class="wlc-punctuation wlc-negative-sign">-</span>'
                ).replace(
                    /\+/g,
                    '<span class="wlc-punctuation wlc-positive-sign">+</span>'
                )

                astNode.content = content
            }
        )


        if (
            codeLanguageIsNotAnyOf(codeLanguage, [
                'css',
                'stylus',
                'sass',
                'less',
                'ini',
                'json',
            ])
        ) {
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
            '<span class="wlc-punctuation',
            '</span>',
            null
        )



        astNodesRest.forEach(astNode => {
            parseAllRestPunctuationsInAnASTNodeIntoHTML(astNode, codeLanguage)
        })



        if (
            codeLanguageIsOneOf(codeLanguage, [
                'css',
                'stylus',
                'sass',
                'less',
            ])
        ) {
            astNodesRest.forEach(astNode => {
                parseCSSFamilyStuffsInAnASTNodeIntoHTMLAfterPunctuations(astNode, codeLanguage)
            })
        }



        if (
            codeLanguageIsOneOf(codeLanguage, [
                'javascript',
                'typescript',
                // 'coffeescript',
            ])
        ) {
            astNodesRest.forEach(astNode => {
                parseJavascriptFamilyStuffsInAnASTNodeIntoHTML(astNode, codeLanguage)
            })
        }
    })


    return parseASTIntoString(rootLevelASTNodes)
}
