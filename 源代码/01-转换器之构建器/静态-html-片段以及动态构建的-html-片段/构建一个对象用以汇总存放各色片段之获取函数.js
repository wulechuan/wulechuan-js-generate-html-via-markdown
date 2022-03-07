const 路径工具 = require('path')

const {
    本NPM包之根文件夹之绝对路径,
} = require('../../面向研发阶段之配置')

const 阻塞式读取一文本文件之完整内容字符串 = require('../../99-辅助工具集/阻塞式读取一文本文件之完整内容字符串')

const 根据文件之扩展名选用包裹该文件之内容之HTML标签名 = require(
    '../../99-辅助工具集/根据文件之扩展名选用包裹该文件之内容之-html-标签名'
)

const 将字符串用某HTML标签包裹起来得出另一字符串 = require(
    '../文件内容字符串之处理工具集/2-针对-html-内容的字符串/1-对最初产生的-html-内容字符做的修订/将字符串用某-html-标签包裹起来得出另一字符串'
)

const { join: 遵循POSIX标准拼接路径 } = 路径工具.posix





let html起始片段之原始字符串 = ''

const {
    html自Head结束标签至Body起始标签之片段之默认形式之字符串,
    html末尾片段字符串,
} = require('./以-javascript-字符串形式给出的-html-片段集/若干简短但关键的-html-内容片段字符串')



const html自Head结束标签至Body起始标签之片段之默认形式之描述项 = {
    content: html自Head结束标签至Body起始标签之片段之默认形式之字符串,
}

const html末尾片段之描述项 = {
    content: html末尾片段字符串,
}





/**
 * @private
 */
const 一切HTML片段分两类集结于此容器 = {
    /** keys are combinations of several factors.
     * @enum {string}
     */
    所谓标准片段之集结字典: {},

    /** keys are source file names or file paths,
     * values are HTML snippets with wrapper tags,
     * containing the content of the source file.
     * @enum {object}
     */
    非必须之片段之集结字典: {},
}



/**
 * @typedef {object} snippetEntry
 * @property {string} content
 * @property {boolean?} 内容由style标签而非script标签包裹着
 * @property {snippetEntry[]} 与该文件关联的一对Javascript文件由Script标签包裹好之片段之描述项列表
 */



/**
 * @typedef {object} SnippetEntryGetters
 * @method 阻塞式获取HTML起始片段之描述项
 * @method 阻塞式获取HTML自Head结束标签至Body起始标签之片段之描述项
 * @method 阻塞式获取HTML末尾片段之描述项
 * @method 从Peer依赖包中阻塞式获取某个主题文件之内容全文字符串
 * @method 阻塞式获取某文件被特定HTML标签包裹后之内容之描述项
 */



/**
 * @module
 */
module.exports = 构建一个对象用以汇总存放各色片段之获取函数





/**
 * @function 构建一个对象用以汇总存放各色片段之获取函数
 * @argument {object} options
 * @argument {object} options.peer依赖包提供的以文件名称为索引之所有文件简易描述项之字典
 * @argument {function} options.peer依赖包提供用以获取某特定文件之完整内容字符串之函数
 * @returns {SnippetEntryGetters}
 */
function 构建一个对象用以汇总存放各色片段之获取函数(options) {
    const {
        peer依赖包提供的以文件名称为索引之所有文件简易描述项之字典,
        peer依赖包提供用以获取某特定文件之完整内容字符串之函数,
    } = options

    return {
        阻塞式获取HTML起始片段之描述项,
        阻塞式获取HTML自Head结束标签至Body起始标签之片段之描述项,
        阻塞式获取HTML末尾片段之描述项,

        从Peer依赖包中阻塞式获取某个主题文件之内容全文字符串,
        阻塞式获取某文件被特定HTML标签包裹后之内容之描述项,
    }



    /**
     * @param {object} options
     * @param {string} options.产出之HTML文件之HTML标签之语言属性之取值
     * @returns {snippetEntry}
     */
    function 阻塞式获取HTML起始片段之描述项(options) {
        const {
            产出之HTML文件之HTML标签之语言属性之取值,
        } = options

        if (!html起始片段之原始字符串) {
            html起始片段之原始字符串 = 阻塞式读取一文本文件之完整内容字符串(
                遵循POSIX标准拼接路径(
                    本NPM包之根文件夹之绝对路径,
                    './源代码/01-转换器之构建器/静态-html-片段以及动态构建的-html-片段/以-html-原生代码之形式存放的片段/begin.html'
                )
            )
        }

        const entryKey = `HTML beginning snippet of language ${产出之HTML文件之HTML标签之语言属性之取值}`

        const snippetsDict = 一切HTML片段分两类集结于此容器.所谓标准片段之集结字典

        if (!snippetsDict[entryKey]) {
            let 处理好的HTML起始片段之字符串 = html起始片段之原始字符串

            if (
                typeof 产出之HTML文件之HTML标签之语言属性之取值 === 'string' &&
                产出之HTML文件之HTML标签之语言属性之取值.length > 1 &&
                产出之HTML文件之HTML标签之语言属性之取值 !== 'zh-hans-CN'
            ) {
                处理好的HTML起始片段之字符串 = 处理好的HTML起始片段之字符串.replace(
                    '<html lang="zh-hans-CN">',
                    `<html lang="${产出之HTML文件之HTML标签之语言属性之取值}">`
                )
            }

            snippetsDict[entryKey] = {
                content: 处理好的HTML起始片段之字符串,
            }
        }

        return snippetsDict[entryKey]
    }

    function 阻塞式获取HTML自Head结束标签至Body起始标签之片段之描述项(options) {
        const {
            markdown文章中包含了TOC标记,
            层叠样式表类名之用于Body标签以表明文章配备了纲要列表的,
        } = options

        if (markdown文章中包含了TOC标记) {
            return {
                content: `\n</head>\n<body class="${
                    层叠样式表类名之用于Body标签以表明文章配备了纲要列表的
                }">\n`,
            }
        }

        return html自Head结束标签至Body起始标签之片段之默认形式之描述项
    }

    function 阻塞式获取HTML末尾片段之描述项() {
        return html末尾片段之描述项
    }

    function 从Peer依赖包中阻塞式获取某个主题文件之内容全文字符串(文件名, 不应采纳Require机制缓存之文件旧内容, 其他选项集) {
        /** 本函数所提及之所谓Peer依赖包是指 “ @wulechuan/css-stylus-markdown-themes ”。 */
        const { 非必须之片段之集结字典 } = 一切HTML片段分两类集结于此容器

        if (!非必须之片段之集结字典[文件名] || 不应采纳Require机制缓存之文件旧内容) {
            const 文件之简易描述项 = peer依赖包提供的以文件名称为索引之所有文件简易描述项之字典[文件名]

            const 选用的HTML标签名 = 根据文件之扩展名选用包裹该文件之内容之HTML标签名(文件名)
            const 文件之原始内容字符串 = peer依赖包提供用以获取某特定文件之完整内容字符串之函数(
                文件名,
                不应采纳Require机制缓存之文件旧内容,
                其他选项集
            )

            const fileWrappedContent = 将字符串用某HTML标签包裹起来得出另一字符串({
                原始字符串: 文件之原始内容字符串,
                用于包裹原始字符串之HTML标签名: 选用的HTML标签名,
                包裹原始内容后原始应逐行额外缩进两层: true,
            })

            const 片段描述项 = {
                content: fileWrappedContent,
                内容由style标签而非script标签包裹着: 选用的HTML标签名 === 'style',
            }

            const { associatedJavascriptFileNames } = 文件之简易描述项

            if (associatedJavascriptFileNames) {
                片段描述项.与该文件关联的一对Javascript文件由Script标签包裹好之片段之描述项列表 = associatedJavascriptFileNames.map(给出的Javascript文件名 => {
                    const 给出的Javascript文件名系压缩过之版本之文件之名称 = !!给出的Javascript文件名.match(/\.min\.js$/)

                    let 压缩过之Javascript文件之名称
                    let 未经压缩之原始Javascript文件之名称

                    if (给出的Javascript文件名系压缩过之版本之文件之名称) {
                        压缩过之Javascript文件之名称   = 给出的Javascript文件名
                        未经压缩之原始Javascript文件之名称 = 给出的Javascript文件名.replace(/\.min\.js$/, '.js')
                    } else {
                        未经压缩之原始Javascript文件之名称 = 给出的Javascript文件名
                        压缩过之Javascript文件之名称   = 给出的Javascript文件名.replace(/\.js$/, '.min.js')
                    }

                    const jsEntryPair = {
                        压缩过的版本: 从Peer依赖包中阻塞式获取某个主题文件之内容全文字符串(
                            压缩过之Javascript文件之名称,
                            不应采纳Require机制缓存之文件旧内容,
                            其他选项集
                        ),

                        未经压缩之原始版本: 从Peer依赖包中阻塞式获取某个主题文件之内容全文字符串(
                            未经压缩之原始Javascript文件之名称,
                            不应采纳Require机制缓存之文件旧内容,
                            其他选项集
                        ),
                    }

                    return jsEntryPair
                })
            }

            非必须之片段之集结字典[文件名] = 片段描述项
        }

        return 非必须之片段之集结字典[文件名]
    }

    /**
     * @param {string?} 文件之绝对路径
     * @param {boolean?} 不应采纳Require机制缓存之文件旧内容
     * @returns {object}
     */
    function 阻塞式获取某文件被特定HTML标签包裹后之内容之描述项(文件之绝对路径, 不应采纳Require机制缓存之文件旧内容) {
        const { 非必须之片段之集结字典 } = 一切HTML片段分两类集结于此容器

        if (!非必须之片段之集结字典[文件之绝对路径] || 不应采纳Require机制缓存之文件旧内容) {
            const 选用的HTML标签名 = 根据文件之扩展名选用包裹该文件之内容之HTML标签名(文件之绝对路径)
            const 文件之原始内容字符串 = 阻塞式读取一文本文件之完整内容字符串(文件之绝对路径)
            const fileWrappedContent = 将字符串用某HTML标签包裹起来得出另一字符串({
                原始字符串: 文件之原始内容字符串,
                用于包裹原始字符串之HTML标签名: 选用的HTML标签名,
                包裹原始内容后原始应逐行额外缩进两层: true,
            })

            const 片段描述项 = {
                content: fileWrappedContent,
                内容由style标签而非script标签包裹着: 选用的HTML标签名 === 'style',
            }

            非必须之片段之集结字典[文件之绝对路径] = 片段描述项
        }

        return 非必须之片段之集结字典[文件之绝对路径]
    }
}
