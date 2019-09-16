const path = require('path')
const createATaskCycle = require('../../utils/create-a-task-cycle')
const createAPipeForConvertingMarkdownsIntoHTMLs = require('./_converter-markdown-into-html-gulp-wrapper')


const {
    peerDepThemingNPMPackageRootPath,
    thisModuleRootFolderPath,
} = require('../../configs/common')


const {
    buildingHTMLs: {
        descriptionOfInputsOfCoreTask,
        sourceFilesFolderSubPathInPeerDepPackage,
        sourceFilesRelativeGlobsInPeerDepPackage,
        outputRootFolderSubPath,
        relativeGlobsOfAllPossibleOutputs,
        extraSourceGlobsToWatch,
    },
} = require('../../configs/peer-dependency-examples')


const joinPathPOSIX = path.posix.join


const taskCycleForMarkdownConversions = createATaskCycle({
    descriptionOfInputsOfCoreTask,

    sourceGlobs: {
        rootFolderPath: joinPathPOSIX(
            peerDepThemingNPMPackageRootPath,
            sourceFilesFolderSubPathInPeerDepPackage
        ),

        // relativeGlobsSharedWithOtherTaskSets: [],
        relativeGlobsSpecificallyForThisTaskSet: sourceFilesRelativeGlobsInPeerDepPackage,
        extraSourceGlobsToWatch,
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

    sourceContentFirstProcessor: createAPipeForConvertingMarkdownsIntoHTMLs({}),
})

module.exports = taskCycleForMarkdownConversions
