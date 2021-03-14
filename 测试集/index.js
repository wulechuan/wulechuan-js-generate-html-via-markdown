/// <reference path="../源代码/types/index.d.ts" />

const {
    readFileSync: 阻塞式读取文件之内容,
    writeFileSync: 阻塞式将内容写入文件,
    existsSync: 阻塞式探明文件存在,
    mkdirSync: 阻塞式创建单层文件夹,
} = require('fs')

const 路径工具 = require('path')
const { join: 遵循POSIX标准拼接路径 } = 路径工具.posix

// 为简化本 npm 包之用法，本 npm 包预先构建了一枚转换器。
const 本NPM包现成提供的一枚转换器 = require('..')
const 本NPM包之Package点JSON文件 = require('../package.json')

const {
    本NPM包之Peer依赖包之名称,
} = require('../源代码/面向研发阶段之配置')



/**
 * npm 运行本测试集时，
 * 计算机进程之【工作路径】为本 npm 包之根文件夹，
 * 而非本 javascript 文件之存放文件夹之路径。
 *
 * 故，下方多个相对路径均从本 npm 包之根文件夹出发，
 * 而非从本 javascript 文件出发。
 */
const 自本NPM包之根文件夹至本NPM包之汉语版说明书文件之相对路径 = './ReadMe.md'
const 自本NPM包之根文件夹至测试集输出内容之存放文件夹之相对路径 = './测试集/输出之内容'
const 自本NPM包之根文件夹至测试转换简短文章之输出内容之存放文件夹之相对路径 = 遵循POSIX标准拼接路径(自本NPM包之根文件夹至测试集输出内容之存放文件夹之相对路径, '其余测试集')





const 简短之文章之Markdown内容字符串 = [
    '# 用于测试本工具之文章',
    '## 此为某一级章节之标题',
    '### 此为某二级章节之标题',
    '踵事者易，创始者难。',
    '> 本工具之测试集故意令本文产出两个不同版本的 HTML 文件，请留意左侧【文章纲要】之细节变化。',
    '',
].join('\n\n')





// 下方产出为简短文章之所谓甲型风貌，又故意分为两个变种。变种二用以“卖弄”转换器之某些配置项。
const 由简短文章产出之甲型风貌之变种其一之HTML内容字符串 = 本NPM包现成提供的一枚转换器(简短之文章之Markdown内容字符串)

const 由简短文章产出之甲型风貌之变种其二之HTML内容字符串 = 本NPM包现成提供的一枚转换器(简短之文章之Markdown内容字符串, {
    将Markdown转换为HTML之阶段: {
        构建文章纲要列表时自该级别之标题始: 1,
        各章节标题超链接之符号字符串: '✨✨✨', // 由本例可见，此处允许采用多个字符。
    },

    对HTML做进一步处理之阶段: {
        须对产出之HTML内容字符串依次按下诸内容替换规则做修订: {
            '2 额外的替换规则序列': [
                {
                    凡: '本工具',
                    替换为: ` ${本NPM包之Package点JSON文件.name} `,
                },
            ],
        },
    },
})





// 下方产出为简短文章之所谓乙型风貌，实则极简风貌。即，欲输出极简风貌之文章，以此为例。
const 由简短文章产出之乙型风貌之HTML内容字符串 = 本NPM包现成提供的一枚转换器(简短之文章之Markdown内容字符串, {
    须在控制台打印详尽细节: true,

    将Markdown转换为HTML之前之预备阶段: {
        不应主动插入TOC之占位标记: true,
    },

    将Markdown转换为HTML之阶段: {
        不应为各章节标题构建超链接: true,
    },

    对HTML做进一步处理之阶段: {
        不应将代码块中的换行符替换成BR标签: true,
        不应采用任何由本工具内建之层叠样式表: true,
        产出之HTML文件之Title标签之内容字符串: '简文一则',
        产出之HTML文件之HTML标签之语言属性之取值: 'en-US', // 故意假想输出之文章内容为外国话，仅为演示该选项之功用。
        不应注入用于返回文章起始之按钮: true,

        须对产出之HTML内容字符串依次按下诸内容替换规则做修订: {
            '2 额外的替换规则序列': [
                {
                    凡: '本工具',
                    替换为: ` ${本NPM包之Package点JSON文件.name} `,
                },
            ],
        },
    },

    杂项: {
        控制台打印信息须改用英国话: true,
    },
})





const 由本工具之汉语版说明书产出之HTML内容字符串 = 本NPM包现成提供的一枚转换器(
    阻塞式读取文件之内容(自本NPM包之根文件夹至本NPM包之汉语版说明书文件之相对路径).toString(),
    {
        对HTML做进一步处理之阶段: {
            采用由本工具内建之层叠样式表时应采用未经压缩之版本: false,
            采用由本工具内建之Javascript时应采用未经压缩之版本: true,

            须对产出之HTML内容字符串依次按下诸内容替换规则做修订: {
                '2 额外的替换规则序列': [
                    {
                        凡: `<link rel="stylesheet" href="./node_modules/${本NPM包之Peer依赖包之名称}/源代码/发布的源代码/文章排版与配色方案集/层叠样式表/wulechuan-styles-for-html-via-markdown--vscode.default.min.css">`,
                        替换为: '',
                    },
                ],
            },
        },
    }
)





if (!阻塞式探明文件存在(自本NPM包之根文件夹至测试集输出内容之存放文件夹之相对路径)) {
    阻塞式创建单层文件夹(自本NPM包之根文件夹至测试集输出内容之存放文件夹之相对路径)
}

if (!阻塞式探明文件存在(自本NPM包之根文件夹至测试转换简短文章之输出内容之存放文件夹之相对路径)) {
    阻塞式创建单层文件夹(自本NPM包之根文件夹至测试转换简短文章之输出内容之存放文件夹之相对路径)
}



阻塞式将内容写入文件(
    遵循POSIX标准拼接路径(自本NPM包之根文件夹至测试转换简短文章之输出内容之存放文件夹之相对路径, '用于测试本工具之文章之甲型风貌之变种其一.html'),
    由简短文章产出之甲型风貌之变种其一之HTML内容字符串
)

阻塞式将内容写入文件(
    遵循POSIX标准拼接路径(自本NPM包之根文件夹至测试转换简短文章之输出内容之存放文件夹之相对路径, '用于测试本工具之文章之甲型风貌之变种其二.html'),
    由简短文章产出之甲型风貌之变种其二之HTML内容字符串
)

阻塞式将内容写入文件(
    遵循POSIX标准拼接路径(自本NPM包之根文件夹至测试转换简短文章之输出内容之存放文件夹之相对路径, '用于测试本工具之文章之极简风貌，且假想其内容为外国话.html'),
    由简短文章产出之乙型风貌之HTML内容字符串
)

阻塞式将内容写入文件(
    遵循POSIX标准拼接路径(自本NPM包之根文件夹至测试集输出内容之存放文件夹之相对路径, '本-npm-工具之汉语版《说明书》.html'),
    由本工具之汉语版说明书产出之HTML内容字符串
)
