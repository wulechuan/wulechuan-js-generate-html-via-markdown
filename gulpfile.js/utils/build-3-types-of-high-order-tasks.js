const chalk = require('chalk')

const {
    series:   gulpBuildTaskSeries,
    parallel: gulpBuildParallelTasks,
    watch:    gulpWatch,
} = require('gulp')



function nothingToDo(cb) {
    console.log('')
    console.log(chalk.green('无事可做'))
    console.log('')
    cb()
}


module.exports = function buildHighOrderTasksForABatchOfTaskSettings({
    taskCyclesInPallarel,

    beforeCleaningEveryThing,
    afterCleaningEveryThing,

    beforeBuildingEveryThingOnce,
    afterBuildingEveryThingOnce,

    beforeWatchingEveryThing,
}) {
    if (!Array.isArray(taskCyclesInPallarel) || taskCyclesInPallarel.length === 0) {
        return {
            cleanAllOldOuputs:   nothingToDo,
            buildEverythingOnce: nothingToDo,
            watchEverything:     nothingToDo,
        }
    }



    if (typeof beforeCleaningEveryThing !== 'function') {
        beforeCleaningEveryThing = function() {
            console.log(`\n正在${chalk.red('删除')}旧有的输出文件`)
        }
    }

    if (typeof beforeBuildingEveryThingOnce !== 'function') {
        beforeBuildingEveryThingOnce = function() {
            console.log(`\n正在${chalk.black.bgBlue('构建')}新的输出文件`)
        }
    }

    if (typeof beforeWatchingEveryThing !== 'function') {
        beforeWatchingEveryThing = function() {
            console.log(`\n正在${chalk.black.bgBlue('监视')} 文件变动`)
        }
    }



    const cleanAllOldOuputs = gulpBuildTaskSeries(
        function _beforeCleaningEveryThing(cb) {
            beforeCleaningEveryThing()
            cb()
        },

        gulpBuildParallelTasks(
            ...taskCyclesInPallarel.map(taskSettings => taskSettings.taskBodies.cleanOldOutputs)
        ),

        function _afterCleaningEveryThing(cb) {
            if (typeof afterCleaningEveryThing === 'function') {
                afterCleaningEveryThing()
            }
            cb()
        }
    )

    const buildEverythingOnce = gulpBuildTaskSeries(
        function _beforeBuildingEveryThingOnce(cb) {
            beforeBuildingEveryThingOnce()
            cb()
        },

        gulpBuildParallelTasks(
            ...taskCyclesInPallarel.map(taskSettings => taskSettings.taskBodies.buildNewOutputs)
        ),

        function _afterBuildingEveryThingOnce(cb) {
            if (typeof afterBuildingEveryThingOnce === 'function') {
                afterBuildingEveryThingOnce()
            }
            cb()
        }
    )

    const watchEverything = gulpBuildTaskSeries(
        function startAllWatchers(cb) {
            beforeWatchingEveryThing()

            taskCyclesInPallarel.forEach(taskSettings => {
                gulpWatch(
                    taskSettings.sourceGlobsToWatch,
                    { ignoreInitial: false },
                    taskSettings.taskBodies.buildNewOutputs
                )
            })

            cb()
        }
    )


    return {
        cleanAllOldOuputs,
        buildEverythingOnce,
        watchEverything,
    }
}
