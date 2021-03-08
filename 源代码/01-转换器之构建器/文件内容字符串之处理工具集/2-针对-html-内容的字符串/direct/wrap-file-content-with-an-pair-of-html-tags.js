const {
    tab1,
    tab2,
} = require('../../../静态-html-片段以及动态构建的-html-片段/static/tabs')

module.exports = function wrapContentsWithAPairOfHTMLTags({ fileRawContent, wrappingTagName, shouldIndentContentsBy2Levels }) {
    if (!fileRawContent.trim()) {
        return ''
    }

    let fileContent = fileRawContent
    if (shouldIndentContentsBy2Levels) {
        fileContent = fileContent
            .replace(/\n/g, `\n${tab2}`)
            .replace(/\n{2,}/g, '\n')
    }

    return [
        `\n${tab1}<${wrappingTagName}>\n`,

        tab2,

        fileContent,

        `\n${tab1}</${wrappingTagName}>`,
    ].join('')
}
