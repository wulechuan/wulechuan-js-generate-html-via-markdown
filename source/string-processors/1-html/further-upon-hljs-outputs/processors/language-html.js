module.exports = {
    parseAnHTMLSnippetASTNode,
}

function parseAnHTMLSnippetASTNode(astNode) {
    if (!astNode.content) { return }
    astNode.content = astNode.content
        .replace(
            /<span class="hljs-attr">([\w\d_-]+)<\/span>/g,
            '<span class="hljs-attr $1">$1</span>'
        )
}
