const {
    splitStringIntoASTByOpenAndCloseMarks,
    parseASTIntoString,
} = require('./split-string-by-open-and-close-marks')

const parseOneRegExpIntoHTML = require('./parse-one-regexp-into-html')
const parseOneStringASTNodeIntoHTML = require('./parse-one-string-into-html')

function processAnyContextInPreTagsOfHTMLString(html) {
    const tokenTypesToAddWrapperTo = [
        'hljs-keyword',
        'hljs-built_in',
        'hljs-literal',
    ]

    tokenTypesToAddWrapperTo.forEach(tokenType => {
        html = html.replace(
            new RegExp(`<span class="${tokenType}">(\\w+)</span>`, 'g'),
            `<span class="${tokenType} $1">$1</span>`
        )
    })


    html = html.replace(
        /([\w_$][\w_$\d]*)(\s*=\s*<span class="hljs-function)/g,
        '<span class="wlc-function-name hljs-title wlc-var-name">$1</span>$2'
    )


    html = html.replace(
        /([^\\])\(/g,
        '$1<span class="wlc-parenthesis wlc-parenthesis-open">(</span>'
    )

    html = html.replace(
        /([^\\])\)/g,
        '$1<span class="wlc-parenthesis wlc-parenthesis-close">)</span>'
    )

    html = html.replace(
        /([^\\])\[/g,
        '$1<span class="wlc-square-bracket wlc-square-bracket-open">[</span>'
    )

    html = html.replace(
        /([^\\])\]/g,
        '$1<span class="wlc-square-bracket wlc-square-bracket-close">]</span>'
    )

    html = html.replace(
        /([^\\])\{/g,
        '$1<span class="wlc-curly-brace wlc-curly-brace-open">{</span>'
    )

    html = html.replace(
        /([^\\])\}/g,
        '$1<span class="wlc-curly-brace wlc-curly-brace-close">}</span>'
    )








    return html
}

module.exports = function processAllContentsOfAllPreTagsOfHTMLString(html) {
    const preTagsOrNotASTNodes = splitStringIntoASTByOpenAndCloseMarks(
        html,
        '<pre>',
        '</pre>',
        false
    )

    preTagsOrNotASTNodes.filter(n => n.isEnclosured).forEach(preTagASTNode => {
        if (!preTagASTNode.content) { return }


        const regexpOrNotASTNodes = splitStringIntoASTByOpenAndCloseMarks(
            preTagASTNode.content,
            '<span class="hljs-regexp">',
            '</span>',
            false
        )

        regexpOrNotASTNodes.filter(n =>  n.isEnclosured).forEach(regexpASTNode => {
            regexpASTNode.content = parseOneRegExpIntoHTML(regexpASTNode.content)
        })

        regexpOrNotASTNodes.filter(n => !n.isEnclosured).forEach(nonRegexpASTNode => {
            nonRegexpASTNode.content = processAnyContextInPreTagsOfHTMLString(nonRegexpASTNode.content)

            const stringOrNotASTNodes1 = splitStringIntoASTByOpenAndCloseMarks(
                nonRegexpASTNode.content,
                '<span class="hljs-string">\'',
                '\'</span>',
                false
            )

            // console.log(stringOrNotASTNodes1.length)
            let safeStringSpanHTMLs1
            let notStringOrUnsafeStringHTMLs1

            if (stringOrNotASTNodes1.length > 3) {
                safeStringSpanHTMLs1 = []
                notStringOrUnsafeStringHTMLs1 = stringOrNotASTNodes1
            } else {
                safeStringSpanHTMLs1          = stringOrNotASTNodes1.filter(n =>  n.isEnclosured)
                notStringOrUnsafeStringHTMLs1 = stringOrNotASTNodes1.filter(n => !n.isEnclosured)
            }

            safeStringSpanHTMLs1.forEach(stringASTNode1 => {
                stringASTNode1.content = parseOneStringASTNodeIntoHTML(stringASTNode1)
            })

            notStringOrUnsafeStringHTMLs1.forEach((/* nonStringASTNode1 */) => {
                // const stringOrNotASTNodes2 = splitStringIntoASTByOpenAndCloseMarks(
                //     nonStringASTNode1.content,
                //     '<span class="hljs-string">"',
                //     '"</span>',
                //     false
                // )

                // stringOrNotASTNodes2.filter(n =>  n.isEnclosured).forEach(stringASTNode2 => {
                //     stringASTNode2.content = parseOneStringASTNodeIntoHTML(stringASTNode2)
                // })

                // nonStringASTNode1.content = stringOrNotASTNodes2
            })

            nonRegexpASTNode.content = stringOrNotASTNodes1
        })


        preTagASTNode.content = regexpOrNotASTNodes
    })


    return parseASTIntoString(preTagsOrNotASTNodes)
}
