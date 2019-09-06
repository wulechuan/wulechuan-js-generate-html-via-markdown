const path = require('path')
const createOneMarkdownToHTMLConerter = require('./source/core/generate-full-html-string-via-markdown-string')

const thisModuleRootFolderPath = path.dirname(require.resolve('./package.json'))
const markdownToHTMLConverter = createOneMarkdownToHTMLConerter({
    thisModuleRootFolderPath,
})

module.exports = markdownToHTMLConverter
