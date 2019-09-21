module.exports = function parseASTSubTreeIntoSingleString(input) {
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

    console.log('@wulechuan/hljs-plus: WARNING: invalid type "' + (typeof input) + '" for an AST node.')

    return ''
}
