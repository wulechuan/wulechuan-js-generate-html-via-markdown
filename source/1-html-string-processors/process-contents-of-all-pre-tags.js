const {
    splitStringIntoASTByOpenAndCloseMarks,
    parseASTIntoString,
} = require('./split-string-by-open-and-close-marks')

const parseOneRegExpASTNodeIntoHTML = require(
    './parse-one-regexp-into-html'
)
const parseOneStringASTNodeIntoHTML = require(
    './parse-one-string-into-html'
)
const parseSepcialPunctuationsIntoHTML = require(
    './parse-punctuations-special-into-html'
)
const parseCommonPunctuationsIntoHTML = require(
    './parse-punctuations-common-into-html'
)



function processASTNodesAndCollectUnprocessedOnes(astNodes, openMark, closeMark, enclosuredContentsProcessor, optionsForSplitting) {
    return astNodes.reduce((restNodes, astNode) => {
        const {
            allNodesInOriginalOrder,
            nodesEnclosured: astNodesForRegExps,
            nodesNotEnclosured,
        } = splitStringIntoASTByOpenAndCloseMarks(
            astNode.content,
            openMark,
            closeMark,
            optionsForSplitting
        )

        astNode.content = allNodesInOriginalOrder

        if (typeof enclosuredContentsProcessor === 'function') {
            astNodesForRegExps.forEach(enclosuredContentsProcessor)
        }

        restNodes = [
            ...restNodes,
            ...nodesNotEnclosured,
        ]

        return restNodes
    }, [])
}

function codeLanguageIsOneOf(codeLanguage, languageNames) {
    if (!codeLanguage) {
        return false
    }

    if (!codeLanguage || typeof codeLanguage !== 'string') {
        throw new TypeError('@wulechuan/hljs-plus: codeLanguage must be a non-empty string')
    }

    if (!Array.isArray(languageNames)) {
        throw new TypeError('@wulechuan/hljs-plus: languageNames must be an array')
    }

    let cl1
    // let cl2

    const matchingResult = codeLanguage.match(/^language-([\w_\d-]+)/)
    if (matchingResult) {
        cl1 = matchingResult[1]
        // cl2 = codeLanguage
    } else {
        cl1 = codeLanguage
        // cl2 = `language-${codeLanguage}`
    }

    for (let i = 0; i < languageNames.length; i++) {
        const provided = languageNames[i]

        if (!provided || typeof provided !== 'string') {
            throw new TypeError('@wulechuan/hljs-plus: languageName must be a non-empty string')
        }

        let l1
        // let l2

        const matchingResult = provided.match(/^language-([\w_\d-]+)/)
        if (matchingResult) {
            l1 = matchingResult[1]
            // l2 = provided
        } else {
            l1 = provided
            // l2 = `language-${provided}`
        }

        if (cl1 === l1) {
            return true
        }
    }

    return false
}

function codeLanguageIsNotAnyOf(codeLanguage, languageNames) { // eslint-disable-line no-unused-vars
    return !codeLanguageIsOneOf(codeLanguage, languageNames)
}

module.exports = function processAllContentsOfAllHTMLPreTagsOfHTMLString(html) {
    const {
        allNodesInOriginalOrder: rootLevelASTNodes,
        nodesEnclosured: astNodesHTMLPreTag,
    } = splitStringIntoASTByOpenAndCloseMarks(
        html,
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
            allNodesInOriginalOrder,
            // nodesEnclosured: astNodesForComments,
            nodesNotEnclosured: astNodesForNonComments,
        } = splitStringIntoASTByOpenAndCloseMarks(
            astNodeHTMLCodeTag.content,
            '<span class="hljs-comment">',
            '</span>'
        )

        astNodeHTMLCodeTag.content = allNodesInOriginalOrder

        // astNodesForComments.forEach(parseOneCommentASTNodeIntoHTML)









        let astNodesRest = astNodesForNonComments // eslint-disable-line no-unused-vars


        if (
            codeLanguageIsOneOf(codeLanguage, [
                'xml',
                'html',
            ])
        ) {
            astNodesRest = processASTNodesAndCollectUnprocessedOnes(
                astNodesRest,
                '<span class="hljs-meta">', // <!DOCTYPE html>
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
            astNode => {
                if (astNode.content.match(/<span|<\/span>/)) {
                    return
                }
                parseOneStringASTNodeIntoHTML(astNode)
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
                'less',
                'sass',
            ])
        ) {
            // ++ -- % etc
            astNodesRest.forEach(astNode => {
                parseSepcialPunctuationsIntoHTML(astNode)
            })
        }



        astNodesRest.forEach(astNode => {
            // '{', '}', '[', ']', '(', ')', ',', ';', '.', etc.
            parseCommonPunctuationsIntoHTML(astNode)
        })
    })


    return parseASTIntoString(rootLevelASTNodes)
}
