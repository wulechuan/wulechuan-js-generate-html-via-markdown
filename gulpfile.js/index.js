const {
    cleanAllOldOuputs,
    buildExampleHTMLsOnce,
    buildExampleHTMLsAndStartWatching,
} = require(
    './tasks/build-peer-dependency-examples'
)

const cleanAll          = cleanAllOldOuputs
const buildExamplesOnce = buildExampleHTMLsOnce
const buildAndWatch     = buildExampleHTMLsAndStartWatching

module.exports = {
    cleanAll,
    buildExamplesOnce,
    buildAndWatch,

    default: buildAndWatch,
}
