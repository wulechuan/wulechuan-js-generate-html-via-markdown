const path = require('path')
const {
    createATaskCycle,
} = require('@wulechuan/gulp-classical-task-cycle')


const {
    peerDepThemingNPMPackageRootPath,
    thisModuleRootFolderPath,
} = require('../../configs/common')


const {
    copyingMarkdownJustForReferencingOfHTMLs: {
        descriptionOfInputsOfCoreTask,
        sourceFilesFolderSubPathInPeerDepPackage,
        sourceFilesRelativeGlobsInPeerDepPackage,
        outputRootFolderSubPath,
        relativeGlobsOfAllPossibleOutputs,
    },
} = require('../../configs/peer-dependency-examples')


const joinPathPOSIX = path.posix.join


const taskCycleForCopyingMarkdowns = createATaskCycle({
    descriptionOfInputsOfCoreTask,

    sourceGlobs: {
        rootFolderPath: joinPathPOSIX(
            peerDepThemingNPMPackageRootPath,
            sourceFilesFolderSubPathInPeerDepPackage
        ),

        // relativeGlobsSharedWithOtherTaskCycles: [],
        relativeGlobsSpecificallyForThisTaskCycle: sourceFilesRelativeGlobsInPeerDepPackage,
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

module.exports = taskCycleForCopyingMarkdowns
