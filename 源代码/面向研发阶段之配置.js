/**
 * 本文件，以及其余一切被 `源代码/01-转换器之构建器/index.js` 引用（ require ）之文件，
 * 均不应提及对 Peer 依赖包（指 '@wulechuan/css-stylus-markdown-themes' ，下暂称甲 ）之
 * 文件路径之解析。
 *
 * 设此限制，旨在令本工具所谓 “ 核心 ” —— “ 转换器之构建器 ” —— 可摆脱对甲之路径之检测逻辑，
 * 而将对甲（或未来类似之存在）之功能、资源引用交由外界其它代码完成。
 *
 * 特别指出，
 * 此举首先可令其（指 `源代码/01-转换器之构建器/index.js` ）摆脱 `源代码/index.js` 文件而
 * 独立存在、独立运行。
 *
 * 为何有此设计？即为何要令对甲之（路径）处理代码交由外界？
 * 因为本工具有一特定之功用，即作为甲之研发依赖包，参与构建甲之各个层叠样式表文件。
 * 换句话说，于此种特别之应用场合，二者是相互依赖的：
 *     本工具依赖甲作为样式表之来源，
 *     甲工具依赖本工具作为构建工具。
 *
 * 于本工具之 v3.0.0 、 v3.0.1 两版本中，在本文件（指 “ 源代码/面向研发阶段之配置.js ”）中有
 * 解析甲之绝对路径之代码，本以为可以带来些许方便。结果在甲之运行环境中，无法正常解析甲之存放路径，
 * 当时之代码片段如下：
 *
 * ```js
 *     const 本NPM包之Peer依赖包之名称 = '@wulechuan/css-stylus-markdown-themes'
 *     const 本NPM包之Peer依赖包之根文件夹之绝对路径 = 路径工具.dirname(
 *         require.resolve(`${本NPM包之Peer依赖包之名称}/package.json`)
 *     )
 * ```
 *
 * 在甲之环境中，上述代码报错，云 “ 无法解析模块 '@wulechuan/css-stylus-markdown-themes/package.json' ”。
 *
 * 思来想去，我说服自己抛弃上述设计不应理解为无奈。毕竟，“转换器之构建器” 作
 * 为本工具所谓“核心”，的确应降低对外界之耦合程度。
 * 公平的说，上述两个旧版本之代码，思维主线仍然体现了解耦之意图，即 “转换器之构建器” 实则
 * 并未真正用到 “ 本NPM包之Peer依赖包之根文件夹之绝对路径 ” 这一常量。怎奈其对本文件之依
 * 赖 “ 顺带 ” 造成了其对 '@wulechuan/css-stylus-markdown-themes' 路径解析逻辑之依赖。
 * 故不妥。
 *
 * 何况，原本设计的 “ 本NPM包之Peer依赖包之根文件夹之绝对路径 ” 常量，在本工具
 * 全域范围内采用次数寥寥无几，“ 收获 ” 亦不可观。于是那旧设计更显得得不偿失了。
 */

const 路径工具 = require('path')

const 本NPM包之Peer依赖包之名称 = '@wulechuan/css-stylus-markdown-themes'

const 本NPM包之根文件夹之绝对路径 = 路径工具.dirname(
    require.resolve('../package.json')
)

const 本NPM包之Package点JSON文件 = require('../package.json')
const 本NPM包之NPM名称 = 本NPM包之Package点JSON文件.name



module.exports = {
    本NPM包之根文件夹之绝对路径,
    本NPM包之Package点JSON文件,
    本NPM包之NPM名称,
    本NPM包之Peer依赖包之名称,
}
