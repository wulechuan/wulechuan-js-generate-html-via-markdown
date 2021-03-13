/// <reference path="../types/index.d.ts" />

/**
 * 为令 @wulechuan/css-stylus-markdown-themes 之 TypeScript 之类型定义生效，
 * 放弃采用变量 “ 本NPM包之Peer依赖包之名称 ” ，
 * 改为经典的 “ require('@wulechuan/css-stylus-markdown-themes') ” 之写法。
 */

// const { 本NPM包之Peer依赖包之名称 } = require('../面向研发阶段之配置')
// const 本NPM包之Peer依赖包 = require(本NPM包之Peer依赖包之名称)

const 本NPM包之Peer依赖包 = require('@wulechuan/css-stylus-markdown-themes')

const 构建一个用于将Markdown内容字符串转换为HTML字符串的转换器 = require('../01-转换器之构建器')

const 将Markdown内容字符串转换为HTML内容的转换器 = 构建一个用于将Markdown内容字符串转换为HTML字符串的转换器({
    themesPeerPackageAllDistFileEntriesKeyingByFileNames: 本NPM包之Peer依赖包.以文件名称为索引之所有文件简易描述项之字典,
    syncGetContentStringOfOneFileOfThePeerModuleOfThemes: 本NPM包之Peer依赖包.获取某一已发布之文件之完整内容字符串,
    不应采纳本工具之源代码之缓存版本以应对本工具研发阶段之要求: false,
})

module.exports = 将Markdown内容字符串转换为HTML内容的转换器
