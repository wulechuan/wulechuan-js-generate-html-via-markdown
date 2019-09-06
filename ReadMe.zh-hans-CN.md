<link rel="stylesheet" href="./dist/css/wulechuan-styles-for-html-via-markdown--vscode.default.min.css">

# 吴乐川的将 MarkDown 代码转换为 HTML 代码的工具


## Multilingual Editions of this Article

- [English version of this ReadMe](ReadMe.md)




## NPM 页

<dl>
<dt>NPM 包名</dt>
<dd>

[@wulechuan/generate-html-via-markdown](https://www.npmjs.com/package/@wulechuan/generate-html-via-markdown)

</dd>
<dt>作者</dt>
<dd><p>南昌吴乐川</p></dd>
</dl>





## 简介

本工具借助 [markdownIt](https://www.npmjs.com/package/markdown-it) 生态的工具集，可将一段 MarkDown 内容转化成对应的 HTML 内容。本工具还在输出的完整 HTML 内容中，内嵌了精美的 CSS 样式集和 Javascript 代码。**故，当你借助本工具来制作你的文章的可分发版本时，单一的完整 HTML 文档即可独立运转。**

> 其中的 Javascript 代码用于控制【文章纲要列表】之行为。

> 尽管样式和脚本均已完整包含其中，但图片文件仍为改 HTML 文档的外部资源，须正确对应引用路径。

简而言之，输入一个 MarkDown 字符串，得到一个 HTML 字符串。

### 内嵌样式

内嵌样式来源于本人创建和为何的另一项目，即《[@wulechuan/css-stylus-markdown-themes](https://www.npmjs.com/package/@wulechuan/css-stylus-markdown-themes)》。其文档中亦有若干截图，直观展示一篇文档在应用默认样式后之样貌。见 [该文档](https://github.com/wulechuan/wulechuan-themes-for-htmls-via-markdowns/blob/master/docs/refs/zh-hans-CN/application-examples.md).

## 用法

### 示例 1

```js
const markdownToHTMLConverter = require('@wulechuan/generate-html-via-markdown')
const markdownContent = '# Test article\n\n## this is heading 2\n\n### this is heading 3\n\nthis is a sentence.\n\n'
const htmlContent = markdownToHTMLConverter(markdownContent)
```

### 示例 2

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

### 主函数

主函数为一个**匿名函数**。因此，欲调用之，不妨先将其命名。

如下例所示，我将其命名为 `mardownToHTMLConverter`。

```js
const markdownToHTMLConverter = require('@wulechuan/generate-html-via-markdown')
```

### 主函数接口

```js
const htmlString = markdownToHTMLConverter(markdownString, options)
```

#### 入口参数

- markdownString

    一个字符串，其被视为一篇采用 MarkDown 语言撰写的文章。


- options

    `./default-options.js` 文件已尽述之。请参阅。

    我已将 `./default-options.js` 文件的（几乎）完整内容复制如下：

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


#### 返回值

一个字符串，内容为一篇完整的 HTML 文档，包含 CSS 和 Javascript。不需任何外部链接的样式或脚本文件。

> 尽管样式和脚本均已完整包含其中，但图片文件仍为改 HTML 文档的外部资源，须正确对应引用路径。

> 千万注意！改返回值是一个字符串，**而不是**一个文件。欲将该字符串写入磁盘永久保存，请在你自己的脚本中另行调用诸如 `writeFile` 或 `writeFileSync` 的函数。另，文件扩展名应为 `html`。





## 未来计划

暂无。


## 许可证类型

WTFPL

> 注意：
>
> 我未研究过许可证的约束。因此姑且声明为 WTFPL 类型。但实际上该许可证类型可能与我采用的开源模块有冲突。

