module.exports = {
    shouldLogVerbosely: false,

    conversionPreparations: {
        shouldNotAutoInsertTOCPlaceholderIntoMarkdown: false,
    },

    conversionOptions: {
        shouldNotBuildHeadingPermanentLinks: false,
        headingPermanentLinkSymbolChar: '§',

        cssClassNameOfHeadingPermanentLinks: undefined, // Take the default value of "markdown-it-anchor"'s "permalinkClass"

        cssClassNameOfArticleTOCRootTag: 'markdown-article-toc',
        cssClassNameOfArticleTOCLists:       undefined, // <ul>s and <ol>s
        cssClassNameOfArticleTOCListItems:   undefined, // <li>s
        cssClassNameOfArticleTOCItemAnchors: undefined, // <a>s under <li>s

        /*
            To build TOC from heading of this level downwards.

            For example:
                Say this value is 2.
                Then NONE of the <h1/>s will have its corresponding item in the TOC.
                While all <h2/>s, <h3/>s, ... etc, will have theirs in the TOC.
        */
        articleTOCBuildingHeadingLevelStartsFrom: 2,
        articleTOCListTagNameIsUL: false,
    },

    manipulationsOverHTML: {
        shouldNotInsertBackToTopAnchor: false,
        shouldNotUseInternalCSSThemingFiles: false,

        htmlTagLanguage: '', // Which means `'zh-hans-CN'`, according to the `begin.html`.
        htmlTitleString: '', // Which means to extract content of the first met <h1/>.

        moduleCSSFileNameOfDefaultTheme:        'wulechuan-styles-for-html-via-markdown.default--no-toc.min.css',
        moduleCSSFileNameOfDefaultThemeWithTOC: 'wulechuan-styles-for-html-via-markdown.default--with-toc.min.css',

        cssClassNameOfMarkdownChiefContentWrappingArticleTag: 'markdown-article',
        cssClassNameOfBodyTagWhenMarkdownArticleHasTOC:       'markdown-article-toc-exists',
        cssClassNameOfBackToTopAnchor:                        'markdown-article-back-to-top',

        desiredReplacementsInHTML: [
            /*
                {
                    from: <string or RegExp>,
                    to:   <string>,
                },
            */
        ],

        absolutePathsOfExtraFilesToEmbedIntoHTML: [],
    },

    sundries: {
        shouldConsoleLogsInChinese: false,
    },
}
