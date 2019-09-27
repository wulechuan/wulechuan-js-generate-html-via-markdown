const chalk = require('chalk')

function clearCacheOfRequiredFile(pathOfFileToReload, { shouldNotLog, shouldNotWarn }) {
    !shouldNotLog && console.log(`${
        chalk.gray('Prepare for reloading file:')
    }\n    ${
        chalk.rgb(51, 102, 45)(pathOfFileToReload)
    }`)

    if (pathOfFileToReload in require.cache) {
        delete require.cache[pathOfFileToReload]
    } else {
        !shouldNotWarn && console.log(chalk.rgb(128, 96, 23)('    FILE CACHE MISSED!'))
    }
}

function rerequire(pathOfFileToReload, options) {
    clearCacheOfRequiredFile(pathOfFileToReload, options)
    return require(pathOfFileToReload)
}

module.exports = {
    clearCacheOfRequiredFile,
    rerequire,
}
