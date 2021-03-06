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

module.exports = function buildHTMLTitleSnippetString(htmlContentViaMarkDownContent, options) {
    const {
        specifiedArticleTitle,
        控制台打印信息改用英国话,
    } = options


    let articleTitle
    if (specifiedArticleTitle) {
        articleTitle = specifiedArticleTitle
    } else {
        articleTitle = 获取文章中第一个H1标签之内容字符串(htmlContentViaMarkDownContent)
    }

    console.log('')

    let htmlTitleSnippet = ''

    if (articleTitle) {

        htmlTitleSnippet = `<title>${articleTitle}</title>`

        if (控制台打印信息改用英国话) {
            console.log(`Article title: ${彩色粉笔工具.green(articleTitle)}`)
        } else {
            console.log(`文章标题为：${彩色粉笔工具.green('《' + articleTitle + '》')}`)
        }

    } else {

        htmlTitleSnippet = '<title>HTML via MarkDown (by markdownIt)</title>'

        if (控制台打印信息改用英国话) {
            console.log(彩色粉笔工具.red('Article title not found.'))
        } else {
            console.log(彩色粉笔工具.red('未找到文章标题'))
        }
    }

    console.log('')

    return htmlTitleSnippet
}
