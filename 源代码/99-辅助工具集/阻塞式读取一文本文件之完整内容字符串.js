const 彩色粉笔工具 = require('chalk')
const { readFileSync: 阻塞式读取文件之内容, existsSync: 阻塞式探明文件存在 } = require('fs')

module.exports = function 阻塞式读取一文本文件之完整内容字符串(filePath) {
    if (阻塞式探明文件存在(filePath)) {
        return 阻塞式读取文件之内容(filePath).toString()
    } else {
        console.log(`\n${
            彩色粉笔工具.yellow('File not found:')
        }\n    ${
            彩色粉笔工具.red(filePath)
        }\n`)
    }

    return ''
}
