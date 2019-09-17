const {
    splitStringIntoASTByOpenAndCloseMarks,
    parseASTIntoString,
} = require('./split-string-by-open-and-close-marks')

const parseOnRegExpIntoHTML = require('./parse-one-regexp-into-html')

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




    // const standardEscapeChars = [
    //     { escapedChar: 'n', cssClassName: 'new-line' },
    //     { escapedChar: 'r', cssClassName: 'carriage-return' },
    //     { escapedChar: 't', cssClassName: 'tab' },
    //     { escapedChar: '\'', cssClassName: 'single-quote' },
    //     { escapedChar: '"', cssClassName: 'double-quote' },
    //     { escapedChar: '/', cssClassName: 'forward-mark' },
    //     { escapedChar: '\\\\', cssClassName: 'backward-slash' },
    // ]



    // standardEscapeChars.forEach(ec => {
    //     html = html.replace(
    //         new RegExp(`(\\\\${ec.escapedChar})`, 'g'),
    //         `<span class="wlc-escape-char ${ec.cssClassName}">\\<span class="escaped-char">${
    //             ec.escapedChar.startsWith('\\') ? ec.escapedChar.slice(1) : ec.escapedChar
    //         }</span></span>`
    //     )
    // })



    return html
}

module.exports = function processAllContentsOfAllPreTagsOfHTMLString(html) {
    const preTagsASTNodes = splitStringIntoASTByOpenAndCloseMarks(
        html,
        '<pre>',
        '</pre>',
        false
    )

    preTagsASTNodes.forEach(preTagASTNode => {
        const { content } = preTagASTNode

        if (!content) { return }


        if (!preTagASTNode.isEnclosured) {
            preTagASTNode.content = processAnyContextInPreTagsOfHTMLString(content)
        } else {
            const subASTNodes = splitStringIntoASTByOpenAndCloseMarks(
                content,
                '<span class="hljs-regexp">',
                '</span>',
                false
            )

            subASTNodes.forEach(regexpASTNode => {
                if (!regexpASTNode.isEnclosured) { return }

                const newContent = parseOnRegExpIntoHTML(regexpASTNode.content)
                regexpASTNode.content = newContent
            })

            preTagASTNode.content = subASTNodes
        }
    })


    return parseASTIntoString(preTagsASTNodes)
}
