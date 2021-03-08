module.exports = {
    parseAnHTMLSnippetASTNode,
}

function parseAnHTMLSnippetASTNode(astNode) {
    if (!astNode.content) { return }
    astNode.content = astNode.content
        .replace(
            /<span class="hljs-name">([^<]+)<\/span>/g,
            '<span class="hljs-name tag-name-$1">$1</span>'
        )
        .replace(
            /<span class="hljs-attr">([^<]+)<\/span>/g,
            '<span class="hljs-attr tag-attribute-name-$1">$1</span>'
        )
}
