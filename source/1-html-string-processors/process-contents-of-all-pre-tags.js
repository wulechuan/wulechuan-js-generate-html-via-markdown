const {
    splitStringIntoASTByOpenAndCloseMarks,
    parseASTIntoString,
} = require('./split-string-by-open-and-close-marks')

const parseOneRegExpIntoHTML = require('./parse-one-regexp-into-html')
const parseOneStringASTNodeIntoHTML = require('./parse-one-string-into-html')

function processAnyNotStringNonRegExpContextOfHTMLString(html) {
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
        /\(/g,
        '<span class="wlc-parenthesis wlc-parenthesis-open">(</span>'
    ).replace(
        /\)/g,
        '<span class="wlc-parenthesis wlc-parenthesis-close">)</span>'
    ).replace(
        /\[/g,
        '<span class="wlc-square-bracket wlc-square-bracket-open">[</span>'
    ).replace(
        /\]/g,
        '<span class="wlc-square-bracket wlc-square-bracket-close">]</span>'
    ).replace(
        /\{/g,
        '<span class="wlc-curly-brace wlc-curly-brace-open">{</span>'
    ).replace(
        /\}/g,
        '<span class="wlc-curly-brace wlc-curly-brace-close">}</span>'
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
            const stringOrNotASTNodes1 = splitStringIntoASTByOpenAndCloseMarks(
                nonRegexpASTNode.content,
                '<span class="hljs-string">\'',
                '\'</span>',
                false
            )

            const safeStringSpanHTMLs1 = stringOrNotASTNodes1.filter(n => {
                return n.isEnclosured && !n.content.match(/<span|<\/span>/)
            })
            const unsafeStringHTMLs1 = stringOrNotASTNodes1.filter(n => {
                return n.isEnclosured &&  n.content.match(/<span|<\/span>/)
            })

            unsafeStringHTMLs1.forEach(console.log)

            const notStringHTMLs1 = stringOrNotASTNodes1.filter(n => {
                return !n.isEnclosured && n.content
            })

            safeStringSpanHTMLs1.forEach(stringASTNode1 => {
                stringASTNode1.content = parseOneStringASTNodeIntoHTML(stringASTNode1)
            })

            notStringHTMLs1.forEach(nonStringASTNode1 => {
                const stringOrNotASTNodes2 = splitStringIntoASTByOpenAndCloseMarks(
                    nonStringASTNode1.content,
                    '<span class="hljs-string">"',
                    '"</span>',
                    false
                )

                const safeStringSpanHTMLs2 = stringOrNotASTNodes2.filter(n => {
                    return n.isEnclosured && !n.content.match(/<span|<\/span>/)
                })
                const unsafeStringHTMLs2 = stringOrNotASTNodes2.filter(n => {
                    return n.isEnclosured &&  n.content.match(/<span|<\/span>/)
                })

                unsafeStringHTMLs2.forEach(console.log)

                const notStringHTMLs2 = stringOrNotASTNodes2.filter(n => {
                    return !n.isEnclosured
                })

                safeStringSpanHTMLs2.forEach(stringASTNode1 => {
                    stringASTNode1.content = parseOneStringASTNodeIntoHTML(stringASTNode1)
                })

                notStringHTMLs2.forEach(nonStringASTNode2 => {
                    nonStringASTNode2.content = processAnyNotStringNonRegExpContextOfHTMLString(nonStringASTNode2.content)
                })


                nonStringASTNode1.content = stringOrNotASTNodes2
            })


            nonRegexpASTNode.content = stringOrNotASTNodes1
        })


        preTagASTNode.content = regexpOrNotASTNodes
    })


    return parseASTIntoString(preTagsOrNotASTNodes)
}
