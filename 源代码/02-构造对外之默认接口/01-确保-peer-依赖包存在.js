const 彩色粉笔工具 = require('chalk')



const 路径工具 = require('path').posix
const { join: 遵循POSIX标准拼接路径 } = 路径工具



const 文件系统工具 = require('fs')
const { existsSync: 阻塞式探明文件已存在 } = 文件系统工具



const 根据项目根文件夹相对于当前文件之路径求出几种关键路径 = require(
    '../99-辅助工具集/根据某文件之位置求出几种关键路径'
)





const {
    本NPM包之Peer依赖包之名称,

    // 自本文件出发至本NPM包之Package点JSON文件之相对路径,
    // 自本文件出发至本NPM包之Peer依赖包之根文件夹之相对路径,
    自本文件出发至本NPM包之Peer依赖包之Package点JSON文件之相对路径,

    自本NPM包之根文件夹出发至本NPM包之Peer依赖包之根文件夹之相对路径,
    自本NPM包之根文件夹出发至本NPM包之Peer依赖包之Package点JSON文件之相对路径,

    本NPM包之Package点JSON文件,
} = 根据项目根文件夹相对于当前文件之路径求出几种关键路径({
    自本文件出发至本NPM包之根文件夹之相对路径: '../../',
    应顺便读取本NPM包之Package点JOSN之内容: true,
})





let 本NPM包之Peer依赖包已经存在 = false

if (!阻塞式探明文件已存在(自本NPM包之根文件夹出发至本NPM包之Peer依赖包之Package点JSON文件之相对路径)) {
    console.log('Peer依赖包之 package.json 文件之路径无效：\n   ', 自本NPM包之根文件夹出发至本NPM包之Peer依赖包之Package点JSON文件之相对路径)
} else {
    const 本NPM包之Peer依赖包之Package点JSON文件 = require(自本文件出发至本NPM包之Peer依赖包之Package点JSON文件之相对路径)

    if (本NPM包之Peer依赖包之Package点JSON文件) {
        const 本NPM包之Peer依赖包之主入口文件之内层相对路径 = 本NPM包之Peer依赖包之Package点JSON文件['main']
        if (typeof 本NPM包之Peer依赖包之主入口文件之内层相对路径 === 'string' && !!本NPM包之Peer依赖包之主入口文件之内层相对路径) {
            const 自本NPM之根文件夹出发至本NPM包之Peer依赖包之主入口文件之相对路径 = 遵循POSIX标准拼接路径(
                自本NPM包之根文件夹出发至本NPM包之Peer依赖包之根文件夹之相对路径,
                本NPM包之Peer依赖包之主入口文件之内层相对路径
            )

            // console.log('本NPM包之Peer依赖包之主入口文件之相对路径\n   ', 自本NPM之根文件夹出发至本NPM包之Peer依赖包之主入口文件之相对路径)
            本NPM包之Peer依赖包已经存在 = 阻塞式探明文件已存在(自本NPM之根文件夹出发至本NPM包之Peer依赖包之主入口文件之相对路径)
        }
    }
}

if (!本NPM包之Peer依赖包已经存在) {
    console.log('-'.repeat(79))
    console.log('')
    console.log(彩色粉笔工具.yellow(`本工具（${
        彩色粉笔工具.green(本NPM包之Package点JSON文件.name)
    }）依赖另一\n名为“${
        彩色粉笔工具.white.bgRed(本NPM包之Peer依赖包之名称)
    }”之工具。而此依赖包并不存在。`))
    console.log('')

    console.log(彩色粉笔工具.yellow(`另，而此依赖系所谓 peer 依赖，故 npm ${
        彩色粉笔工具.red('不会')
    }因安装本工具而自动将上述依赖工具一并安装。\n${
        彩色粉笔工具.red('请手工安装之。')
    }安装方法取以下二者之任一：`))
    console.log(彩色粉笔工具.green(`    npm  i      ${彩色粉笔工具.magenta(本NPM包之Peer依赖包之名称)}`))
    console.log(彩色粉笔工具.green(`    npm  i  -D  ${彩色粉笔工具.magenta(本NPM包之Peer依赖包之名称)}`))

    console.log('')
    console.log('-'.repeat(79))

    const 期望提供层叠样式表之peer依赖包缺失之错误 = new ReferenceError(`Peer依赖包“${本NPM包之Peer依赖包之名称}”不存在。`)
    throw(期望提供层叠样式表之peer依赖包缺失之错误)
} else {
    console.log(彩色粉笔工具.green(`兹探明该 peer 依赖包确已存在：${彩色粉笔工具.bgGreen.black(本NPM包之Peer依赖包之名称)}`))
}
