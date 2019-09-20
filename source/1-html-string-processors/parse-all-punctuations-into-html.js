const {
    codeLanguageIsOneOf,    // eslint-disable-line no-unused-vars
    codeLanguageIsNotAnyOf, // eslint-disable-line no-unused-vars
} = require('./code-language-matchers')


const COMMON_PUNCTUATIONS_TO_SEARCH_AND_REPLACE_DIRECTLY = [
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

const SPECIAL_PUNCTUATIONS_TO_SEARCH_AND_REPLACE_DIRECTLY = [
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


module.exports = {
    parseVeryCommonPunctuationsInAnASTNodeIntoHTML,
    parseAllRestPunctuationsInAnASTNodeIntoHTML,
}


function parseVeryCommonPunctuationsInAnASTNodeIntoHTML(astNode/*, codeLanguage*/) {
    let { content } = astNode

    COMMON_PUNCTUATIONS_TO_SEARCH_AND_REPLACE_DIRECTLY.forEach(({ sign, signRegExp, cssClassNames })=> {
        content = content.replace(
            new RegExp(signRegExp || sign, 'g'),
            `<span class="${cssClassNames}">${sign}</span>`
        )
    })

    content = content.replace(
        /\|\|/g,
        '<span class="wlc-punctuation wlc-double-pipes">||</span>'
    )

    content = content.replace(
        /([^|])\|([^|])/g,
        '$1<span class="wlc-punctuation wlc-pipe">|</span>$2'
    )

    astNode.content = content
}

function parseAllRestPunctuationsInAnASTNodeIntoHTML(astNode, codeLanguage) {
    let { content } = astNode

    content = processStandaloneEqualSigns(content, codeLanguage)
    content = processSpecialPunctuationsString(content, codeLanguage)
    content = processExclamationMarks(content, codeLanguage)

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

    astNode.content = content
}





function processStandaloneEqualSigns(html, codeLanguage) {
    /*
        Find standalone equal signs.
        Should avoid:
            =&gt; or => // arrow function sign
            ==
            ===
            !=
            !==
            >=  or  &gt;=
            <=  or  &lt;=
            "=
            ="
            '=
            ='
     */

    if (
        codeLanguageIsOneOf(codeLanguage, [
            'xml',
            'html',
        ])
    ) {
        html = html.replace(
            /(\s*[^"';])=([^"'&]\s*)/g,
            '$1<span class="wlc-punctuation wlc-equal-sign">=</span>$2'
        )
    } else {
        /*
            TODO: Not perfect.
            Both =' & =" are allowed inside javascript.
            But according to regexp below, these two are not processed as expected.
        */
        html = html.replace(
            /\s*([^"';!=])=([^"'&=>]\s*)/g,
            '$1<span class="wlc-punctuation wlc-equal-sign">=</span>$2'
        )
    }

    return html
}

function processExclamationMarks(html, codeLanguage) {
    if (html.match(/!/)) {
        console.log(html)
        console.log('-'.repeat(79))
    }

    html = html.replace(
        /([^!])((!!)+)([^!])/g,
        '$1<span class="wlc-punctuation wlc-exclamation-marks even-count">$2</span>$4'
    ).replace(
        /([^!])!((!!)*)([^!])/g,
        '$1<span class="wlc-punctuation wlc-exclamation-marks odd-count">!$3</span>$4'
    )

    if (
        codeLanguageIsOneOf(codeLanguage, [
            'css',
            'stylus',
            'less',
            'sass',
        ])
    ) {
        html = html.replace(
            /<span class="hljs-meta"><span class="wlc-punctuation wlc-exclamation-marks odd-count">!<\/span>important<\/span>/g,
            '<span class="hljs-meta css-exclamation-important>!important</span>'
        )
    }

    return html
}


function processSpecialPunctuationsString(html , codeLanguage) {
    SPECIAL_PUNCTUATIONS_TO_SEARCH_AND_REPLACE_DIRECTLY.forEach(({ sign, signRegExp, cssClassNames })=> {
        html = html.replace(
            new RegExp(signRegExp || sign, 'g'),
            `<span class="${cssClassNames}">${sign}</span>`
        )
    })


    html = html.replace(
        /([^=])==([^=])/g,
        '$1<span class="wlc-punctuation wlc-double-equal-signs">==</span>$2'
    )

    if (
        codeLanguageIsNotAnyOf(codeLanguage, [
            'xml',
            'html',
        ])
    ) {
        html = html.replace(
            /&lt;([^=])/g,
            '<span class="wlc-punctuation wlc-less-than-sign"><</span>$1'
        ).replace(
            /([^=])&gt;([^=])/g,
            '$1<span class="wlc-punctuation wlc-greater-than-sign">></span>$2'
        )
    }

    html = html.replace(
        /!=([^=])/g,
        '<span class="wlc-punctuation wlc-exclamation-mark-and-equal-sign">!=</span>$1'
    )

    return html
}
