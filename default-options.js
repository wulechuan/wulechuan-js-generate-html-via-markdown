module.exports = {
    shouldLogVerbosely: false,

    conversionPreparations: {
        shouldNotAutoInsertTOCPlaceholderIntoMarkdown: false,
    },

    conversionOptions: {
        shouldNotBuildHeadingPermanentLinks: false,
        headingPermanentLinkSymbolChar: '§',

        /*
            This property is mapped on the "permalinkClass" property
            of the "markdown-it-anchor" plugin.
            The default value is "header-anchor".

            My internal CSS uses the default value.
        */
        cssClassNameOfHeadingPermanentLinks: undefined,

        cssClassNameOfArticleTOCRootTag: 'markdown-article-toc',
        cssClassNameOfArticleTOCLists:       undefined, // <ul>s and <ol>s
        cssClassNameOfArticleTOCListItems:   undefined, // <li>s
        cssClassNameOfArticleTOCItemAnchors: undefined, // <a>s under <li>s

        /*
            "articleTOCBuildingHeadingLevelStartsFrom" is mapped
            upon the "level" property of the "markdown-it-toc-done-right" plugin.
            It basically means to build TOC items from the headings of this
            level downwards.

            For example:
                Say this value is 2.
                Then NONE of the <h1/>s will have its corresponding item in the TOC.
                While all <h2/>s, <h3/>s, ... etc, will have theirs in the TOC.
        */
        articleTOCBuildingHeadingLevelStartsFrom: 2, // I take 2 as default value.
        articleTOCListTagNameIsUL: false,
    },

    manipulationsOverHTML: {
        shouldNotInsertBackToTopAnchor: false,
        shouldNotUseInternalCSSThemingFiles: false,

        htmlTagLanguage: '', // By default it's an emepty string. This means it will be `'zh-hans-CN'`, according to the `begin.html`.
        htmlTitleString: '', // By default it's an emepty string. This means to extract content of the first met <h1/> as the content of the <title/> tag.

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

            For example:
            To make opening methods of all external links to be "_blank".
            {
                from: /\s+href="([!#])/gi,
                to: ' target="_blank" href="$1',
            },

            Another example:
            To batch replace some href values.
            {
                from: /\s+href="\.\/course-examples\//gi,
                to: ' href="../public/assets/course-examples/',
            },
        */
        ],

        absolutePathsOfExtraFilesToEmbedIntoHTML: [],
    },

    sundries: {
        shouldConsoleLogsInChinese: false,
    },
}
