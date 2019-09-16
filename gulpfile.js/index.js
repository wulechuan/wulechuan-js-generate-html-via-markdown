const highOrderTasksForBuildingPeerDependencyExamples = require(
    './tasks/build-peer-dependency-examples'
)

const cleanAll           = highOrderTasksForBuildingPeerDependencyExamples.cleanAllOldOuputs
const buildAllThemesOnce = highOrderTasksForBuildingPeerDependencyExamples.buildEverythingOnce
const buildAndWatch      = highOrderTasksForBuildingPeerDependencyExamples.watchEverything

module.exports ={
    cleanAll,
    buildAllThemesOnce,
    buildAndWatch,

    default: buildAndWatch,
}
