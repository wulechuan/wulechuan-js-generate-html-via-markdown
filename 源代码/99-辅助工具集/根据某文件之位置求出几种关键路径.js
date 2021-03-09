const 路径工具 = require('path')
const 遵循POSIX标准之路径工具 = 路径工具.posix
const { join: 遵循POSIX标准拼接路径 } = 遵循POSIX标准之路径工具





const {
    本NPM包之Peer依赖包之名称,
} = require('../面向研发阶段之配置')





/**
 * 用于文件、文件夹存在性检测之路径，总是要求从本项目之根目录出发，而不是从某 JavaScript 文件出发。
 * 用于 require 语句之路径，总是从该 require 语句所在之 JavaScript 文件之路径出发。
 *
 * 重要：
 *     在其他 npm 包中安装并使用本 npm 包时，该“其他” npm 包为【主体】，本 npm 为【客体】。
 *     此时，很多路径应自【主体】 npm 包之根文件夹出发，而非从本【客体】 npm 包之根文件夹出发。
 *     而在所谓【主体】 npm 包之环境中，本 npm 包、本 npm 包之 peer 依赖包之路径不固定，亦不可预知，
 *     因此，不必在此费力求解 peer 依赖包相关之路径，与其有关之一切路径之求解，
 *     应临时交由 require 机制或 import 语句。
 */
module.exports = function 根据项目根文件夹相对于当前文件之路径求出几种关键路径({
    自本文件出发至本NPM包之根文件夹之相对路径,
    应顺便读取本NPM包之Package点JOSN之内容,
} = {}) {
    if (!自本文件出发至本NPM包之根文件夹之相对路径) {
        自本文件出发至本NPM包之根文件夹之相对路径 = ''
    }





    const 自本文件出发至本NPM包之Package点JSON文件之相对路径 = 遵循POSIX标准拼接路径(
        自本文件出发至本NPM包之根文件夹之相对路径,
        'package.json'
    )

    let 本NPM包之Package点JSON文件 = null

    if (应顺便读取本NPM包之Package点JOSN之内容) {
        本NPM包之Package点JSON文件 = require(自本文件出发至本NPM包之Package点JSON文件之相对路径)
    }





    const 求解结果汇总摘要 = {
        本NPM包之Peer依赖包之名称, // 在此给出此值，仅为方便。
        自本文件出发至本NPM包之Package点JSON文件之相对路径,
        本NPM包之Package点JSON文件: 本NPM包之Package点JSON文件 ? '<已读取>' : 本NPM包之Package点JSON文件,
    }

    const 求解结果汇总 = {
        ...求解结果汇总摘要,
        本NPM包之Package点JSON文件,
    }

    // console.log(求解结果汇总摘要)

    return 求解结果汇总
}
