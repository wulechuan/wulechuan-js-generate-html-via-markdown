module.exports = function chooseWrappingHTMLTagNameViaFileExt(fileName) {
    let wrappingTagName = 'style'

    if (fileName.match(/.+\.js$/)) {
        wrappingTagName = 'script'
    }

    return wrappingTagName
}
