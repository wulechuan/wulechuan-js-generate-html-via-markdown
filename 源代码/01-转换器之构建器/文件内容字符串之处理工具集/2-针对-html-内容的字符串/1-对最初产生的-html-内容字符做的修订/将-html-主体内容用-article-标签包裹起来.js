const {
    表达单层缩进之字符串,
    // 表达双层缩进之字符串,
} = require('../../../静态-html-片段以及动态构建的-html-片段/以-javascript-字符串形式给出的-html-片段集/表达源代码缩进之字符串')

module.exports = function 将HTML之主体内容用Article标签包裹起来(htmlOldChiefContent, options) {
    const {
        层叠样式表类名之用于文章正文之根Article标签的,
        cssClassNameOfArticleTOCRootTag,
        markdown文章中包含了TOC标记,
    } = options

    let articleStartTag

    if (层叠样式表类名之用于文章正文之根Article标签的) {
        articleStartTag = `<article class="${层叠样式表类名之用于文章正文之根Article标签的}">`
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
