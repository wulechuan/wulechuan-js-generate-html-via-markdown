const {
    代码语种系以下之任一,    // eslint-disable-line no-unused-vars
    代码语种非以下之任一, // eslint-disable-line no-unused-vars
} = require('../代码语种称谓比对之工具集')



module.exports = {
    parseCSSFamilyStuffsInAnASTNodeIntoHTMLBeforeProcessingPunctuations,
    parseCSSFamilyStuffsInAnASTNodeIntoHTMLAfterProcessingPunctuations,
}



function parseCSSFamilyStuffsInAnASTNodeIntoHTMLBeforeProcessingPunctuations(astNode) {
    if (!astNode.content) { return }
    astNode.content = astNode.content
        .replace(
            /([(,]\s*)([+-]?(\d*\.\d+|\d+)(\w{1,5})?)/g,
            [
                '$1<span class="hljs-number">$2</span>',
            ].join('')
        )
        .replace(
            /([^+-])([+-]?)<span class="hljs-number">/g,
            [
                '$1<span class="hljs-number">$2',
            ].join('')
        )
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
            /([+-]?)(\d*\.\d+|\d+)(cap|ch|em|ex|ic|lh|rem|rlh|vh|vw|vi|vb|vmin|vmax)/g,
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
            /([+-]?)(\d*\.\d+|\d+)(px|mm|cm|Q|in|pt|pc)/g,
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
        .replace(
            /(\bcurrent[Cc]olor\b)/g,
            [
                '<span class="hljs-built_in css-current-color">$1</span>',
            ].join('')
        )
        .replace(
            /(\b((sans-)?serif|monospace|cursive|fantasy|system-ui|emoji|math|fangsong)\b)/gi,
            [
                '<span class="hljs-built_in css-generic-font-family-name $1">$1</span>',
            ].join('')
        )
        .replace(
            /(\b(inherit|initial|unset)\b)/gi,
            [
                '<span class="hljs-built_in css-implict-value $1">$1</span>',
            ].join('')
        )
        .replace(
            /<span class="hljs-number">#/g,
            '<span class="hljs-number color-hex-value">#'
        )
}



function parseCSSFamilyStuffsInAnASTNodeIntoHTMLAfterProcessingPunctuations(astNode) {
    if (!astNode.content) { return }
    astNode.content = astNode.content
        .replace(
            /([:^\n\s])(black|silver|gray|white|maroon|red|purple|fuchsia|green|lime|olive|yellow|navy|blue|teal|aqua|orange|aliceblue|antiquewhite|aquamarine|azure|beige|bisque|blanchedalmond|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|gainsboro|ghostwhite|gold|goldenrod|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|limegreen|linen|magenta|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|oldlace|olivedrab|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|thistle|tomato|turquoise|violet|wheat|whitesmoke|yellowgreen|rebeccapurple)([;}\s\n$]|<br)/gi,
            [
                '$1<span class="hljs-built_in css-color-value css-named-color $2">$2</span>$3',
            ].join('')
        )
}
