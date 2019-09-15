const chalk = require('chalk')

function getTextContentOfFirstH1Tag(htmlSnippetToSearchContentIn) {
    const matchingResultOfH1TagContent = htmlSnippetToSearchContentIn.match(
        /<h1( id=".+".*)?>(<a.+>.*<\/a>)?(.*)<\/h1>/
    )

    if (matchingResultOfH1TagContent) {
        return matchingResultOfH1TagContent[3].trim()
    }

    return ''
}

module.exports = function buildHTMLTitleSnippetString(htmlContentViaMarkDownContent, options) {
    const {
        specifiedArticleTitle,
        shouldConsoleLogsInChinese,
    } = options


    let articleTitle
    if (specifiedArticleTitle) {
        articleTitle = specifiedArticleTitle
    } else {
        articleTitle = getTextContentOfFirstH1Tag(htmlContentViaMarkDownContent)
    }

    console.log('')

    let htmlTitleSnippet = ''

    if (articleTitle) {

        htmlTitleSnippet = `<title>${articleTitle}</title>`

        if (shouldConsoleLogsInChinese) {
            console.log(`文章标题为：${chalk.green('《' + articleTitle + '》')}`)
        } else {
            console.log(`Article title: ${chalk.green(articleTitle)}`)
        }

    } else {

        htmlTitleSnippet = '<title>HTML via MarkDown (by markdownIt)</title>'

        if (shouldConsoleLogsInChinese) {
            console.log(chalk.red('未找到文章标题'))
        } else {
            console.log(chalk.red('Article title not found.'))
        }
    }

    console.log('')

    return htmlTitleSnippet
}
