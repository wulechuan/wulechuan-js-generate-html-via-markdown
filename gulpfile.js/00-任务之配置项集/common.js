const 路径工具 = require('path')

const peerDepThemingNPMPackageRootPath = 路径工具.dirname(
    require.resolve('@wulechuan/css-stylus-markdown-themes/package.json')
)

const thisModuleRootFolderPath = 路径工具.dirname(
    require.resolve('../../package.json')
)

module.exports = {
    peerDepThemingNPMPackageRootPath,
    thisModuleRootFolderPath,
}
