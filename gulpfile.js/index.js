const {
    cleanAllOldOuputs,
    buildEverythingOnce,
    watchEverything,
} = require(
    './tasks/build-peer-dependency-examples'
)

const cleanAll          = cleanAllOldOuputs
const buildExamplesOnce = buildEverythingOnce
const buildAndWatch     = watchEverything

module.exports = {
    cleanAll,
    buildExamplesOnce,
    buildAndWatch,

    default: buildAndWatch,
}
