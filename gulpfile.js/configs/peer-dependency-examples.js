const outputRootFolderSubPath = '测试集/输出之内容/取自-peer-依赖包之范文'

module.exports = {
    buildingHTMLs: {
        descriptionOfInputsOfCoreTask: 'Example MarkDown Files from Peer-dep Package',
        sourceFilesFolderSubPathInPeerDepPackage: 'documents/examples/source-markdown-files',
        sourceFilesRelativeGlobsInPeerDepPackage: [ '**/*.md' ],
        outputRootFolderSubPath,
        relativeGlobsOfAllPossibleOutputs: [ '**/*.html' ],
        extraSourceGlobsToWatch: [
            'core.js',
            '完备的默认配置.js',
            '源代码/string-processors/1-html/further-upon-hljs-outputs/**/*',
        ],
    },
}
