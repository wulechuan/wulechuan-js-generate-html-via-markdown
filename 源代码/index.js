require(
    './02-构造对外之默认接口/01-确保-peer-依赖包存在'
)

const 本工具现成提供的一枚转换器 = require(
    './02-构造对外之默认接口/02-构造一个现成的转换器作为本工具之对外默认接口'
)

module.exports = 本工具现成提供的一枚转换器



/**
 * @typedef {object} converterConversionPreparationOptions
 * @property {boolean} 不应主动插入TOC之占位标记
 */


/**
 * @typedef {object} converterConversionOptions
 * @property {boolean} 不应为各章节标题构建超链接
 * @property {string} 各章节标题超链接之符号字符串
 * @property {string} cssClassNameOfHeadingPermanentLinks
 * @property {string} cssClassNameOfArticleTOCRootTag
 * @property {string} cssClassNameOfArticleTOCLists
 * @property {string} cssClassNameOfArticleTOCListItems
 * @property {string} cssClassNameOfArticleTOCItemAnchors
 * @property {boolean} 文章纲要列表应采用UL标签而非OL标签
 * @property {number} 构建文章纲要列表时自该级别之标题始
 */


/**
 * @typedef {object} converterManipulationsOverHTMLOptions
 * @property {boolean} 不应将代码块中的换行符替换成BR标签
 * @property {boolean} 不应注入用于返回文章起始之按钮
 * @property {boolean} 不应采用任何由本工具内建之层叠样式表
 * @property {boolean} 采用由本工具内建之层叠样式表时应采用未经压缩之版本
 * @property {boolean} 采用由本工具内建之Javascript时应采用未经压缩之版本
 * @property {string} 产出之HTML文件之HTML标签之语言属性之取值
 * @property {string} 产出之HTML文件之Title标签之内容字符串
 * @property {string} 所采用之由本工具内建之含有文章纲要列表之定义之层叠样式表文件之名称
 * @property {string} 所采用之由本工具内建之不含文章纲要列表之定义之层叠样式表文件之名称
 * @property {string} cssClassNameOfBackToTopAnchor
 * @property {string} cssClassNameOfBodyTagWhenMarkdownArticleHasTOC
 * @property {string} cssClassNameOfMarkdownChiefContentWrappingArticleTag
 * @property {object[]} 须对产出之HTML内容字符串依次按下诸内容替换规则做修订
 * @property {string[]} 须读取以下诸文件之内容并全部注入产出之HTML内容中
 */


/**
 * @typedef {object} converterSundryOptions
 * @property {boolean} 控制台打印信息改用英国话
 * @property {boolean} 读取本工具内建之层叠样式表文件和Javascript文件时禁止Require语句缓存其内容
 */


/**
 * @exports
 * @function generateFullHTMLStringViaMarkdownString
 * @arg {string} markdownContent
 * @arg {object} options
 * @arg {boolean} options.须在控制台打印详尽细节
 * @arg {converterConversionPreparationOptions} options.将Markdown转换为HTML之前之预备阶段
 * @arg {converterConversionOptions} options.将Markdown转换为HTML之阶段
 * @arg {converterManipulationsOverHTMLOptions} options.对HTML做额外处理之阶段
 * @arg {converterSundryOptions} options.杂项
 * @returns {string} - Full HTML contents
 */
