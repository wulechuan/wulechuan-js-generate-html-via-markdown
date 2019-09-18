# Wulechuan's Tool for Generating HTMLs via Markdowns

## Multilingual Editions of this Article

- [简体中文版文档](./ReadMe.zh-hans-CN.md)




## NPM Page

<dl>
<dt>Package Name</dt>
<dd>

[@wulechuan/generate-html-via-markdown](https://www.npmjs.com/package/@wulechuan/generate-html-via-markdown)

</dd>
<dt>Author</dt>
<dd><p>wulechuan (南昌吴乐川)</p></dd>
</dl>




## Introduction

Yet another tool for converting MarkDown content into corresponding HTML content, but with gorgeous themes applied to the output HTML by default. The HTML includes both CSS rules and Javascript codes. **Thus, when deliver your article with the help of this tool, a single HTML file would be enough.**

> The Javascript codes are for the behviours of the table of contents(TOC) part.

> Note that although all CSS and Javascript contents are embeded, images are still external resources to the HTML.

This tool utilizes the ecosystem of the famous tool, "[markdownIt](https://www.npmjs.com/package/markdown-it)".

**You provide a string of MarkDown, you get a string of HTML.**

No need to provide literally anything, you get a full featured HTML. Including gorgeous themes, and responsive layout fitting all sizes of screens, and TOC with smart behaviours, and the pretty "back-to-top" button(an anchor in fact).

There're plenty of options which provide full controls over the ouptut HTML contents. Whether the TOC exists? Whether the "back-to-top" button exists? Whether the embedded CSS codes are minified or not? What about the Javascript codes, should they be minified? Everything is under your controls.


### Built-in Themes

The CSS file for the built-in theming is from another NPM package of mine, named "[@wulechuan/css-stylus-markdown-themes](https://www.npmjs.com/package/@wulechuan/css-stylus-markdown-themes)". See some pictures of an example article with the default theme applied [there](https://github.com/wulechuan/wulechuan-themes-for-htmls-via-markdowns/blob/master/docs/refs/en-US/application-examples.md).

> IMPORTANT:
>
> This package "@wulechuan/generate-html-via-markdown"(package A) peer-depends upon the css theming pacakge(package B) said above.
> This means when installing pacakge A, npm will **NOT** automatically install package B as well, but rather print some warning messages after installation of package A. **YOU MUST INSTALL PACKAGE B MANUALLY YOURSELF**.



### Gulpjs Workflow Adaptor

Alongside this npm package, I also maintain another npm package, named [@wulechuan/gulp-markdown-to-html](https://www.npmjs.com/package/@wulechuan/gulp-markdown-to-html). Let's call it package A. The package perfectly fit the workflows provided by the [Gulpjs](https://gulpjs.com) ecosystem. The package A utilizes this npm package internally to convert Markdown files into HTML files in batch.

## Usage

### Example 1

Use it without any options. By default, you get everything, the CSS theming, the TOC with behaviours, the "back-to-top" button(an anchor in fact), etc.

```js
const markdownToHTMLConverter = require('@wulechuan/generate-html-via-markdown')

const markdownContent = '# Test article\n\n## this is heading 2\n\n### this is heading 3\n\nthis is a sentence.\n\n'

/********************************************************************/
/**/ const htmlContent = markdownToHTMLConverter(markdownContent) /**/
/********************************************************************/
```

### Example 2

To output a really "pure" HTML document. No CSS, no TOC, no "back-to-top" button(an anchor in fact), no Javascript, no nothing.

```js
const {
    readFileSync,
    writeFileSync,
} = require('fs')

const markdownToHTMLConverter = require('@wulechuan/generate-html-via-markdown')
const markdownContent = readFileSync('my-article.md').toString()

const htmlContent = markdownToHTMLConverter(markdownContent, {
    shouldLogVerbosely: true,

    conversionPreparations: {
        shouldNotAutoInsertTOCPlaceholderIntoMarkdown: true,
    },

    conversionOptions: {
        shouldNotBuildHeadingPermanentLinks: true,
    },

    manipulationsOverHTML: {
        shouldNotUseInternalCSSThemingFiles: true,
        htmlTitleString: 'A really simple HTML document',
        htmlTagLanguage: 'en-US',
        shouldNotInsertBackToTopAnchor: true,
    },
})

writeFileSync('my-article.html', htmlContent)
```

### Example 3

To use your custom CSS file as an embed theme in the output HTML string.

```js
const {
    readFileSync,
    writeFileSync,
} = require('fs')

const markdownToHTMLConverter = require('@wulechuan/generate-html-via-markdown')
const markdownContent = readFileSync('my-writings.md').toString()

const htmlContent = markdownToHTMLConverter(markdownContent, {
    manipulationsOverHTML: {
        // 1) Disable internal CSS
        shouldNotUseInternalCSSThemingFiles: true,
    },

    absolutePathsOfExtraFilesToEmbedIntoHTML: [
        // 2) Use your own CSS
        '/d/my/work/folder/some/theme/my-splendid-theme.css',

        // 3) [Optional] Maybe you also need to use your own js
        '/d/my/work/folder/some/theme/my-splendid-theme.actions.js',
    ],
})

writeFileSync('my-writings.html', htmlContent)
```



## API

### Chief Function

The chief function is an anounymous function. So we often need to give it a name before we can invoke it.

Say we name the chief function `mardownToHTMLConverter`, as shown below.

```js
const markdownToHTMLConverter = require('@wulechuan/generate-html-via-markdown')
```

### Interface of the Chief Function

```js
const htmlString = markdownToHTMLConverter(markdownString, options)
```

#### Arguments

- markdownString

    A string, treated as an article written in MarkDown language.


- options

    All in the `./default-options.js` file.

    I've copy & paste the full(almost) content of the `./default-options.js` below.

    ```js
    {
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
            cssClassNameOfArticleTOCLists:       undefined, // <ul>s or <ol>s
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
            shouldNotInsertBackToTopAnchor: false,
            shouldNotUseInternalCSSThemingFiles: false,
            shouldUseUnminifiedVersionOfInternalCSS: false,
            shouldUseUnminifiedVersionOfInternalJavascriptIfAny: false,

            htmlTagLanguage: '', // By default it's an emepty string. This means it will be `'zh-hans-CN'`, according to the `begin.html`.
            htmlTitleString: '', // By default it's an emepty string. This means to extract content of the first met <h1/> as the content of the <title/> tag.

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
            shouldDisableCachingForInternalThemeFiles: false,
            shouldDisableCachingForExternalFiles: false,
        },
    }
    ```


#### Return Value

A string, containing a full HTML document. By full, I mean the HTML includes CSS codes and Javascript codes if any. No more external `.css` files nor `.js` files are needed.

> But images are still treated as external resources.

> This return value is **not** a file, but a string rather. To write the HTML document onto your hard driver, use a function like `writeFile` or `writeFileSync`.


## TODOS

Nothing at present.



## License

WTFPL

> NOTE:
>
> I'm not an expert about license types. So I temporarily use WTFPL. But I guess this type of license might conflict with the ones used by those npm packages I'm utilizing.
