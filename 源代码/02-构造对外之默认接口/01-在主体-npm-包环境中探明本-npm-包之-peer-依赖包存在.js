const {
    本NPM包之NPM名称,
    // 本NPM包之Package点JSON文件,
    本NPM包之Peer依赖包之名称,
    // 本NPM包之根文件夹之绝对路径,
} = require('../面向研发阶段之配置')





/** @type {Error} */
let 须抛出的错误之记载 = null

/** @type {string} */
let 抛出错误前须打印的消息文本 = ''

/** @type {import('chalk')} */
let 彩色粉笔工具





try {

    require(本NPM包之Peer依赖包之名称)

} catch (错误甲之记载) {

    须抛出的错误之记载 = 错误甲之记载

} finally {

    try {

        彩色粉笔工具 = require('chalk')

        if (须抛出的错误之记载) {
            抛出错误前须打印的消息文本 = [
                彩色粉笔工具.yellow(`本工具（“${
                    彩色粉笔工具.green(本NPM包之NPM名称)
                }”，暂称“甲”）依赖另一`),

                彩色粉笔工具.yellow(`名为“${
                    彩色粉笔工具.white.bgRed(本NPM包之Peer依赖包之名称)
                }”之工具（暂称“乙”）。`),

                '',

                彩色粉笔工具.yellow('现在，加载乙的过程中出错。'),
                彩色粉笔工具.yellow('  - 可能乙尚缺失（未安装。'),
                彩色粉笔工具.yellow('  - 也可能乙进一步依赖的其它包缺失或加载出错。'),

                '',

                彩色粉笔工具.yellow(`须知，甲（即本工具）故意未声明对乙之依赖性，故 npm ${
                    彩色粉笔工具.red('不会')
                }因安装甲而自动将乙一并安装。`),

                彩色粉笔工具.yellow(`${
                    彩色粉笔工具.red('如果乙确实尚未安装，请手工安装乙。')
                }安装方法取以下二者之任一：`),

                彩色粉笔工具.green(`    npm  i      ${彩色粉笔工具.magenta(本NPM包之Peer依赖包之名称)}`),
                彩色粉笔工具.green(`    npm  i  -D  ${彩色粉笔工具.magenta(本NPM包之Peer依赖包之名称)}`),
            ].join('\n')
        }

    } catch (错误乙之记载) {

        if (须抛出的错误之记载) {

            抛出错误前须打印的消息文本 = [
                `本工具（“${本NPM包之NPM名称}”，暂称“甲”）依赖另一`,

                `名为“${本NPM包之Peer依赖包之名称}”之工具（暂称“乙”）。`,

                '',

                '现在，加载乙的过程中出错。',
                '  - 可能乙尚缺失（未安装。',
                '  - 也可能乙进一步依赖的其它包缺失或加载出错。',

                '',

                '另，甲（即本工具）故意未声明对乙之依赖性，故 npm【不会】因安装甲而自动将乙一并安装。',

                '如果乙确实尚未安装，请手工安装乙。安装方法取以下二者之任一：',
                `    npm  i      ${本NPM包之Peer依赖包之名称}`,
                `    npm  i  -D  ${本NPM包之Peer依赖包之名称}`,
            ].join('\n')

        } else {

            须抛出的错误之记载 = 错误乙之记载
            抛出错误前须打印的消息文本 = '加载依赖包 “ chalk ” 时出错。'

        }
    }
}





if (须抛出的错误之记载) {
    console.log('-'.repeat(79))
    console.log('')
    console.log(`加载依赖包 “ ${本NPM包之Peer依赖包之名称} ” 时出错。`)
    console.log('')

    if (抛出错误前须打印的消息文本) {
        console.log(抛出错误前须打印的消息文本)
    }

    console.log('')
    console.log('-'.repeat(79))

    throw 须抛出的错误之记载
}





console.log(彩色粉笔工具.green(`兹探明该 npm 依赖包确已存在：${彩色粉笔工具.bgGreen.black(本NPM包之Peer依赖包之名称)}`))
