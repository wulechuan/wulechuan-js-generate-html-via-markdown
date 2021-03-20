<link rel="stylesheet" href="../../../node_modules/@wulechuan/css-stylus-markdown-themes/源代码/发布的源代码/文章排版与配色方案集/层叠样式表/wulechuan-styles-for-html-via-markdown--vscode.default.min.css">


# Wulechuan's Tool for Generating HTMLs via Markdowns

## Multilingual Editions of this Article

- [简体中文版文档](../../../ReadMe.md)




## NPM Page

<dl>
<dt>Package Name</dt>
<dd>

[@wulechuan/generate-html-via-markdown](https://www.npmjs.com/package/@wulechuan/generate-html-via-markdown)

</dd>
<dt>Author</dt>
<dd><p>wulechuan (南昌吴乐川)</p></dd>
</dl>



## Compatibility Broken Version Warning

**IMPORTANT**

**As of v`3.0.0`, ALL APIs of this package are in CHINESE instead of English. In addition, the hierarchy of the interfacing properties have adjusted. For non-chinese speaker, please stick with the old v`2.x.x`. Good news is there're very few enhancements/changes to functionalities as the v3 over the v2, though some.**

I do am looking forward to provide new APIs in English alongside with those in Chinese.


## Introduction

Yet another tool for converting MarkDown content into corresponding HTML content, but with gorgeous themes applied to the output HTML by default. The HTML includes both CSS rules and Javascript codes. **Thus, when deliver your article with the help of this tool, a single HTML file would be enough.**

> The Javascript codes are for the behviours of the table of contents(TOC) part.

> Note that although all CSS and Javascript contents are embeded, images are still external resources to the HTML.

This tool utilizes the ecosystem of the famous tool, "[markdownIt](https://www.npmjs.com/package/markdown-it)".

**You provide a string of MarkDown, you get a string of HTML.**

No need to provide literally anything, you get a full featured HTML. Including gorgeous themes, and responsive layout fitting all sizes of screens, and TOC with smart behaviours, and the pretty "back-to-top" button(an anchor in fact).

There're plenty of options which provide full controls over the ouptut HTML contents. Whether the TOC exists? Whether the "back-to-top" button exists? Whether the embedded CSS codes are minified or not? What about the Javascript codes, should they be minified? Everything is under your controls.


### Built-in Themes

The CSS file for the built-in theming is from another NPM package of mine, named "[@wulechuan/css-stylus-markdown-themes](https://www.npmjs.com/package/@wulechuan/css-stylus-markdown-themes)".

See some pictures of an example article with 2 default themes (a light-colored one and a dark-colred one) applied [there](https://github.com/wulechuan/wulechuan-css-stylus-themes-for-htmls-via-markdowns/blob/master/%E6%96%87%E6%A1%A3/%E8%AF%B4%E6%98%8E%E4%B9%A6/en-US/application-examples.md).

<!--
> IMPORTANT:
>
> This package "@wulechuan/generate-html-via-markdown"(package A) peer-depends upon the css theming pacakge(package B) said above.
> This means when installing pacakge A, npm will **NOT** automatically install package B as well, but rather print some warning messages after installation of package A. **YOU MUST INSTALL PACKAGE B MANUALLY YOURSELF**.
 -->


### Gulpjs Workflow Adaptor

Alongside this npm package, I also maintain another npm package, named [@wulechuan/gulp-markdown-to-html](https://www.npmjs.com/package/@wulechuan/gulp-markdown-to-html). Let's call it package A. The package perfectly fit the workflows provided by the [Gulpjs](https://gulpjs.com) ecosystem. The package A utilizes this npm package internally to convert Markdown files into HTML files in batch.

### CLI Tool

Alongside this npm package, I also maintain another npm package, named [@wulechuan/markdown-to-html-via-cli](https://www.npmjs.com/package/@wulechuan/markdown-to-html-via-cli). Let's call it package B. The package is a convenient CLI tool for batch converting markdwon files into HTML ones, internally utilizing the features of this npm package you are inspecting.


## Git Repositories

| <span style="display:inline-block;width:6em;">Supplier</span> | <span style="display:inline-block;width:4em;">Nation</span> | URI |
| ----------- | :-----: | ------- |
| Gitee       |  China  | [https://gitee.com/nanchang-wulechuan/wulechuan-js-generate-html-via-markdown](https://gitee.com/nanchang-wulechuan/wulechuan-js-generate-html-via-markdown) |
| Aliyun:code |  China  | [https://code.aliyun.com/wulechuan/wulechuan-generate-html-via-markdown](https://code.aliyun.com/wulechuan/wulechuan-generate-html-via-markdown) |
| GitHub      |   USA   | [https://github.com/wulechuan/wulechuan-js-generate-html-via-markdown](https://github.com/wulechuan/wulechuan-js-generate-html-via-markdown) |



## Usage



## TODOS

- Provide APIs in English alongside with already existing Chinese ones.



## License

WTFPL

> NOTE:
>
> I'm not an expert about license types. So I temporarily use WTFPL. But I guess this type of license might conflict with the ones used by those npm packages I'm utilizing.
