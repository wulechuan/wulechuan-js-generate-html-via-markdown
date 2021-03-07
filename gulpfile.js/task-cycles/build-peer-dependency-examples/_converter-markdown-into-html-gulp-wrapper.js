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
const { rerequire } = require('../../../源代码/99-辅助工具集/rerequired-file')

const {
    thisModuleRootFolderPath,
} = require('../../configs/common')

const {
    allFileEntriesKeyingByFileNames: themesPeerPackageAllDistFileEntriesKeyingByFileNames,
    syncGetContentStringOfOneFileEntry: syncGetContentStringOfOneFileOfThePeerModuleOfThemes,
} = require('@wulechuan/css-stylus-markdown-themes')

const joinPath = path.join
const joinPathPOSIX = path.posix.join

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

            // console.log('>>==> index.js', joinPathPOSIX(thisModuleRootFolderPath, '源代码', 'index.js'))
            const { 构建一个用于将Markdown内容字符串转换为HTML字符串的转换器 } = rerequire(
                joinPath(thisModuleRootFolderPath, '源代码', 'index.js')
            )
            // console.log('构建一个用于将Markdown内容字符串转换为HTML字符串的转换器', 构建一个用于将Markdown内容字符串转换为HTML字符串的转换器)

            const 将Markdown内容字符串转换为HTML内容的转换器 = 构建一个用于将Markdown内容字符串转换为HTML字符串的转换器({
                themesPeerPackageAllDistFileEntriesKeyingByFileNames,
                syncGetContentStringOfOneFileOfThePeerModuleOfThemes,
                shouldReloadModulesForDevWatchingMode: true,
            })
            console.log('将Markdown内容字符串转换为HTML内容的转换器', 将Markdown内容字符串转换为HTML内容的转换器)



            let htmlContent
            try {
                htmlContent = 将Markdown内容字符串转换为HTML内容的转换器(file.contents.toString(fileEncoding || 'utf-8'), converterOptions)
            } catch(error) {
                return callback(createNewGulpError(error))
            }

            // console.log(`${htmlContent.slice(0, 300)}\n...\n${'-'.repeat(79)}\n`)

            file.path = replaceFileExt(file.path, '.html')
            file.contents = Buffer.from(htmlContent)

            return callback(null, file)
        })
    }
}
