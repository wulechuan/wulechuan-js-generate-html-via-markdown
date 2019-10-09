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

        cssClassNameOfArticleTOCRootTag:     'markdown-article-toc',
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

            What's more, I perposely hide level 4 or deeper items in the TOC, via CSS rules.
            This means although the HTML tags of ALL LEVELS DO EXIST, but from level 4 onwards,
            their are not visible.
        */
        articleTOCBuildingHeadingLevelStartsFrom: 2, // Pay attention that I take 2 as a default value.
        articleTOCListTagNameIsUL: false,
    },

    manipulationsOverHTML: {
        shouldNotReplaceLineBreaksInCodeTagsWithBrTags: false,
        shouldNotInsertBackToTopAnchor: false,
        shouldNotUseInternalCSSThemingFiles: false,
        shouldUseUnminifiedVersionOfInternalCSS: false,
        shouldUseUnminifiedVersionOfInternalJavascriptIfAny: false,

        htmlTagLanguage: '', // By default it's an empty string. This means `'zh-hans-CN'` is used, according to the `begin.html`.
        htmlTitleString: '', // By default it's an empty string. This means to extract content of the first met <h1/> as the content of the <title/> tag.

        internalCSSFileNameOfTheme:        'wulechuan-styles-for-html-via-markdown.default--no-toc.min.css',
        internalCSSFileNameOfThemeWithTOC: 'wulechuan-styles-for-html-via-markdown.default--with-toc.min.css',

        /*
            These two properties are deprecated. Take the two above instead.
            Once the corresnponding property shown above is set, the one shown below is ignored.
        */
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
                from: /\s+href="([^#])/gi,
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

    /* [ DEPRECATED ]
        Deprecated because of two typos.
        Please avoid using this object.
    */
    // behaviousOfBuiltInTOC: {
    //     shouldShowOnlyTwoLevelsOfTOCItemsAtMost: false,
    //     atBeginingShouldCollapseAllTOCItemsOfLevelsGreaterThan: 1,
    //     atBeginingShouldExpandTOCWhenWindowsIsWideEnough: false,
    // },

    behavioursOfBuiltInTOC: {
        shouldShowOnlyTwoLevelsOfTOCItemsAtMost: false,
        atBeginingShouldCollapseAllTOCItemsOfLevelsGreaterThan: 1,
        atBeginingShouldExpandTOCWhenWindowIsWideEnough: false, // "Window" instead of "Windows".
    },

    sundries: {
        shouldConsoleLogsInChinese: false,
        shouldDisableCachingForInternalThemeFiles: false,
        shouldDisableCachingForExternalFiles: false,
    },
}
