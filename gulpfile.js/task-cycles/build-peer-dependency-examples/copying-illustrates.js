const path = require('path')
const {
    createATaskCycle,
} = require('@wulechuan/gulp-classical-task-cycle')


const {
    thisModuleRootFolderPath,
} = require('../../configs/common')


const {
    copyingIllustrates: {
        descriptionOfInputsOfCoreTask,
        sourceFilesFolderPath,
        sourceFilesRelativeGlobs,
        outputRootFolderSubPath,
        relativeGlobsOfAllPossibleOutputs,
    },
} = require('../../configs/peer-dependency-examples')


const joinPathPOSIX = path.posix.join


const taskCycleForCopyingIllustrates = createATaskCycle({
    descriptionOfInputsOfCoreTask,

    sourceGlobs: {
        rootFolderPath: sourceFilesFolderPath,

        // relativeGlobsSharedWithOtherTaskCycles: [],
        relativeGlobsSpecificallyForThisTaskCycle: sourceFilesRelativeGlobs,
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
