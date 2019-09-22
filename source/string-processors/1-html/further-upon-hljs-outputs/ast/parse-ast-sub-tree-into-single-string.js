const createErrorMessageBuildersFor = require('@wulechuan/meaningful-error-messages')

const {
    // buildErrorMessage,
    buildErrorMessageSaysThatSomethingMustBe,
} = createErrorMessageBuildersFor('@wulechuan/very-simple-ast-stringifier')

module.exports = function parseASTSubTreeIntoSingleString(input) {
    const errorContext = 'parseASTSubTreeIntoSingleString'

    if (!input) {
        return ''
    }

    if (typeof input === 'string') {
        return input
    }

    if (typeof input === 'object') {

        if (Array.isArray(input)) {
            return input.map(parseASTSubTreeIntoSingleString).join('')
        }

        const {
            openMark,
            closeMark,
            content,
        } = input

        return `${openMark}${parseASTSubTreeIntoSingleString(content)}${closeMark}`
    }

    console.log(buildErrorMessageSaysThatSomethingMustBe(
        'an object(an AST Node for specific), a string, or an array of either',
        input,
        'arguments.input',
        errorContext
    ))

    return ''
}
