const 路径工具 = require('path')



const {
    createATaskCycle,
} = require('@wulechuan/gulp-classical-task-cycle')

const 将由本工具构建之内容转换器包裹成Gulp任务管道之环节 = require('../99-辅助工具集/将由本工具构建之内容转换器包裹成-gulp-任务管道之环节')



const {
    本NPM包之Peer依赖包之根文件夹之绝对路径,
    本NPM包之根文件夹之绝对路径,
} = require('../../源代码/面向研发阶段之配置')



const {
    欲输出MarkdownIt生态工具集之原始产出以便验证之而非输出正式内容,
    针对构建范文之HTML之任务闭环之配置项集: {
        对于此任务闭环之输入文件集的易读易懂的描述,
        存放源Markdown文件之文件夹相对于Peer依赖包根文件夹之路径,
        以相对于Peer依赖包根文件夹之路径表达的用于甄选源Markdown文件之描述符,
        存放输出文件之文件夹之相对路径,
        relativeGlobsOfAllPossibleOutputs,
        extraSourceGlobsToWatch,
    },
} = require('../00-任务之配置项集/针对用于构建范文-html-之任务闭环的')



const { join: 遵循POSIX标准拼接路径 } = 路径工具.posix



const 专门用于将本NPM包之Peer依赖包中之Markdown范文逐一转换为HTML文件的任务闭环 = createATaskCycle({
    descriptionOfInputsOfCoreTask: 对于此任务闭环之输入文件集的易读易懂的描述,

    sourceGlobs: {
        rootFolderPath: 遵循POSIX标准拼接路径(
            本NPM包之Peer依赖包之根文件夹之绝对路径,
            存放源Markdown文件之文件夹相对于Peer依赖包根文件夹之路径
        ),

        // relativeGlobsSharedWithOtherTaskCycles: [],
        relativeGlobsSpecificallyForThisTaskCycle: 以相对于Peer依赖包根文件夹之路径表达的用于甄选源Markdown文件之描述符,
        extraSourceGlobsToWatch,
    },

    outputFiles: {
        rootFolderPath: 遵循POSIX标准拼接路径(本NPM包之根文件夹之绝对路径, 存放输出文件之文件夹之相对路径),
        forBatchOutputFiles: {
            relativeGlobsOfAllPossibleOutputs,
        },
    },

    compressions: {
        shouldNotOutputCompressedVersion: true,
    },

    firstPipeForProcessingSources: 将由本工具构建之内容转换器包裹成Gulp任务管道之环节(
        {
            对HTML做进一步处理之阶段: {
                须对产出之HTML内容字符串依次按下诸内容替换规则做修订: {
                    '2 额外的替换规则之定义之序列': [
                        {
                            凡: /\.\/illustrates\//g,
                            替换为: '../../../node_modules/@wulechuan/css-stylus-markdown-themes/文档/文章排版与配色效果示例集/原始的-markdown-格式的文章/illustrates/',
                        },
                    ],
                },
            },
        },
        {
            欲输出MarkdownIt生态工具集之原始产出以便验证之而非输出正式内容,
        }
    ),
})

module.exports = 专门用于将本NPM包之Peer依赖包中之Markdown范文逐一转换为HTML文件的任务闭环
