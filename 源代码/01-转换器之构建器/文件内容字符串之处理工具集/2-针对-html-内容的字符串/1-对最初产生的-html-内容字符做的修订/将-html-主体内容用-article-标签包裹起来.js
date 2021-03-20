const {
    表达单层缩进之字符串,
    // 表达双层缩进之字符串,
} = require('../../../静态-html-片段以及动态构建的-html-片段/以-javascript-字符串形式给出的-html-片段集/表达源代码缩进之字符串')

module.exports = function 将HTML之主体内容用Article标签包裹起来(原始的HTML文章主体内容字符串, 配置项集) {
    const {
        层叠样式表类名之用于文章正文之根Article标签的,
        cssClassNameOfArticleTOCRootTag,
        markdown文章中包含了TOC标记,
    } = 配置项集

    let 文章之Article之起始标签

    if (层叠样式表类名之用于文章正文之根Article标签的) {
        文章之Article之起始标签 = `<article class="${层叠样式表类名之用于文章正文之根Article标签的}">`
    } else {
        文章之Article之起始标签 = '<article>'
    }


    let 包裹号Article标签之后的完整HTML文章字符串 = `${表达单层缩进之字符串}${文章之Article之起始标签}\n${原始的HTML文章主体内容字符串}`

    if (markdown文章中包含了TOC标记) {
        const fullStringOfTOCRootStartTagByMarkdownItTOCDoneRight = `<nav class="${cssClassNameOfArticleTOCRootTag}">`

        包裹号Article标签之后的完整HTML文章字符串 = 包裹号Article标签之后的完整HTML文章字符串.replace(
            fullStringOfTOCRootStartTagByMarkdownItTOCDoneRight,

            `\n${
                表达单层缩进之字符串}</article>\n${
                表达单层缩进之字符串}${fullStringOfTOCRootStartTagByMarkdownItTOCDoneRight
            }`
        )
    } else {
        包裹号Article标签之后的完整HTML文章字符串 = `${
            包裹号Article标签之后的完整HTML文章字符串
        }\n${表达单层缩进之字符串}</article>\n`
    }

    return 包裹号Article标签之后的完整HTML文章字符串
}
