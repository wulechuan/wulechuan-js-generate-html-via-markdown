const outputRootFolderSubPath = 'test/output/examples-from-peer-dependency'

module.exports = {
    buildingHTMLs: {
        descriptionOfInputsOfCoreTask: 'Peer dependency example Markdowns',
        sourceFilesFolderSubPathInPeerDepPackage: 'docs/examples/source-markdown-files',
        sourceFilesRelativeGlobsInPeerDepPackage: [ '**/*.md' ],
        outputRootFolderSubPath,
        relativeGlobsOfAllPossibleOutputs: [ '**/*.html' ],
        extraSourceGlobsToWatch: [
            'core.js',
            'default-options.js',
        ],
    },

    copyingIllustrates: {
        descriptionOfInputsOfCoreTask: 'Peer dependency example images',
        sourceFilesFolderPath: 'test',
        sourceFilesRelativeGlobsInPeerDepPackage: [ 'illustrates/**/*' ],
        outputRootFolderSubPath,
        relativeGlobsOfAllPossibleOutputs: [ 'illustrates/**/*' ],
    },
}
