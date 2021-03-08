const 路径工具 = require('path')
const 遵循POSIX标准之路径工具 = 路径工具.posix
const { join: 遵循POSIX标准拼接路径 } = 遵循POSIX标准之路径工具





const {
    本NPM包之Peer依赖包之名称,
} = require('../面向研发阶段之配置')





// 用于文件、文件夹存在性检测之路径，总是要求从本项目之根目录出发，而不是从某 JavaScript 文件出发。
// 用于 require 语句之路径，总是从该 require 语句所在之 JavaScript 文件之路径出发。
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





    const 自本NPM包之根文件夹出发至本NPM包之Peer依赖包之根文件夹之相对路径 = 遵循POSIX标准拼接路径(
        'node_modules',
        本NPM包之Peer依赖包之名称
    )

    const 自本文件出发至本NPM包之Peer依赖包之根文件夹之相对路径 = 遵循POSIX标准拼接路径(
        自本文件出发至本NPM包之根文件夹之相对路径,
        自本NPM包之根文件夹出发至本NPM包之Peer依赖包之根文件夹之相对路径
    )





    const 自本NPM包之根文件夹出发至本NPM包之Peer依赖包之Package点JSON文件之相对路径 = 遵循POSIX标准拼接路径(
        自本NPM包之根文件夹出发至本NPM包之Peer依赖包之根文件夹之相对路径,
        'package.json'
    )

    const 自本文件出发至本NPM包之Peer依赖包之Package点JSON文件之相对路径 = 遵循POSIX标准拼接路径(
        自本文件出发至本NPM包之Peer依赖包之根文件夹之相对路径,
        'package.json'
    )





    const 求解结果汇总摘要 = {
        本NPM包之Peer依赖包之名称, // 在此给出此值，仅为方便。

        自本文件出发至本NPM包之Package点JSON文件之相对路径,
        自本文件出发至本NPM包之Peer依赖包之根文件夹之相对路径,
        自本文件出发至本NPM包之Peer依赖包之Package点JSON文件之相对路径,

        自本NPM包之根文件夹出发至本NPM包之Peer依赖包之根文件夹之相对路径,
        自本NPM包之根文件夹出发至本NPM包之Peer依赖包之Package点JSON文件之相对路径,

        本NPM包之Package点JSON文件: 本NPM包之Package点JSON文件 ? '<已读取>' : 本NPM包之Package点JSON文件,
    }

    const 求解结果汇总 = {
        ...求解结果汇总摘要,
        本NPM包之Package点JSON文件,
    }

    // console.log(求解结果汇总摘要)

    return 求解结果汇总
}
