const chalk = require('chalk')
const { readFileSync, existsSync } = require('fs')

module.exports = function syncReadOneTextFile(filePath) {
    if (existsSync(filePath)) {
        return readFileSync(filePath).toString()
    } else {
        console.log(`\n${
            chalk.yellow('File not found:')
        }\n    ${
            chalk.red(filePath)
        }\n`)
    }

    return ''
}
