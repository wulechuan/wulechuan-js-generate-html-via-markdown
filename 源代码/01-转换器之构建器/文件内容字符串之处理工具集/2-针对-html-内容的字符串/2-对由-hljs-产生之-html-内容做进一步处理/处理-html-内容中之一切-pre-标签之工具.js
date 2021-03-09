const createErrorMessageBuildersFor                 = require('@wulechuan/meaningful-error-messages')
const splitOneASTNodeByOpenAndCloseMarks            = require('./ast/ast-generic-simple-splitter')
const parseASTSubTreeIntoSingleString               = require('./ast/parse-ast-sub-tree-into-single-string')
const processHTMLStringThatMightContainSubLanguages = require('./process-snippet-of-one-language')

const {
    buildErrorMessage,
    // buildErrorMessageSaysThatSomethingMustBe,
} = createErrorMessageBuildersFor('@wulechuan/hljs-plus')



module.exports = function processAllContentsOfAllHTMLPreTagsOfHTMLString(html, options = {}) {
    const errorContext = 'processAllContentsOfAllHTMLPreTagsOfHTMLString' // eslint-disable-line no-unused-vars

    const {
        不应将代码块中的换行符替换成BR标签,
    } = options

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
            throw new Error(buildErrorMessage([
                'Unhandled situation that a <pre> tag contains:',
                '    more than one <code> tags,',
                '    or zero <code> tags.',
            ]))
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



    astNodesForHTMLCodeTagsWithinAPreTag.forEach(astNodeForOneCodeTag => {
        processHTMLStringThatMightContainSubLanguages(
            astNodeForOneCodeTag,
            {
                不应将代码块中的换行符替换成BR标签,
            }
        )
    })



    return parseASTSubTreeIntoSingleString(rootLevelASTNodes)
}
