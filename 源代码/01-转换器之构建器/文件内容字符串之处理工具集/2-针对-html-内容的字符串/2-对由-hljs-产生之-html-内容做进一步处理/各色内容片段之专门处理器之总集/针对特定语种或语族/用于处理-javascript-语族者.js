module.exports = function parseJavascriptFamilyStuffsIntoHTML(astNode) {
    const { content } = astNode

    if (!content) { return }
    if (typeof content !== 'string') { return }
}
