const chalk = require('chalk')
const path = require('path')

const MarkDownIt = require('markdown-it')

const markdownItPluginHighlightJs  = require('markdown-it-highlightjs')
const markdownItPluginCheckbox     = require('markdown-it-checkbox')
const markdownItPluginAnchor       = require('markdown-it-anchor')
const markdownItPluginTOCDoneRight = require('markdown-it-toc-done-right')

const {
    tab1,
    // tab2,
} = require('./source/snippets/static/tabs')

const defaultOptionValues = require('./default-options')


const thisModuleRootFolderPath = path.dirname(require.resolve('./package.json'))










/**
 * @param {object} options
 * @param {object} options.themesPeerModuleAllFileEntriesKeyingByFileNames
 * @param {function} options.syncGetContentStringOfOneFileOfThePeerModuleOfThemes
 * @returns {function} - The core converter function
 */
module.exports = function createOneMarkdownToHTMLConerter(options = {}) {
    const {
        themesPeerModuleAllFileEntriesKeyingByFileNames,
        syncGetContentStringOfOneFileOfThePeerModuleOfThemes,
    } = options


    const { // Reading these files only once is enough. Saving time.
        syncGetSnippetEntryOfHTMLBeginning,
        syncGetSnippetEntryOfHTMLFromHeadEndToBodyBegin,
        syncGetSnippetEntryOfHTMLEnding,

        syncGetSnippetEntryOfOneFileOfThePeerModuleOfThemes,
        syncGetSnippetEntryOfOneExternalFile,
    } = require('./source/snippets/dynamic/create-snippet-entry-getters')({
        themesPeerModuleAllFileEntriesKeyingByFileNames,
        syncGetContentStringOfOneFileOfThePeerModuleOfThemes,
    })




    return function generateFullHTMLStringViaMarkdownString(markdownContent, options = {}) {
        const {
            shouldLogVerbosely,
        } = options

        let {
            conversionPreparations = {},
            conversionOptions = {},
            manipulationsOverHTML = {},
            sundries = {},
        } = options

        const newVerionPropertyProvided = {
            internalCSSFileNameOfThemeWithTOC: manipulationsOverHTML.internalCSSFileNameOfThemeWithTOC !== undefined,
            internalCSSFileNameOfTheme:        manipulationsOverHTML.internalCSSFileNameOfTheme        !== undefined,
        }




        /* ************* Merge options with their default values ************** */

        conversionPreparations = {
            ...defaultOptionValues.conversionPreparations,
            ...conversionPreparations,
        }

        conversionOptions = {
            ...defaultOptionValues.conversionOptions,
            ...conversionOptions,
        }

        manipulationsOverHTML = {
            ...defaultOptionValues.manipulationsOverHTML,
            ...manipulationsOverHTML,
        }

        sundries = {
            ...defaultOptionValues.sundries,
            ...sundries,
        }

        const {
            shouldNotAutoInsertTOCPlaceholderIntoMarkdown,
        } = conversionPreparations

        const {
            shouldNotBuildHeadingPermanentLinks,
            headingPermanentLinkSymbolChar,
            cssClassNameOfHeadingPermanentLinks,
            cssClassNameOfArticleTOCRootTag,
            cssClassNameOfArticleTOCLists,
            cssClassNameOfArticleTOCListItems,
            cssClassNameOfArticleTOCItemAnchors,
            articleTOCListTagNameIsUL,
            articleTOCBuildingHeadingLevelStartsFrom,
        } = conversionOptions

        const {
            shouldNotInsertBackToTopAnchor,
            shouldNotUseInternalCSSThemingFiles,
            shouldUseUnminifiedVersionOfInternalCSS,
            shouldUseUnminifiedVersionOfInternalJavascriptIfAny,

            htmlTagLanguage,
            htmlTitleString,

            internalCSSFileNameOfThemeWithTOC,
            internalCSSFileNameOfTheme,

            moduleCSSFileNameOfDefaultThemeWithTOC,
            moduleCSSFileNameOfDefaultTheme,

            cssClassNameOfBackToTopAnchor,
            cssClassNameOfBodyTagWhenMarkdownArticleHasTOC,
            cssClassNameOfMarkdownChiefContentWrappingArticleTag,

            desiredReplacementsInHTML,

            absolutePathsOfExtraFilesToEmbedIntoHTML,
        } = manipulationsOverHTML

        const {
            shouldConsoleLogsInChinese,
            shouldDisableCachingForInternalThemeFiles,
            shouldDisableCachingForExternalFiles,
        } = sundries


        if (shouldLogVerbosely) {
            console.log('\nconversionPreparations:', conversionPreparations)
            console.log('\nconversionOptions:', conversionOptions)
            console.log('\nmanipulationsOverHTML:', manipulationsOverHTML)
            console.log('\nsundries:', sundries)
        }



        /* *************** Modify markdown content if necessary *************** */

        const {
            markdownContentHasTOCPlaceholder,
            processedMarkdownContent: _tempMarkdownContent1,
        } = insertTOCMarkDownTagIfNecessary(markdownContent, shouldNotAutoInsertTOCPlaceholderIntoMarkdown)

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
            permalink: !shouldNotBuildHeadingPermanentLinks,
            permalinkBefore: true,
        }

        if (headingPermanentLinkSymbolChar) {
            markdownItPluginAnchorOptions.permalinkSymbol = headingPermanentLinkSymbolChar
        }

        if (cssClassNameOfHeadingPermanentLinks) {
            markdownItPluginAnchorOptions.permalinkClass = cssClassNameOfHeadingPermanentLinks
        }

        markdownItParser.use(markdownItPluginAnchor, markdownItPluginAnchorOptions)

        if (markdownContentHasTOCPlaceholder) {
            markdownItParser.use(markdownItPluginTOCDoneRight, {
                level: articleTOCBuildingHeadingLevelStartsFrom,
                containerClass: cssClassNameOfArticleTOCRootTag,
                listType: articleTOCListTagNameIsUL ? 'ul' : 'ol',
                listClass: cssClassNameOfArticleTOCLists,
                itemClass: cssClassNameOfArticleTOCListItems,
                linkClass: cssClassNameOfArticleTOCItemAnchors,
            })
        }

        let htmlContentViaMarkDownContent = markdownItParser.render(finalMarkdownContent)
        const markdownArticleHasTOC = markdownContentHasTOCPlaceholder
        /*                                                                      */
        /*                                                                      */
        /* ******************************************************************** */




        /* ****** Extract HTML title out of generated HTML raw contents ******* */

        const snippetStringOfHTMLTitle = buildHTMLTitleSnippetString(htmlContentViaMarkDownContent, {
            specifiedArticleTitle: htmlTitleString,
            shouldConsoleLogsInChinese,
        })





        /* **************** Modify generated HTML raw contents **************** */

        desiredReplacementsInHTML.forEach(pair => {
            htmlContentViaMarkDownContent = htmlContentViaMarkDownContent.replace(pair.from, pair.to)
        })


        htmlContentViaMarkDownContent = wulechuanAddExtraMarkupsToHTML(
            htmlContentViaMarkDownContent
        )

        htmlContentViaMarkDownContent = wrapHTMLChiefContentWithAnArticleTag(
            htmlContentViaMarkDownContent,

            {
                cssClassNameOfMarkdownChiefContentWrappingArticleTag,
                cssClassNameOfArticleTOCRootTag,
                markdownArticleHasTOC,
            }
        )

        if (!shouldNotInsertBackToTopAnchor) {
            htmlContentViaMarkDownContent += `\n${tab1}<a href="#" class="${cssClassNameOfBackToTopAnchor}"></a>\n`
        }






        /* ***************** Prepare all extra HTML snippets ****************** */

        const snippetEntryOfHTMLBeginning = syncGetSnippetEntryOfHTMLBeginning({
            thisModuleRootFolderPath,
            htmlTagLanguage,
        })

        const snippetEntryOfHTMLEnding = syncGetSnippetEntryOfHTMLEnding()

        const snippetEntryOfHTMLFromHeadEndToBodyBegin = syncGetSnippetEntryOfHTMLFromHeadEndToBodyBegin({
            markdownArticleHasTOC,
            cssClassNameOfBodyTagWhenMarkdownArticleHasTOC,
        })


        let allSnippetEntriesToEmbed = []





        let themingCSSFileEntryKey

        if (!shouldNotUseInternalCSSThemingFiles) {
            if (markdownArticleHasTOC) {
                if (newVerionPropertyProvided.internalCSSFileNameOfThemeWithTOC) {
                    themingCSSFileEntryKey = internalCSSFileNameOfThemeWithTOC
                } else {
                    themingCSSFileEntryKey = moduleCSSFileNameOfDefaultThemeWithTOC
                }
            } else {
                if (newVerionPropertyProvided.internalCSSFileNameOfTheme) {
                    themingCSSFileEntryKey = internalCSSFileNameOfTheme
                } else {
                    themingCSSFileEntryKey = moduleCSSFileNameOfDefaultTheme
                }
            }

            if (shouldUseUnminifiedVersionOfInternalCSS) {
                themingCSSFileEntryKey = themingCSSFileEntryKey.replace(/\.min\.css$/, '.css')
            }
        }


        if (themingCSSFileEntryKey) {
            const snippetEntryOfThemingCSS = syncGetSnippetEntryOfOneFileOfThePeerModuleOfThemes(
                themingCSSFileEntryKey,
                shouldDisableCachingForInternalThemeFiles
            )

            allSnippetEntriesToEmbed = [
                ...allSnippetEntriesToEmbed,
                snippetEntryOfThemingCSS,
            ]

            if (snippetEntryOfThemingCSS.pairingJavascriptSnippetEntryPairs) {
                allSnippetEntriesToEmbed = [
                    ...allSnippetEntriesToEmbed,
                    ...snippetEntryOfThemingCSS.pairingJavascriptSnippetEntryPairs.map(entryPair => {
                        if (shouldUseUnminifiedVersionOfInternalJavascriptIfAny) {
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
            ...absolutePathsOfExtraFilesToEmbedIntoHTML
                .map(filePath => {
                    return syncGetSnippetEntryOfOneExternalFile(
                        filePath,
                        shouldDisableCachingForExternalFiles
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





function insertTOCMarkDownTagIfNecessary(markdownContent, shouldNotAutoInsertTOCPlaceholderIntoMarkdown) {
    if (typeof markdownContent !== 'string') {
        throw new TypeError(`@wulechuan/generate-html-via-markdown:\n    ${
            chalk.red('Invalid markdownContent. It must be a string')
        }.\n    ${
            chalk.yellow(`If you read it from a file, please use "${
                chalk.magenta('.toString')
            }" method to convert its contents first.`)
        }\n`)
    }

    let processedMarkdownContent = markdownContent

    let markdownContentHasTOCPlaceholder = processedMarkdownContent
        .match(/\$\{toc\}|\[\[toc\]\]|\[toc\]|\[\[_toc_\]\]/i)

    if (!markdownContentHasTOCPlaceholder && !shouldNotAutoInsertTOCPlaceholderIntoMarkdown) {
        processedMarkdownContent += [
            '\n',
            '[[toc]]',
        ].join('\n\n')

        markdownContentHasTOCPlaceholder = true
    }

    return {
        markdownContentHasTOCPlaceholder,
        processedMarkdownContent,
    }
}

function getTextContentOfFirstH1Tag(htmlSnippetToSearchContentIn) {
    const matchingResultOfH1TagContent = htmlSnippetToSearchContentIn.match(
        /<h1( id=".+".*)?>(<a.+>.*<\/a>)?(.*)<\/h1>/
    )

    if (matchingResultOfH1TagContent) {
        return matchingResultOfH1TagContent[3].trim()
    }

    return ''
}

function buildHTMLTitleSnippetString(htmlContentViaMarkDownContent, options) {
    const {
        specifiedArticleTitle,
        shouldConsoleLogsInChinese,
    } = options

    let articleTitle

    if (specifiedArticleTitle) {
        articleTitle = specifiedArticleTitle
    } else {
        articleTitle = getTextContentOfFirstH1Tag(htmlContentViaMarkDownContent)
    }


    console.log('')

    let htmlTitleSnippet = ''
    if (articleTitle) {
        htmlTitleSnippet = `<title>${articleTitle}</title>`

        if (shouldConsoleLogsInChinese) {
            console.log(`文章标题为：${chalk.green('《' + articleTitle + '》')}`)
        } else {
            console.log(`Article title: ${chalk.green(articleTitle)}`)
        }
    } else {
        htmlTitleSnippet = '<title>HTML via MarkDown (by markdownIt)</title>'

        if (shouldConsoleLogsInChinese) {
            console.log(chalk.red('未找到文章标题'))
        } else {
            console.log(chalk.red('Article title not found.'))
        }
    }

    console.log('')

    return htmlTitleSnippet
}

function wulechuanAddExtraMarkupsToHTML(html) {
    const tokenTypesToAddWrapperTo = [
        'hljs-keyword',
        'hljs-built_in',
        'hljs-literal',
    ]


    html = html.replace(
        /\/(g|gi|ig|i)?<\/span>/g,
        [
            '<span class="regexp-end">/</span>',
            '<span class="regexp-options">$1</span>',
            '</span>',
        ].join('')
    )

    html = html.replace(
        /([^\\])(\$)?<span class="regexp-end">/g,
        [
            '$1</span>',
            '<span class="regexp-selector-input-end">$2</span>',
            '<span class="regexp-end">',
        ].join('')
    )

    html = html.replace(
        /<span class="hljs-regexp">\/(\^)?/g,
        [
            '<span class="hljs-regexp">',
            '<span class="regexp-begin">/</span>',
            '<span class="regexp-selector-input-begin">$1</span>',
            '<span class="regexp-body">',
        ].join('')
    )



    tokenTypesToAddWrapperTo.forEach(tokenType => {
        html = html.replace(
            new RegExp(`<span class="${tokenType}">(\\w+)</span>`, 'g'),
            `<span class="${tokenType} $1">$1</span>`
        )
    })



    html = html.replace(
        /([\w_$][\w_$\d]*)(\s*=\s*<span class="hljs-function)/g,
        '<span class="wlc-function-name hljs-title wlc-var-name">$1</span>$2'
    )

    // html = html.replace(
    //     /([^\\])\(/g,
    //     '$1<span class="wlc-parenthesis wlc-parenthesis-open">(</span>'
    // )

    // html = html.replace(
    //     /([^\\])\)/g,
    //     '$1<span class="wlc-parenthesis wlc-parenthesis-close">)</span>'
    // )

    html = html.replace(
        /([^\\])\[/g,
        '$1<span class="wlc-square-bracket wlc-square-bracket-open">[</span>'
    )

    html = html.replace(
        /([^\\])\]/g,
        '$1<span class="wlc-square-bracket wlc-square-bracket-close">]</span>'
    )

    html = html.replace(
        /([^\\])\{/g,
        '$1<span class="wlc-curly-brace wlc-curly-brace-open">{</span>'
    )

    html = html.replace(
        /([^\\])\}/g,
        '$1<span class="wlc-curly-brace wlc-curly-brace-close">}</span>'
    )



    const standardEscapeChars = [
        { escapedChar: 'n', cssClassName: 'new-line' },
        { escapedChar: 'r', cssClassName: 'carriage-return' },
        { escapedChar: 't', cssClassName: 'tab' },
        { escapedChar: '\'', cssClassName: 'single-quote' },
        { escapedChar: '"', cssClassName: 'double-quote' },
        { escapedChar: '/', cssClassName: 'forward-mark' },
        { escapedChar: '\\\\', cssClassName: 'backward-slash' },
    ]

    const regExpEscapeChars = [
        { escapedChar: 'w', cssClassName: 'regexp-selector-word' },
        { escapedChar: 'W', cssClassName: 'regexp-selector-non-word' },
        { escapedChar: 'd', cssClassName: 'regexp-selector-digit' },
        { escapedChar: 'D', cssClassName: 'regexp-selector-non-digit' },
        { escapedChar: 's', cssClassName: 'regexp-selector-whitespace' },
        { escapedChar: 'S', cssClassName: 'regexp-selector-non-whitespace' },
        { escapedChar: 'b', cssClassName: 'regexp-selector-boundary' },
        { escapedChar: 'B', cssClassName: 'regexp-selector-non-boundary' },
        // { escapedChar: '\\\\', cssClassName: 'regexp-selector-backward-slash' },
        { escapedChar: '\\?', cssClassName: 'regexp-selector-question-mark' },
        { escapedChar: '\\*', cssClassName: 'regexp-selector-asterisk' },
        { escapedChar: '\\+', cssClassName: 'regexp-selector-plus-sign' },
        { escapedChar: '\\.', cssClassName: 'regexp-selector-period' },
        { escapedChar: '\\(', cssClassName: 'regexp-selector-parenthesis parenthesis-open' },
        { escapedChar: '\\)', cssClassName: 'regexp-selector-parenthesis parenthesis-close' },
        { escapedChar: '\\[', cssClassName: 'regexp-selector-square-bracket square-bracket-open' },
        { escapedChar: '\\]', cssClassName: 'regexp-selector-square-bracket square-bracket-close' },
        { escapedChar: '\\{', cssClassName: 'regexp-selector-curly-brace curly-brace-open' },
        { escapedChar: '\\}', cssClassName: 'regexp-selector-curly-brace curly-brace-close' },
    ]

    const allEscapeChars = [
        ...standardEscapeChars,
        ...regExpEscapeChars,
    ]

    allEscapeChars.forEach(ec => {
        html = html.replace(
            new RegExp(`(\\\\${ec.escapedChar})`, 'g'),
            `<span class="wlc-escape-char ${ec.cssClassName}">\\<span class="escaped-char">${
                ec.escapedChar.startsWith('\\') ? ec.escapedChar.slice(1) : ec.escapedChar
            }</span></span>`
        )
    })

    html = html.replace(
        /<span class="wlc-curly-brace wlc-curly-brace-open">\{<\/span>(\d+)((,)(\d*))?<span class="wlc-curly-brace wlc-curly-brace-close">\}<\/span>/g,
        [
            '<span class="wlc-curly-brace wlc-curly-brace-open">{</span>',
            '<span class="wlc-digit-pair-between-curly-braces">',
            '<span class="digit digit-1">$1</span>',
            '<span class="comma">$3</span>',
            '<span class="digit digit-2">$4</span>',
            '</span>',
            '<span class="wlc-curly-brace wlc-curly-brace-close">}</span>',
        ].join('')
    )

    return html
}

function wrapHTMLChiefContentWithAnArticleTag(htmlOldChiefContent, options) {
    const {
        cssClassNameOfMarkdownChiefContentWrappingArticleTag,
        cssClassNameOfArticleTOCRootTag,
        markdownArticleHasTOC,
    } = options

    let articleStartTag

    if (cssClassNameOfMarkdownChiefContentWrappingArticleTag) {
        articleStartTag = `<article class="${cssClassNameOfMarkdownChiefContentWrappingArticleTag}">`
    } else {
        articleStartTag = '<article>'
    }


    let htmlNewChiefContent = `${tab1}${articleStartTag}\n${htmlOldChiefContent}`

    if (markdownArticleHasTOC) {
        const fullStringOfTOCRootStartTagByMarkdownItTOCDoneRight = `<nav class="${cssClassNameOfArticleTOCRootTag}">`

        htmlNewChiefContent = htmlNewChiefContent.replace(
            fullStringOfTOCRootStartTagByMarkdownItTOCDoneRight,

            `\n${
                tab1}</article>\n${
                tab1}${fullStringOfTOCRootStartTagByMarkdownItTOCDoneRight
            }`
        )
    } else {
        htmlNewChiefContent = `${
            htmlNewChiefContent
        }\n${tab1}</article>\n`
    }

    return htmlNewChiefContent
}
