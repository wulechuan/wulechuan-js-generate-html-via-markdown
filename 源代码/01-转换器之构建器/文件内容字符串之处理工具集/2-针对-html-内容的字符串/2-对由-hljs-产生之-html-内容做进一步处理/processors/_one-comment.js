const processAllLineBreaksAndLeadingWhitespaces = require(
    './__line-breaks-and-leading-whitespaces'
)


module.exports = function parseOneASTNodeOfCommentIntoHTML(astNode) {
    processAllLineBreaksAndLeadingWhitespaces(astNode)
}
