const {
    codeLanguageIsOneOf,    // eslint-disable-line no-unused-vars
    codeLanguageIsNotAnyOf, // eslint-disable-line no-unused-vars
} = require('../code-language-matchers')


const COMMON_PUNCTUATIONS_TO_SEARCH_AND_REPLACE_DIRECTLY = [
    {
        sign: '#',
        signRegExp: '',
        cssClassNames: 'punctuation sharp-sign',
    },
    {
        sign: ',',
        signRegExp: '',
        cssClassNames: 'punctuation comma',
    },
    {
        sign: '.',
        signRegExp: '\\.',
        cssClassNames: 'punctuation period',
    },
    {
        sign: ':',
        signRegExp: '',
        cssClassNames: 'punctuation colon',
    },
    {
        sign: '(',
        signRegExp: '\\(',
        cssClassNames: 'punctuation parenthesis open-parenthesis',
    },
    {
        sign: ')',
        signRegExp: '\\)',
        cssClassNames: 'punctuation parenthesis close-parenthesis',
    },
    {
        sign: '[',
        signRegExp: '\\[',
        cssClassNames: 'punctuation bracket open-bracket',
    },
    {
        sign: ']',
        signRegExp: '\\]',
        cssClassNames: 'punctuation bracket close-bracket',
    },
    {
        sign: '{',
        signRegExp: '\\{',
        cssClassNames: 'punctuation curly-brace open-curly-brace',
    },
    {
        sign: '}',
        signRegExp: '\\}',
        cssClassNames: 'punctuation curly-brace close-curly-brace',
    },
]

const SPECIAL_PUNCTUATIONS_TO_SEARCH_AND_REPLACE_DIRECTLY = [
    {
        sign: '===',
        signRegExp: '',
        cssClassNames: 'punctuation tripple-equal-signs',
    },
    {
        sign: '!==',
        signRegExp: '\\!===',
        cssClassNames: 'punctuation exclamation-mark-and-double-equal-signs',
    },
    {
        sign: '=&gt;',
        signRegExp: '',
        cssClassNames: 'punctuation arrow-function-sign',
    },
    {
        sign: '&gt;=',
        signRegExp: '',
        cssClassNames: 'punctuation greater-than-or-equal-to-sign',
    },
    {
        sign: '&lt;=',
        signRegExp: '',
        cssClassNames: 'punctuation less-than-or-equal-to-sign',
    },
    {
        sign: '&amp;&amp;',
        signRegExp: '',
        cssClassNames: 'punctuation double-ampersands',
    },
    {
        sign: '?',
        signRegExp: '\\?',
        cssClassNames: 'punctuation question-mark',
    },
    {
        sign: '++',
        signRegExp: '\\+\\+',
        cssClassNames: 'punctuation plus-plus-sign',
    },
    {
        sign: '--',
        signRegExp: '',
        cssClassNames: 'punctuation minus-minus-sign',
    },
    {
        sign: '+=',
        signRegExp: '\\+=',
        cssClassNames: 'punctuation plus-and-assign-to',
    },
    {
        sign: '-=',
        signRegExp: '\\-=',
        cssClassNames: 'punctuation minus-and-assign-to',
    },
    {
        sign: '*=',
        signRegExp: '\\*=',
        cssClassNames: 'punctuation multiply-and-assign-to',
    },
    {
        sign: '/=',
        signRegExp: '\\/=',
        cssClassNames: 'punctuation divide-by-and-assign-to',
    },
    {
        sign: '%=',
        signRegExp: '',
        cssClassNames: 'punctuation modulo-by-and-assign-to',
    },
]


module.exports = {
    parseVeryCommonPunctuationsInAnASTNodeIntoHTML,
    parseAllRestPunctuationsInAnASTNodeIntoHTML,
}


function parseVeryCommonPunctuationsInAnASTNodeIntoHTML(astNode) {
    let { content } = astNode

    COMMON_PUNCTUATIONS_TO_SEARCH_AND_REPLACE_DIRECTLY.forEach(({ sign, signRegExp, cssClassNames })=> {
        content = content.replace(
            new RegExp(signRegExp || sign, 'g'),
            `<span class="${cssClassNames}">${sign}</span>`
        )
    })

    content = content.replace(
        /\|\|/g,
        '<span class="punctuation double-pipes">||</span>'
    )

    content = content.replace(
        /([^|])\|([^|])/g,
        '$1<span class="punctuation pipe">|</span>$2'
    )

    astNode.content = content
}

function parseAllRestPunctuationsInAnASTNodeIntoHTML(astNode) {
    const { codeLanguage } = astNode
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
    //     '$1<span class="punctuation minus-sign">-</span>'
    // )


    /*
        below will match:
            1. javascript/css comments quoting signs
        Not a broken visual effect at all finally.
        But not satisfying.
    */
    // html = html.replace(
    //     /([^<>])\//g,
    //     '$1<span class="punctuation forward-slash">/</span>'
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

    if (codeLanguageIsOneOf(codeLanguage, [
        'xml',
        'html',
    ])) {
        html = html.replace(
            /(\s*[^"';])=([^"'&]\s*)/g,
            '$1<span class="punctuation equal-sign">=</span>$2'
        )
    } else {
        /*
            TODO: Not perfect.
            Both =' & =" are allowed inside javascript.
            But according to regexp below, these two are not processed as expected.
        */
        html = html.replace(
            /\s*([^"';!=+\-*/%&|^~])=([^"'&=>]\s*)/g,
            '$1<span class="punctuation equal-sign">=</span>$2'
        )
    }

    return html
}

function processExclamationMarks(html, codeLanguage) {
    /**
     * Snippets like "!!<span" will finally produce ".*!!"
     * Thus !! might be at tail of a content string.
     * So we need to consider the "$" in our regexps used below.
     * The same as the "^".
     */
    html = html.replace(
        /(^|([^!]))((!!)+)(([^!])|$)/g,
        '$2<span class="punctuation exclamation-marks even-count">$3</span>$6'
    ).replace(
        /(^|([^!]))!((!!)*)(([^!])|$)/g,
        '$2<span class="punctuation exclamation-marks odd-count">!$4</span>$6'
    )

    if (codeLanguageIsOneOf(codeLanguage, [
        'css',
        'stylus',
        'less',
        'sass',
    ])) {
        html = html.replace(
            /<span class="hljs-meta"><span class="punctuation exclamation-marks odd-count">!<\/span>important/g,
            '<span class="hljs-meta css-exclamation-important">!important'
        ).replace(
            /<span class="punctuation exclamation-marks odd-count">!<\/span>important(\s*[;<])/g,
            '<span class="hljs-meta css-exclamation-important">!important</span>$1'
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
        '$1<span class="punctuation double-equal-signs">==</span>$2'
    )


    if (!codeLanguage) {
        console.log(`codeLanguage = "${codeLanguage}"`)
    }

    if (codeLanguageIsNotAnyOf(codeLanguage, [
        'xml',
        'html',
    ])) {
        html = html.replace(
            /&lt;([^=])/g,
            '<span class="punctuation less-than-sign"><</span>$1'
        ).replace(
            /([^=])&gt;([^=])/g,
            '$1<span class="punctuation greater-than-sign">></span>$2'
        )
    }



    html = html.replace(
        /!=([^=])/g,
        '<span class="punctuation exclamation-mark-and-equal-sign">!=</span>$1'
    )

    html = html.replace(
        /([^+])\+([^=+])/g,
        '$1<span class="punctuation plus-sign">+</span>$2'
    )

    html = html.replace(
        /([^*])\*([^=*])/g,
        '$1<span class="punctuation asterisk">*</span>$2'
    )

    html = html.replace(
        /%([^=])/g,
        '<span class="punctuation percentage-sign">%</span>$1'
    )

    html = html.replace(
        /;/g,
        '<span class="punctuation semi-colon">;</span>'
    ).replace(
        /(&\w{2,})<span class="punctuation semi-colon">;<\/span>/g,
        '$1;'
    )

    return html
}
