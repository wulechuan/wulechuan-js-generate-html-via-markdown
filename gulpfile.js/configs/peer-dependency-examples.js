const outputRootFolderSubPath = 'tests/output/examples-from-peer-dependency'

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
        descriptionOfInputsOfCoreTask: 'Example images (manually copied from peer dep package)',
        sourceFilesFolderPath: 'tests/source-assets',
        sourceFilesRelativeGlobs: [ 'illustrates/**/*' ],
        outputRootFolderSubPath,
        relativeGlobsOfAllPossibleOutputs: [ 'illustrates/**/*' ],
    },
}
