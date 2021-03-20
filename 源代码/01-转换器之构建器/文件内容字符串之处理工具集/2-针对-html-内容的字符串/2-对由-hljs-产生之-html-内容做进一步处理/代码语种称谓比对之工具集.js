module.exports = {
    求取代码语种称谓中的关键词,
    代码语种系以下之任一,
    代码语种非以下之任一,
}



function 求取代码语种称谓中的关键词(代码语种之称谓) {
    if (!代码语种之称谓 || typeof 代码语种之称谓 !== 'string') {
        throw new TypeError('@wulechuan/hljs-plus: 【代码语种之称谓】必须为字符串。')
    }

    let 代码语种之称谓之关键词

    const 比对之结果 = 代码语种之称谓.match(/^language-([\w_\d-]+)/)
    if (比对之结果) {
        代码语种之称谓之关键词 = 比对之结果[1]
    } else {
        代码语种之称谓之关键词 = 代码语种之称谓
    }

    return 代码语种之称谓之关键词
}



function 代码语种系以下之任一(待判断之代码语种之称谓, 待比对之语种称谓之列表) {
    if (!待判断之代码语种之称谓) {
        return false
    }

    if (!Array.isArray(待比对之语种称谓之列表)) {
        throw new TypeError('@wulechuan/hljs-plus: languageNames must be an array')
    }

    const 待判断之代码语种之称谓之关键词 = 求取代码语种称谓中的关键词(待判断之代码语种之称谓)

    for (let 列表之索引数 = 0; 列表之索引数 < 待比对之语种称谓之列表.length; 列表之索引数++) {
        if (待判断之代码语种之称谓之关键词 === 求取代码语种称谓中的关键词(待比对之语种称谓之列表[列表之索引数])) {
            return true
        }
    }

    return false
}



function 代码语种非以下之任一(待判断之代码语种之称谓, 待比对之语种称谓之列表) {
    return !代码语种系以下之任一(待判断之代码语种之称谓, 待比对之语种称谓之列表)
}
