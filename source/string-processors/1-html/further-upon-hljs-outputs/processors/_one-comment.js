const processAllLineBreaksAndLeadingWhitespaces = require(
    '../processors/__line-breaks-and-leading-whitespaces'
)


module.exports = function parseOneASTNodeOfCommentIntoHTML(astNode) {
    processAllLineBreaksAndLeadingWhitespaces(astNode)
}
