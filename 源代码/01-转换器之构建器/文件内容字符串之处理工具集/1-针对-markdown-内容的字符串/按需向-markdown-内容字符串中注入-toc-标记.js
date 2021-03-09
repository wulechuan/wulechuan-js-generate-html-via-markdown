const 彩色粉笔工具 = require('chalk')

module.exports = function 按需向Markdown内容字符串中注入TOC标记(markdown内容之字符串, 不应主动插入TOC之占位标记) {
    if (typeof markdown内容之字符串 !== 'string') {
        throw new TypeError(`@wulechuan/generate-html-via-markdown:\n    ${
            彩色粉笔工具.red('给出的 Markdown 内容无效。应给出一个【字符串】值。')
        }.\n    ${
            彩色粉笔工具.yellow(`如果该 Markdown 内容系从文件读取而得，勿忘调用读取之结果之“${
                彩色粉笔工具.magenta('.toString')
            }”方法函数，以将该内容转换为一个字符串。`)
        }\n`)
    }

    let 处理过的Markdown内容之字符串 = markdown内容之字符串

    const 给出的Markdown内容本就包含TOC标记 = 处理过的Markdown内容之字符串
        .match(/\$\{toc\}|\[\[toc\]\]|\[toc\]|\[\[_toc_\]\]/i)

    let markdown内容现已包含TOC标记 = 给出的Markdown内容本就包含TOC标记

    if (!给出的Markdown内容本就包含TOC标记 && !不应主动插入TOC之占位标记) {
        处理过的Markdown内容之字符串 += [
            '\n',
            '[[toc]]',
            '',
        ].join('\n\n')

        markdown内容现已包含TOC标记 = true
    }

    return {
        markdown内容现已包含TOC标记,
        处理过的Markdown内容之字符串,
    }
}
