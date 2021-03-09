const 路径工具 = require('path')

const 阻塞式读取一文本文件之完整内容字符串 = require('../../../99-辅助工具集/阻塞式读取一文本文件之完整内容字符串')

const 根据文件之扩展名选用包裹该文件之内容之HTML标签名 = require(
    '../../../99-辅助工具集/根据文件之扩展名选用包裹该文件之内容之-html-标签名'
)

const 将字符串用HTML标签包裹起来得出另一字符串 = require(
    '../../文件内容字符串之处理工具集/2-针对-html-内容的字符串/1-对最初产生的-html-内容字符做的修订/将字符串用-html-标签包裹起来得出另一字符串'
)

const { join: 遵循POSIX标准拼接路径 } = 路径工具.posix





let rawHTMLBeginning = ''

const {
    htmlFromHeadEndToBodyBegin,
    htmlEnding,
} = require('../static/html')


const standardSnippetEntryOfHTMLFromHeadEndToBodyBegin = {
    content: htmlFromHeadEndToBodyBegin,
}

const standardSnippetEntryOfHTMLEnding = {
    content: htmlEnding,
}





/**
 * @private
 */
const allSnippetEntries = {
    /** keys are combinations of several factors.
     * @enum {string}
     */
    standard: {},

    /** keys are source file names or file paths,
     * values are HTML snippets with wrapper tags,
     * containing the content of the source file.
     * @enum {object}
     */
    optional: {},
}


/**
 * @typedef {object} SnippetEntryGetters
 * @method syncGetSnippetEntryOfHTMLBeginning
 * @method syncGetSnippetEntryOfHTMLFromHeadEndToBodyBegin
 * @method syncGetSnippetEntryOfHTMLEnding
 * @method syncGetSnippetEntryOfOneFileOfThePeerDepPackageOfThemes
 * @method syncGetSnippetEntryOfOneExternalFile
 */


module.exports = createSnippetEntryGetters





/**
 * @function createSnippetEntryGetters
 * @argument {object} options
 * @argument {object} options.themesPeerPackageAllDistFileEntriesKeyingByFileNames
 * @argument {function} options.syncGetContentStringOfOneFileOfThePeerModuleOfThemes
 *
 * @returns {SnippetEntryGetters}
 */
function createSnippetEntryGetters(options) {
    const {
        themesPeerPackageAllDistFileEntriesKeyingByFileNames,
        syncGetContentStringOfOneFileOfThePeerModuleOfThemes,
    } = options

    return {
        syncGetSnippetEntryOfHTMLBeginning,
        syncGetSnippetEntryOfHTMLFromHeadEndToBodyBegin,
        syncGetSnippetEntryOfHTMLEnding,

        syncGetSnippetEntryOfOneFileOfThePeerDepPackageOfThemes,
        syncGetSnippetEntryOfOneExternalFile,
    }





    function syncGetSnippetEntryOfHTMLBeginning(options) {
        const {
            本NPM包之根文件夹之绝对路径 = '',
            产出之HTML文件之HTML标签之语言属性之取值,
        } = options

        if (!rawHTMLBeginning) {
            rawHTMLBeginning = 阻塞式读取一文本文件之完整内容字符串(
                遵循POSIX标准拼接路径(本NPM包之根文件夹之绝对路径, './源代码/01-转换器之构建器/静态-html-片段以及动态构建的-html-片段/raw-sources/begin.html')
            )
        }

        const entryKey = `HTML beginning snippet of language ${产出之HTML文件之HTML标签之语言属性之取值}`

        const snippetsDict = allSnippetEntries.standard

        if (!snippetsDict[entryKey]) {
            const {
                产出之HTML文件之HTML标签之语言属性之取值,
            } = options

            let htmlBeginning = rawHTMLBeginning

            if (
                typeof 产出之HTML文件之HTML标签之语言属性之取值 === 'string' &&
                产出之HTML文件之HTML标签之语言属性之取值.length > 1 &&
                产出之HTML文件之HTML标签之语言属性之取值 !== 'zh-hans-CN'
            ) {
                htmlBeginning = htmlBeginning.replace(
                    '<html lang="zh-hans-CN">',
                    `<html lang="${产出之HTML文件之HTML标签之语言属性之取值}">`
                )
            }

            snippetsDict[entryKey] = {
                content: htmlBeginning,
            }
        }

        return snippetsDict[entryKey]
    }

    function syncGetSnippetEntryOfHTMLFromHeadEndToBodyBegin(options) {
        const {
            markdown文章中包含了TOC标记,
            cssClassNameOfBodyTagWhenMarkdownArticleHasTOC,
        } = options

        if (markdown文章中包含了TOC标记) {
            return {
                content: `\n</head>\n<body class="${
                    cssClassNameOfBodyTagWhenMarkdownArticleHasTOC
                }">\n`,
            }
        }

        return standardSnippetEntryOfHTMLFromHeadEndToBodyBegin
    }

    function syncGetSnippetEntryOfHTMLEnding() {
        return standardSnippetEntryOfHTMLEnding
    }

    /** The said peer module below is the "@wulechuan/css-stylus-markdown-themes" */
    function syncGetSnippetEntryOfOneFileOfThePeerDepPackageOfThemes(文件名, 不应采纳Require机制缓存之文件旧内容, 其他选项集) {
        const { optional: optionalEntries } = allSnippetEntries

        if (!optionalEntries[文件名] || 不应采纳Require机制缓存之文件旧内容) {
            const 文件之简易描述项 = themesPeerPackageAllDistFileEntriesKeyingByFileNames[文件名]

            const 选用的HTML标签名 = 根据文件之扩展名选用包裹该文件之内容之HTML标签名(文件名)
            const 文件之原始内容字符串 = syncGetContentStringOfOneFileOfThePeerModuleOfThemes(
                文件名,
                不应采纳Require机制缓存之文件旧内容,
                其他选项集
            )

            const fileWrappedContent = 将字符串用HTML标签包裹起来得出另一字符串({
                原始字符串: 文件之原始内容字符串,
                用于包裹原始字符串之HTML标签名: 选用的HTML标签名,
                包裹原始内容后原始应逐行额外缩进两层: true,
            })

            const snippetEntry = {
                content: fileWrappedContent,
                内容由style标签而非script标签包裹着: 选用的HTML标签名 === 'style',
            }

            const { associatedJavascriptFileNames } = 文件之简易描述项

            if (associatedJavascriptFileNames) {
                snippetEntry.associatedJavascriptSnippetEntryPairs = associatedJavascriptFileNames.map(jsFileName => {
                    const jsFileNameIsOfMinifiedVersion = !!jsFileName.match(/\.min\.js$/)

                    let jsFileNameOfMinifiedVersion
                    let jsFileNameOfUnminifiedVersion

                    if (jsFileNameIsOfMinifiedVersion) {
                        jsFileNameOfMinifiedVersion   = jsFileName
                        jsFileNameOfUnminifiedVersion = jsFileName.replace(/\.min\.js$/, '.js')
                    } else {
                        jsFileNameOfUnminifiedVersion = jsFileName
                        jsFileNameOfMinifiedVersion   = jsFileName.replace(/\.js$/, '.min.js')
                    }

                    const jsEntryPair = {
                        minified:   syncGetSnippetEntryOfOneFileOfThePeerDepPackageOfThemes(
                            jsFileNameOfMinifiedVersion,
                            不应采纳Require机制缓存之文件旧内容,
                            其他选项集
                        ),

                        unminified: syncGetSnippetEntryOfOneFileOfThePeerDepPackageOfThemes(
                            jsFileNameOfUnminifiedVersion,
                            不应采纳Require机制缓存之文件旧内容,
                            其他选项集
                        ),
                    }

                    return jsEntryPair
                })
            }

            optionalEntries[文件名] = snippetEntry
        }

        return optionalEntries[文件名]
    }

    function syncGetSnippetEntryOfOneExternalFile(fileAbsolutePath, shouldIgnoreCachedContent) {
        const { optional: optionalEntries } = allSnippetEntries

        if (!optionalEntries[fileAbsolutePath] || shouldIgnoreCachedContent) {
            const 选用的HTML标签名 = 根据文件之扩展名选用包裹该文件之内容之HTML标签名(fileAbsolutePath)
            const 文件之原始内容字符串 = 阻塞式读取一文本文件之完整内容字符串(fileAbsolutePath)
            const fileWrappedContent = 将字符串用HTML标签包裹起来得出另一字符串({
                原始字符串: 文件之原始内容字符串,
                用于包裹原始字符串之HTML标签名: 选用的HTML标签名,
                包裹原始内容后原始应逐行额外缩进两层: true,
            })

            const snippetEntry = {
                content: fileWrappedContent,
                内容由style标签而非script标签包裹着: 选用的HTML标签名 === 'style',
            }

            optionalEntries[fileAbsolutePath] = snippetEntry
        }

        return optionalEntries[fileAbsolutePath]
    }
}
