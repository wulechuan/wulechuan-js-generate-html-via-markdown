const processAllLineBreaksAndLeadingWhitespaces = require(
    '../泛用处理器集/用于处理换行符以及行首空白者'
)



module.exports = function parseOneASTNodeOfCommentIntoHTML(astNode) {
    processAllLineBreaksAndLeadingWhitespaces(astNode)
}
