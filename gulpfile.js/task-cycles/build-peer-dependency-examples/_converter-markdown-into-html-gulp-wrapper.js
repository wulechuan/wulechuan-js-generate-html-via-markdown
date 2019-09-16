/**
 * The chief contents of this file are almost identical to
 * those of `@wulechuan/gulp-markdown-to-html/index.js`.
 *
 * I copy them here, simply because I don't want
 * this package we are working on to depend on that
 * NPM package.
 *
 * Actually, that package depends on this package instead.
 */


const path = require('path')
const through = require('through2')
const GulpPluginError = require('plugin-error')
const replaceFileExt  = require('replace-ext')
const { rerequire } = require('../../../source/utils/rerequired-file')

const {
    thisModuleRootFolderPath,
} = require('../../configs/common')

const {
    allFileEntriesKeyingByFileNames: themesPeerPackageAllDistFileEntriesKeyingByFileNames,
    syncGetContentStringOfOneFileEntry: syncGetContentStringOfOneFileOfThePeerModuleOfThemes,
} = require('@wulechuan/css-stylus-markdown-themes')

const joinPath = path.join
// const joinPathPOSIX = path.posix.join

function createNewGulpError(rawError) {
    return new GulpPluginError('@wulechuan/generate-html-via-markdown', rawError)
}

module.exports = function createAPipeForConvertingMarkdownsIntoHTMLs(converterOptions) {
    return function pipeForConvertingMarkdownsIntoHTMLs() {
        return through.obj(function (file, fileEncoding, callback) {
            if (file.isStream()) {
                return callback(createNewGulpError('Streaming is not supported.'))
            }

            if (file.isNull()) {
                return callback(null, file)
            }

            const createOneConverterOfMarkdownToHTML = rerequire(
                joinPath(thisModuleRootFolderPath, 'core.js')
            )

            const markdownToHTMLConverter = createOneConverterOfMarkdownToHTML({
                themesPeerPackageAllDistFileEntriesKeyingByFileNames,
                syncGetContentStringOfOneFileOfThePeerModuleOfThemes,
                shouldReloadDefaultOptionValuesForDebuggingContinuously: true,
            })


            let htmlContent
            try {
                htmlContent = markdownToHTMLConverter(file.contents.toString(fileEncoding || 'utf-8'), converterOptions)
            } catch(error) {
                return callback(createNewGulpError(error))
            }

            file.path = replaceFileExt(file.path, '.html')
            file.contents = Buffer.from(htmlContent)

            return callback(null, file)
        })
    }
}
