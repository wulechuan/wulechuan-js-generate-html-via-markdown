module.exports = function processAllLineBreaksAndLeadingWhitespaces (astNode) {
    const { content } = astNode

    if (!content) { return }
    if (typeof content !== 'string') { return }

    astNode.content = content
        .replace(
            /(\n+)(\s+)/g,
            '$1<span class="inline-pre-whitespaces indentation">$2</span>'
        )
        .replace(
            /\n/g,
            '<br\n>'
        )
}
