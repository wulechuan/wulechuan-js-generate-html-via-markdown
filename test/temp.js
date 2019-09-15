const func = require('../gulpfile.esm.js/utils/_create-settings-for-one-abstract-task-cycle')
const {
    taskCycleOptionsForMarkdownConversions,
} = require('../gulpfile.esm.js/configs/peer-dependency-examples')

const taskCycle = func(taskCycleOptionsForMarkdownConversions)

module.exports.default = taskCycle.taskBodies.buildNewOutputs
