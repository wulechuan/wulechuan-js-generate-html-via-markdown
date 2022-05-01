/**
 * The chief contents of this file are almost identical to
 * those of `@wulechuan/gulp-markdown-to-html/index.js`.
 *
 * I copy them here, simply because I don't want
 * this package we are working on to depend on that NPM package.
 *
 * Actually, that package depends on this package instead.
 */



const 路径工具 = require('path')
const through = require('through2')
const GulpPluginError = require('plugin-error')
const 替换文件名中的扩展名  = require('replace-ext')
const { 先清除Require机制对该文件之缓存而后重新Require该文件 } = require('../../源代码/99-辅助工具集/先清除-require-机制对某文件之缓存而后重新-require-该文件')

const {
    本NPM包之NPM名称,
    本NPM包之根文件夹之绝对路径,
} = require('../../源代码/面向研发阶段之配置')

const {
    以文件名称为索引之所有文件简易描述项之字典: peer依赖包提供的以文件名称为索引之所有文件简易描述项之字典,
    获取某一已发布之文件之完整内容字符串: peer依赖包提供用以获取某特定文件之完整内容字符串之函数,
} = require('@wulechuan/css-stylus-markdown-themes')

const 依照当前操作系统之风格拼接路径字符串 = 路径工具.join

function 构造一个Gulp生态中之特型错误对象(用以描述错误的原生对象) {
    return new GulpPluginError(本NPM包之NPM名称, 用以描述错误的原生对象)
}


/**
 * @param {import('../../').范_将Markdown字符串转换为HTML字符串之转换器之配置项集} 转换器之配置项集
 * @param {object} 任务闭环之配置项集
 * @returns {Function}
 */
module.exports = function 将由本工具构建之内容转换器包裹成Gulp任务管道之环节(转换器之配置项集, 任务闭环之配置项集 = {}) {
    const {
        应输出MarkdownIt生态工具集之原始产出以便验证之而非输出正式内容,
    } = 任务闭环之配置项集

    return function pipeForConvertingMarkdownsIntoHTMLs() {
        return through.obj(function (gulp任务管道中的文件, gulp任务管道中文件之字符编码类别, gulp任务管道该环节结束之回调函数) {
            if (gulp任务管道中的文件.isStream()) {
                return gulp任务管道该环节结束之回调函数(
                    构造一个Gulp生态中之特型错误对象('Gulpjs 不支持流式（Streaming）之内容。')
                )
            }

            if (gulp任务管道中的文件.isNull()) {
                return gulp任务管道该环节结束之回调函数(null, gulp任务管道中的文件)
            }

            const { 构建一个用于将Markdown内容字符串转换为HTML字符串的转换器 } = 先清除Require机制对该文件之缓存而后重新Require该文件(
                依照当前操作系统之风格拼接路径字符串(本NPM包之根文件夹之绝对路径, '源代码', 'index.js')
            )

            const 将Markdown内容字符串转换为HTML内容的转换器 = 构建一个用于将Markdown内容字符串转换为HTML字符串的转换器({
                peer依赖包提供的以文件名称为索引之所有文件简易描述项之字典,
                peer依赖包提供用以获取某特定文件之完整内容字符串之函数,
                不应采纳本工具之源代码之缓存版本以应对本工具研发阶段之要求: true,
                应输出MarkdownIt生态工具集之原始产出以便验证之而非输出正式内容,
            })



            let html内容之字符串
            try {
                html内容之字符串 = 将Markdown内容字符串转换为HTML内容的转换器(
                    gulp任务管道中的文件.contents.toString(gulp任务管道中文件之字符编码类别 || 'utf-8'),
                    转换器之配置项集
                )
            } catch(error) {
                return gulp任务管道该环节结束之回调函数(构造一个Gulp生态中之特型错误对象(error))
            }

            // console.log(`${htmlContent.slice(0, 300)}\n...\n${'-'.repeat(79)}\n`)

            gulp任务管道中的文件.path = 替换文件名中的扩展名(gulp任务管道中的文件.path, '.html')
            gulp任务管道中的文件.contents = Buffer.from(html内容之字符串)

            return gulp任务管道该环节结束之回调函数(null, gulp任务管道中的文件)
        })
    }
}
