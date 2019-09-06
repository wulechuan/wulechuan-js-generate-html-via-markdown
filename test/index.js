const {
    readFileSync,
    writeFileSync,
} = require('fs')

const markdownToHTMLConverter = require('..')


const markdownContent = '# Test article\n\n## this is heading 2\n\n### this is heading 3\n\nthis is a sentence.\n\n'



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
        shouldNotUseInternalCSSThemingFiles: true,
        htmlTitleString: 'Test 3',
        htmlTagLanguage: 'en-US',
        shouldNotInsertBackToTopAnchor: true,
    },

    sundries: {
        shouldConsoleLogsInChinese: true,
    },
})

const readMeHTMLContent = markdownToHTMLConverter(
    readFileSync('./ReadMe.zh-hans-CN.md').toString()
)

writeFileSync('./test/output/test1.html', htmlContent1)
writeFileSync('./test/output/test2.html', htmlContent2)
writeFileSync('./test/output/test3.html', htmlContent3)

writeFileSync('./test/output/readme.zh-hans-cn.html', readMeHTMLContent)

