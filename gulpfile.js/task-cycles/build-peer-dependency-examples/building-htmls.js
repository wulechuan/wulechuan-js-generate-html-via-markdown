const 路径工具 = require('path')



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



const { join: 遵循POSIX标准拼接路径 } = 路径工具.posix



const taskCycleForMarkdownConversions = createATaskCycle({
    descriptionOfInputsOfCoreTask,

    sourceGlobs: {
        rootFolderPath: 遵循POSIX标准拼接路径(
            peerDepThemingNPMPackageRootPath,
            sourceFilesFolderSubPathInPeerDepPackage
        ),

        // relativeGlobsSharedWithOtherTaskCycles: [],
        relativeGlobsSpecificallyForThisTaskCycle: sourceFilesRelativeGlobsInPeerDepPackage,
        extraSourceGlobsToWatch,
    },

    outputFiles: {
        rootFolderPath: 遵循POSIX标准拼接路径(thisModuleRootFolderPath, outputRootFolderSubPath),
        forBatchOutputFiles: {
            relativeGlobsOfAllPossibleOutputs,
        },
    },

    compressions: {
        shouldNotOutputCompressedVersion: true,
    },

    firstPipeForProcessingSources: createAPipeForConvertingMarkdownsIntoHTMLs({
        对HTML做额外处理之阶段: {
            须对产出之HTML内容字符串依次按下诸内容替换规则做修订: [
                {
                    凡: /\.\/illustrates\//g,
                    替换为: '../../../node_modules/@wulechuan/css-stylus-markdown-themes/文档/文章排版与配色效果示例集/原始的-markdown-格式的文章/illustrates/',
                },
            ],
        },
    }),
})

module.exports = taskCycleForMarkdownConversions
