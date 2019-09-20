const {
    codeLanguageIsOneOf,    // eslint-disable-line no-unused-vars
    codeLanguageIsNotAnyOf, // eslint-disable-line no-unused-vars
} = require('./code-language-matchers')


module.exports = {
    parseCSSFamilyStuffsInAnASTNodeIntoHTMLBeforePunctuations,
    parseCSSFamilyStuffsInAnASTNodeIntoHTMLAfterPunctuations,
}


function parseCSSFamilyStuffsInAnASTNodeIntoHTMLBeforePunctuations(astNode, codeLanguage) {
    let { content } = astNode
    if (!content) { return }

    if (
        codeLanguageIsOneOf(codeLanguage, [
            'css',
            'stylus',
            'sass',
            'less',
        ])
    ) {
        content = content.replace(
            /([+-]?)(\d*.\d+|\d+)%/g,
            [
                '<span class="wlc-percentage-value">',
                '<span class="hljs-number">$1$2</span>',
                '%',
                '</span>',
            ].join('')
        )
    }

    if (
        codeLanguageIsOneOf(codeLanguage, [
            'css',
            'stylus',
            'sass',
            'less',
            'html', // HTML inline CSS, HTML <style> tags
        ])
    ) {
        content = content.replace(
            /<span class="hljs-number">#/g,
            '<span class="hljs-number color-hex-value">#'
        )
    }


    astNode.content = content
}

function parseCSSFamilyStuffsInAnASTNodeIntoHTMLAfterPunctuations(astNode/* , codeLanguage */ ) {
    let { content } = astNode // eslint-disable-line prefer-const
    if (!content) { return }
}
