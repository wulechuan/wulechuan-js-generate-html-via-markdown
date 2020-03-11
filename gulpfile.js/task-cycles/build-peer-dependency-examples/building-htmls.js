const path = require('path')
const {
    createATaskCycle,
} = require('@wulechuan/gulp-classical-task-cycle')
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

        // relativeGlobsSharedWithOtherTaskCycles: [],
        relativeGlobsSpecificallyForThisTaskCycle: sourceFilesRelativeGlobsInPeerDepPackage,
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

    firstPipeForProcessingSources: createAPipeForConvertingMarkdownsIntoHTMLs({
        manipulationsOverHTML: {
            desiredReplacementsInHTML: [
                {
                    from: /\.\/illustrates\//g,
                    to:   '../../../node_modules/@wulechuan/css-stylus-markdown-themes/documents/examples/source-markdown-files/illustrates/',
                },
            ],
        },
    }),
})

module.exports = taskCycleForMarkdownConversions
