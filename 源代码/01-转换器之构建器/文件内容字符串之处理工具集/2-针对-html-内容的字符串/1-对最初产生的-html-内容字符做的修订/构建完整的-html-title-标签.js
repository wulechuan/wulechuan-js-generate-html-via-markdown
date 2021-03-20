const 彩色粉笔工具 = require('chalk')



function 获取文章中第一个H1标签之内容字符串(用于在其中搜寻H1标签的HTML片段字符串) {
    const 正则表达式匹配之结果 = 用于在其中搜寻H1标签的HTML片段字符串.match(
        /<h1( id=".+".*)?>(<a.+>.*<\/a>)?(.*)<\/h1>/
    )

    if (正则表达式匹配之结果) {
        return 正则表达式匹配之结果[3].trim()
    }

    return ''
}



module.exports = function 构建HTML之完整Title标签之字符串(由Markdown转换而得的HTML内容字符串, 选项集) {
    const {
        客体程序指明采用的作为HTMLTitle标签内容之字符串,
        控制台打印信息须改用英国话,
    } = 选项集


    let htmlTitle标签之内容字符串
    if (客体程序指明采用的作为HTMLTitle标签内容之字符串) {
        htmlTitle标签之内容字符串 = 客体程序指明采用的作为HTMLTitle标签内容之字符串
    } else {
        htmlTitle标签之内容字符串 = 获取文章中第一个H1标签之内容字符串(由Markdown转换而得的HTML内容字符串)
    }

    console.log('')

    let htmlTitle标签之完整字符串 = ''

    if (htmlTitle标签之内容字符串) {

        htmlTitle标签之完整字符串 = `<title>${htmlTitle标签之内容字符串}</title>`

        if (控制台打印信息须改用英国话) {
            console.log(`Article title: ${彩色粉笔工具.green(htmlTitle标签之内容字符串)}`)
        } else {
            console.log(`文章标题为：${彩色粉笔工具.green('《' + htmlTitle标签之内容字符串 + '》')}`)
        }

    } else {

        htmlTitle标签之完整字符串 = '<title>一篇由 Markdown 源文编译而得的网页（核心技术由 markdownIt 提供）</title>'

        if (控制台打印信息须改用英国话) {
            console.log(彩色粉笔工具.red('Article title not found.'))
        } else {
            console.log(彩色粉笔工具.red('未找到文章标题'))
        }
    }

    console.log('')

    return htmlTitle标签之完整字符串
}
