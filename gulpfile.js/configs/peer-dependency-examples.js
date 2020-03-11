const outputRootFolderSubPath = 'tests/output/examples-from-peer-dependency'

module.exports = {
    buildingHTMLs: {
        descriptionOfInputsOfCoreTask: 'Example MarkDown Files from Peer-dep Package',
        sourceFilesFolderSubPathInPeerDepPackage: 'documents/examples/source-markdown-files',
        sourceFilesRelativeGlobsInPeerDepPackage: [ '**/*.md' ],
        outputRootFolderSubPath,
        relativeGlobsOfAllPossibleOutputs: [ '**/*.html' ],
        extraSourceGlobsToWatch: [
            'core.js',
            'default-options.js',
            'source/string-processors/1-html/further-upon-hljs-outputs/**/*',
        ],
    },
}
