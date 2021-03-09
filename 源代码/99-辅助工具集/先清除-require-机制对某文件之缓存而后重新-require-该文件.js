const 彩色粉笔工具 = require('chalk')

function 清除Require机制对该文件之缓存(须重清除其缓存之文件之绝对路径, 选项集 = {}) {
    const {
        不应打印普通的日志内容,
        不应打印警告性的日志内容,
    } = 选项集

    if (!不应打印普通的日志内容) {
        console.log(`${
            彩色粉笔工具.gray('准备重新读取（require）以下文件：')
        }\n    ${
            彩色粉笔工具.rgb(51, 102, 45)(须重清除其缓存之文件之绝对路径)
        }`)
    }

    if (须重清除其缓存之文件之绝对路径 in require.cache) {
        delete require.cache[须重清除其缓存之文件之绝对路径]
    } else {
        if (!不应打印警告性的日志内容) {
            console.log(彩色粉笔工具.rgb(128, 96, 23)('    上述文件之缓存并不存在。无须清除。'))
        }
    }
}

function 先清除Require机制对该文件之缓存而后重新Require该文件(须重新读取之文件之绝对路径, 选项集) {
    清除Require机制对该文件之缓存(须重新读取之文件之绝对路径, 选项集)
    return require(须重新读取之文件之绝对路径)
}

module.exports = {
    清除Require机制对该文件之缓存,
    先清除Require机制对该文件之缓存而后重新Require该文件,
}
