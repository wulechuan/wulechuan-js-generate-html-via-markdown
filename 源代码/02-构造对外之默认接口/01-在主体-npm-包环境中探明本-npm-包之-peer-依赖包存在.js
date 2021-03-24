const 彩色粉笔工具 = require('chalk')





const {
    本NPM包之NPM名称,
    // 本NPM包之Package点JSON文件,
    本NPM包之Peer依赖包之名称,
    // 本NPM包之根文件夹之绝对路径,
} = require('../面向研发阶段之配置')





try {
    require(本NPM包之Peer依赖包之名称)
} catch (error) {
    console.log('-'.repeat(79))
    console.log('')
    console.log(彩色粉笔工具.yellow(`本工具（“${
        彩色粉笔工具.green(本NPM包之NPM名称)
    }”，暂称“甲”）依赖另一\n名为“${
        彩色粉笔工具.white.bgRed(本NPM包之Peer依赖包之名称)
    }”（暂称“乙”）之工具。而此依赖包并不存在。`))
    console.log('')

    console.log(彩色粉笔工具.yellow(`另，甲（即本工具）故意未声明对乙之依赖性，故 npm ${
        彩色粉笔工具.red('不会')
    }因安装甲而自动将乙一并安装。\n${
        彩色粉笔工具.red('请手工安装乙。')
    }安装方法取以下二者之任一：`))
    console.log(彩色粉笔工具.green(`    npm  i      ${彩色粉笔工具.magenta(本NPM包之Peer依赖包之名称)}`))
    console.log(彩色粉笔工具.green(`    npm  i  -D  ${彩色粉笔工具.magenta(本NPM包之Peer依赖包之名称)}`))

    console.log('')
    console.log('-'.repeat(79))

    const 期望提供层叠样式表之peer依赖包缺失之错误 = new ReferenceError(`Peer依赖包“${本NPM包之Peer依赖包之名称}”不存在。`)
    throw(期望提供层叠样式表之peer依赖包缺失之错误)
}





console.log(彩色粉笔工具.green(`兹探明该 npm 依赖包确已存在：${彩色粉笔工具.bgGreen.black(本NPM包之Peer依赖包之名称)}`))
