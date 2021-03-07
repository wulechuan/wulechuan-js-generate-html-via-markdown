const 路径工具 = require('path')
const {
    clearCacheOfRequiredFile,
    rerequire,
} = require('../99-辅助工具集/rerequired-file')

const MarkDownIt = require('markdown-it')

const markdownItPluginHighlightJs  = require('markdown-it-highlightjs')
const markdownItPluginCheckbox     = require('markdown-it-checkbox')
const markdownItPluginAnchor       = require('markdown-it-anchor')
const markdownItPluginTOCDoneRight = require('markdown-it-toc-done-right')


const joinPathOSLocalStyle = 路径工具.join

const thisModuleRootFolderPath = 路径工具.dirname(require.resolve('../../package.json'))

const rerequireLoggingOptions = { shouldNotLog: true, shouldNotWarn: false }










/**
 * @param {object} options
 * @param {object} options.themesPeerPackageAllDistFileEntriesKeyingByFileNames
 * @param {function} options.syncGetContentStringOfOneFileOfThePeerModuleOfThemes
 * @returns {function} - The core converter function
 */
module.exports = function 构建一个用于将Markdown内容字符串转换为HTML字符串的转换器(options = {}) {
    const {
        themesPeerPackageAllDistFileEntriesKeyingByFileNames,
        syncGetContentStringOfOneFileOfThePeerModuleOfThemes,
        shouldReloadModulesForDevWatchingMode,
    } = options

    let defaultOptionValues
    let tab1

    let insertTOCMarkDownTagIfNecessary
    let buildHTMLTitleSnippetString
    let wrapHTMLChiefContentWithAnArticleTag
    let processAllContentsOfAllPreTagsOfHTMLString


    if (!shouldReloadModulesForDevWatchingMode) {
        defaultOptionValues = require('../完备的默认配置')

        const tabs = require('./snippets/static/tabs')
        tab1 = tabs.tab1




        insertTOCMarkDownTagIfNecessary = require(
            './string-processors/0-markdown/insert-toc-placeholder'
        )

        buildHTMLTitleSnippetString = require(
            './string-processors/1-html/direct/build-html-title-tag'
        )

        wrapHTMLChiefContentWithAnArticleTag = require(
            './string-processors/1-html/direct/wrap-chief-content-with-article-tag'
        )

        processAllContentsOfAllPreTagsOfHTMLString = require(
            './string-processors/1-html/further-upon-hljs-outputs/process-all-html-pre-tags'
        )
    }





    const { // Reading these files only once is enough. Saving time.
        syncGetSnippetEntryOfHTMLBeginning,
        syncGetSnippetEntryOfHTMLFromHeadEndToBodyBegin,
        syncGetSnippetEntryOfHTMLEnding,

        syncGetSnippetEntryOfOneFileOfThePeerDepPackageOfThemes,
        syncGetSnippetEntryOfOneExternalFile,
    } = require('./snippets/dynamic/create-snippet-entry-getters')({
        themesPeerPackageAllDistFileEntriesKeyingByFileNames,
        syncGetContentStringOfOneFileOfThePeerModuleOfThemes,
    })




    return function generateFullHTMLStringViaMarkdownString(markdownContent, options = {}) {
        const {
            须在控制台打印详尽细节,
        } = options

        let {
            将Markdown转换为HTML之前之预备阶段 = {},
            将Markdown转换为HTML之阶段 = {},
            对HTML做额外处理之阶段 = {},
            对本工具现成提供的文章纲要做以下配置 = {},
            杂项 = {},
        } = options





        if (shouldReloadModulesForDevWatchingMode) {
            [
                './string-processors/1-html/further-upon-hljs-outputs/process-snippet-of-one-language.js',
                './string-processors/1-html/further-upon-hljs-outputs/ast/ast-generic-simple-splitter.js',
                './string-processors/1-html/further-upon-hljs-outputs/ast/ast-splitter-for-escape-chars-in-string-or-regexp.js',
                './string-processors/1-html/further-upon-hljs-outputs/ast/ast-splitters-for-regexp.js',
                './string-processors/1-html/further-upon-hljs-outputs/ast/parse-ast-sub-tree-into-single-string.js',
                './string-processors/1-html/further-upon-hljs-outputs/processors/__line-breaks-and-leading-whitespaces.js',
                './string-processors/1-html/further-upon-hljs-outputs/processors/__punctuations.js',
                './string-processors/1-html/further-upon-hljs-outputs/processors/_one-comment.js',
                './string-processors/1-html/further-upon-hljs-outputs/processors/_one-regexp.js',
                './string-processors/1-html/further-upon-hljs-outputs/processors/_one-string.js',
                './string-processors/1-html/further-upon-hljs-outputs/processors/language-css-family.js',
                './string-processors/1-html/further-upon-hljs-outputs/processors/language-html.js',
                './string-processors/1-html/further-upon-hljs-outputs/processors/language-javascript-family.js',
            ].forEach(subPath => {
                clearCacheOfRequiredFile(
                    joinPathOSLocalStyle(thisModuleRootFolderPath, subPath),
                    rerequireLoggingOptions
                )
            })

            // ----------------------------------------------

            defaultOptionValues = rerequire(
                joinPathOSLocalStyle(
                    thisModuleRootFolderPath,
                    '源代码/完备的默认配置.js'
                ),
                rerequireLoggingOptions
            )

            const tabs = rerequire(
                joinPathOSLocalStyle(
                    thisModuleRootFolderPath,
                    './源代码/01-转换器之构建器/snippets/static/tabs.js'
                ),
                rerequireLoggingOptions
            )
            tab1 = tabs.tab1

            insertTOCMarkDownTagIfNecessary = rerequire(
                joinPathOSLocalStyle(
                    thisModuleRootFolderPath,
                    './源代码/01-转换器之构建器/string-processors/0-markdown/insert-toc-placeholder.js'
                ),
                rerequireLoggingOptions
            )

            buildHTMLTitleSnippetString = rerequire(
                joinPathOSLocalStyle(
                    thisModuleRootFolderPath,
                    './源代码/01-转换器之构建器/string-processors/1-html/direct/build-html-title-tag.js'
                ),
                rerequireLoggingOptions
            )

            wrapHTMLChiefContentWithAnArticleTag = rerequire(
                joinPathOSLocalStyle(
                    thisModuleRootFolderPath,
                    './源代码/01-转换器之构建器/string-processors/1-html/direct/wrap-chief-content-with-article-tag.js'
                ),
                rerequireLoggingOptions
            )

            processAllContentsOfAllPreTagsOfHTMLString = rerequire(
                joinPathOSLocalStyle(
                    thisModuleRootFolderPath,
                    './源代码/01-转换器之构建器/string-processors/1-html/further-upon-hljs-outputs/process-all-html-pre-tags.js'
                ),
                rerequireLoggingOptions
            )
        }



        /* ************* Merge options with their default values ************** */

        将Markdown转换为HTML之前之预备阶段 = {
            ...defaultOptionValues.将Markdown转换为HTML之前之预备阶段,
            ...将Markdown转换为HTML之前之预备阶段,
        }

        将Markdown转换为HTML之阶段 = {
            ...defaultOptionValues.将Markdown转换为HTML之阶段,
            ...将Markdown转换为HTML之阶段,
        }

        对HTML做额外处理之阶段 = {
            ...defaultOptionValues.对HTML做额外处理之阶段,
            ...对HTML做额外处理之阶段,
        }

        对本工具现成提供的文章纲要做以下配置 = {
            ...defaultOptionValues.对本工具现成提供的文章纲要做以下配置,
            ...对本工具现成提供的文章纲要做以下配置,
        }

        杂项 = {
            ...defaultOptionValues.杂项,
            ...杂项,
        }

        const {
            不应主动插入TOC之占位标记,
        } = 将Markdown转换为HTML之前之预备阶段

        const {
            不应为各章节标题构建超链接,
            各章节标题超链接之符号字符串,
            cssClassNameOfHeadingPermanentLinks,
            cssClassNameOfArticleTOCRootTag,
            cssClassNameOfArticleTOCLists,
            cssClassNameOfArticleTOCListItems,
            cssClassNameOfArticleTOCItemAnchors,
            文章纲要列表应采用UL标签而非OL标签,
            构建文章纲要列表时自该级别之标题始,
        } = 将Markdown转换为HTML之阶段

        const {
            不应将代码块中的换行符替换成BR标签,
            不应注入用于返回文章起始之按钮,
            不应采用任何由本工具内建之层叠样式表,
            采用由本工具内建之层叠样式表时应采用未经压缩之版本,
            采用由本工具内建之Javascript时应采用未经压缩之版本,

            产出之HTML文件之HTML标签之语言属性之取值,
            产出之HTML文件之Title标签之内容字符串,

            所采用之由本工具内建之含有文章纲要列表之定义之层叠样式表文件之名称,
            所采用之由本工具内建之不含文章纲要列表之定义之层叠样式表文件之名称,

            moduleCSSFileNameOfDefaultThemeWithTOC,
            moduleCSSFileNameOfDefaultTheme,

            cssClassNameOfBackToTopAnchor,
            cssClassNameOfBodyTagWhenMarkdownArticleHasTOC,
            cssClassNameOfMarkdownChiefContentWrappingArticleTag,

            须对产出之HTML内容字符串依次按下诸内容替换规则做修订,

            须读取以下诸文件之内容并全部注入产出之HTML内容中,
        } = 对HTML做额外处理之阶段

        const {
            控制台打印信息改用英国话,
            读取本工具内建之层叠样式表文件和Javascript文件时禁止Require语句缓存其内容,
            读取外来文件时禁止Require语句缓存其内容,
        } = 杂项

        if (须在控制台打印详尽细节) {
            console.log('\n 将Markdown转换为HTML之前之预备阶段：', 将Markdown转换为HTML之前之预备阶段)
            console.log('\n 将Markdown转换为HTML之阶段：', 将Markdown转换为HTML之阶段)
            console.log('\n 对HTML做额外处理之阶段：', 对HTML做额外处理之阶段)
            console.log('\n 对本工具现成提供的文章纲要做以下配置：', 对本工具现成提供的文章纲要做以下配置)
            console.log('\n 杂项：', 杂项)
        }








        /* *************** Modify markdown content if necessary *************** */

        const {
            markdownContentHasTOCPlaceholder,
            processedMarkdownContent: _tempMarkdownContent1,
        } = insertTOCMarkDownTagIfNecessary(markdownContent, 不应主动插入TOC之占位标记)

        const finalMarkdownContent = _tempMarkdownContent1





        /* ************************* MarkDown to HTML ************************* */
        /*                                                                      */
        /*                                                                      */
        const markdownItParser = new MarkDownIt({
            html: true,
            linkify: true,
            typographer: true,
        })

        markdownItParser.use(markdownItPluginHighlightJs)
        markdownItParser.use(markdownItPluginCheckbox)

        const markdownItPluginAnchorOptions = {
            permalink: !不应为各章节标题构建超链接,
            permalinkBefore: true,
        }

        if (各章节标题超链接之符号字符串) {
            markdownItPluginAnchorOptions.permalinkSymbol = 各章节标题超链接之符号字符串
        }

        if (cssClassNameOfHeadingPermanentLinks) {
            markdownItPluginAnchorOptions.permalinkClass = cssClassNameOfHeadingPermanentLinks
        }

        markdownItParser.use(markdownItPluginAnchor, markdownItPluginAnchorOptions)

        if (markdownContentHasTOCPlaceholder) {
            markdownItParser.use(markdownItPluginTOCDoneRight, {
                level: 构建文章纲要列表时自该级别之标题始,
                containerClass: cssClassNameOfArticleTOCRootTag,
                listType: 文章纲要列表应采用UL标签而非OL标签 ? 'ul' : 'ol',
                listClass: cssClassNameOfArticleTOCLists,
                itemClass: cssClassNameOfArticleTOCListItems,
                linkClass: cssClassNameOfArticleTOCItemAnchors,
            })
        }
        const markdownArticleHasTOC = markdownContentHasTOCPlaceholder

        let htmlContentViaMarkDownContent = markdownItParser.render(finalMarkdownContent)
        /*                                                                      */
        /*                                                                      */
        /* ******************************************************************** */




        /* ****** Extract HTML title out of generated HTML raw contents ******* */

        const snippetStringOfHTMLTitle = buildHTMLTitleSnippetString(htmlContentViaMarkDownContent, {
            specifiedArticleTitle: 产出之HTML文件之Title标签之内容字符串,
            控制台打印信息改用英国话,
        })





        /* **************** Modify generated HTML raw contents **************** */

        须对产出之HTML内容字符串依次按下诸内容替换规则做修订.forEach(某替换规则 => {
            htmlContentViaMarkDownContent = htmlContentViaMarkDownContent.replace(某替换规则.凡, 某替换规则.替换为)
        })


        htmlContentViaMarkDownContent = processAllContentsOfAllPreTagsOfHTMLString(
            htmlContentViaMarkDownContent,
            {
                不应将代码块中的换行符替换成BR标签,
            }
        )

        htmlContentViaMarkDownContent = wrapHTMLChiefContentWithAnArticleTag(
            htmlContentViaMarkDownContent,

            {
                cssClassNameOfMarkdownChiefContentWrappingArticleTag,
                cssClassNameOfArticleTOCRootTag,
                markdownArticleHasTOC,
            }
        )

        if (!不应注入用于返回文章起始之按钮) {
            htmlContentViaMarkDownContent += `\n${tab1}<a href="#" class="${cssClassNameOfBackToTopAnchor}"></a>\n`
        }






        /* ***************** Prepare all extra HTML snippets ****************** */

        const snippetEntryOfHTMLBeginning = syncGetSnippetEntryOfHTMLBeginning({
            thisModuleRootFolderPath,
            产出之HTML文件之HTML标签之语言属性之取值,
        })

        const snippetEntryOfHTMLEnding = syncGetSnippetEntryOfHTMLEnding()

        const snippetEntryOfHTMLFromHeadEndToBodyBegin = syncGetSnippetEntryOfHTMLFromHeadEndToBodyBegin({
            markdownArticleHasTOC,
            cssClassNameOfBodyTagWhenMarkdownArticleHasTOC,
        })


        let allSnippetEntriesToEmbed = []





        let themingCSSFileEntryKey

        if (!不应采用任何由本工具内建之层叠样式表) {
            if (markdownArticleHasTOC) {
                themingCSSFileEntryKey = 所采用之由本工具内建之含有文章纲要列表之定义之层叠样式表文件之名称
            } else {
                themingCSSFileEntryKey = 所采用之由本工具内建之不含文章纲要列表之定义之层叠样式表文件之名称
            }

            if (采用由本工具内建之层叠样式表时应采用未经压缩之版本) {
                themingCSSFileEntryKey = themingCSSFileEntryKey.replace(/\.min\.css$/, '.css')
            }
        }


        if (themingCSSFileEntryKey) {
            const snippetEntryOfThemingCSS = syncGetSnippetEntryOfOneFileOfThePeerDepPackageOfThemes(
                themingCSSFileEntryKey,
                读取本工具内建之层叠样式表文件和Javascript文件时禁止Require语句缓存其内容,
                对本工具现成提供的文章纲要做以下配置
            )

            allSnippetEntriesToEmbed = [
                ...allSnippetEntriesToEmbed,
                snippetEntryOfThemingCSS,
            ]

            if (snippetEntryOfThemingCSS.associatedJavascriptSnippetEntryPairs) {
                allSnippetEntriesToEmbed = [
                    ...allSnippetEntriesToEmbed,
                    ...snippetEntryOfThemingCSS.associatedJavascriptSnippetEntryPairs.map(entryPair => {
                        if (采用由本工具内建之Javascript时应采用未经压缩之版本) {
                            return entryPair.unminified
                        } else {
                            return entryPair.minified
                        }
                    }),
                ]
            }
        }


        allSnippetEntriesToEmbed = [
            ...allSnippetEntriesToEmbed,
            ...须读取以下诸文件之内容并全部注入产出之HTML内容中
                .map(filePath => {
                    return syncGetSnippetEntryOfOneExternalFile(
                        filePath,
                        读取外来文件时禁止Require语句缓存其内容
                    )
                })
                .filter(entry => !!entry),
        ]

        const allSnippetEntriesOfAllCSS         = allSnippetEntriesToEmbed.filter(entry =>  entry.isStyleTag)
        const allSnippetEntriesOfAllJavascripts = allSnippetEntriesToEmbed.filter(entry => !entry.isStyleTag)








        /* ***************** Join all HTML snippets together ****************** */

        const htmlFullContent = [
            // <!DOCTYPE html>... etc.
            snippetEntryOfHTMLBeginning.content,

            // <title />
            snippetStringOfHTMLTitle,

            // <style /> tags
            ...allSnippetEntriesOfAllCSS.map(entry => entry.content),

            // </head><body ...>
            snippetEntryOfHTMLFromHeadEndToBodyBegin.content,



            /* ***** chief content ***** */
            /*                           */
            /*                           */
            htmlContentViaMarkDownContent,
            /*                           */
            /*                           */
            /* ************************* */


            // <script /> tags
            ...allSnippetEntriesOfAllJavascripts.map(entry => entry.content),

            // </body></html>
            snippetEntryOfHTMLEnding.content,
        ].join('')




        return htmlFullContent
    }
}
