const chalk = require('chalk')

const MarkDownIt = require('markdown-it')

const markdownItPluginHighlightJs  = require('markdown-it-highlightjs')
const markdownItPluginCheckbox     = require('markdown-it-checkbox')
const markdownItPluginAnchor       = require('markdown-it-anchor')
const markdownItPluginTOCDoneRight = require('markdown-it-toc-done-right')

const {
    tab1,
    // tab2,
} = require('../snippets/static/tabs')

const { // Reading these files only once is enough. Saving time.
    syncGetSnippetEntryOfHTMLBeginning,
    syncGetSnippetEntryOfHTMLFromHeadEndToBodyBegin,
    syncGetSnippetEntryOfHTMLEnding,

    syncGetSnippetEntryOfOneModuleFileEntry,
    syncGetSnippetEntryOfOneExternalFile,
} = require('../snippets/dynamic/get-one-snippet-entry')

const defaultOptionValues = require('../../default-options')









module.exports = function createOneMarkdownToHTMLConerter(options = {}) {
    const {
        thisModuleRootFolderPath,
    } = options


    return function buildFullHTMLStringViaMarkDownString(markdownContent, options = {}) {
        const {
            shouldLogVerbosely,
        } = options

        let {
            conversionPreparations = {},
            conversionOptions = {},
            manipulationsOverHTML = {},
            sundries = {},
        } = options




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

            htmlTagLanguage,
            htmlTitleString,

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

        markdownItParser.use(markdownItPluginAnchor, {
            permalink: !shouldNotBuildHeadingPermanentLinks,
            permalinkClass: cssClassNameOfHeadingPermanentLinks,
            permalinkBefore: true,
            permalinkSymbol: headingPermanentLinkSymbolChar,
        })

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


        let allEmbeddingSnippetEntries = []





        let themingCSSFileEntryKey

        if (!shouldNotUseInternalCSSThemingFiles) {
            if (markdownArticleHasTOC) {
                themingCSSFileEntryKey = moduleCSSFileNameOfDefaultThemeWithTOC
            } else {
                themingCSSFileEntryKey = moduleCSSFileNameOfDefaultTheme
            }
        }


        if (themingCSSFileEntryKey) {
            const snippetEntryOfThemingCSS = syncGetSnippetEntryOfOneModuleFileEntry(themingCSSFileEntryKey)

            allEmbeddingSnippetEntries = [
                ...allEmbeddingSnippetEntries,
                snippetEntryOfThemingCSS,
            ]

            if (snippetEntryOfThemingCSS.pairingJavascriptSnippetEntries) {
                allEmbeddingSnippetEntries = [
                    ...allEmbeddingSnippetEntries,
                    ...snippetEntryOfThemingCSS.pairingJavascriptSnippetEntries,
                ]
            }
        }


        allEmbeddingSnippetEntries = [
            ...allEmbeddingSnippetEntries,
            ...absolutePathsOfExtraFilesToEmbedIntoHTML
                .map(syncGetSnippetEntryOfOneExternalFile)
                .filter(entry => !!entry),
        ]

        const allSnippetEntriesOfAllCSS         = allEmbeddingSnippetEntries.filter(entry =>  entry.isStyleTag)
        const allSnippetEntriesOfAllJavascripts = allEmbeddingSnippetEntries.filter(entry => !entry.isStyleTag)








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
