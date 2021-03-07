// import 本NPM包之Peer依赖包 from '@wulechuan/css-stylus-markdown-themes'
const 本NPM包之Peer依赖包 = require('@wulechuan/css-stylus-markdown-themes')

const 构建一个用于将Markdown内容字符串转换为HTML字符串的转换器 = require('../01-转换器之构建器')

const 将Markdown内容字符串转换为HTML内容的转换器 = 构建一个用于将Markdown内容字符串转换为HTML字符串的转换器({
    themesPeerPackageAllDistFileEntriesKeyingByFileNames: 本NPM包之Peer依赖包.以文件名称为索引之所有文件之字典,
    syncGetContentStringOfOneFileOfThePeerModuleOfThemes: 本NPM包之Peer依赖包.获取某一已发布之文件之完整内容字符串,
    shouldReloadModulesForDevWatchingMode: false,
})

module.exports = 将Markdown内容字符串转换为HTML内容的转换器
// export default 将Markdown内容字符串转换为HTML内容的转换器
