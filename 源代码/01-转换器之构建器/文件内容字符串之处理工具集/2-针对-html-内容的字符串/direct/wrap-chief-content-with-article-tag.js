const {
    tab1,
    // tab2,
} = require('../../../静态-html-片段以及动态构建的-html-片段/static/tabs')

module.exports = function wrapHTMLChiefContentWithAnArticleTag(htmlOldChiefContent, options) {
    const {
        cssClassNameOfMarkdownChiefContentWrappingArticleTag,
        cssClassNameOfArticleTOCRootTag,
        markdown文章中包含了TOC标记,
    } = options

    let articleStartTag

    if (cssClassNameOfMarkdownChiefContentWrappingArticleTag) {
        articleStartTag = `<article class="${cssClassNameOfMarkdownChiefContentWrappingArticleTag}">`
    } else {
        articleStartTag = '<article>'
    }


    let htmlNewChiefContent = `${tab1}${articleStartTag}\n${htmlOldChiefContent}`

    if (markdown文章中包含了TOC标记) {
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
