const chalk = require('chalk')
const {
    series,
    parallel,
} = require('gulp')

const {
    create3HighOrderTasksUponMultipleTaskCycles,
} = require('@wulechuan/gulp-classical-task-cycle')






const taskCycleForMarkdownConversions = require(
    '../task-cycles/build-peer-dependency-examples/building-htmls'
)

const taskCycleForCopyingIllustrates = require(
    '../task-cycles/build-peer-dependency-examples/copying-illustrates'
)

const taskCycleForCopyingMarkdowns = require(
    '../task-cycles/build-peer-dependency-examples/copying-markdowns'
)





const highOrderTasksForBuildingPeerDependencyExamples = create3HighOrderTasksUponMultipleTaskCycles({
    taskCyclesInPallarel: [
        taskCycleForMarkdownConversions,
    ],

    beforeBuildingEveryThingOnce: function() {
        console.log(`\n正在采用默认主题${chalk.black.bgBlue('构建所有语言版本的示例文档')}的 HTML 文件`)
    },
})

const {
    buildEverythingOnce: buildExampleHTMLsOnce,
    watchEverything: buildExampleHTMLsAndStartWatching,
} = highOrderTasksForBuildingPeerDependencyExamples

const prepareForBuildingPeerDependencyExamples = parallel(
    taskCycleForCopyingIllustrates.taskBodies.buildNewOutputs,
    taskCycleForCopyingMarkdowns.taskBodies.buildNewOutputs
)

module.exports = {
    cleanAllOldOuputs: parallel(
        taskCycleForCopyingIllustrates.taskBodies.cleanOldOutputs,
        taskCycleForCopyingMarkdowns.taskBodies.cleanOldOutputs,
        highOrderTasksForBuildingPeerDependencyExamples.cleanAllOldOuputs
    ),

    buildExampleHTMLsOnce: series(
        prepareForBuildingPeerDependencyExamples,
        buildExampleHTMLsOnce
    ),

    buildExampleHTMLsAndStartWatching: series(
        prepareForBuildingPeerDependencyExamples,
        buildExampleHTMLsAndStartWatching
    ),
}
