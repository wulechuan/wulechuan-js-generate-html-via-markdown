<link rel="stylesheet" href="./dist/css/wulechuan-styles-for-html-via-markdown--vscode.default.min.css">

# Wulechuan's Tool for Generating HTMLs via Markdowns

[简体中文版文档](./ReadMe.zh-hans-cn.md)




## npm Page

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

> Note that even if the CSS and Javascript are all embeded, images are still external resources to the HTML.

You provide a string of MarkDown, you get a string of HTML.

### Built-in Themes

The CSS file for the built-in theming is from another NPM package of mine, aka "[@wulechuan/css-stylus-markdown-themes](https://www.npmjs.com/package/@wulechuan/css-stylus-markdown-themes)". See some pictures of an example article with the default theme applied [there](https://github.com/wulechuan/wulechuan-themes-for-htmls-via-markdowns/blob/master/docs/refs/en-US/application-examples.md).

## Usage

### Example 1

```js
const markdownToHTMLConverter = require('@wulechuan/generate-html-via-markdown')
const markdownContent = '# Test article\n\n## this is heading 2\n\n### this is heading 3\n\nthis is a sentence.\n\n'
const htmlContent = markdownToHTMLConverter(markdownContent)
```

### Example 2

```js
const {
    readFileSync,
    writeFileSync,
} = require('fs')

const markdownToHTMLConverter = require('@wulechuan/generate-html-via-markdown')
const markdownContent = readFileSync('my-article.md').toString()

const htmlContent = markdownToHTMLConverter(markdownContent, {
    shouldLogVerbosely: true,

    conversionOptions: {
        shouldNotBuildHeadingPermanentLinks: true,
    },

    manipulationsOverHTML: {
        shouldNotUseInternalCSSThemingFiles: true,
        htmlTitleString: 'Test 3',
        htmlTagLanguage: 'en-US',
        shouldNotInsertBackToTopAnchor: true,
    },

    absolutePathsOfExtraFilesToEmbedIntoHTML: [
        '/d/my/work/folder/some/theme/my-splendid-theme.css',
        '/d/my/work/folder/some/theme/my-splendid-theme.actions.js',
    ],
})

writeFileSync('my-article.html', htmlContent)
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

    A string, treated as an article write in MarkDown language.


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

            cssClassNameOfHeadingPermanentLinks: '', // Take the default value of "markdown-it-anchor"'s "permalinkClass"

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
