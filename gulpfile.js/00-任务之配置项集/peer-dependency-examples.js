const outputRootFolderSubPath = '测试集/输出之内容/取自-peer-依赖包之范文'

module.exports = {
    buildingHTMLs: {
        descriptionOfInputsOfCoreTask: 'Example MarkDown Files from Peer-dep Package',
        sourceFilesFolderSubPathInPeerDepPackage: '文档/文章排版与配色效果示例集/原始的-markdown-格式的文章',
        sourceFilesRelativeGlobsInPeerDepPackage: [ '**/*.md' ],
        outputRootFolderSubPath,
        relativeGlobsOfAllPossibleOutputs: [ '**/*.html' ],
        extraSourceGlobsToWatch: [
            '源代码/完备的默认配置.js',
            '源代码/01-转换器之构建器/index.js',
            '源代码/01-转换器之构建器/string-processors/1-html/further-upon-hljs-outputs/**/*',
        ],
    },
}
