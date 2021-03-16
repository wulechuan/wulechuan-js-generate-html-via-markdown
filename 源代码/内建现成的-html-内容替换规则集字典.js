module.exports = {
    '令所有外部链接之打开方式为 _blank': {
        凡: /\s+href="([^#./].+)/gi,
        替换为: ' target="_blank" href="$1',
    },

    令所有原本指向Markdown文件之链接改为指向同名HTML文件: {
        凡: /\s+href="(.+)\.md(#.*)?"/gi,
        替换为: ' href="$1.html$2"',
    },
}
