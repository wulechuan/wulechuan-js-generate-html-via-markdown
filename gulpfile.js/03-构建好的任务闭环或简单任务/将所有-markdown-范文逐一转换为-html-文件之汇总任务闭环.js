const 彩色粉笔工具 = require('chalk')

const {
    create3HighOrderTasksUponMultipleTaskCycles,
} = require('@wulechuan/gulp-classical-task-cycle')

const 专门用于将本NPM包之Peer依赖包中之Markdown范文逐一转换为HTML文件的任务闭环 = require(
    './将-peer-依赖包中之-markdown-范文逐一转换为-html-文件的任务闭环'
)

module.exports = create3HighOrderTasksUponMultipleTaskCycles({
    taskCyclesInPallarel: [
        专门用于将本NPM包之Peer依赖包中之Markdown范文逐一转换为HTML文件的任务闭环,
    ],

    beforeBuildingEveryThingOnce: function() {
        console.log(`\n正在采用默认主题${彩色粉笔工具.black.bgBlue('构建所有语言版本的示例文档')}的 HTML 文件`)
    },
})
