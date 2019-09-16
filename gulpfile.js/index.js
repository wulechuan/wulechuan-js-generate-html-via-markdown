const highOrderTasksForBuildingPeerDependencyExamples = require(
    './tasks/build-peer-dependency-examples'
)

const cleanAll          = highOrderTasksForBuildingPeerDependencyExamples.cleanAllOldOuputs
const buildExamplesOnce = highOrderTasksForBuildingPeerDependencyExamples.buildEverythingOnce
const buildAndWatch     = highOrderTasksForBuildingPeerDependencyExamples.watchEverything

module.exports ={
    cleanAll,
    buildExamplesOnce,
    buildAndWatch,

    default: buildAndWatch,
}
