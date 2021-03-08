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
const { 先清除Require机制对该文件之缓存而后重新Require该文件 } = require('../../../源代码/99-辅助工具集/rerequired-file')

const {
    thisModuleRootFolderPath,
} = require('../../00-任务之配置项集/common')

const {
    allFileEntriesKeyingByFileNames: themesPeerPackageAllDistFileEntriesKeyingByFileNames,
    syncGetContentStringOfOneFileEntry: syncGetContentStringOfOneFileOfThePeerModuleOfThemes,
} = require('@wulechuan/css-stylus-markdown-themes')

const joinPath = path.join
const joinPathPOSIX = path.posix.join

function 构造一个Gulp生态中之特型错误对象(rawError) {
    return new GulpPluginError('@wulechuan/generate-html-via-markdown', rawError)
}

module.exports = function 将由本工具构建之内容转换器包裹成Gulp任务管道之环节(converterOptions) {
    return function pipeForConvertingMarkdownsIntoHTMLs() {
        return through.obj(function (file, fileEncoding, callback) {
            if (file.isStream()) {
                return callback(构造一个Gulp生态中之特型错误对象('Gulpjs 不支持流式（Streaming）之内容。'))
            }

            if (file.isNull()) {
                return callback(null, file)
            }

            const { 构建一个用于将Markdown内容字符串转换为HTML字符串的转换器 } = 先清除Require机制对该文件之缓存而后重新Require该文件(
                joinPath(thisModuleRootFolderPath, '源代码', 'index.js')
            )

            const 将Markdown内容字符串转换为HTML内容的转换器 = 构建一个用于将Markdown内容字符串转换为HTML字符串的转换器({
                themesPeerPackageAllDistFileEntriesKeyingByFileNames,
                syncGetContentStringOfOneFileOfThePeerModuleOfThemes,
                不应采纳本工具之源代码之缓存版本以应对本工具研发阶段之要求: true,
            })



            let htmlContent
            try {
                htmlContent = 将Markdown内容字符串转换为HTML内容的转换器(file.contents.toString(fileEncoding || 'utf-8'), converterOptions)
            } catch(error) {
                return callback(构造一个Gulp生态中之特型错误对象(error))
            }

            // console.log(`${htmlContent.slice(0, 300)}\n...\n${'-'.repeat(79)}\n`)

            file.path = replaceFileExt(file.path, '.html')
            file.contents = Buffer.from(htmlContent)

            return callback(null, file)
        })
    }
}
