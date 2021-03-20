const chalk = require('chalk')

const {
    create3HighOrderTasksUponMultipleTaskCycles,
} = require('@wulechuan/gulp-classical-task-cycle')

const taskCycleForMarkdownConversions = require(
    '../task-cycles/build-peer-dependency-examples/building-htmls'
)

module.exports = create3HighOrderTasksUponMultipleTaskCycles({
    taskCyclesInPallarel: [
        taskCycleForMarkdownConversions,
    ],

    beforeBuildingEveryThingOnce: function() {
        console.log(`\n正在采用默认主题${chalk.black.bgBlue('构建所有语言版本的示例文档')}的 HTML 文件`)
    },
})