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

module.exports = function processAllContentsOfAllHTMLPreTagsOfHTMLString(html) {
    const {
        allNodesInOriginalOrder: rootLevelASTNodes,
        nodesEnclosured: astNodesHTMLPreTag,
    } = splitStringIntoASTByOpenAndCloseMarks(
        html,
        '<pre>',
        '</pre>'
    )


    astNodesHTMLPreTag.forEach(astNodeHTMLPreTag => {
        const {
            allNodesInOriginalOrder,
            // nodesEnclosured: astNodesForComments,
            nodesNotEnclosured: astNodesForNonComments,
        } = splitStringIntoASTByOpenAndCloseMarks(
            astNodeHTMLPreTag.content,
            '<span class="hljs-comment">',
            '</span>'
        )

        astNodeHTMLPreTag.content = allNodesInOriginalOrder

        // astNodesForComments.forEach(parseOneCommentASTNodeIntoHTML)






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

                astNodesForRegExps.forEach(enclosuredContentsProcessor)

                restNodes = [
                    ...restNodes,
                    ...nodesNotEnclosured,
                ]

                return restNodes
            }, [])
        }




        let astNodesRest = astNodesForNonComments


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
            function (astNode) {
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
            function (astNode) {
                const { content } = astNode
                astNode.openMark = `<span class="hljs-keyword ${content}">`
            }
        )

        astNodesRest = processRestASTNodes(
            astNodesRest,
            '<span class="hljs-built_in">',
            '</span>',
            function (astNode) {
                const { content } = astNode
                astNode.openMark = `<span class="hljs-built_in ${content}">`
            }
        )

        astNodesRest = processRestASTNodes(
            astNodesRest,
            '<span class="hljs-literal">',
            '</span>',
            function (astNode) {
                const { content } = astNode
                astNode.openMark = `<span class="hljs-literal ${content}">`
            }
        )

        astNodesRest = processRestASTNodes(
            astNodesRest,
            '<span class="hljs-number">',
            '</span>',
            function (astNode) {
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
