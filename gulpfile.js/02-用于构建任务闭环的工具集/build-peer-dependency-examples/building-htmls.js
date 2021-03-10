const 路径工具 = require('path')



const {
    createATaskCycle,
} = require('@wulechuan/gulp-classical-task-cycle')

const 将由本工具构建之内容转换器包裹成Gulp任务管道之环节 = require('./将由本工具构建之内容转换器包裹成-gulp-任务管道之环节')



const {
    本NPM包之Peer依赖包之根文件夹之绝对路径,
    本NPM包之根文件夹之绝对路径,
} = require('../../../源代码/面向研发阶段之配置')



const {
    buildingHTMLs: {
        descriptionOfInputsOfCoreTask,
        sourceFilesFolderSubPathInPeerDepPackage,
        sourceFilesRelativeGlobsInPeerDepPackage,
        outputRootFolderSubPath,
        relativeGlobsOfAllPossibleOutputs,
        extraSourceGlobsToWatch,
    },
} = require('../../00-任务之配置项集/peer-dependency-examples')



const { join: 遵循POSIX标准拼接路径 } = 路径工具.posix



const 专门用于将本NPM包之Peer依赖包中之Markdown范文逐一转换为HTML文件的任务闭环 = createATaskCycle({
    descriptionOfInputsOfCoreTask,

    sourceGlobs: {
        rootFolderPath: 遵循POSIX标准拼接路径(
            本NPM包之Peer依赖包之根文件夹之绝对路径,
            sourceFilesFolderSubPathInPeerDepPackage
        ),

        // relativeGlobsSharedWithOtherTaskCycles: [],
        relativeGlobsSpecificallyForThisTaskCycle: sourceFilesRelativeGlobsInPeerDepPackage,
        extraSourceGlobsToWatch,
    },

    outputFiles: {
        rootFolderPath: 遵循POSIX标准拼接路径(本NPM包之根文件夹之绝对路径, outputRootFolderSubPath),
        forBatchOutputFiles: {
            relativeGlobsOfAllPossibleOutputs,
        },
    },

    compressions: {
        shouldNotOutputCompressedVersion: true,
    },

    firstPipeForProcessingSources: 将由本工具构建之内容转换器包裹成Gulp任务管道之环节({
        对HTML做进一步处理之阶段: {
            须对产出之HTML内容字符串依次按下诸内容替换规则做修订: {
                '2 额外的替换规则序列': [
                    {
                        凡: /\.\/illustrates\//g,
                        替换为: '../../../node_modules/@wulechuan/css-stylus-markdown-themes/文档/文章排版与配色效果示例集/原始的-markdown-格式的文章/illustrates/',
                    },
                ],
            },
        },
    }),
})

module.exports = 专门用于将本NPM包之Peer依赖包中之Markdown范文逐一转换为HTML文件的任务闭环
