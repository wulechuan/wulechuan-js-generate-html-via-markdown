const path = require('path')

const peerDepThemingNPMPackageRootPath = path.dirname(
    require.resolve('@wulechuan/css-stylus-markdown-themes/package.json')
)

const thisModuleRootFolderPath = path.dirname(
    require.resolve('../../package.json')
)

module.exports = {
    peerDepThemingNPMPackageRootPath,
    thisModuleRootFolderPath,
}
