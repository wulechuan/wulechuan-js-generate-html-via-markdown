const chalk = require('chalk')

const buildHighOrderTasksForABatchOfTaskSettings = require('../utils/build-3-types-of-high-order-tasks')

const taskCycleForMarkdownConversions = require(
    '../task-cycles/build-peer-dependency-examples/building-htmls'
)

const taskCycleForCopyingIllustrates = require(
    '../task-cycles/build-peer-dependency-examples/copying-illustrates'
)


module.exports = buildHighOrderTasksForABatchOfTaskSettings({
    taskCyclesInPallarel: [
        taskCycleForMarkdownConversions,
        taskCycleForCopyingIllustrates,
    ],

    beforeBuildingEveryThingOnce: function() {
        console.log(`\n正在采用默认主题${chalk.black.bgBlue('构建所有语言版本的示例文档')}的 HTML 文件`)
    },
})
