const {
    splitStringIntoASTByOpenAndCloseMarks,
    parseASTIntoString,
} = require('./split-string-by-open-and-close-marks')

const parseOneRegExpIntoHTML = require(
    './parse-one-regexp-into-html'
)
const parseOneStringASTNodeIntoHTML = require(
    './parse-one-string-into-html'
)
const processAnyNonStringNonRegExpContextOfHTMLString = require(
    './parse-any-non-string-non-regexp-codes-into-html'
)

function processRestASTNodes(astNodesRest, openMark, closeMark, enclosuredContentsProcessor, optionsForSplitting) {
    return astNodesRest.reduce((restNodes, astNode) => {
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
        const segments = astNodeHTMLPreTag.content.split(/<code class="hljs(\s*)(language-[\w_\d-]+)?">/)
        if (segments.length !== 4) {
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

        const astNodeForHTMLCodeTag = {
            isHTMLCodeTagWithinAnPreTag: true,
            codeLanguage: optionalLangugaeType,
            isEnclosured: true,
            openMark: `<code class="hljs${optionalSpace}${optionalLangugaeType}">`,
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









        let astNodesRest = astNodesForNonComments


        astNodesRest = processRestASTNodes(
            astNodesRest,
            '<span class="hljs-tag">&lt;<span class="hljs-name">',
            '</span>&gt;</span>',
            null
        )

        astNodesRest = processRestASTNodes(
            astNodesRest,
            '<span class="hljs-tag">&lt;/<span class="hljs-name">',
            '</span>&gt;</span>',
            null
        )

        astNodesRest = processRestASTNodes(
            astNodesRest,
            '<span class="hljs-regexp">',
            '</span>',
            parseOneRegExpIntoHTML
        )

        astNodesRest = processRestASTNodes(
            astNodesRest,
            '<span class="hljs-string">\'',
            '\'</span>',
            parseOneStringASTNodeIntoHTML
        )

        astNodesRest = processRestASTNodes(
            astNodesRest,
            '<span class="hljs-string">"',
            '"</span>',
            parseOneStringASTNodeIntoHTML
        )

        astNodesRest = processRestASTNodes(
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

        astNodesRest = processRestASTNodes(
            astNodesRest,
            '<span class="hljs-keyword">',
            '</span>',
            astNode => {
                const { content } = astNode
                astNode.openMark = `<span class="hljs-keyword ${content}">`
            }
        )

        astNodesRest = processRestASTNodes(
            astNodesRest,
            '<span class="hljs-built_in">',
            '</span>',
            astNode => {
                const { content } = astNode
                astNode.openMark = `<span class="hljs-built_in ${content}">`
            }
        )

        astNodesRest = processRestASTNodes(
            astNodesRest,
            '<span class="hljs-literal">',
            '</span>',
            astNode => {
                const { content } = astNode
                astNode.openMark = `<span class="hljs-literal ${content}">`
            }
        )

        astNodesRest = processRestASTNodes(
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






        // astNodesRest.forEach(astNode => {
        //     astNode.content = processAnyNonStringNonRegExpContextOfHTMLString(astNode)
        // })
    })


    return parseASTIntoString(rootLevelASTNodes)
}
