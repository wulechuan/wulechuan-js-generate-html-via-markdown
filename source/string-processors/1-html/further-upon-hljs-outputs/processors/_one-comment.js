module.exports = function parseOneASTNodeOfCommentIntoHTML(astNode /* , codeLanguage */) {
    astNode.content = astNode.content.replace(
        /(\n+)(\s+)/g,
        '$1<span class="inline-pre-whitespaces indentation">$2</span>'
    ).replace(
        /\n/g,
        '<br>'
    )
}
