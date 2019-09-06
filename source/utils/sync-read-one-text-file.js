const { readFileSync } = require('fs')

module.exports = function syncReadOneTextFile(filePath) {
    return readFileSync(filePath).toString()
}
