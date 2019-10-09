const {
    readFileSync,
    writeFileSync,
    existsSync,
    mkdirSync,
} = require('fs')

const path = require('path')

const markdownToHTMLConverter = require('..')


const markdownContent = '# Test article\n\n## This is heading 2\n\n### This is heading 3\n\nThis is a sentence.\n\n'



const htmlContent1 = markdownToHTMLConverter(markdownContent)

const htmlContent2 = markdownToHTMLConverter(markdownContent, {
    conversionOptions: {
        articleTOCBuildingHeadingLevelStartsFrom: 1,
    },
})

const htmlContent3 = markdownToHTMLConverter(markdownContent, {
    shouldLogVerbosely: true,

    conversionPreparations: {
        shouldNotAutoInsertTOCPlaceholderIntoMarkdown: true,
    },

    conversionOptions: {
        shouldNotBuildHeadingPermanentLinks: true,
    },

    manipulationsOverHTML: {
        shouldNotReplaceLineBreaksInCodeTagsWithBrTags: true,
        shouldNotUseInternalCSSThemingFiles: true,
        htmlTitleString: 'A really simple HTML document',
        htmlTagLanguage: 'en-US',
        shouldNotInsertBackToTopAnchor: true,
    },

    sundries: {
        shouldConsoleLogsInChinese: true,
    },
})

const readMeHTMLContent = markdownToHTMLConverter(
    readFileSync('./ReadMe.zh-hans-CN.md').toString(),
    {
        manipulationsOverHTML: {
            shouldUseUnminifiedVersionOfInternalCSS: false,
            shouldUseUnminifiedVersionOfInternalJavascriptIfAny: true,
        },
    }
)

const joinPathPOSIX = path.posix.join
const testsOutputPath1 = './tests/output'
const testsOutputPath2 = joinPathPOSIX(testsOutputPath1, 'other-tests')

if (!existsSync(testsOutputPath1)) {
    mkdirSync(testsOutputPath1)
}

if (!existsSync(testsOutputPath2)) {
    mkdirSync(testsOutputPath2)
}

writeFileSync(joinPathPOSIX(testsOutputPath2, 'test1.html'), htmlContent1)
writeFileSync(joinPathPOSIX(testsOutputPath2, 'test2.html'), htmlContent2)
writeFileSync(joinPathPOSIX(testsOutputPath2, 'test3.html'), htmlContent3)

writeFileSync(joinPathPOSIX(testsOutputPath1, 'readme.zh-hans-cn.html'), readMeHTMLContent)
