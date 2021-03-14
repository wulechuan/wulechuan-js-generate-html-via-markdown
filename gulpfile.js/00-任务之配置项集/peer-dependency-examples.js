const outputRootFolderSubPath = '测试集/输出之内容/取自-peer-依赖包之范文'

module.exports = {
    buildingHTMLs: {
        descriptionOfInputsOfCoreTask: 'Example MarkDown Files from Peer-dep Package',
        sourceFilesFolderSubPathInPeerDepPackage: '文档/文章排版与配色效果示例集/原始的-markdown-格式的文章',
        sourceFilesRelativeGlobsInPeerDepPackage: [ '**/*.md' ],
        outputRootFolderSubPath,
        relativeGlobsOfAllPossibleOutputs: [ '**/*.html' ],
        extraSourceGlobsToWatch: [
            '源代码/完备的默认配置项集.js',
            '源代码/01-转换器之构建器/index.js',
            '源代码/01-转换器之构建器/文件内容字符串之处理工具集/2-针对-html-内容的字符串/**/*',
        ],
    },
}
