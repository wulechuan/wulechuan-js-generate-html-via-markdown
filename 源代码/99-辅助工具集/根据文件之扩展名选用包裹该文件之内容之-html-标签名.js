module.exports = function 根据文件之扩展名选用包裹该文件之内容之HTML标签名(待处理之文件名) {
    let 用于包裹文件之内容之HTML标签名 = 'style'

    if (待处理之文件名.match(/.+\.js$/)) {
        用于包裹文件之内容之HTML标签名 = 'script'
    }

    return 用于包裹文件之内容之HTML标签名
}
