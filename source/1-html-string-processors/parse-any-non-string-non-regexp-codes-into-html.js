const PUNCTUATIONS_TO_SEARCH_AND_REPLACE_DIRECTLY = [
    // {
    //     sign: '&semi;',
    //     signRegExp: '',
    //     cssClassNames: 'wlc-punctuation wlc-semi-colon',
    // },
    {
        sign: ',',
        signRegExp: '',
        cssClassNames: 'wlc-punctuation wlc-comma',
    },
    {
        sign: '===',
        signRegExp: '',
        cssClassNames: 'wlc-punctuation wlc-tripple-equal-signs',
    },
    {
        sign: '!==',
        signRegExp: '\\!===',
        cssClassNames: 'wlc-punctuation wlc-exclamation-mark-and-double-equal-signs',
    },
    {
        sign: '=&gt;',
        signRegExp: '',
        cssClassNames: 'wlc-punctuation wlc-arrow-function-sign',
    },
    {
        sign: '&gt;=',
        signRegExp: '',
        cssClassNames: 'wlc-punctuation wlc-greater-than-or-equal-to-sign',
    },
    {
        sign: '&lt;=',
        signRegExp: '',
        cssClassNames: 'wlc-punctuation wlc-less-than-or-equal-to-sign',
    },
    {
        sign: '&amp;&amp;',
        signRegExp: '',
        cssClassNames: 'wlc-punctuation wlc-double-ampersands',
    },
    {
        sign: '.',
        signRegExp: '\\.',
        cssClassNames: 'wlc-punctuation wlc-period',
    },
    {
        sign: '?',
        signRegExp: '\\?',
        cssClassNames: 'wlc-punctuation wlc-question-mark',
    },
    {
        sign: ':',
        signRegExp: '',
        cssClassNames: 'wlc-punctuation wlc-colon',
    },
    {
        sign: '++',
        signRegExp: '\\+\\+',
        cssClassNames: 'wlc-punctuation wlc-plus-plus-sign',
    },
    {
        sign: '--',
        signRegExp: '',
        cssClassNames: 'wlc-punctuation wlc-minus-minus-sign',
    },
    {
        sign: '%',
        signRegExp: '',
        cssClassNames: 'wlc-punctuation wlc-percentage-sign',
    },
    {
        sign: '(',
        signRegExp: '\\(',
        cssClassNames: 'wlc-punctuation wlc-parenthesis wlc-parenthesis-open',
    },
    {
        sign: ')',
        signRegExp: '\\)',
        cssClassNames: 'wlc-punctuation wlc-parenthesis wlc-parenthesis-close',
    },
    {
        sign: '[',
        signRegExp: '\\[',
        cssClassNames: 'wlc-punctuation wlc-square-bracket wlc-square-bracket-open',
    },
    {
        sign: ']',
        signRegExp: '\\]',
        cssClassNames: 'wlc-punctuation wlc-square-bracket wlc-square-bracket-close',
    },
    {
        sign: '{',
        signRegExp: '\\{',
        cssClassNames: 'wlc-punctuation wlc-curly-brace wlc-curly-brace-open',
    },
    {
        sign: '}',
        signRegExp: '\\}',
        cssClassNames: 'wlc-punctuation wlc-curly-brace wlc-curly-brace-close',
    },
]

module.exports = function processAnyNonStringNonRegExpContextOfHTMLString(astNode) {
    var html = astNode.content

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

    PUNCTUATIONS_TO_SEARCH_AND_REPLACE_DIRECTLY.forEach(({ sign, signRegExp, cssClassNames })=> {
        html = html.replace(
            new RegExp(signRegExp || sign, 'g'),
            `<span class="${cssClassNames}">${sign}</span>`
        )
    })


    html = html.replace(
        /([^=])==([^=])/g,
        '$1<span class="wlc-punctuation wlc-double-equal-signs">==</span>$2'
    )

    html = html.replace(
        /([^=])&gt;([^=])/g,
        '$1<span class="wlc-punctuation wlc-greater-than-sign">></span>$2'
    )

    html = html.replace(
        /&lt;([^=])/g,
        '<span class="wlc-punctuation wlc-less-than-sign"><</span>$1'
    )

    html = html.replace(
        /!=([^=])/g,
        '<span class="wlc-punctuation wlc-exclamation-mark-and-equal-sign">!=</span>$1'
    )

    html = html.replace(
        /([^"=;]\s*)=(\s*[^"=&>])/g,
        '$1<span class="wlc-punctuation wlc-equal-sign">=</span>$2'
    )

    html = html.replace(
        /([^!])((!!)+)([^!])/g,
        '$1<span class="wlc-punctuation wlc-exclamation-marks even-count">$2</span>$4'
    )

    html = html.replace(
        /([^!])!((!!)*)([^!])/g,
        '$1<span class="wlc-punctuation wlc-exclamation-marks odd-count">!$3</span>$4'
    )

    html = html.replace(
        /(<span class="hljs-number">[^-]*)-(\d+)/g,
        '$1<span class="wlc-punctuation wlc-negative-sign">-</span>$2'
    )

    html = html.replace(
        /(<span class="hljs-number">[^+]*)\+(\d+)/g,
        '$1<span class="wlc-punctuation wlc-positive-sign">+</span>$2'
    )

    /*
        below will match:
            1. dashes in html attributes
            2. dashes in css attributes
            3. html comments quoting signs
        Not a broken visual effect at all finally,
        but way too many of them.
        So not satisfying.
    */
    // html = html.replace(
    //     /(>[^<-]*)-/g,
    //     '$1<span class="wlc-punctuation wlc-minus-sign">-</span>'
    // )


    /*
        below will match:
            1. javascript/css comments quoting signs
        Not a broken visual effect at all finally.
        But not satisfying.
    */
    // html = html.replace(
    //     /([^<>])\//g,
    //     '$1<span class="wlc-punctuation wlc-forward-slash">/</span>'
    // )


    html = html.replace(
        /\|\|/g,
        '<span class="wlc-punctuation wlc-double-pipes">||</span>'
    )

    html = html.replace(
        /([^|])\|([^|])/g,
        '$1<span class="wlc-punctuation wlc-pipe">|</span>$2'
    )


    return html
}
