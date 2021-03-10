module.exports = {
    配置格式适用之最低版本: 3, // 最高适用版本不可预见。

    须在控制台打印详尽细节: false,

    将Markdown转换为HTML之前之预备阶段: {
        不应主动插入TOC之占位标记: false, // 但若 Markdown 原文已有此占位标记，本工具亦不会粗鲁的删除之。
    },

    将Markdown转换为HTML之阶段: {
        不应为各章节标题构建超链接: false,
        各章节标题超链接之符号字符串: '§', // 允许采用多个字符。

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
            "构建文章纲要列表时自该级别之标题始" is mapped
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
        构建文章纲要列表时自该级别之标题始: 2, // Pay attention that I take 2 as a default value.
        文章纲要列表应采用UL标签而非OL标签: false,
    },

    对HTML做进一步处理之阶段: {
        不应将代码块中的换行符替换成BR标签: false,
        不应注入用于返回文章起始之按钮: false,
        不应采用任何由本工具内建之层叠样式表: false,
        采用由本工具内建之层叠样式表时应采用未经压缩之版本: false,
        采用由本工具内建之Javascript时应采用未经压缩之版本: false,

        /*
            研发你自己的样式集时，须不断修改样式表、配套 Javascript ，
            并即时观察修订之结果。
            此时，将下方该项配置为 true 将大有裨益。
            因为，一旦不采纳 require 机制之缓存， gulp 工具链才可以确保
            总是读取和处理最新版本的层叠样式表和配套 Javascript 之内容。
        */
        读取本工具内建之层叠样式表文件和Javascript文件时禁止Require语句缓存其内容: false,

        /*
            下方参数默认取空字符串。
            取空字符串即意味着实际取值为 “'zh-hans-CN'”。该实际之默认取值源自 “begin.html”。
        */
        产出之HTML文件之HTML标签之语言属性之取值: '',

        /*
            下方参数默认取空字符串。
            取空字符串即意味着自动从文字中第一个 <h1> 标签中提前内容文字，作为 HTML 文档的标题（<title>）。
        */
        产出之HTML文件之Title标签之内容字符串: '',

        所采用之由本工具内建之不含文章纲要列表之定义之层叠样式表文件之名称: 'wulechuan-styles-for-html-via-markdown.default--no-toc.min.css',
        所采用之由本工具内建之含有文章纲要列表之定义之层叠样式表文件之名称: 'wulechuan-styles-for-html-via-markdown.default--with-toc.min.css',

        cssClassNameOfMarkdownChiefContentWrappingArticleTag: 'markdown-article',
        cssClassNameOfBodyTagWhenMarkdownArticleHasTOC:       'markdown-article-toc-exists',
        cssClassNameOfBackToTopAnchor:                        'markdown-article-back-to-top',

        须对产出之HTML内容字符串依次按下诸内容替换规则做修订: {
            '1 内建现成的替换规则序列': [
                '令所有外部链接之打开方式为 _blank',
                '令所有原本指向 Markdown 文件之链接改为指向同名 HTML 文件',
            ],

            '2 额外的替换规则序列': [
                /*
                {
                    凡: <字符串或正则表达式>,
                    替换为: <字符串>,
                },



                // 例 1：令所有外部链接之打开方式为 “_blank”，即在浏览器中新建窗口或页签来打开该链接。
                //      另，该例已经收录在所谓“内建现成的替换规则集”当中，
                //      名为 '令所有外部链接之打开方式为 _blank' 。
                {
                    凡: /\s+href="([^#./].+)/gi,
                    替换为: ' target="_blank" href="$1',
                },

                // 例 2：批量令原本指向另一些 Markdown 文件的链接地址，改为指向对应的 HTML 文件。
                //      另，该例已经收录在所谓“内建现成的替换规则集”当中，
                //      名为 '令所有原本指向 Markdown 文件之链接改为指向同名 HTML 文件' 。
                {
                    凡: /\s+href="(.+)\.md(#.*)?"/gi,
                    替换为: ' href="$1.html$2"',
                },

                // 例 3：依照假想的特定要求批量转换链接地址。
                {
                    凡: /\s+href="\.\/课件之示例集\//gi,
                    替换为: ' href="../公开发表/课件之示例集/',
                },
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

        // 注意： 【展开文章纲要列表面板】与【展开文章纲要列表的某一条目】不是一回事。
        浏览器打开HTML文章最初之时文章纲要列表中凡层级深于该值之条目均应收叠: 1,
        浏览器打开HTML文章最初之时若浏览器窗口足够宽大则直接展开文章纲要列表之面板: false,
    },

    杂项: {
        控制台打印信息须改用英国话: false,
    },
}
