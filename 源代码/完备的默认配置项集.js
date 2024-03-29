/** @type {import('..').范_将Markdown字符串转换为HTML字符串之转换器之配置项集} */
const 完备的默认配置项集 = {
    配置格式适用之最低版本: 3, // 此为最低版本。另，所谓“最高适用版本”不可预见。故不指明。

    须在控制台打印详尽细节: false,

    将Markdown转换为HTML之前之预备阶段: {
        /**
         * 即便下方字段配置为 true，
         * 倘若 Markdown 原文已有此占位标记，
         * 本工具亦不会粗鲁的删除之。
         * 因此，最终输出的 HTML 仍然会配备文章纲要列表（亦称“目录”）。
         */
        不应主动插入TOC之占位标记: false,

        须对原始Markdown内容字符串依次按下诸内容替换规则做修订: {
            '1 内建现成的替换规则之名称之序列': [
                '去除Markdown中自有的用于引用内建层叠样式表文件之Style标签',
            ],

            '2 额外的替换规则之定义之序列': [
                /**
                 * // 数据结构示例：
                 * {
                 *     凡:    <字符串或正则表达式>,
                 *     替换为: <字符串>,
                 * },
                 */
            ],
        },
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
             * 其中，“ 用于文章纲要列表之容器的 ” 字段的由本工具设计之默认值有异于 toc 插件设计之默认值。
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
        读取本工具内建之层叠样式表文件和Javascript文件时应禁止采用Require语句对这些文件之缓存内容以确保计算机进程反复读取各文件时恒取到各文件最新之内容全文: false,

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

        须对产出之HTML内容字符串依次遵照下列诸内容替换规则做修订: {
            '1 内建现成的替换规则之名称之序列': [
                '令所有外部链接之打开方式为 _blank',
                '令所有原本指向Markdown文件之链接改为指向同名HTML文件',
            ],

            '2 额外的替换规则之定义之序列': [
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
            应禁止采用Require语句对这些文件之缓存内容以确保计算机进程反复读取各文件时恒取用各文件最新之内容全文: false,
        },
    },

    对本工具现成提供的文章纲要做以下配置: {
        为求文章纲要列表简洁明了故意仅显示两层条目以至于较深层级条目形同作废: false,

        // 注意： 【呈现文章纲要列表面板】与【展开文章纲要列表的某一条目】并非一回事。
        浏览器打开HTML文章最初之时文章纲要列表中凡层级深于该值之条目均应收叠: 1,
        浏览器打开HTML文章最初之时若浏览器窗口足够宽大则直接展开文章纲要列表之面板: false,
    },

    杂项: {
        控制台打印信息须改用英国话: false,
    },
}

module.exports = 完备的默认配置项集
