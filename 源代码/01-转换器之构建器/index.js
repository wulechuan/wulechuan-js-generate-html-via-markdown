/// <reference path="../types/index.d.ts" />

const 彩色粉笔工具 = require('chalk')



const 路径工具 = require('path')
const 遵循当前操作系统之规则拼接路径字符串 = 路径工具.join





const MarkdownIt = require('markdown-it')

const markdownItPluginHighlightJs  = require('markdown-it-highlightjs')
const markdownItPluginCheckbox     = require('markdown-it-checkbox')
const markdownItPluginAnchor       = require('markdown-it-anchor')
const markdownItPluginTOCDoneRight = require('markdown-it-toc-done-right')





const {
    本NPM包之NPM名称,
    本NPM包之根文件夹之绝对路径,
} = require('../面向研发阶段之配置')

const 所有作用于Markdown原始内容之内建替换规则之字典 = require('../内建现成的-markdown-内容替换规则集字典')
const 所有作用于HTML内容之内建替换规则之字典 = require('../内建现成的-html-内容替换规则集字典')

const {
    清除Require机制对该文件之缓存,
    先清除Require机制对该文件之缓存而后重新Require该文件,
} = require('../99-辅助工具集/先清除-require-机制对某文件之缓存而后重新-require-该文件')





const rerequire工具之配置项集 = {
    不应打印普通的日志内容: true,
    不应打印警告性的日志内容: false,
}









function 该值为所谓标准对象(待检测值) {
    return !!待检测值 && typeof 待检测值 === 'object' && !Array.isArray(待检测值)
}

function 尽量取原始值但确保最终取值为所谓标准对象(原始值) {
    return 该值为所谓标准对象(原始值) ? 原始值 : {}
}

function 对某字符串执行某查找替换规则(欲处理之字符串, 某替换规则) {
    if (!某替换规则) { return false }

    const { 凡, 替换为 } = 某替换规则

    const 查找规则系字符串 = typeof 凡 === 'string'
    const 查找规则系正则表达式 = 凡 instanceof RegExp
    const 替换标的系字符串 = typeof 替换为 === 'string'
    const 替换标的系函数 = typeof 替换为 === 'function'

    if (!查找规则系字符串 && !查找规则系正则表达式) { return false }

    if (替换标的系字符串 || (查找规则系正则表达式 && 替换标的系函数)) {
        if (查找规则系正则表达式 && 替换标的系函数) {
            // 暂不支持
            return false
        } else {
            const 替换后的字符串 = 欲处理之字符串.replace(凡, 替换为)
            return 替换后的字符串
        }
    }

    return false
}





/**
 * @param {object} 配置项集
 * @param {object} 配置项集.peer依赖包提供的以文件名称为索引之所有文件简易描述项之字典
 * @param {function} 配置项集.peer依赖包提供用以获取某特定文件之完整内容字符串之函数
 * @returns {function} - The core converter function
 */
module.exports = function 构建一个用于将Markdown内容字符串转换为HTML字符串的转换器(配置项集 = {}) {
    const {
        peer依赖包提供的以文件名称为索引之所有文件简易描述项之字典,
        peer依赖包提供用以获取某特定文件之完整内容字符串之函数,
        不应采纳本工具之源代码之缓存版本以应对本工具研发阶段之要求,
        欲输出MarkdownIt生态工具集之原始产出以便验证之而非输出正式内容,
    } = 配置项集

    let 完备的默认配置项集
    let 表达单层缩进之字符串

    let 按需向Markdown内容字符串中注入TOC标记
    let 构建HTML之完整Title标签之字符串
    let 将HTML之主体内容用Article标签包裹起来
    let 处理HTML内容中之一切Pre标签



    if (!不应采纳本工具之源代码之缓存版本以应对本工具研发阶段之要求) {
        完备的默认配置项集 = require('../完备的默认配置项集')

        const tabs = require('./静态-html-片段以及动态构建的-html-片段/以-javascript-字符串形式给出的-html-片段集/表达源代码缩进之字符串')
        表达单层缩进之字符串 = tabs.表达单层缩进之字符串




        按需向Markdown内容字符串中注入TOC标记 = require(
            './文件内容字符串之处理工具集/1-针对-markdown-内容的字符串/按需向-markdown-内容字符串中注入-toc-标记'
        )

        构建HTML之完整Title标签之字符串 = require(
            './文件内容字符串之处理工具集/2-针对-html-内容的字符串/1-对最初产生的-html-内容字符做的修订/构建完整的-html-title-标签'
        )

        将HTML之主体内容用Article标签包裹起来 = require(
            './文件内容字符串之处理工具集/2-针对-html-内容的字符串/1-对最初产生的-html-内容字符做的修订/将-html-主体内容用-article-标签包裹起来'
        )

        处理HTML内容中之一切Pre标签 = require(
            './文件内容字符串之处理工具集/2-针对-html-内容的字符串/2-对由-hljs-产生之-html-内容做进一步处理/处理-html-内容中之一切-pre-标签之工具'
        )
    }





    const { // Reading these files only once is enough. Saving time.
        阻塞式获取HTML起始片段之描述项,
        阻塞式获取HTML自Head结束标签至Body起始标签之片段之描述项,
        阻塞式获取HTML末尾片段之描述项,

        syncGetSnippetEntryOfOneFileOfThePeerDepPackageOfThemes,
        阻塞式获取某文件被特定HTML标签包裹后之内容之描述项,
    } = require('./静态-html-片段以及动态构建的-html-片段/构建一个对象用以汇总存放各色片段之获取函数')({
        peer依赖包提供的以文件名称为索引之所有文件简易描述项之字典,
        peer依赖包提供用以获取某特定文件之完整内容字符串之函数,
    })




    return function 吴乐川的将以Markdown为内容之字符串转换为HTML内容之字符串的转换器(
        markdown原始文章全文之字符串,
        转换器之配置项集
    ) {
        转换器之配置项集 = 尽量取原始值但确保最终取值为所谓标准对象(转换器之配置项集)

        const 须在控制台打印详尽细节 = !!转换器之配置项集.须在控制台打印详尽细节





        if (不应采纳本工具之源代码之缓存版本以应对本工具研发阶段之要求) {
            [
                './文件内容字符串之处理工具集/2-针对-html-内容的字符串/2-对由-hljs-产生之-html-内容做进一步处理/process-snippet-of-one-language.js',
                './文件内容字符串之处理工具集/2-针对-html-内容的字符串/2-对由-hljs-产生之-html-内容做进一步处理/ast/ast-generic-simple-splitter.js',
                './文件内容字符串之处理工具集/2-针对-html-内容的字符串/2-对由-hljs-产生之-html-内容做进一步处理/ast/ast-splitter-for-escape-chars-in-string-or-regexp.js',
                './文件内容字符串之处理工具集/2-针对-html-内容的字符串/2-对由-hljs-产生之-html-内容做进一步处理/ast/ast-splitters-for-regexp.js',
                './文件内容字符串之处理工具集/2-针对-html-内容的字符串/2-对由-hljs-产生之-html-内容做进一步处理/ast/parse-ast-sub-tree-into-single-string.js',
                './文件内容字符串之处理工具集/2-针对-html-内容的字符串/2-对由-hljs-产生之-html-内容做进一步处理/各色内容片段之专门处理器之总集/泛用处理器集/用于处理换行符以及行首空白者.js',
                './文件内容字符串之处理工具集/2-针对-html-内容的字符串/2-对由-hljs-产生之-html-内容做进一步处理/各色内容片段之专门处理器之总集/泛用处理器集/用于处理标点符号者.js',
                './文件内容字符串之处理工具集/2-针对-html-内容的字符串/2-对由-hljs-产生之-html-内容做进一步处理/各色内容片段之专门处理器之总集/通用于大部分语言/用于处理单个注释块者.js',
                './文件内容字符串之处理工具集/2-针对-html-内容的字符串/2-对由-hljs-产生之-html-内容做进一步处理/各色内容片段之专门处理器之总集/通用于大部分语言/用于处理单个正则表达式者.js',
                './文件内容字符串之处理工具集/2-针对-html-内容的字符串/2-对由-hljs-产生之-html-内容做进一步处理/各色内容片段之专门处理器之总集/通用于大部分语言/用于处理单个字符串者.js',
                './文件内容字符串之处理工具集/2-针对-html-内容的字符串/2-对由-hljs-产生之-html-内容做进一步处理/各色内容片段之专门处理器之总集/针对特定语种或语族/用于处理层叠样式表语族者.js',
                './文件内容字符串之处理工具集/2-针对-html-内容的字符串/2-对由-hljs-产生之-html-内容做进一步处理/各色内容片段之专门处理器之总集/针对特定语种或语族/用于处理超文本标记语言者.js',
                './文件内容字符串之处理工具集/2-针对-html-内容的字符串/2-对由-hljs-产生之-html-内容做进一步处理/各色内容片段之专门处理器之总集/针对特定语种或语族/针用于处理-javascript-语族者.js',
            ].forEach(subPath => {
                清除Require机制对该文件之缓存(
                    遵循当前操作系统之规则拼接路径字符串(本NPM包之根文件夹之绝对路径, subPath),
                    rerequire工具之配置项集
                )
            })

            // ----------------------------------------------

            完备的默认配置项集 = 先清除Require机制对该文件之缓存而后重新Require该文件(
                遵循当前操作系统之规则拼接路径字符串(
                    本NPM包之根文件夹之绝对路径,
                    '源代码/完备的默认配置项集.js'
                ),
                rerequire工具之配置项集
            )

            const tabs = 先清除Require机制对该文件之缓存而后重新Require该文件(
                遵循当前操作系统之规则拼接路径字符串(
                    本NPM包之根文件夹之绝对路径,
                    './源代码/01-转换器之构建器/静态-html-片段以及动态构建的-html-片段/以-javascript-字符串形式给出的-html-片段集/表达源代码缩进之字符串.js'
                ),
                rerequire工具之配置项集
            )
            表达单层缩进之字符串 = tabs.表达单层缩进之字符串

            按需向Markdown内容字符串中注入TOC标记 = 先清除Require机制对该文件之缓存而后重新Require该文件(
                遵循当前操作系统之规则拼接路径字符串(
                    本NPM包之根文件夹之绝对路径,
                    './源代码/01-转换器之构建器/文件内容字符串之处理工具集/1-针对-markdown-内容的字符串/按需向-markdown-内容字符串中注入-toc-标记.js'
                ),
                rerequire工具之配置项集
            )

            构建HTML之完整Title标签之字符串 = 先清除Require机制对该文件之缓存而后重新Require该文件(
                遵循当前操作系统之规则拼接路径字符串(
                    本NPM包之根文件夹之绝对路径,
                    './源代码/01-转换器之构建器/文件内容字符串之处理工具集/2-针对-html-内容的字符串/1-对最初产生的-html-内容字符做的修订/构建完整的-html-title-标签.js'
                ),
                rerequire工具之配置项集
            )

            将HTML之主体内容用Article标签包裹起来 = 先清除Require机制对该文件之缓存而后重新Require该文件(
                遵循当前操作系统之规则拼接路径字符串(
                    本NPM包之根文件夹之绝对路径,
                    './源代码/01-转换器之构建器/文件内容字符串之处理工具集/2-针对-html-内容的字符串/1-对最初产生的-html-内容字符做的修订/将-html-主体内容用-article-标签包裹起来.js'
                ),
                rerequire工具之配置项集
            )

            处理HTML内容中之一切Pre标签 = 先清除Require机制对该文件之缓存而后重新Require该文件(
                遵循当前操作系统之规则拼接路径字符串(
                    本NPM包之根文件夹之绝对路径,
                    './源代码/01-转换器之构建器/文件内容字符串之处理工具集/2-针对-html-内容的字符串/2-对由-hljs-产生之-html-内容做进一步处理/处理-html-内容中之一切-pre-标签之工具.js'
                ),
                rerequire工具之配置项集
            )
        }









        /* ************* Merge options with their default values ************** */

        const 将Markdown转换为HTML之前之预备阶段 = {
            ...完备的默认配置项集.将Markdown转换为HTML之前之预备阶段,
            ...尽量取原始值但确保最终取值为所谓标准对象(
                转换器之配置项集.将Markdown转换为HTML之前之预备阶段
            ),
        }

        const 将Markdown转换为HTML之阶段 = {
            ...完备的默认配置项集.将Markdown转换为HTML之阶段,
            ...尽量取原始值但确保最终取值为所谓标准对象(
                转换器之配置项集.将Markdown转换为HTML之阶段
            ),
        }

        const 对HTML做进一步处理之阶段 = {
            ...完备的默认配置项集.对HTML做进一步处理之阶段,
            ...尽量取原始值但确保最终取值为所谓标准对象(
                转换器之配置项集.对HTML做进一步处理之阶段
            ),
        }

        const 对本工具现成提供的文章纲要做以下配置 = {
            ...完备的默认配置项集.对本工具现成提供的文章纲要做以下配置,
            ...尽量取原始值但确保最终取值为所谓标准对象(
                转换器之配置项集.对本工具现成提供的文章纲要做以下配置
            ),
        }

        const 杂项 = {
            ...完备的默认配置项集.杂项,
            ...尽量取原始值但确保最终取值为所谓标准对象(
                转换器之配置项集.杂项
            ),
        }





        const {
            不应主动插入TOC之占位标记,
        } = 将Markdown转换为HTML之前之预备阶段

        const 须对原始Markdown内容字符串依次按下诸内容替换规则做修订 = 尽量取原始值但确保最终取值为所谓标准对象(
            将Markdown转换为HTML之前之预备阶段.须对原始Markdown内容字符串依次按下诸内容替换规则做修订
        )

        let {
            '1 内建现成的替换规则之名称之序列': 作用于原始Markdown的内建现成的替换规则之名称之序列,
            '2 额外的替换规则之定义之序列': 作用于原始Markdown的额外的替换规则之定义之序列,
        } = 须对原始Markdown内容字符串依次按下诸内容替换规则做修订

        if (!Array.isArray(作用于原始Markdown的内建现成的替换规则之名称之序列)) {
            作用于原始Markdown的内建现成的替换规则之名称之序列 = 完备的默认配置项集.将Markdown转换为HTML之前之预备阶段.须对原始Markdown内容字符串依次按下诸内容替换规则做修订['1 内建现成的替换规则之名称之序列']
        }

        if (!Array.isArray(作用于原始Markdown的额外的替换规则之定义之序列)) {
            // 作用于原始Markdown的额外的替换规则之定义之序列 = 完备的默认配置项集.将Markdown转换为HTML之前之预备阶段.须对原始Markdown内容字符串依次按下诸内容替换规则做修订['2 额外的替换规则之定义之序列']
            作用于原始Markdown的额外的替换规则之定义之序列 = []
        }





        const {
            不应为各章节标题构建超链接,
            各章节标题超链接之符号字符串,
            文章纲要列表应采用UL标签而非OL标签,
            构建文章纲要列表时自该级别之标题始,
        } = 将Markdown转换为HTML之阶段

        const 针对MarkdownIt生态之诸工具的层叠样式表类名集 = {
            ...完备的默认配置项集.将Markdown转换为HTML之阶段.针对MarkdownIt生态之诸工具的层叠样式表类名集,
            ...尽量取原始值但确保最终取值为所谓标准对象(
                将Markdown转换为HTML之阶段.针对MarkdownIt生态之诸工具的层叠样式表类名集
            ),
        }

        const {
            用于各级标题之超链接A标签的: cssClassNameOfHeadingPermanentLinks,
            用于文章纲要列表之容器的: cssClassNameOfArticleTOCRootTag,
            用于文章纲要列表各级UL或OL标签的: cssClassNameOfArticleTOCLists,
            用于文章纲要列表各级LI标签的: cssClassNameOfArticleTOCListItems,
            用于文章纲要列表各级LI标签内嵌之A标签的: cssClassNameOfArticleTOCItemAnchors,
        } = 针对MarkdownIt生态之诸工具的层叠样式表类名集





        const {
            不应将代码块中的换行符替换成BR标签,
            不应注入用于返回文章起始之按钮,
            不应采用任何由本工具内建之层叠样式表,
            采用由本工具内建之层叠样式表时应采用未经压缩之版本,
            采用由本工具内建之Javascript时应采用未经压缩之版本,
            读取本工具内建之层叠样式表文件和Javascript文件时禁止Require语句缓存其内容,

            产出之HTML文件之HTML标签之语言属性之取值,
            产出之HTML文件之Title标签之内容字符串,

            所采用之由本工具内建之含有文章纲要列表之定义之层叠样式表文件之名称,
            所采用之由本工具内建之不含文章纲要列表之定义之层叠样式表文件之名称,
        } = 对HTML做进一步处理之阶段

        const 凡内容须注入产出之HTML中之所有外来文件 = {
            ...完备的默认配置项集.对HTML做进一步处理之阶段.凡内容须注入产出之HTML中之所有外来文件,
            ...尽量取原始值但确保最终取值为所谓标准对象(
                对HTML做进一步处理之阶段.凡内容须注入产出之HTML中之所有外来文件
            ),
        }

        const 本工具专门可配置的层叠样式表类名集 = {
            ...完备的默认配置项集.对HTML做进一步处理之阶段.本工具专门可配置的层叠样式表类名集,
            ...尽量取原始值但确保最终取值为所谓标准对象(
                对HTML做进一步处理之阶段.本工具专门可配置的层叠样式表类名集
            ),
        }

        const 须对产出之HTML内容字符串依次按下诸内容替换规则做修订 = {
            ...完备的默认配置项集.对HTML做进一步处理之阶段.须对产出之HTML内容字符串依次按下诸内容替换规则做修订,
            ...尽量取原始值但确保最终取值为所谓标准对象(
                对HTML做进一步处理之阶段.须对产出之HTML内容字符串依次按下诸内容替换规则做修订
            ),
        }



        const {
            应禁止采用Require语句对这些文件之缓存内容以确保计算机进程反复读取各文件时恒取用各文件最新之内容全文,
        } = 凡内容须注入产出之HTML中之所有外来文件

        let {
            依次给出之外来文件之绝对路径序列,
        } = 凡内容须注入产出之HTML中之所有外来文件

        if (!Array.isArray(依次给出之外来文件之绝对路径序列)) {
            依次给出之外来文件之绝对路径序列 = []
        }



        const {
            用于Body标签以表明文章配备了纲要列表的: 层叠样式表类名之用于Body标签以表明文章配备了纲要列表的,
            用于文章正文之根Article标签的: 层叠样式表类名之用于文章正文之根Article标签的,
            用于具有按钮样貌的返回文章首部之链接的: 层叠样式表类名之用于具有按钮样貌的返回文章首部之链接的,
        } = 本工具专门可配置的层叠样式表类名集



        let {
            '1 内建现成的替换规则之名称之序列': 作用于HTML的内建现成的替换规则之名称之序列,
            '2 额外的替换规则之定义之序列': 作用于HTML的额外的替换规则之定义之序列,
        } = 须对产出之HTML内容字符串依次按下诸内容替换规则做修订

        if (!Array.isArray(作用于HTML的内建现成的替换规则之名称之序列)) {
            作用于HTML的内建现成的替换规则之名称之序列 = 完备的默认配置项集.对HTML做进一步处理之阶段.须对产出之HTML内容字符串依次按下诸内容替换规则做修订['1 内建现成的替换规则之名称之序列']
        }

        if (!Array.isArray(作用于HTML的额外的替换规则之定义之序列)) {
            // 作用于HTML的额外的替换规则之定义之序列 = 完备的默认配置项集.对HTML做进一步处理之阶段.须对产出之HTML内容字符串依次按下诸内容替换规则做修订['2 额外的替换规则之定义之序列']
            作用于HTML的额外的替换规则之定义之序列 = []
        }





        const {
            控制台打印信息须改用英国话,
        } = 杂项

        if (须在控制台打印详尽细节) {
            const 最终采纳之配置之打印项 = {
                将Markdown转换为HTML之前之预备阶段: {
                    ...将Markdown转换为HTML之前之预备阶段,

                    须对原始Markdown内容字符串依次按下诸内容替换规则做修订: {
                        ...须对原始Markdown内容字符串依次按下诸内容替换规则做修订,

                        '1 内建现成的替换规则之名称之序列': 作用于原始Markdown的内建现成的替换规则之名称之序列,
                        '2 额外的替换规则之定义之序列': 作用于原始Markdown的额外的替换规则之定义之序列,
                    },
                },

                将Markdown转换为HTML之阶段: {
                    ...将Markdown转换为HTML之阶段,

                    针对MarkdownIt生态之诸工具的层叠样式表类名集,
                },

                对HTML做进一步处理之阶段: {
                    ...对HTML做进一步处理之阶段,

                    凡内容须注入产出之HTML中之所有外来文件: {
                        ...凡内容须注入产出之HTML中之所有外来文件,

                        依次给出之外来文件之绝对路径序列,
                    },

                    本工具专门可配置的层叠样式表类名集,

                    须对产出之HTML内容字符串依次按下诸内容替换规则做修订: {
                        ...须对产出之HTML内容字符串依次按下诸内容替换规则做修订,

                        '1 内建现成的替换规则之名称之序列': 作用于HTML的内建现成的替换规则之名称之序列,
                        '2 额外的替换规则之定义之序列': 作用于HTML的额外的替换规则之定义之序列,
                    },
                },
            }

            console.log('\n最终采纳之配置：', 最终采纳之配置之打印项)
        }









        /* *************** Modify markdown content if necessary *************** */

        let _markdown内容之半成品1 = markdown原始文章全文之字符串

        作用于原始Markdown的内建现成的替换规则之名称之序列.forEach(某内建替换规则之名称 => {
            const 某内建替换规则 = 所有作用于Markdown原始内容之内建替换规则之字典[某内建替换规则之名称]
            const 要么为替换结果字符串要么为False = 对某字符串执行某查找替换规则(_markdown内容之半成品1, 某内建替换规则)

            if (要么为替换结果字符串要么为False === false) {
                throw new Error(彩色粉笔工具.red(`${本NPM包之NPM名称} 出错：\n    给出的拟作用于 Markdown 原始内容之【内建现成】的【替换规则】之【名称】“${
                    彩色粉笔工具.yellow(某内建替换规则之名称)
                }”无效。`))
            } else {
                _markdown内容之半成品1 = 要么为替换结果字符串要么为False
            }
        })

        作用于原始Markdown的额外的替换规则之定义之序列.forEach((某额外替换规则, 数组索引数) => {
            if (!某额外替换规则) { return }

            const 要么为替换结果字符串要么为False = 对某字符串执行某查找替换规则(_markdown内容之半成品1, 某额外替换规则)

            if (要么为替换结果字符串要么为False === false) {
                console.log(彩色粉笔工具.red(`${本NPM包之NPM名称} 出错：\n    拟作用于 Markdown 原始内容之【额外】的【替换规则】序列中的第 ${
                    彩色粉笔工具.yellow(数组索引数 + 1)
                } 条规则无效。`), '该无效值规则为：',  某额外替换规则)

                throw new Error(`${本NPM包之NPM名称} 出错：用于 HTML 内容替换之额外规则序列中的第 ${数组索引数 + 1} 条规则无效。`)
            } else {
                _markdown内容之半成品1 = 要么为替换结果字符串要么为False
            }
        })



        const {
            markdown内容现已包含TOC标记,
            处理过的Markdown内容之字符串: _markdown内容之半成品2,
        } = 按需向Markdown内容字符串中注入TOC标记(_markdown内容之半成品1, 不应主动插入TOC之占位标记)

        const markdown内容之最终成品之字符串 = _markdown内容之半成品2









        /* ************************* MarkDown to HTML ************************* */
        /*                                                                      */
        /*                                                                      */
        const markdownItParser = new MarkdownIt({
            html: true,
            linkify: true,
            typographer: true,
        })

        markdownItParser.use(markdownItPluginHighlightJs)
        markdownItParser.use(markdownItPluginCheckbox)

        const markdownItPluginAnchorOptions = {
            permalink: !不应为各章节标题构建超链接,
            permalinkBefore: true,
        }

        if (各章节标题超链接之符号字符串) {
            markdownItPluginAnchorOptions.permalinkSymbol = 各章节标题超链接之符号字符串
        }

        if (cssClassNameOfHeadingPermanentLinks) {
            markdownItPluginAnchorOptions.permalinkClass = cssClassNameOfHeadingPermanentLinks
        }

        markdownItParser.use(markdownItPluginAnchor, markdownItPluginAnchorOptions)

        if (markdown内容现已包含TOC标记) {
            markdownItParser.use(markdownItPluginTOCDoneRight, {
                level: 构建文章纲要列表时自该级别之标题始,
                containerClass: cssClassNameOfArticleTOCRootTag,
                listType: 文章纲要列表应采用UL标签而非OL标签 ? 'ul' : 'ol',
                listClass: cssClassNameOfArticleTOCLists,
                itemClass: cssClassNameOfArticleTOCListItems,
                linkClass: cssClassNameOfArticleTOCItemAnchors,
            })
        }
        const markdown文章中包含了TOC标记 = markdown内容现已包含TOC标记

        const 借助MarkdownIt工具家族将Markdown内容直接转换而得的初始HTML内容字符串 = markdownItParser.render(
            markdown内容之最终成品之字符串
        )
        /*                                                                      */
        /*                                                                      */
        /* ******************************************************************** */









        /* ****** Extract HTML title out of generated HTML raw contents ******* */

        let html之完整Title标签之字符串 = '<title>【验证性输出】输出内容并非正式内容</title>'

        if (!欲输出MarkdownIt生态工具集之原始产出以便验证之而非输出正式内容) {
            html之完整Title标签之字符串 = 构建HTML之完整Title标签之字符串(
                借助MarkdownIt工具家族将Markdown内容直接转换而得的初始HTML内容字符串,

                {
                    客体程序指明采用的作为HTMLTitle标签内容之字符串: 产出之HTML文件之Title标签之内容字符串,
                    控制台打印信息须改用英国话,
                }
            )
        }





        /* **************** Modify generated HTML raw contents **************** */

        let html半成品之内容字符串 = 借助MarkdownIt工具家族将Markdown内容直接转换而得的初始HTML内容字符串



        if (!欲输出MarkdownIt生态工具集之原始产出以便验证之而非输出正式内容) {
            作用于HTML的内建现成的替换规则之名称之序列.forEach(某内建替换规则之名称 => {
                const 某内建替换规则 = 所有作用于HTML内容之内建替换规则之字典[某内建替换规则之名称]
                const 要么为替换结果字符串要么为False = 对某字符串执行某查找替换规则(html半成品之内容字符串, 某内建替换规则)

                if (要么为替换结果字符串要么为False === false) {
                    throw new Error(彩色粉笔工具.red(`${本NPM包之NPM名称} 出错：\n    给出的拟作用于 HTML 内容之【内建现成】的【替换规则】之【名称】“${
                        彩色粉笔工具.yellow(某内建替换规则之名称)
                    }”无效。`))
                } else {
                    html半成品之内容字符串 = 要么为替换结果字符串要么为False
                }
            })

            作用于HTML的额外的替换规则之定义之序列.forEach((某额外替换规则, 数组索引数) => {
                if (!某额外替换规则) { return }

                const 要么为替换结果字符串要么为False = 对某字符串执行某查找替换规则(html半成品之内容字符串, 某额外替换规则)

                if (要么为替换结果字符串要么为False === false) {
                    console.log(彩色粉笔工具.red(`${本NPM包之NPM名称} 出错：\n    给出的拟作用于 HTML 内容之【额外】的【替换规则】序列中的第 ${
                        彩色粉笔工具.yellow(数组索引数 + 1)
                    } 条规则无效。`), '该无效值规则为：',  某额外替换规则)

                    throw new Error(`${本NPM包之NPM名称} 出错：用于 HTML 内容替换之额外规则序列中的第 ${数组索引数 + 1} 条规则无效。`)
                } else {
                    html半成品之内容字符串 = 要么为替换结果字符串要么为False
                }
            })



            html半成品之内容字符串 = 处理HTML内容中之一切Pre标签(
                html半成品之内容字符串,
                {
                    不应将代码块中的换行符替换成BR标签,
                }
            )



            html半成品之内容字符串 = 将HTML之主体内容用Article标签包裹起来(
                html半成品之内容字符串,

                {
                    层叠样式表类名之用于文章正文之根Article标签的,
                    cssClassNameOfArticleTOCRootTag,
                    markdown文章中包含了TOC标记,
                }
            )



            if (!不应注入用于返回文章起始之按钮) {
                html半成品之内容字符串 += `\n${表达单层缩进之字符串}<a href="#" class="${层叠样式表类名之用于具有按钮样貌的返回文章首部之链接的}"></a>\n`
            }
        }





        /* ***************** Prepare all extra HTML snippets ****************** */

        const html起始片段之描述项 = 阻塞式获取HTML起始片段之描述项({
            产出之HTML文件之HTML标签之语言属性之取值,
        })

        const html末尾片段之描述项 = 阻塞式获取HTML末尾片段之描述项()

        const html自Head结束标签至Body起始标签至片段之描述项 = 阻塞式获取HTML自Head结束标签至Body起始标签之片段之描述项({
            markdown文章中包含了TOC标记,
            层叠样式表类名之用于Body标签以表明文章配备了纲要列表的,
        })



        let 所有层叠样式表片段之列表 = []
        let 所有Javascript片段之列表 = []

        if (!欲输出MarkdownIt生态工具集之原始产出以便验证之而非输出正式内容) {
            let 一切须注入HTML之标签之列表 = []



            let 所采用之本NPM包之Peer依赖包提供之层叠样式表文件之名称

            if (!不应采用任何由本工具内建之层叠样式表) {
                if (markdown文章中包含了TOC标记) {
                    所采用之本NPM包之Peer依赖包提供之层叠样式表文件之名称 = 所采用之由本工具内建之含有文章纲要列表之定义之层叠样式表文件之名称
                } else {
                    所采用之本NPM包之Peer依赖包提供之层叠样式表文件之名称 = 所采用之由本工具内建之不含文章纲要列表之定义之层叠样式表文件之名称
                }

                if (采用由本工具内建之层叠样式表时应采用未经压缩之版本) {
                    所采用之本NPM包之Peer依赖包提供之层叠样式表文件之名称 = 所采用之本NPM包之Peer依赖包提供之层叠样式表文件之名称.replace(
                        /\.min\.css$/,
                        '.css'
                    )
                }
            }

            if (所采用之本NPM包之Peer依赖包提供之层叠样式表文件之名称) {
                const snippetEntryOfThemingCSS = syncGetSnippetEntryOfOneFileOfThePeerDepPackageOfThemes(
                    所采用之本NPM包之Peer依赖包提供之层叠样式表文件之名称,
                    读取本工具内建之层叠样式表文件和Javascript文件时禁止Require语句缓存其内容,
                    对本工具现成提供的文章纲要做以下配置
                )

                一切须注入HTML之标签之列表 = [
                    ...一切须注入HTML之标签之列表,
                    snippetEntryOfThemingCSS,
                ]

                if (snippetEntryOfThemingCSS.与该文件关联的一对Javascript文件由Script标签包裹好之片段之描述项列表) {
                    一切须注入HTML之标签之列表 = [
                        ...一切须注入HTML之标签之列表,
                        ...snippetEntryOfThemingCSS.与该文件关联的一对Javascript文件由Script标签包裹好之片段之描述项列表.map(entryPair => {
                            if (采用由本工具内建之Javascript时应采用未经压缩之版本) {
                                return entryPair.未经压缩之原始版本
                            } else {
                                return entryPair.压缩过的版本
                            }
                        }),
                    ]
                }
            }

            一切须注入HTML之标签之列表 = [
                ...一切须注入HTML之标签之列表,
                ...依次给出之外来文件之绝对路径序列
                    .map(外来文件之绝对路径 => {
                        return 阻塞式获取某文件被特定HTML标签包裹后之内容之描述项(
                            外来文件之绝对路径,
                            应禁止采用Require语句对这些文件之缓存内容以确保计算机进程反复读取各文件时恒取用各文件最新之内容全文
                        )
                    })
                    .filter(entry => !!entry),
            ]

            所有层叠样式表片段之列表  = 一切须注入HTML之标签之列表.filter(entry =>  entry.内容由style标签而非script标签包裹着)
            所有Javascript片段之列表 = 一切须注入HTML之标签之列表.filter(entry => !entry.内容由style标签而非script标签包裹着)
        }





        /* ***************** Join all HTML snippets together ****************** */

        const 最终HTML之完整内容字符串 = [
            // <!DOCTYPE html> 之类的内容。
            html起始片段之描述项.content,

            // 完整的 <title /> 标签。
            html之完整Title标签之字符串,

            // 所有 <style /> 标签。
            ...所有层叠样式表片段之列表.map(片段描述项 => 片段描述项.content),

            // </head><body ...> 。
            html自Head结束标签至Body起始标签至片段之描述项.content,



            /* * * * * * * * * */
            /*                 */
            /*                 */
            html半成品之内容字符串,
            /*                 */
            /*                 */
            /* * * * * * * * * */



            // 所有 <script /> 标签。
            ...所有Javascript片段之列表.map(片段 => 片段.content),

            // </body></html> 。
            html末尾片段之描述项.content,
        ].join('')





        return 最终HTML之完整内容字符串
    }
}
