const 彩色粉笔工具 = require('chalk')
const 路径工具 = require('path').posix
const 文件系统工具 = require('fs')

const { join: 遵循POSIX标准拼接路径 } = 路径工具
const { existsSync: 阻塞式探明文件已存在 } = 文件系统工具



const 本NPM包之根文件夹之相对路径  = '../../'





const 本NPM包之Package点JSON文件之相对路径 = 遵循POSIX标准拼接路径(
    本NPM包之根文件夹之相对路径,
    'package.json'
)
const 本NPM包之Package点JSON文件 = require(本NPM包之Package点JSON文件之相对路径)





const 本NPM包之Peer依赖包之名称 = '@wulechuan/css-stylus-markdown-themes'

// 用于文件、文件夹存在性检测之路径，总是要求从本项目之根目录出发，而不是从本 JavaScript 文件之路径出发。
const 本NPM包之Peer依赖包任何文件之存在性检测路径之公共起始部分 = 遵循POSIX标准拼接路径(
    'node_modules',
    本NPM包之Peer依赖包之名称
)

// 用于 require 语句之路径，总是从本 JavaScript 文件之路径出发。
const 本NPM包之Peer依赖包之根文件夹之相对路径 = 遵循POSIX标准拼接路径(
    本NPM包之根文件夹之相对路径,
    本NPM包之Peer依赖包任何文件之存在性检测路径之公共起始部分
)





let 本NPM包之Peer依赖包已经存在 = false

const 本NPM包之Peer依赖包之Package点JSON文件之相对路径 = 遵循POSIX标准拼接路径(
    本NPM包之Peer依赖包任何文件之存在性检测路径之公共起始部分,
    'package.json'
)

if (!阻塞式探明文件已存在(本NPM包之Peer依赖包之Package点JSON文件之相对路径)) {
    // console.log('无效路径：', 本NPM包之Peer依赖包之Package点JSON文件之相对路径)
} else {
    const 本NPM包之Peer依赖包之Package点JSON文件 = require(遵循POSIX标准拼接路径(
        本NPM包之Peer依赖包之根文件夹之相对路径,
        'package.json'
    ))
    // console.log('本NPM包之Peer依赖包之Package点JSON文件\n   ', 本NPM包之Peer依赖包之Package点JSON文件)

    if (本NPM包之Peer依赖包之Package点JSON文件) {
        const 本NPM包之Peer依赖包之主入口文件之内层相对路径 = 本NPM包之Peer依赖包之Package点JSON文件['main']
        if (typeof 本NPM包之Peer依赖包之主入口文件之内层相对路径 === 'string' && !!本NPM包之Peer依赖包之主入口文件之内层相对路径) {
            const 本NPM包之Peer依赖包之主入口文件之相对路径 = 遵循POSIX标准拼接路径(
                本NPM包之Peer依赖包任何文件之存在性检测路径之公共起始部分,
                本NPM包之Peer依赖包之主入口文件之内层相对路径
            )

            // console.log('本NPM包之Peer依赖包之主入口文件之相对路径\n   ', 本NPM包之Peer依赖包之主入口文件之相对路径)
            本NPM包之Peer依赖包已经存在 = 阻塞式探明文件已存在(本NPM包之Peer依赖包之主入口文件之相对路径)
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

    const 依赖包缺失之错误 = new ReferenceError(`Peer依赖包“${本NPM包之Peer依赖包之名称}”不存在。`)
    throw(依赖包缺失之错误)
}
