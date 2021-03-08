const 路径工具 = require('path')
const {
    清除Require机制对该文件之缓存,
    先清除Require机制对该文件之缓存而后重新Require该文件,
} = require('../99-辅助工具集/先清除-require-机制对某文件之缓存而后重新-require-该文件')

const MarkDownIt = require('markdown-it')

const markdownItPluginHighlightJs  = require('markdown-it-highlightjs')
const markdownItPluginCheckbox     = require('markdown-it-checkbox')
const markdownItPluginAnchor       = require('markdown-it-anchor')
const markdownItPluginTOCDoneRight = require('markdown-it-toc-done-right')


const joinPathOSLocalStyle = 路径工具.join

const {
    本NPM包之根文件夹之绝对路径,
} = require('../面向研发阶段之配置')

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
        不应采纳本工具之源代码之缓存版本以应对本工具研发阶段之要求,
    } = options

    let 完备的默认配置集
    let tab1

    let 按需向Markdown内容字符串中注入TOC标记
    let 构建HTML之完整Title标签之字符串
    let wrapHTMLChiefContentWithAnArticleTag
    let processAllContentsOfAllPreTagsOfHTMLString


    if (!不应采纳本工具之源代码之缓存版本以应对本工具研发阶段之要求) {
        完备的默认配置集 = require('../完备的默认配置集')

        const tabs = require('./静态-html-片段以及动态构建的-html-片段/static/tabs')
        tab1 = tabs.tab1




        按需向Markdown内容字符串中注入TOC标记 = require(
            './文件内容字符串之处理工具集/1-针对-markdown-内容的字符串/insert-toc-placeholder'
        )

        构建HTML之完整Title标签之字符串 = require(
            './文件内容字符串之处理工具集/2-针对-html-内容的字符串/direct/build-html-title-tag'
        )

        wrapHTMLChiefContentWithAnArticleTag = require(
            './文件内容字符串之处理工具集/2-针对-html-内容的字符串/direct/wrap-chief-content-with-article-tag'
        )

        processAllContentsOfAllPreTagsOfHTMLString = require(
            './文件内容字符串之处理工具集/2-针对-html-内容的字符串/further-upon-hljs-outputs/process-all-html-pre-tags'
        )
    }





    const { // Reading these files only once is enough. Saving time.
        syncGetSnippetEntryOfHTMLBeginning,
        syncGetSnippetEntryOfHTMLFromHeadEndToBodyBegin,
        syncGetSnippetEntryOfHTMLEnding,

        syncGetSnippetEntryOfOneFileOfThePeerDepPackageOfThemes,
        syncGetSnippetEntryOfOneExternalFile,
    } = require('./静态-html-片段以及动态构建的-html-片段/dynamic/create-snippet-entry-getters')({
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





        if (不应采纳本工具之源代码之缓存版本以应对本工具研发阶段之要求) {
            [
                './文件内容字符串之处理工具集/2-针对-html-内容的字符串/further-upon-hljs-outputs/process-snippet-of-one-language.js',
                './文件内容字符串之处理工具集/2-针对-html-内容的字符串/further-upon-hljs-outputs/ast/ast-generic-simple-splitter.js',
                './文件内容字符串之处理工具集/2-针对-html-内容的字符串/further-upon-hljs-outputs/ast/ast-splitter-for-escape-chars-in-string-or-regexp.js',
                './文件内容字符串之处理工具集/2-针对-html-内容的字符串/further-upon-hljs-outputs/ast/ast-splitters-for-regexp.js',
                './文件内容字符串之处理工具集/2-针对-html-内容的字符串/further-upon-hljs-outputs/ast/parse-ast-sub-tree-into-single-string.js',
                './文件内容字符串之处理工具集/2-针对-html-内容的字符串/further-upon-hljs-outputs/processors/__line-breaks-and-leading-whitespaces.js',
                './文件内容字符串之处理工具集/2-针对-html-内容的字符串/further-upon-hljs-outputs/processors/__punctuations.js',
                './文件内容字符串之处理工具集/2-针对-html-内容的字符串/further-upon-hljs-outputs/processors/_one-comment.js',
                './文件内容字符串之处理工具集/2-针对-html-内容的字符串/further-upon-hljs-outputs/processors/_one-regexp.js',
                './文件内容字符串之处理工具集/2-针对-html-内容的字符串/further-upon-hljs-outputs/processors/_one-string.js',
                './文件内容字符串之处理工具集/2-针对-html-内容的字符串/further-upon-hljs-outputs/processors/language-css-family.js',
                './文件内容字符串之处理工具集/2-针对-html-内容的字符串/further-upon-hljs-outputs/processors/language-html.js',
                './文件内容字符串之处理工具集/2-针对-html-内容的字符串/further-upon-hljs-outputs/processors/language-javascript-family.js',
            ].forEach(subPath => {
                清除Require机制对该文件之缓存(
                    joinPathOSLocalStyle(本NPM包之根文件夹之绝对路径, subPath),
                    rerequireLoggingOptions
                )
            })

            // ----------------------------------------------

            完备的默认配置集 = 先清除Require机制对该文件之缓存而后重新Require该文件(
                joinPathOSLocalStyle(
                    本NPM包之根文件夹之绝对路径,
                    '源代码/完备的默认配置集.js'
                ),
                rerequireLoggingOptions
            )

            const tabs = 先清除Require机制对该文件之缓存而后重新Require该文件(
                joinPathOSLocalStyle(
                    本NPM包之根文件夹之绝对路径,
                    './源代码/01-转换器之构建器/静态-html-片段以及动态构建的-html-片段/static/tabs.js'
                ),
                rerequireLoggingOptions
            )
            tab1 = tabs.tab1

            按需向Markdown内容字符串中注入TOC标记 = 先清除Require机制对该文件之缓存而后重新Require该文件(
                joinPathOSLocalStyle(
                    本NPM包之根文件夹之绝对路径,
                    './源代码/01-转换器之构建器/文件内容字符串之处理工具集/1-针对-markdown-内容的字符串/insert-toc-placeholder.js'
                ),
                rerequireLoggingOptions
            )

            构建HTML之完整Title标签之字符串 = 先清除Require机制对该文件之缓存而后重新Require该文件(
                joinPathOSLocalStyle(
                    本NPM包之根文件夹之绝对路径,
                    './源代码/01-转换器之构建器/文件内容字符串之处理工具集/2-针对-html-内容的字符串/direct/build-html-title-tag.js'
                ),
                rerequireLoggingOptions
            )

            wrapHTMLChiefContentWithAnArticleTag = 先清除Require机制对该文件之缓存而后重新Require该文件(
                joinPathOSLocalStyle(
                    本NPM包之根文件夹之绝对路径,
                    './源代码/01-转换器之构建器/文件内容字符串之处理工具集/2-针对-html-内容的字符串/direct/wrap-chief-content-with-article-tag.js'
                ),
                rerequireLoggingOptions
            )

            processAllContentsOfAllPreTagsOfHTMLString = 先清除Require机制对该文件之缓存而后重新Require该文件(
                joinPathOSLocalStyle(
                    本NPM包之根文件夹之绝对路径,
                    './源代码/01-转换器之构建器/文件内容字符串之处理工具集/2-针对-html-内容的字符串/further-upon-hljs-outputs/process-all-html-pre-tags.js'
                ),
                rerequireLoggingOptions
            )
        }



        /* ************* Merge options with their default values ************** */

        将Markdown转换为HTML之前之预备阶段 = {
            ...完备的默认配置集.将Markdown转换为HTML之前之预备阶段,
            ...将Markdown转换为HTML之前之预备阶段,
        }

        将Markdown转换为HTML之阶段 = {
            ...完备的默认配置集.将Markdown转换为HTML之阶段,
            ...将Markdown转换为HTML之阶段,
        }

        对HTML做额外处理之阶段 = {
            ...完备的默认配置集.对HTML做额外处理之阶段,
            ...对HTML做额外处理之阶段,
        }

        对本工具现成提供的文章纲要做以下配置 = {
            ...完备的默认配置集.对本工具现成提供的文章纲要做以下配置,
            ...对本工具现成提供的文章纲要做以下配置,
        }

        杂项 = {
            ...完备的默认配置集.杂项,
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

            cssClassNameOfBackToTopAnchor,
            cssClassNameOfBodyTagWhenMarkdownArticleHasTOC,
            cssClassNameOfMarkdownChiefContentWrappingArticleTag,

            须对产出之HTML内容字符串依次按下诸内容替换规则做修订,

            须读取以下诸文件之内容并全部注入产出之HTML内容中,
        } = 对HTML做额外处理之阶段

        const {
            控制台打印信息须改用英国话,
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
            markdown内容现已包含TOC标记,
            处理过的Markdown内容之字符串: _markdown内容之半成品1,
        } = 按需向Markdown内容字符串中注入TOC标记(markdownContent, 不应主动插入TOC之占位标记)

        const markdown内容之最终成品之字符串 = _markdown内容之半成品1





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

        if (markdown内容现已包含TOC标记) {
            markdownItParser.use(markdownItPluginTOCDoneRight, {
                level: 构建文章纲要列表时自该级别之标题始,
                containerClass: cssClassNameOfArticleTOCRootTag,
                listType: 文章纲要列表应采用UL标签而非OL标签 ? 'ul' : 'ol',
                listClass: cssClassNameOfArticleTOCLists,
                itemClass: cssClassNameOfArticleTOCListItems,
                linkClass: cssClassNameOfArticleTOCItemAnchors,
            })
        }
        const markdown文章中包含了TOC标记 = markdown内容现已包含TOC标记

        let 借助MarkdownIt工具家族将Markdown内容直接转换而得的初始HTML内容字符串 = markdownItParser.render(
            markdown内容之最终成品之字符串
        )
        /*                                                                      */
        /*                                                                      */
        /* ******************************************************************** */









        /* ****** Extract HTML title out of generated HTML raw contents ******* */

        const html之完整Title标签之字符串 = 构建HTML之完整Title标签之字符串(借助MarkdownIt工具家族将Markdown内容直接转换而得的初始HTML内容字符串, {
            specifiedArticleTitle: 产出之HTML文件之Title标签之内容字符串,
            控制台打印信息须改用英国话,
        })





        /* **************** Modify generated HTML raw contents **************** */

        须对产出之HTML内容字符串依次按下诸内容替换规则做修订.forEach(某替换规则 => {
            借助MarkdownIt工具家族将Markdown内容直接转换而得的初始HTML内容字符串 = 借助MarkdownIt工具家族将Markdown内容直接转换而得的初始HTML内容字符串.replace(某替换规则.凡, 某替换规则.替换为)
        })


        借助MarkdownIt工具家族将Markdown内容直接转换而得的初始HTML内容字符串 = processAllContentsOfAllPreTagsOfHTMLString(
            借助MarkdownIt工具家族将Markdown内容直接转换而得的初始HTML内容字符串,
            {
                不应将代码块中的换行符替换成BR标签,
            }
        )

        借助MarkdownIt工具家族将Markdown内容直接转换而得的初始HTML内容字符串 = wrapHTMLChiefContentWithAnArticleTag(
            借助MarkdownIt工具家族将Markdown内容直接转换而得的初始HTML内容字符串,

            {
                cssClassNameOfMarkdownChiefContentWrappingArticleTag,
                cssClassNameOfArticleTOCRootTag,
                markdown文章中包含了TOC标记,
            }
        )

        if (!不应注入用于返回文章起始之按钮) {
            借助MarkdownIt工具家族将Markdown内容直接转换而得的初始HTML内容字符串 += `\n${tab1}<a href="#" class="${cssClassNameOfBackToTopAnchor}"></a>\n`
        }





        /* ***************** Prepare all extra HTML snippets ****************** */

        const snippetEntryOfHTMLBeginning = syncGetSnippetEntryOfHTMLBeginning({
            本NPM包之根文件夹之绝对路径,
            产出之HTML文件之HTML标签之语言属性之取值,
        })

        const snippetEntryOfHTMLEnding = syncGetSnippetEntryOfHTMLEnding()

        const snippetEntryOfHTMLFromHeadEndToBodyBegin = syncGetSnippetEntryOfHTMLFromHeadEndToBodyBegin({
            markdown文章中包含了TOC标记,
            cssClassNameOfBodyTagWhenMarkdownArticleHasTOC,
        })


        let 一切须注入HTML之标签之列表 = []





        let 所采用之本NPM包之Peer依赖包提供之层叠样式表文件之名称

        if (!不应采用任何由本工具内建之层叠样式表) {
            if (markdown文章中包含了TOC标记) {
                所采用之本NPM包之Peer依赖包提供之层叠样式表文件之名称 = 所采用之由本工具内建之含有文章纲要列表之定义之层叠样式表文件之名称
            } else {
                所采用之本NPM包之Peer依赖包提供之层叠样式表文件之名称 = 所采用之由本工具内建之不含文章纲要列表之定义之层叠样式表文件之名称
            }

            if (采用由本工具内建之层叠样式表时应采用未经压缩之版本) {
                所采用之本NPM包之Peer依赖包提供之层叠样式表文件之名称 = 所采用之本NPM包之Peer依赖包提供之层叠样式表文件之名称.replace(
                    /\.min\.css$/,
                    '.css'
                )
            }
        }

        if (所采用之本NPM包之Peer依赖包提供之层叠样式表文件之名称) {
            const snippetEntryOfThemingCSS = syncGetSnippetEntryOfOneFileOfThePeerDepPackageOfThemes(
                所采用之本NPM包之Peer依赖包提供之层叠样式表文件之名称,
                读取本工具内建之层叠样式表文件和Javascript文件时禁止Require语句缓存其内容,
                对本工具现成提供的文章纲要做以下配置
            )

            一切须注入HTML之标签之列表 = [
                ...一切须注入HTML之标签之列表,
                snippetEntryOfThemingCSS,
            ]

            if (snippetEntryOfThemingCSS.associatedJavascriptSnippetEntryPairs) {
                一切须注入HTML之标签之列表 = [
                    ...一切须注入HTML之标签之列表,
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

        一切须注入HTML之标签之列表 = [
            ...一切须注入HTML之标签之列表,
            ...须读取以下诸文件之内容并全部注入产出之HTML内容中
                .map(filePath => {
                    return syncGetSnippetEntryOfOneExternalFile(
                        filePath,
                        读取外来文件时禁止Require语句缓存其内容
                    )
                })
                .filter(entry => !!entry),
        ]

        const 所有层叠样式表片段之列表  = 一切须注入HTML之标签之列表.filter(entry =>  entry.内容由style标签而非script标签包裹着)
        const 所有Javascript片段之列表 = 一切须注入HTML之标签之列表.filter(entry => !entry.内容由style标签而非script标签包裹着)





        /* ***************** Join all HTML snippets together ****************** */

        const 最终HTML之完整内容字符串 = [
            // <!DOCTYPE html> 之类的内容。
            snippetEntryOfHTMLBeginning.content,

            // 完整的 <title /> 标签。
            html之完整Title标签之字符串,

            // <style /> tags
            ...所有层叠样式表片段之列表.map(片段 => 片段.content),

            // </head><body ...>
            snippetEntryOfHTMLFromHeadEndToBodyBegin.content,



            /* ***** chief content ***** */
            /*                           */
            /*                           */
            借助MarkdownIt工具家族将Markdown内容直接转换而得的初始HTML内容字符串,
            /*                           */
            /*                           */
            /* ************************* */



            // <script /> tags
            ...所有Javascript片段之列表.map(片段 => 片段.content),

            // </body></html>
            snippetEntryOfHTMLEnding.content,
        ].join('')





        return 最终HTML之完整内容字符串
    }
}
