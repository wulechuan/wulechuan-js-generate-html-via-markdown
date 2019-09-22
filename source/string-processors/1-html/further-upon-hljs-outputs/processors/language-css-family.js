const {
    codeLanguageIsOneOf,    // eslint-disable-line no-unused-vars
    codeLanguageIsNotAnyOf, // eslint-disable-line no-unused-vars
} = require('../code-language-matchers')


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
        content = content
            .replace(
                /<span class="hljs-number">([+-]?)(\d*\.\d+|\d+)(cap|ch|em|ex|ic|lh|rem|rlh|vh|vw|vi|vb|vmin|vmax)<\/span>/g,
                [
                    '<span class="css-length">',
                    '<span class="hljs-number">$1$2</span>',
                    '<span class="css-unit length-unit relative-length-unit $3">$3</span>',
                    '</span>',
                ].join('')
            )
            .replace(
                /<span class="hljs-number">([+-]?)(\d*\.\d+|\d+)(px|mm|cm|Q|in|pt|pc)<\/span>/g,
                [
                    '<span class="css-length">',
                    '<span class="hljs-number">$1$2</span>',
                    '<span class="css-unit length-unit absolute-length-unit $3">$3</span>',
                    '</span>',
                ].join('')
            )
            .replace(
                /<span class="hljs-number">([+-]?)(\d*\.\d+|\d+)(s)<\/span>/g,
                [
                    '<span class="css-time-duration">',
                    '<span class="hljs-number">$1$2</span>',
                    '<span class="css-unit time-duration-unit">$3</span>',
                    '</span>',
                ].join('')
            )
            .replace(
                /<span class="hljs-number">([+-]?)(\d*\.\d+|\d+)(deg|rad|turn)<\/span>/g,
                [
                    '<span class="css-angle">',
                    '<span class="hljs-number">$1$2</span>',
                    '<span class="css-unit angle-unit">$3</span>',
                    '</span>',
                ].join('')
            )
            .replace(
                /([+-]?)(\d*\.\d+|\d+)(deg|rad|turn)/g,
                [
                    '<span class="css-angle">',
                    '<span class="hljs-number">$1$2</span>',
                    '<span class="css-unit angle-unit">$3</span>',
                    '</span>',
                ].join('')
            )
            .replace( // Some percentage values have already treated as number by hljs
                /<span class="hljs-number">([+-]?)(\d*\.\d+|\d+)%<\/span>/g,
                [
                    '<span class="percentage-value">',
                    '<span class="hljs-number">$1$2</span>',
                    '%',
                    '</span>',
                ].join('')
            )
            .replace( // Some percentage values have not been identified as number, thus are plain texts.
                /([+-]?)(\d*\.\d+|\d+)%/g,
                [
                    '<span class="percentage-value">',
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
