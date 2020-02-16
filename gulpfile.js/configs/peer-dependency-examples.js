const outputRootFolderSubPath = 'tests/output/examples-from-peer-dependency'

module.exports = {
    buildingHTMLs: {
        descriptionOfInputsOfCoreTask: 'Example HTMLs',
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

    copyingMarkdownJustForReferencingOfHTMLs: {
        descriptionOfInputsOfCoreTask: 'Peer dependency example Markdowns',
        sourceFilesFolderSubPathInPeerDepPackage: 'documents/examples/source-markdown-files',
        sourceFilesRelativeGlobsInPeerDepPackage: [ '**/*.md' ],
        outputRootFolderSubPath,
        relativeGlobsOfAllPossibleOutputs: [ '**/*.md' ],
    },

    copyingIllustrates: {
        descriptionOfInputsOfCoreTask: 'Example images (manually copied from peer dep package)',
        sourceFilesFolderPath: 'tests/source-assets',
        sourceFilesRelativeGlobs: [ 'illustrates/**/*' ],
        outputRootFolderSubPath,
        relativeGlobsOfAllPossibleOutputs: [ 'illustrates/**/*' ],
    },
}
