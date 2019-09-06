const path = require('path')
const syncReadOneTextFile = require('../../utils/sync-read-one-text-file')
const chooseWrappingHTMLTagNameViaFileExt = require('../../utils/choose-wrapping-html-tag-name-via-file-ext')
const wrapContentsWithAPairOfHTMLTags = require('../../utils/wrap-file-content-with-an-pair-of-html-tags')

const joinPathPOSIX = path.posix.join


let rawHTMLBeginning = ''

const {
    htmlFromHeadEndToBodyBegin,
    htmlEnding,
} = require('../static/html')

const {
    allFileEntriesKeyingByFileNames: allModuleFileEntriesKeyingByFileNames,
    syncGetContentStringOfOneFileEntry: syncGetContentStringOfOneModuleFileEntry,
} = require('@wulechuan/css-stylus-markdown-themes')

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





module.exports = {
    syncGetSnippetEntryOfHTMLBeginning,
    syncGetSnippetEntryOfHTMLFromHeadEndToBodyBegin,
    syncGetSnippetEntryOfHTMLEnding,

    syncGetSnippetEntryOfOneModuleFileEntry,
    syncGetSnippetEntryOfOneExternalFile,
}






function syncGetSnippetEntryOfHTMLBeginning(options) {
    const {
        thisModuleRootFolderPath = '',
        htmlTagLanguage,
    } = options

    if (!rawHTMLBeginning) {
        rawHTMLBeginning = syncReadOneTextFile(
            joinPathPOSIX(thisModuleRootFolderPath, './source/snippets/raw-sources/begin.html')
        )
    }

    const entryKey = `HTML beginning snippet of language ${htmlTagLanguage}`

    const snippetsDict = allSnippetEntries.standard

    if (!snippetsDict[entryKey]) {
        const {
            htmlTagLanguage,
        } = options

        let htmlBeginning = rawHTMLBeginning

        if (
            typeof htmlTagLanguage === 'string' &&
            htmlTagLanguage.length > 1 &&
            htmlTagLanguage !== 'zh-hans-CN'
        ) {
            htmlBeginning = htmlBeginning.replace(
                '<html lang="zh-hans-CN">',
                `<html lang="${htmlTagLanguage}">`
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
        markdownArticleHasTOC,
        cssClassNameOfBodyTagWhenMarkdownArticleHasTOC,
    } = options

    if (markdownArticleHasTOC) {
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

/** The said module below is the "@wulechuan/css-stylus-markdown-themes" */
function syncGetSnippetEntryOfOneModuleFileEntry(fileName) {
    const { optional: optionalEntries } = allSnippetEntries

    if (!optionalEntries[fileName]) {
        const fileEntry = allModuleFileEntriesKeyingByFileNames[fileName]

        const wrappingTagName = chooseWrappingHTMLTagNameViaFileExt(fileName)
        const fileRawContent = syncGetContentStringOfOneModuleFileEntry(fileName)
        const fileWrappedContent = wrapContentsWithAPairOfHTMLTags({
            fileRawContent,
            wrappingTagName,
            shouldIndentContentsBy2Levels: true,
        })

        const snippetEntry = {
            content: fileWrappedContent,
            isStyleTag: wrappingTagName === 'style',
        }

        const { pairingJavascriptFileNames } = fileEntry

        if (pairingJavascriptFileNames) {
            snippetEntry.pairingJavascriptSnippetEntries = pairingJavascriptFileNames.map(
                syncGetSnippetEntryOfOneModuleFileEntry
            )
        }

        optionalEntries[fileName] = snippetEntry
    }

    return optionalEntries[fileName]
}

function syncGetSnippetEntryOfOneExternalFile(fileAbsolutePath) {
    const { optional: optionalEntries } = allSnippetEntries

    if (!optionalEntries[fileAbsolutePath]) {
        const wrappingTagName = chooseWrappingHTMLTagNameViaFileExt(fileAbsolutePath)
        const fileRawContent = syncReadOneTextFile(fileAbsolutePath)
        const fileWrappedContent = wrapContentsWithAPairOfHTMLTags({
            fileRawContent,
            wrappingTagName,
            shouldIndentContentsBy2Levels: true,
        })

        const snippetEntry = {
            content: fileWrappedContent,
            isStyleTag: wrappingTagName === 'style',
        }

        optionalEntries[fileAbsolutePath] = snippetEntry
    }

    return optionalEntries[fileAbsolutePath]
}
