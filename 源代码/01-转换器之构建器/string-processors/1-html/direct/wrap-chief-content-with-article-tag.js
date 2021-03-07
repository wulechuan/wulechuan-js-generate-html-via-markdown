const {
    tab1,
    // tab2,
} = require('../../../snippets/static/tabs')

module.exports = function wrapHTMLChiefContentWithAnArticleTag(htmlOldChiefContent, options) {
    const {
        cssClassNameOfMarkdownChiefContentWrappingArticleTag,
        cssClassNameOfArticleTOCRootTag,
        markdownArticleHasTOC,
    } = options

    let articleStartTag

    if (cssClassNameOfMarkdownChiefContentWrappingArticleTag) {
        articleStartTag = `<article class="${cssClassNameOfMarkdownChiefContentWrappingArticleTag}">`
    } else {
        articleStartTag = '<article>'
    }


    let htmlNewChiefContent = `${tab1}${articleStartTag}\n${htmlOldChiefContent}`

    if (markdownArticleHasTOC) {
        const fullStringOfTOCRootStartTagByMarkdownItTOCDoneRight = `<nav class="${cssClassNameOfArticleTOCRootTag}">`

        htmlNewChiefContent = htmlNewChiefContent.replace(
            fullStringOfTOCRootStartTagByMarkdownItTOCDoneRight,

            `\n${
                tab1}</article>\n${
                tab1}${fullStringOfTOCRootStartTagByMarkdownItTOCDoneRight
            }`
        )
    } else {
        htmlNewChiefContent = `${
            htmlNewChiefContent
        }\n${tab1}</article>\n`
    }

    return htmlNewChiefContent
}
