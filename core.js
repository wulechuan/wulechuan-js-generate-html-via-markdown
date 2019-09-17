const path = require('path')
const { rerequire } = require('./source/utils/rerequired-file')

const MarkDownIt = require('markdown-it')

const markdownItPluginHighlightJs  = require('markdown-it-highlightjs')
const markdownItPluginCheckbox     = require('markdown-it-checkbox')
const markdownItPluginAnchor       = require('markdown-it-anchor')
const markdownItPluginTOCDoneRight = require('markdown-it-toc-done-right')


const joinPathOSLocalStyle = path.join

const thisModuleRootFolderPath = path.dirname(require.resolve('./package.json'))












/**
 * @param {object} options
 * @param {object} options.themesPeerPackageAllDistFileEntriesKeyingByFileNames
 * @param {function} options.syncGetContentStringOfOneFileOfThePeerModuleOfThemes
 * @returns {function} - The core converter function
 */
module.exports = function createOneConverterOfMarkdownToHTML(options = {}) {
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
        defaultOptionValues = require('./default-options')

        const tabs = require('./source/snippets/static/tabs')
        tab1 = tabs.tab1


        insertTOCMarkDownTagIfNecessary = require(
            './source/0-markdown-string-processors/insert-toc-placeholder'
        )

        buildHTMLTitleSnippetString = require(
            './source/1-html-string-processors/build-html-title-tag'
        )

        wrapHTMLChiefContentWithAnArticleTag = require(
            './source/1-html-string-processors/wrap-chief-content-with-article-tag'
        )

        processAllContentsOfAllPreTagsOfHTMLString = require(
            './source/1-html-string-processors/process-contents-of-all-pre-tags'
        )
    }





    const { // Reading these files only once is enough. Saving time.
        syncGetSnippetEntryOfHTMLBeginning,
        syncGetSnippetEntryOfHTMLFromHeadEndToBodyBegin,
        syncGetSnippetEntryOfHTMLEnding,

        syncGetSnippetEntryOfOneFileOfThePeerModuleOfThemes,
        syncGetSnippetEntryOfOneExternalFile,
    } = require('./source/snippets/dynamic/create-snippet-entry-getters')({
        themesPeerPackageAllDistFileEntriesKeyingByFileNames,
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


        if (shouldReloadModulesForDevWatchingMode) {
            defaultOptionValues = rerequire(joinPathOSLocalStyle(
                thisModuleRootFolderPath,
                'default-options.js'
            ))

            const tabs = rerequire(joinPathOSLocalStyle(
                thisModuleRootFolderPath,
                '/source/snippets/static/tabs.js'
            ))
            tab1 = tabs.tab1

            insertTOCMarkDownTagIfNecessary = rerequire(joinPathOSLocalStyle(
                thisModuleRootFolderPath,
                './source/0-markdown-string-processors/insert-toc-placeholder.js'
            ))

            buildHTMLTitleSnippetString = rerequire(joinPathOSLocalStyle(
                thisModuleRootFolderPath,
                './source/1-html-string-processors/build-html-title-tag.js'
            ))

            wrapHTMLChiefContentWithAnArticleTag = rerequire(joinPathOSLocalStyle(
                thisModuleRootFolderPath,
                './source/1-html-string-processors/wrap-chief-content-with-article-tag.js'
            ))

            processAllContentsOfAllPreTagsOfHTMLString = rerequire(joinPathOSLocalStyle(
                thisModuleRootFolderPath,
                './source/1-html-string-processors/process-contents-of-all-pre-tags.js'
            ))
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
        const markdownArticleHasTOC = markdownContentHasTOCPlaceholder

        let htmlContentViaMarkDownContent = markdownItParser.render(finalMarkdownContent)
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


        htmlContentViaMarkDownContent = processAllContentsOfAllPreTagsOfHTMLString(
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
