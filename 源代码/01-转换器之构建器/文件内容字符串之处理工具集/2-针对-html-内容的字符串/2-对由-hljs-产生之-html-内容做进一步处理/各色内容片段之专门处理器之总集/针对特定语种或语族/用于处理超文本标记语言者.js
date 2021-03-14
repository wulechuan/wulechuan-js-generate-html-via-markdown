module.exports = {
    parseAnHTMLSnippetASTNode,
}



function parseAnHTMLSnippetASTNode(astNode) {
    const { content } = astNode

    if (!content) { return }
    if (typeof content !== 'string') { return }

    astNode.content = content
        .replace(
            /<span class="hljs-name">([^<]+)<\/span>/g,
            '<span class="hljs-name tag-name-$1">$1</span>'
        )
        .replace(
            /<span class="hljs-attr">([^<]+)<\/span>/g,
            '<span class="hljs-attr tag-attribute-name-$1">$1</span>'
        )
}
