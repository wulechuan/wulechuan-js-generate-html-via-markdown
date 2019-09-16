const path = require('path')

const peerDepThemingNPMPackageRootPath = path.dirname(
    require.resolve('@wulechuan/css-stylus-markdown-themes/package.json')
).replace(/\\/g, '/')

const thisModuleRootFolderPath = path.dirname(
    require.resolve('../../package.json')
).replace(/\\/g, '/')



module.exports = {
    peerDepThemingNPMPackageRootPath,
    thisModuleRootFolderPath,
}
