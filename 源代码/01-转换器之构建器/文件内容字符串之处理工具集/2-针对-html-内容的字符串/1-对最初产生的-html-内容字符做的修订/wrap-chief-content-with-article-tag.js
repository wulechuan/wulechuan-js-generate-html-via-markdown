const {
    表达单层缩进之字符串,
    // 表达双层缩进之字符串,
} = require('../../../静态-html-片段以及动态构建的-html-片段/static/表达源代码缩进之字符串')

module.exports = function 将原始的HTML主体内容用Article标签包裹起来(htmlOldChiefContent, options) {
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


    let htmlNewChiefContent = `${表达单层缩进之字符串}${articleStartTag}\n${htmlOldChiefContent}`

    if (markdown文章中包含了TOC标记) {
        const fullStringOfTOCRootStartTagByMarkdownItTOCDoneRight = `<nav class="${cssClassNameOfArticleTOCRootTag}">`

        htmlNewChiefContent = htmlNewChiefContent.replace(
            fullStringOfTOCRootStartTagByMarkdownItTOCDoneRight,

            `\n${
                表达单层缩进之字符串}</article>\n${
                表达单层缩进之字符串}${fullStringOfTOCRootStartTagByMarkdownItTOCDoneRight
            }`
        )
    } else {
        htmlNewChiefContent = `${
            htmlNewChiefContent
        }\n${表达单层缩进之字符串}</article>\n`
    }

    return htmlNewChiefContent
}
