/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * 我不打算令 nodejs 运行本 JavaScript 文件之代码。
 * 设计本文件纯粹是为了在其中测试本工具之 TypeScript 定义是否起效。
 * 具体而言，我会在本文中打字，观察我的代码编辑器（ VSCode ）能否给出正确的代码提示。
 *
 *
 *
 * 2021-03-13 实验结果：一切良好。
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */





/** */
import 一枚现成的转换器 from '..'

import {
    获取某一已发布之文件之完整内容字符串,
    以文件名称为索引之所有文件简易描述项之字典,
} from '@wulechuan/css-stylus-markdown-themes'





/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * 请输入以下测试性文字，并观察代码编辑器是否能给出正确的代码提示。
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * const 一枚新的转换器 = 一枚现成的转换器.构建一个用于将Markdown内容字符串转换为HTML字符串的转换器({
 *     不应采纳本工具之源代码之缓存版本以应对本工具研发阶段之要求: true,
 *     syncGetContentStringOfOneFileOfThePeerModuleOfThemes: 获取某一已发布之文件之完整内容字符串,
 *     themesPeerPackageAllDistFileEntriesKeyingByFileNames: 以文件名称为索引之所有文件简易描述项之字典,
 * })
 * 一枚新的转换器('# 自我简介\n\n无。', {
 *     对HTML做进一步处理之阶段: {
 *         不应将代码块中的换行符替换成BR标签: true,
 *     },
 * })
 */
/** */
const 一枚新的转换器 = 一枚现成的转换器.构建一个用于将Markdown内容字符串转换为HTML字符串的转换器({
    不应采纳本工具之源代码之缓存版本以应对本工具研发阶段之要求: true,
    syncGetContentStringOfOneFileOfThePeerModuleOfThemes: 获取某一已发布之文件之完整内容字符串,
    themesPeerPackageAllDistFileEntriesKeyingByFileNames: 以文件名称为索引之所有文件简易描述项之字典,
})
一枚新的转换器('# 自我简介\n\n无。', {
    对HTML做进一步处理之阶段: {
        不应将代码块中的换行符替换成BR标签: true,
    },
})





/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * 请输入以下测试性文字，并观察代码编辑器是否能给出正确的代码提示。
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * const defaultOptions = 一枚现成的转换器.完备的默认配置集
 * const html = 一枚现成的转换器('# 一篇好文\n\n中国加油！', defaultOptions)
 * const charCounts = html.length
 */
/** */
const defaultOptions = 一枚现成的转换器.完备的默认配置集
const html = 一枚现成的转换器('# 一篇好文\n\n中国加油！', defaultOptions)
const charCounts = html.length





/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * 请输入以下测试性文字，并观察代码编辑器是否能给出正确的代码提示。
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * console.log(以文件名称为索引之所有文件简易描述项之字典['wulechuan-styles-for-html-via-markdown--firefox-addon.default.css'].文件之相对路径)
 */
/** */
console.log(以文件名称为索引之所有文件简易描述项之字典['wulechuan-styles-for-html-via-markdown--firefox-addon.default.css'].文件之相对路径)
