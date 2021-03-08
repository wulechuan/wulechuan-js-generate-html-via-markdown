const 路径工具 = require('path')

const 本NPM包之Peer依赖包之名称 = '@wulechuan/css-stylus-markdown-themes'

const 本NPM包之根文件夹之绝对路径 = 路径工具.dirname(
    require.resolve('../package.json')
)

const 本NPM包之Peer依赖包之根文件夹之绝对路径 = 路径工具.dirname(
    require.resolve(`${本NPM包之Peer依赖包之名称}/package.json`)
)

module.exports = {
    本NPM包之Peer依赖包之名称,
    本NPM包之Peer依赖包之根文件夹之绝对路径,
    本NPM包之根文件夹之绝对路径,
}
