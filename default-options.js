module.exports = {
    conversionPreparations: {
        shouldNotAutoInsertTOCPlaceholderIntoMarkdown: false,
    },

    conversionOptions: {
        headingPermanentLinkSymbolChar: '§',
        cssClassNameOfMarkdownTOCRootTag: 'markdown-article-toc',

        /*
            To build TOC from heading of this level downwards.

            For example:
                If this value is 2, then none of the <h1/>s will
                have an corresponding link in the TOC.
                While <h2/>s, <h3/>s, ... etc
                will have theirs in the TOC.
        */
        tocBuildingHeadingLevelStartsFrom: 2,
    },

    manipulationsOverHTML: {
        shouldNotInsertBackToTopAnchor: false,
        shouldNotUseInternalCSSThemingFiles: false,

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
}
