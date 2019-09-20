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
        sign: '.',
        signRegExp: '\\.',
        cssClassNames: 'wlc-punctuation wlc-period',
    },
    {
        sign: ':',
        signRegExp: '',
        cssClassNames: 'wlc-punctuation wlc-colon',
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
    // console.log(html)
    // console.log('-'.repeat(79))


    PUNCTUATIONS_TO_SEARCH_AND_REPLACE_DIRECTLY.forEach(({ sign, signRegExp, cssClassNames })=> {
        html = html.replace(
            new RegExp(signRegExp || sign, 'g'),
            `<span class="${cssClassNames}">${sign}</span>`
        )
    })


    html = html.replace(
        /\|\|/g,
        '<span class="wlc-punctuation wlc-double-pipes">||</span>'
    )

    html = html.replace(
        /([^|])\|([^|])/g,
        '$1<span class="wlc-punctuation wlc-pipe">|</span>$2'
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


    astNode.content = html
}
