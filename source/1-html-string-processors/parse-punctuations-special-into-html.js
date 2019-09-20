const PUNCTUATIONS_TO_SEARCH_AND_REPLACE_DIRECTLY = [
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
        sign: '?',
        signRegExp: '\\?',
        cssClassNames: 'wlc-punctuation wlc-question-mark',
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
]

module.exports = function processAnyNonStringNonRegExpContextOfHTMLString(astNode) {
    var html = astNode.content
    // console.log(html)
    // console.log('-'.repeat(79))


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

    astNode.content = html
}
