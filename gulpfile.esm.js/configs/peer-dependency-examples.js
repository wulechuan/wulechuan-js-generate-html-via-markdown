const path = require('path')
const through = require('through2')
const GulpPluginError = require('plugin-error')
const replaceFileExt  = require('replace-ext')

const markdownToHTMLConverter = require('@wulechuan/generate-html-via-markdown')


function createNewGulpError(rawError) {
    return new GulpPluginError('@wulechuan/generate-html-via-markdown', rawError)
}

const joinPathPOSIX = path.posix.join

const peerDepThemingNPMPackageRootPath = path.dirname(
    require.resolve('@wulechuan/css-stylus-markdown-themes/package.json')
).replace(/\\/g, '/')

const thisModuleRootFolderPath = path.dirname(
    require.resolve('../../package.json')
).replace(/\\/g, '/')

const sourceMarkdownFilesFolderPath = joinPathPOSIX(
    peerDepThemingNPMPackageRootPath,
    'docs/examples/source-markdown-files'
)

function markdownProcessorPipe() {
    const converterOptions = {}

    return through.obj(function (file, fileEncoding, callback) {
        if (file.isStream()) {
            return callback(createNewGulpError('Streaming is not supported.'))
        }

        if (file.isNull()) {
            return callback(null, file)
        }

        let htmlContent
        try {
            htmlContent = markdownToHTMLConverter(file.contents.toString(fileEncoding || 'utf-8'), converterOptions)
        } catch(error) {
            // delete error.input
            return callback(createNewGulpError(error))
        }

        file.path = replaceFileExt(file.path, '.html')
        file.contents = Buffer.from(htmlContent)

        return callback(null, file)
    })
}




const taskCycleOptionsForMarkdownConversions = {
    descriptionOfInputsOfCoreTask: 'Example HTMLs',

    sourceGlobs: {
        rootFolderPath: sourceMarkdownFilesFolderPath,

        // relativeGlobsSharedWithOtherTaskSets: [],
        relativeGlobsSpecificallyForThisTaskSet: [ '**/*.md' ],
        extraSourceGlobsToWatch: [],
    },

    outputFiles: {
        rootFolderPath: joinPathPOSIX(thisModuleRootFolderPath, 'test/output/examples-from-peer-dependency'),
        fileExtWithoutDot: 'html',
        forBatchOutputFiles: {
            relativeGlobsOfAllPossibleOutputs: [ '**/*.html' ],
        },
    },

    compressions: {
        shouldNotOutputCompressedVersion: true,
    },

    sourceContentFirstProcessor: markdownProcessorPipe,
}

module.exports = {
    taskCycleOptionsForMarkdownConversions,
}
