/** @type {import('..').范_内建现成的Markdown内容替换规则集字典} */
const 内建现成的Markdown内容替换规则集字典 = {
    '去除Markdown中自有的用于引用内建层叠样式表文件之Style标签': {
        凡: /<link rel="stylesheet" href=".*([/\\]node_modules)?@wulechuan[/\\]css-stylus-markdown-themes[/\\]源代码[/\\]发布的源代码[/\\]文章排版与配色方案集[/\\]层叠样式表[/\\]wulechuan-styles-for-html-via-markdown.+\.css">/gi,
        替换为: '',
    },
}

module.exports = 内建现成的Markdown内容替换规则集字典
