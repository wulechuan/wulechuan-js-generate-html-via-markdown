const chalk = require('chalk')

module.exports = function insertTOCMarkDownTagIfNecessary(markdownContent, 不应主动插入TOC之占位标记) {
    if (typeof markdownContent !== 'string') {
        throw new TypeError(`@wulechuan/generate-html-via-markdown:\n    ${
            chalk.red('Invalid markdownContent. It must be a string')
        }.\n    ${
            chalk.yellow(`If you read it from a file, please use "${
                chalk.magenta('.toString')
            }" method to convert its contents first.`)
        }\n`)
    }

    let processedMarkdownContent = markdownContent

    let markdownContentHasTOCPlaceholder = processedMarkdownContent
        .match(/\$\{toc\}|\[\[toc\]\]|\[toc\]|\[\[_toc_\]\]/i)

    if (!markdownContentHasTOCPlaceholder && !不应主动插入TOC之占位标记) {
        processedMarkdownContent += [
            '\n',
            '[[toc]]',
        ].join('\n\n')

        markdownContentHasTOCPlaceholder = true
    }

    return {
        markdownContentHasTOCPlaceholder,
        processedMarkdownContent,
    }
}
