const chalk = require('chalk')

const packageJSONOfThisModule = require('./package.json')

const peerDependencyModuleName = '@wulechuan/css-stylus-markdown-themes'

const createOneMarkdownToHTMLConerter = require('./core')

let generateFullHTMLStringViaMarkdownString

try {
    const {
        allFileEntriesKeyingByFileNames: themesPeerPackageAllDistFileEntriesKeyingByFileNames,
        syncGetContentStringOfOneFileEntry: syncGetContentStringOfOneFileOfThePeerModuleOfThemes,
    } = require(peerDependencyModuleName)

    generateFullHTMLStringViaMarkdownString = createOneMarkdownToHTMLConerter({
        themesPeerPackageAllDistFileEntriesKeyingByFileNames,
        syncGetContentStringOfOneFileOfThePeerModuleOfThemes,
    })
} catch (err) {
    console.log('-'.repeat(79))
    console.log(chalk.yellow(`The module "${
        chalk.green(packageJSONOfThisModule.name)
    }" requires a peer dependency \nnamed "${
        chalk.white.bgRed(peerDependencyModuleName)
    }" to install! So please try either \nof the lines below in your CLI:`))
    console.log('')
    console.log(chalk.green(`    npm  i      ${peerDependencyModuleName}`))
    console.log(chalk.green(`    npm  i  -D  ${peerDependencyModuleName}`))
    console.log('')
    console.log('-'.repeat(79))

    throw(err)
}






/**
 * @typedef {object} converterConversionPreparationOptions
 * @property {boolean} shouldNotAutoInsertTOCPlaceholderIntoMarkdown
 */


/**
 * @typedef {object} converterConversionOptions
 * @property {boolean} shouldNotBuildHeadingPermanentLinks
 * @property {string} headingPermanentLinkSymbolChar
 * @property {string} cssClassNameOfHeadingPermanentLinks
 * @property {string} cssClassNameOfArticleTOCRootTag
 * @property {string} cssClassNameOfArticleTOCLists
 * @property {string} cssClassNameOfArticleTOCListItems
 * @property {string} cssClassNameOfArticleTOCItemAnchors
 * @property {boolean} articleTOCListTagNameIsUL
 * @property {number} articleTOCBuildingHeadingLevelStartsFrom
 */


/**
 * @typedef {object} converterManipulationsOverHTMLOptions
 * @property {boolean} shouldNotInsertBackToTopAnchor
 * @property {boolean} shouldNotUseInternalCSSThemingFiles
 * @property {boolean} shouldUseUnminifiedVersionOfInternalCSS
 * @property {boolean} shouldUseUnminifiedVersionOfInternalJavascriptIfAny
 * @property {string} htmlTagLanguage
 * @property {string} htmlTitleString
 * @property {string} internalCSSFileNameOfThemeWithTOC
 * @property {string} internalCSSFileNameOfTheme
 * @property {string} cssClassNameOfBackToTopAnchor
 * @property {string} cssClassNameOfBodyTagWhenMarkdownArticleHasTOC
 * @property {string} cssClassNameOfMarkdownChiefContentWrappingArticleTag
 * @property {object[]} desiredReplacementsInHTML
 * @property {string[]} absolutePathsOfExtraFilesToEmbedIntoHTML
 */


/**
 * @typedef {object} converterSundryOptions
 * @property {boolean} shouldConsoleLogsInChinese
 * @property {boolean} shouldDisableCachingForInternalThemeFiles
 */


/**
 * @exports
 * @function generateFullHTMLStringViaMarkdownString
 * @arg {string} markdownContent
 * @arg {object} options
 * @arg {boolean} options.shouldLogVerbosely
 * @arg {converterConversionPreparationOptions} options.conversionPreparations
 * @arg {converterConversionOptions} options.conversionOptions
 * @arg {converterManipulationsOverHTMLOptions} options.manipulationsOverHTML
 * @arg {converterSundryOptions} options.sundries
 * @returns {string} - Full HTML contents
 */
module.exports = generateFullHTMLStringViaMarkdownString

