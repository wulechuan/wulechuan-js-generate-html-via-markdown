const markdownToHTMLConverter = require('..')

console.log('testing...')
console.log(markdownToHTMLConverter(
    '# Test article\n\n## this is heading 2\n\n### this is heading 3\n\nthis is a sentence.\n\n'
))
