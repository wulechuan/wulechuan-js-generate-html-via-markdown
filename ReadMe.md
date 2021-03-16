<link rel="stylesheet" href="./node_modules/@wulechuan/css-stylus-markdown-themes/源代码/发布的源代码/文章排版与配色方案集/层叠样式表/wulechuan-styles-for-html-via-markdown--vscode.default.min.css">


# 吴乐川的将 MarkDown 代码转换为 HTML 代码的工具

> 中国人——特别是汉族人，理应坚持广泛、规范地使用汉语。凡非必要之情形不说外国话、不用外国字。此乃天经地义！然则每当必要，亦不排斥采用外国之语言。不妨 **博世界之学问，养中国之精神** 。
>
> 本人亦支持少数民族坚持采用自己民族的传统语言。仍须强调，凡中国人，皆应会用汉语、积极使用汉语，此乃中华各民族之大一统之必由。



## Multilingual Editions of this Article

- [English version of this ReadMe](./文档/说明书/en-US/ReadMe.md)




## NPM 页

<dl>
<dt>NPM 包名</dt>
<dd>

[@wulechuan/generate-html-via-markdown](https://www.npmjs.com/package/@wulechuan/generate-html-via-markdown)

</dd>
<dt>作者</dt>
<dd><p>南昌吴乐川</p></dd>
</dl>


## 源代码仓库

| <span style="display:inline-block;width:10em;">提供仓库服务之组织</span> | <span style="display:inline-block;width:9em;">仓库组织之国别</span> | 仓库地址 |
| ------------- | :----------: | ------- |
| 码云           | 中华人民共和国 | [https://gitee.com/nanchang-wulechuan/wulechuan-js-generate-html-via-markdown](https://gitee.com/nanchang-wulechuan/wulechuan-js-generate-html-via-markdown) |
| 阿里云之代码仓库 | 中华人民共和国 | [https://code.aliyun.com/wulechuan/wulechuan-generate-html-via-markdown](https://code.aliyun.com/wulechuan/wulechuan-generate-html-via-markdown) |
| GitHub         | 美           | [https://github.com/wulechuan/wulechuan-js-generate-html-via-markdown](https://github.com/wulechuan/wulechuan-js-generate-html-via-markdown) |


## 简介

本工具借助 [markdownIt](https://www.npmjs.com/package/markdown-it) 生态的工具集，可将一段 MarkDown 内容（一个字符串）转化成对应的 HTML 内容（另一字符串）。

当采用默认的配置项时，本工具还会在输出的 HTML 内容中，内嵌精美的 CSS 样式集和 JavaScript 代码。**故，当借助本工具来制作一篇文章的“可分发版本”时，本工具产生的单一的 HTML 文档即可独立运转。**

> - HTML 中包含【文章目录】、“返回顶部”按钮（实则链接）等方便实用的功能。
>
>   > 【文章目录】，亦称【文章纲要】，即外国话所谓 TOC。
>
> - 其中的 Javascript 代码用于控制【文章目录】之行为。
> - 其内嵌样式另文章排版完全自动适应各型宽窄屏幕尺寸。
> - 于最终产生的单一 HTML 内容，尽管样式和脚本均已完整包含其中，但图片、视频文件仍为该 HTML 文档的外部资源，须确保这些外部资源文件存在，且在 HTML 中配以正确的引用路径。

**简而言之，对本工具输入一个 MarkDown 字符串，其产生一个 HTML 字符串。**

不须带任何参数，调用本工具之接口函数，即可轻松获得一份华丽的 HTML 文档（之内容）。即，该 HTML 文件自带精美主题即交互之功能。

你亦可通过丰富的参数项，精准控制输出 HTML 之方方面面。从有否【文章目录】、【“返回顶部”之按钮】，到是否采用来自您自定义 CSS 文件中之 CSS 内容以增补或替换默认的 CSS。您甚至可以控制内嵌 CSS 和 Javascript 是否为压缩过的版本。


### 内嵌样式

产生的 HTML 文章中，内嵌样式来源于本人创建和维护的另一项目，即《[@wulechuan/css-stylus-markdown-themes](https://www.npmjs.com/package/@wulechuan/css-stylus-markdown-themes)》。

上述项目之文档中亦有若干截图，直观展示一篇文档在应用上述项目自带的两种默认主题样式后之样貌。这两种主题为浅色，另一为深色。见 [该文档](https://github.com/wulechuan/wulechuan-css-stylus-themes-for-htmls-via-markdowns/blob/master/%E6%96%87%E6%A1%A3/%E8%AF%B4%E6%98%8E%E4%B9%A6/%E6%B1%89%E8%AF%AD/%E5%85%B3%E4%BA%8E%E6%96%87%E7%AB%A0%E6%8E%92%E7%89%88%E4%B8%8E%E9%85%8D%E8%89%B2%E6%95%88%E6%9E%9C%E7%A4%BA%E4%BE%8B%E9%9B%86%E7%9A%84%E8%AF%B4%E6%98%8E.md)。


> 重要！
>
> 本程序包（即《@wulechuan/generate-html-via-markdown》），须调用上述 CSS 样式项目（暂称“乙程序”）之 Javascript 接口。
> 换言之，本程序 **依赖** 乙程序。然而，为确保本程序体积尽可能小，又为不至锁死对乙程序依赖之版本，以向程序员提供安装、更新两款程序之灵活性，
> 本程序并不在 `package.json` 中声明对乙程序之依赖之事实。须特别指出，本程序并未声明以所谓“peer 依赖”（我暂译为“平级依赖”）之方式依赖乙程序。
> 这意味着，在安装甲程序时，npm **不会** 自动为你一并安装上乙程序。**你必须亲自手工安装乙程序**！
>
> 顺便指出，本程序之源代码、文档集均多出提及“Peer依赖包”一词，实际上是不准确、不达意的。诸君领会精神即可。


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
    须在控制台打印详尽细节: true,

    将Markdown转换为HTML之前之预备阶段: {
        不应主动插入TOC之占位标记: true,
    },

    将Markdown转换为HTML之阶段: {
        不应为各章节标题构建超链接: true,
    },

    对HTML做进一步处理之阶段: {
        不应采用任何由本工具内建之层叠样式表: true,
        产出之HTML文件之Title标签之内容字符串: '一份极简的 HTML 文档',
        不应注入用于返回文章起始之按钮: true,
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
    对HTML做进一步处理之阶段: {
        // 1) 禁用内部 CSS 主题文件。
        不应采用任何由本工具内建之层叠样式表: true,
    },

    凡内容须注入产出之HTML中之所有外来文件: {
        依次给出之外来文件之绝对路径序列: [
            // 2) 引入你自己设计的 CSS 文件。
            '/d/your/work/folder/some/theme/your-splendid-theme.css',

            // 3) 或许你也须引入你自己的 Javascript 文件。
            '/d/your/work/folder/some/theme/your-splendid-theme.actions.js',
        ],
    },
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

    `./源代码/完备的默认配置项集.js` 文件已尽述之。请参阅。

    我已将 `./源代码/完备的默认配置项集.js` 文件的（几乎）完整内容复制如下：

    ```js
    {
        配置格式适用之最低版本: 3, // 所谓“最高适用版本”不可预见。故不指明。

        须在控制台打印详尽细节: false,

        将Markdown转换为HTML之前之预备阶段: {
            /**
             * 即便下方字段配置为 true，
             * 倘若 Markdown 原文已有此占位标记，
             * 本工具亦不会粗鲁的删除之。
             * 因此，最终输出的 HTML 仍然会配备文章纲要列表（亦称“目录”）。
             */
            不应主动插入TOC之占位标记: false,
        },

        将Markdown转换为HTML之阶段: {
            不应为各章节标题构建超链接: false,

            /** 提醒：此值允许采用多个字符。 */
            各章节标题超链接之符号字符串: '§',

            文章纲要列表应采用UL标签而非OL标签: false,

            针对MarkdownIt生态之诸工具的层叠样式表类名集: {
                /**
                 * 该字段值会传递到 “ markdown-it-anchor ” 插件之 “ permalinkClass ” 属性上。
                 * markdown-it-anchor 为 permalinkClass 给出的默认值为 “ header-anchor ”。
                 * 本工具在套用 markdown-it-anchor 时，并未另设默认值，而是直接采用其原始设计之默认值。
                 */
                用于各级标题之超链接A标签的: undefined,

                /**
                 * 以下 4 个字段的值会逐一传递到 “ markdown-it-toc-done-right ” 插件（下文暂称“ toc 插件 ”）的 4 个属性上。
                 *
                 * 对应关系如下：
                 * -   本工具的 “ 用于文章纲要列表之容器的 ” 传递到 toc 插件的 “ containerClass ”。
                 * -   本工具的 “ 用于文章纲要列表各级UL或OL标签的 ” 传递到 toc 插件的 “ listClass ”。
                 * -   本工具的 “ 用于文章纲要列表各级LI标签的 ” 传递到 toc 插件的 “ itemClass ”。
                 * -   本工具的 “ 用于文章纲要列表各级LI标签内嵌之A标签的 ” 传递到 toc 插件的 “ linkClass ”。
                 *
                 * 其中，cssClassNameOfArticleTOCRootTag 字段由本工具设计之默认值有异于 toc 插件设计之默认值。
                 * 其余 3 个字段，本工具并未设计默认值，故默认值均沿用 toc 插件之设计，且恰巧三者之默认值均为 undefined 。
                 *
                 * 参阅： https://www.npmjs.com/package/markdown-it-toc-done-right#options
                 *
                 * 顺便一提，
                 * 文章纲要列表之容器默认为 <nav> 标签。
                 * 因配置、工具而异，亦可能为 <div> 标签，
                 * 或者干脆直接是文章纲要列表之最顶层的 <ul> 或 <ol> 标签。
                 */
                用于文章纲要列表之容器的: 'markdown-article-toc',
                用于文章纲要列表各级UL或OL标签的: undefined,
                用于文章纲要列表各级LI标签的: undefined,
                用于文章纲要列表各级LI标签内嵌之A标签的: undefined,
            },

            /**
             * 该字段对应 “ markdown-it-toc-done-right ” 插件的 “ level ” 参数，
             * 意为，从第几级标题开始往下，会构建对应的纲要列表项。
             * 其中 <h1> 为所谓第 1 级标题， <h2> 为所谓第 2 级，依此类推。
             *
             * 例如：
             *     假定 “ 构建文章纲要列表时自该级别之标题始 ” 取值为 2。
             *     则“不会”为文章中的任何 <h1> 构建对应的纲要列表项。
             *     而从第 2 级标题开始的所有标题，即 <h2/>、<h3/>……等，均会构建对应纲要列表项。
             *
             * 另，我所设计的默认 CSS，在默认配置下会【故意】隐藏较深层的纲要列表项。
             * 即，这些列表项的 HTML 标签明明存在，但被 CSS 强行隐藏不见。
             */
            构建文章纲要列表时自该级别之标题始: 2, // 注意：我令其默认取 2。
        },

        对HTML做进一步处理之阶段: {
            不应将代码块中的换行符替换成BR标签: false,
            不应注入用于返回文章起始之按钮: false,
            不应采用任何由本工具内建之层叠样式表: false,
            采用由本工具内建之层叠样式表时应采用未经压缩之版本: false,
            采用由本工具内建之Javascript时应采用未经压缩之版本: false,

            /**
             * 研发你自己的样式集时，不免须不断修改样式表以及配套之 Javascript ，
             * 并即时观察修订之结果。
             * 此时，将下方该项配置为 true 将大有裨益。
             * 因为，一旦不采纳 require 机制之缓存， gulp 工具链才可以确保
             * 总是读取和处理最新版本的层叠样式表和配套 Javascript 之内容。
             */
            读取本工具内建之层叠样式表文件和Javascript文件时禁止Require语句缓存其内容: false,

            /**
             * 下方参数默认取空字符串。
             * 取空字符串即意味着实际取值为 “ zh-hans-CN ”。
             * 该实际之默认值（指 “ zh-hans-CN ” ）系源自 “ begin.html ” 这一文件。
             */
            产出之HTML文件之HTML标签之语言属性之取值: '',

            /**
             * 下方参数默认取空字符串。
             *
             * 取空字符串即意味着自动从文字中第一个 <h1> 标签中提前内容文字，
             * 作为 HTML 文档的标题（ <title> ）。
             */
            产出之HTML文件之Title标签之内容字符串: '',

            所采用之由本工具内建之不含文章纲要列表之定义之层叠样式表文件之名称: 'wulechuan-styles-for-html-via-markdown.default--no-toc.min.css',
            所采用之由本工具内建之含有文章纲要列表之定义之层叠样式表文件之名称: 'wulechuan-styles-for-html-via-markdown.default--with-toc.min.css',

            本工具专门可配置的层叠样式表类名集: {
                用于Body标签以表明文章配备了纲要列表的: 'markdown-article-toc-exists',
                用于文章正文之根Article标签的: 'markdown-article',
                用于具有按钮样貌的返回文章首部之链接的: 'markdown-article-back-to-top',
            },

            须对产出之HTML内容字符串依次按下诸内容替换规则做修订: {
                '1 内建现成的替换规则序列': [
                    '令所有外部链接之打开方式为 _blank',
                    令所有原本指向Markdown文件之链接改为指向同名HTML文件,
                ],

                '2 额外的替换规则序列': [
                    /**
                     * // 数据结构示例：
                     * {
                     *     凡:    <字符串或正则表达式>,
                     *     替换为: <字符串>,
                     * },
                     *
                     *
                     *
                     * // 例 1：令所有外部链接之打开方式为 “_blank”，即在浏览器中新建窗口或页签来打开该链接。
                     * //      另，该例已经收录在所谓“内建现成的替换规则集”当中，
                     * //      名为 '令所有外部链接之打开方式为 _blank' 。
                     * {
                     *     凡:    /\s+href="([^#./].+)/gi,
                     *     替换为: ' target="_blank" href="$1',
                     * },
                     *
                     *
                     *
                     * // 例 2：批量令原本指向另一些 Markdown 文件的链接地址，改为指向对应的 HTML 文件。
                     * //      另，该例已经收录在所谓“内建现成的替换规则集”当中，
                     * //      名为 '令所有原本指向Markdown文件之链接改为指向同名HTML文件' 。
                     * {
                     *     凡:    /\s+href="(.+)\.md(#.*)?"/gi,
                     *     替换为: ' href="$1.html$2"',
                     * },
                     *
                     *
                     *
                     * // 例 3：依照假想的特定要求批量转换链接地址。
                     * {
                     *     凡:    /\s+href="\.\/课件之示例集\//gi,
                     *     替换为: ' href="../公开发表/课件之示例集/',
                     * },
                     */
                ],
            },

            凡内容须注入产出之HTML中之所有外来文件: {
                依次给出之外来文件之绝对路径序列: [],
                若将反复读取这些文件应禁止Require语句缓存这些文件之内容: false,
            },
        },

        对本工具现成提供的文章纲要做以下配置: {
            为求文章纲要列表简洁明了故意仅显示两层条目以至于较深层级条目形同作废: false,

            // 注意： 【展开文章纲要列表面板】与【展开文章纲要列表的某一条目】并非一回事。
            浏览器打开HTML文章最初之时文章纲要列表中凡层级深于该值之条目均应收叠: 1,
            浏览器打开HTML文章最初之时若浏览器窗口足够宽大则直接展开文章纲要列表之面板: false,
        },

        杂项: {
            控制台打印信息须改用英国话: false,
        },
    }
    ```


#### 返回值

一个字符串，内容为一篇完整的 HTML 文档，包含 CSS 和 Javascript。不需任何外部链接的样式或脚本文件。

> - 于最终产生的单一 HTML 内容，尽管样式和脚本均已完整包含其中，但图片、视频文件仍为该 HTML 文档的外部资源，须确保这些外部资源文件存在，且在 HTML 中配以正确的引用路径。

> 千万注意！该返回值是一个字符串，**而不是**一个文件。欲将该字符串写入磁盘永久保存，请在你自己的脚本中另行调用诸如 `writeFile` 或 `writeFileSync` 的函数。另，文件扩展名应为 `html`。


## 本项目已知的功能缺陷

见 《[本项目已知的功能缺陷](./文档/本项目已知的功能缺陷/索引.md)》。


## 未来计划

暂无。


## 许可证类型

WTFPL

> 注意：
>
> 我未研究过许可证的约束。因此姑且声明为 WTFPL 类型。但实际上该许可证类型可能与我采用的开源模块有冲突。

