const {
    cleanAllOldOuputs,
    buildEverythingOnce,
    watchEverything,
} = require(
    './03-构建好的任务闭环或简单任务/将所有-markdown-范文逐一转换为-html-文件之汇总任务闭环'
)

const cleanAll          = cleanAllOldOuputs
const buildExamplesOnce = buildEverythingOnce
const buildAndWatch     = watchEverything

module.exports = {
    cleanAll,
    buildExamplesOnce,
    buildAndWatch,

    default: buildAndWatch,
}
