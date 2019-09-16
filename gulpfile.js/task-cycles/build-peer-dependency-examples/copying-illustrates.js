const path = require('path')
const createATaskCycle = require('../../utils/create-a-task-cycle')


const {
    thisModuleRootFolderPath,
} = require('../../configs/common')


const {
    copyingIllustrates: {
        descriptionOfInputsOfCoreTask,
        sourceFilesFolderPath,
        sourceFilesRelativeGlobsInPeerDepPackage,
        outputRootFolderSubPath,
        relativeGlobsOfAllPossibleOutputs,
    },
} = require('../../configs/peer-dependency-examples')


const joinPathPOSIX = path.posix.join


const taskCycleForCopyingIllustrates = createATaskCycle({
    descriptionOfInputsOfCoreTask,

    sourceGlobs: {
        rootFolderPath: sourceFilesFolderPath,

        // relativeGlobsSharedWithOtherTaskSets: [],
        relativeGlobsSpecificallyForThisTaskSet: sourceFilesRelativeGlobsInPeerDepPackage,
        // extraSourceGlobsToWatch: [],
    },

    outputFiles: {
        rootFolderPath: joinPathPOSIX(thisModuleRootFolderPath, outputRootFolderSubPath),
        forBatchOutputFiles: {
            relativeGlobsOfAllPossibleOutputs,
        },
    },

    compressions: {
        shouldNotOutputCompressedVersion: true,
    },
})

module.exports = taskCycleForCopyingIllustrates
