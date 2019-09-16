const chalk = require('chalk')

const {
    series:   gulpBuildTaskSeries,
    parallel: gulpBuildParallelTasks,
    watch:    gulpWatch,
} = require('gulp')




function isAFunction(thing) {
    return typeof thing === 'function'
}
function isNotAFunction(thing) {
    return typeof thing !== 'function'
}
function tryToInvoke(theFunction) {
    if (isAFunction(theFunction)) {
        theFunction()
    }
}



module.exports = function buildHighOrderTasksForABatchOfTaskSettings({
    taskCyclesInPallarel,

    beforeCleaningEveryThing,
    afterCleaningEveryThing,

    beforeBuildingEveryThingOnce,
    afterBuildingEveryThingOnce,

    beforeWatchingEveryThing,

    languageCodeOfBuiltInMessages,
}) {
    function functionOfNothingToDo(cb) {
        console.log('')
        console.log(chalk.green(messageThatSaysNothingToDo))
        console.log('')
        cb()
    }



    let messageThatSaysNothingToDo
    let defaultMessageBeforeCleaningOldOutputs
    let defaultMessageBeforeBuildingNewOutputs
    let defaultMessageBeforeWatchingStarts

    switch (languageCodeOfBuiltInMessages) {
        case 'zh-hans':
        case 'zh-Hans':
        case 'zh-CN':
        case 'zh-cn':
        case 'zh-hans-cn':
        case 'zh-hans-CN':
            messageThatSaysNothingToDo = '无事可做'
            defaultMessageBeforeCleaningOldOutputs = `正在${chalk.red('删除')}旧有的输出文件`
            defaultMessageBeforeBuildingNewOutputs = `正在${chalk.black.bgBlue('构建')}新的输出文件`
            defaultMessageBeforeWatchingStarts     = `正在${chalk.black.bgBlue('监视')} 一切源文件变动`
            break

        default:
            messageThatSaysNothingToDo = 'Nothing to do'
            defaultMessageBeforeCleaningOldOutputs = `${chalk.red('Deleting')} all old output files`
            defaultMessageBeforeBuildingNewOutputs = `${chalk.black.bgBlue('Building')} new output files`
            defaultMessageBeforeWatchingStarts     = `${chalk.black.bgBlue('Watching')} any changes of any source files`
            break
    }


    if (!Array.isArray(taskCyclesInPallarel) || taskCyclesInPallarel.length === 0) {
        return {
            cleanAllOldOuputs:   functionOfNothingToDo,
            buildEverythingOnce: functionOfNothingToDo,
            watchEverything:     functionOfNothingToDo,
        }
    }





    if (isNotAFunction(beforeCleaningEveryThing)) {
        beforeCleaningEveryThing = function() {
            console.log(`\n${defaultMessageBeforeCleaningOldOutputs}`)
        }
    }

    if (isNotAFunction(beforeBuildingEveryThingOnce)) {
        beforeBuildingEveryThingOnce = function() {
            console.log(`\n${defaultMessageBeforeBuildingNewOutputs}`)
        }
    }

    if (isNotAFunction(beforeWatchingEveryThing)) {
        beforeWatchingEveryThing = function() {
            console.log(`\n${defaultMessageBeforeWatchingStarts}`)
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
            tryToInvoke(afterCleaningEveryThing)
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
            tryToInvoke(afterBuildingEveryThingOnce)
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
