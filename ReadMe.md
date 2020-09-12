<link rel="stylesheet" href="./node_modules/@wulechuan/css-stylus-markdown-themes/dist/css/wulechuan-styles-for-html-via-markdown--vscode.default.min.css">


# 吴乐川的将 MarkDown 代码转换为 HTML 代码的工具


## Multilingual Editions of this Article

- [English version of this ReadMe](./documents/ReadMes/ReadMe.en-US.md)




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

本工具借助 [markdownIt](https://www.npmjs.com/package/markdown-it) 生态的工具集，可将一段 MarkDown 内容（一个字符串）转化成对应的 HTML 内容（另一字符串）。

当采用完全默认的配置项时，本工具还会在输出的 HTML 内容中，内嵌精美的 CSS 样式集和 JavaScript 代码。**故，当借助本工具来制作一篇文章的“可分发版本”时，本工具产生的单一的 HTML 文档即可独立运转。**

> - HTML 中包含【文章目录】、“返回顶部”按钮（实则链接）等方便实用的功能。
>
>   > 【文章目录】，亦称【文章纲要】，即外国话所谓 TOC。
>
> - 其中的 Javascript 代码用于控制【文章目录】之行为。
> - 其内嵌样式另文章排版完全自动适应各型宽窄屏幕尺寸。
> - 于最终产生的单一 HTML 内容，尽管样式和脚本均已完整包含其中，但图片、视频文件仍为该 HTML 文档的外部资源，须确保这些外部资源文件存在，且在 HTML 中配以正确的引用路径。

**简而言之，对本工具输入一个 MarkDown 字符串，其产生一个 HTML 字符串。**

不须带任何参数，即可轻松获得一份华丽的 HTML 文档。其自带精美主题。

你亦可通过丰富的参数项，精准控制输出 HTML 之方方面面。从有否【文章目录】、“返回顶部”按钮，到是否采用来自您自定义 CSS 文件中的 CSS 内容替换掉默认的 CSS。您甚至可以控制内嵌 CSS 和 Javascript 是否为压缩过的版本。


### 内嵌样式

产生的 HTML 文章中，内嵌样式来源于本人创建和维护的另一项目，即《[@wulechuan/css-stylus-markdown-themes](https://www.npmjs.com/package/@wulechuan/css-stylus-markdown-themes)》。

上述项目之文档中亦有若干截图，直观展示一篇文档在应用上述项目自带的两种默认主题样式后之样貌。这两种主题为浅色，另一为深色。见 [该文档](https://github.com/wulechuan/wulechuan-css-stylus-themes-for-htmls-via-markdowns/blob/master/documents/refs/zh-hans-CN/application-examples.md)。

<!-- 
> 重要！
>
> 本程序包（即《@wulechuan/generate-html-via-markdown》），暂称“甲程序”，系以所谓“peer 依赖”、“平级依赖”的方式调用上述 CSS 样式项目（称乙程序）的。
> 这意味着，在安装甲程序时，npm **不会** 自动为你一并安装上乙程序。**你必须亲自手工安装乙程序**！ -->


### 用于 Gulpjs 生态的适配版本

本人还另行构建和维护了一个与本软件相关的 npm 项目，名为《[@wulechuan/gulp-markdown-to-html](https://www.npmjs.com/package/@wulechuan/gulp-markdown-to-html)》。为方便指代，此处暂称为“甲软件”。顾名思义，甲软件是适用于 [Gulpjs](https://gulpjs.com) 工作流的工具软件。甲软件内部包含本软件，并会调用本软件之功能，实现从 Markdown 文件到 HTML 文件的批量转换。**注意，本软件旨在从字符串生成新字符串，而甲软件旨在从文件生成新文件。**


### 用于命令行环境的工具

本人还另行构建和维护了一个与本软件相关的 npm 项目，名为《[@wulechuan/markdown-to-html-via-cli](https://www.npmjs.com/package/@wulechuan/markdown-to-html-via-cli)》。为方便指代，此处暂称为“乙软件”。顾名思义，乙软件用于在命令行中批量将 Markdown 文件转换成对应的 HTML 文件。乙软件内部包含本软件，并会调用本软件之功能，实现从 Markdown 文件到 HTML 文件的批量转换。**注意，本软件旨在从字符串生成新字符串，而乙软件旨在从文件生成新文件。** 乙软件异常方便，推荐诸君一试。


## 用法

### 示例 1

不需要带任何参数。输出完整的 HTML 内容，一切都自动包含其中。

```js
const markdownToHTMLConverter = require('@wulechuan/generate-html-via-markdown')

const markdownContent = '# 测试文章\n\n## 此为二级标题\n\n### 此为三级标题\n\n一个句子。\n\n'

/********************************************************************/
/**/ const htmlContent = markdownToHTMLConverter(markdownContent) /**/
/********************************************************************/
```


### 示例 2

输出一个“纯净”的 HTML 文档字符串。无 CSS、无【文章目录】、无“返回顶部”按钮、无 Javascript。总之，什么都没有。

```js
const {
    readFileSync,
    writeFileSync,
} = require('fs')

const markdownToHTMLConverter = require('@wulechuan/generate-html-via-markdown')
const markdownContent = readFileSync('我的文章.md').toString()

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
        htmlTitleString: '一份极简的 HTML 文档',
        shouldNotInsertBackToTopAnchor: true,
    },
})

writeFileSync('我的文章.html', htmlContent)
```

### 示例 3

采用来自你自己设计的 CSS 文件中的 CSS 代码，取代本软件默认的 CSS 代码，嵌入输出的 HTML 内容中，以控制该 HTML 之样貌。

```js
const {
    readFileSync,
    writeFileSync,
} = require('fs')

const markdownToHTMLConverter = require('@wulechuan/generate-html-via-markdown')
const markdownContent = readFileSync('一篇好文.md').toString()

const htmlContent = markdownToHTMLConverter(markdownContent, {
    manipulationsOverHTML: {
        // 1) 禁用内部 CSS 主题文件。
        shouldNotUseInternalCSSThemingFiles: true,
    },

    absolutePathsOfExtraFilesToEmbedIntoHTML: [
        // 2) 引入你自己设计的 CSS 文件。
        '/d/your/work/folder/some/theme/your-splendid-theme.css',

        // 3) 或许你也须引入你自己的 Javascript 文件。
        '/d/your/work/folder/some/theme/your-splendid-theme.actions.js',
    ],
})

writeFileSync('一篇好文.html', htmlContent)
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

            /*
                该参数对应 “markdown-it-anchor” 插件的 “permalinkClass” 参数。
                其默认值为 “'header-anchor'”。

                我的所谓内部 CSS 采用其默认值。
            */
            cssClassNameOfHeadingPermanentLinks: undefined,

            cssClassNameOfArticleTOCRootTag:     'markdown-article-toc',
            cssClassNameOfArticleTOCLists:       undefined, // 作用于 <ul> 或 <ol>。
            cssClassNameOfArticleTOCListItems:   undefined, // 作用于 <li>。
            cssClassNameOfArticleTOCItemAnchors: undefined, // 作用于 <li> 内层的 <a>。

            /*
                “articleTOCBuildingHeadingLevelStartsFrom”：该参数
                对应 “markdown-it-toc-done-right” 插件的 “level” 参数，
                意为，从第几级标题开始往下，会构建对应的纲要列表项。

                例如：
                    假定 “articleTOCBuildingHeadingLevelStartsFrom” 取值为 2。
                    则**不会**为文章中的任何 <h1> 构建对应的纲要列表项。
                    而从第二级标题开始的所有标题，即 <h2/>、<h3/>……等，均会构建对应纲要列表项。

                另，我所设计的默认 CSS，在默认配置下会【故意】隐藏较深层的纲要列表项。
                即，这些列表项的 HTML 标签明明存在，但被 CSS 强行隐藏不见。
            */
            articleTOCBuildingHeadingLevelStartsFrom: 2, // 注意：我令其默认取 2。
            articleTOCListTagNameIsUL: false,
        },

        manipulationsOverHTML: {
            shouldNotReplaceLineBreaksInCodeTagsWithBrTags: false,
            shouldNotInsertBackToTopAnchor: false,
            shouldNotUseInternalCSSThemingFiles: false,
            shouldUseUnminifiedVersionOfInternalCSS: false,
            shouldUseUnminifiedVersionOfInternalJavascriptIfAny: false,

            htmlTagLanguage: '', // 默认取空字符串。此即意味着实际取值为 “'zh-hans-CN'”。该默认取值源自 “begin.html”。
            htmlTitleString: '', // 默认取空字符串。此即意味着自动从文字中第一个 <h1> 标签中提前内容文字，作为 HTML 文档的标题（<title>）。

            internalCSSFileNameOfTheme:        'wulechuan-styles-for-html-via-markdown.default--no-toc.min.css',
            internalCSSFileNameOfThemeWithTOC: 'wulechuan-styles-for-html-via-markdown.default--with-toc.min.css',

            /*
                下列两项参数已被弃用。实则更名为上方两个参数。请尽量采用上方使用新名称的两个参数。
                一旦上方某参数配置了值，则下方对应参数的值会被忽略。
                未来，或许我干脆不再支持使用下方两个参数名。
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



                例 1：令所有外部链接的打开方式为 “_blank”，即在浏览器中新建窗口或页签来打开该链接。
                {
                    from: /\s+href="([^#\./].+)/gi,
                    to:   ' target="_blank" href="$1',
                },

                例 2：批量令原本指向另一些 Markdown 文件的链接地址就，改为指向对应的 HTML 文件。
                {
                    from: /\s+href="(.+)\.md(#.*)?"/gi,
                    to:   ' href="$1.html$2"',
                },

                例 3：批量转换链接地址。
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
    ```


#### 返回值

一个字符串，内容为一篇完整的 HTML 文档，包含 CSS 和 Javascript。不需任何外部链接的样式或脚本文件。

> - 于最终产生的单一 HTML 内容，尽管样式和脚本均已完整包含其中，但图片、视频文件仍为该 HTML 文档的外部资源，须确保这些外部资源文件存在，且在 HTML 中配以正确的引用路径。

> 千万注意！该返回值是一个字符串，**而不是**一个文件。欲将该字符串写入磁盘永久保存，请在你自己的脚本中另行调用诸如 `writeFile` 或 `writeFileSync` 的函数。另，文件扩展名应为 `html`。





## 未来计划

暂无。


## 许可证类型

WTFPL

> 注意：
>
> 我未研究过许可证的约束。因此姑且声明为 WTFPL 类型。但实际上该许可证类型可能与我采用的开源模块有冲突。

