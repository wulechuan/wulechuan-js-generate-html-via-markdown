const 存放输出文件之文件夹之相对路径 = '测试集/诸测试之输出/取自-peer-依赖包之范文'

const {
    本NPM包之Peer依赖包之名称,
} = require('../../源代码/面向研发阶段之配置')

module.exports = {
    应输出MarkdownIt生态工具集之原始产出以便验证之而非输出正式内容: false,

    针对构建范文之HTML之任务闭环之配置项集: {
        对于此任务闭环之输入文件集的易读易懂的描述: `源自 ${本NPM包之Peer依赖包之名称} 的用作范文的 Markdown 文件集`,

        存放源Markdown文件之文件夹相对于Peer依赖包根文件夹之路径: '文档集/文章排版与配色效果示例集/原始的-markdown-格式的文章',

        以相对于Peer依赖包根文件夹之路径表达的用于甄选源Markdown文件之描述符: [ '**/*.md' ],

        存放输出文件之文件夹之相对路径,

        relativeGlobsOfAllPossibleOutputs: [ '**/*.html' ],

        extraSourceGlobsToWatch: [
            '源代码/完备的默认配置项集.js',
            '源代码/01-转换器之构建器/index.js',
            '源代码/01-转换器之构建器/文件内容字符串之处理工具集/2-针对-html-内容的字符串/**/*',
        ],
    },
}
