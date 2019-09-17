module.exports = function processAllContentsOfAllPreTagsOfHTMLString(html) {
    const tokenTypesToAddWrapperTo = [
        'hljs-keyword',
        'hljs-built_in',
        'hljs-literal',
    ]


    html = html.replace(
        /\/(g|gi|ig|i)?<\/span>/g,
        [
            '<span class="regexp-end">/</span>',
            '<span class="regexp-options">$1</span>',
            '</span>',
        ].join('')
    )

    html = html.replace(
        /([^\\])(\$)?<span class="regexp-end">/g,
        [
            '$1</span>',
            '<span class="regexp-selector-input-end">$2</span>',
            '<span class="regexp-end">',
        ].join('')
    )

    html = html.replace(
        /<span class="hljs-regexp">\/(\^)?/g,
        [
            '<span class="hljs-regexp">',
            '<span class="regexp-begin">/</span>',
            '<span class="regexp-selector-input-begin">$1</span>',
            '<span class="regexp-body">',
        ].join('')
    )



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

    // html = html.replace(
    //     /([^\\])\(/g,
    //     '$1<span class="wlc-parenthesis wlc-parenthesis-open">(</span>'
    // )

    // html = html.replace(
    //     /([^\\])\)/g,
    //     '$1<span class="wlc-parenthesis wlc-parenthesis-close">)</span>'
    // )

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



    const standardEscapeChars = [
        { escapedChar: 'n', cssClassName: 'new-line' },
        { escapedChar: 'r', cssClassName: 'carriage-return' },
        { escapedChar: 't', cssClassName: 'tab' },
        { escapedChar: '\'', cssClassName: 'single-quote' },
        { escapedChar: '"', cssClassName: 'double-quote' },
        { escapedChar: '/', cssClassName: 'forward-mark' },
        { escapedChar: '\\\\', cssClassName: 'backward-slash' },
    ]

    const regExpEscapeChars = [
        { escapedChar: 'w', cssClassName: 'regexp-selector-word' },
        { escapedChar: 'W', cssClassName: 'regexp-selector-non-word' },
        { escapedChar: 'd', cssClassName: 'regexp-selector-digit' },
        { escapedChar: 'D', cssClassName: 'regexp-selector-non-digit' },
        { escapedChar: 's', cssClassName: 'regexp-selector-whitespace' },
        { escapedChar: 'S', cssClassName: 'regexp-selector-non-whitespace' },
        { escapedChar: 'b', cssClassName: 'regexp-selector-boundary' },
        { escapedChar: 'B', cssClassName: 'regexp-selector-non-boundary' },
        // { escapedChar: '\\\\', cssClassName: 'regexp-selector-backward-slash' },
        { escapedChar: '\\?', cssClassName: 'regexp-selector-question-mark' },
        { escapedChar: '\\*', cssClassName: 'regexp-selector-asterisk' },
        { escapedChar: '\\+', cssClassName: 'regexp-selector-plus-sign' },
        { escapedChar: '\\.', cssClassName: 'regexp-selector-period' },
        { escapedChar: '\\(', cssClassName: 'regexp-selector-parenthesis parenthesis-open' },
        { escapedChar: '\\)', cssClassName: 'regexp-selector-parenthesis parenthesis-close' },
        { escapedChar: '\\[', cssClassName: 'regexp-selector-square-bracket square-bracket-open' },
        { escapedChar: '\\]', cssClassName: 'regexp-selector-square-bracket square-bracket-close' },
        { escapedChar: '\\{', cssClassName: 'regexp-selector-curly-brace curly-brace-open' },
        { escapedChar: '\\}', cssClassName: 'regexp-selector-curly-brace curly-brace-close' },
    ]

    const allEscapeChars = [
        ...standardEscapeChars,
        ...regExpEscapeChars,
    ]

    allEscapeChars.forEach(ec => {
        html = html.replace(
            new RegExp(`(\\\\${ec.escapedChar})`, 'g'),
            `<span class="wlc-escape-char ${ec.cssClassName}">\\<span class="escaped-char">${
                ec.escapedChar.startsWith('\\') ? ec.escapedChar.slice(1) : ec.escapedChar
            }</span></span>`
        )
    })

    html = html.replace(
        /<span class="wlc-curly-brace wlc-curly-brace-open">\{<\/span>(\d+)((,)(\d*))?<span class="wlc-curly-brace wlc-curly-brace-close">\}<\/span>/g,
        [
            '<span class="wlc-curly-brace wlc-curly-brace-open">{</span>',
            '<span class="wlc-digit-pair-between-curly-braces">',
            '<span class="digit digit-1">$1</span>',
            '<span class="comma">$3</span>',
            '<span class="digit digit-2">$4</span>',
            '</span>',
            '<span class="wlc-curly-brace wlc-curly-brace-close">}</span>',
        ].join('')
    )

    return html
}
