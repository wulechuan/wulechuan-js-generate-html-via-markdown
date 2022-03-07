#!/bin/sh

npm  i \
    'chalk@4' # 不能更新至第 5 过更晚的版本。因为自第 5 版始， chalk 仅支持 ES Module 语法。

npm i \
    '@wulechuan/meaningful-error-messages@latest' \
    'fs@latest' \
    'markdown-it@latest' \
    'markdown-it-anchor@latest' \
    'markdown-it-checkbox@latest' \
    'markdown-it-highlightjs@latest' \
    'markdown-it-toc-done-right@latest'

npm i -D '@wulechuan/css-stylus-markdown-themes@^7'

npm i -D \
    '@wulechuan/gulp-classical-task-cycle@latest' \
    'del@latest' \
    'eslint@latest' \
    'gulp@latest' \
    'gulp-pipe@latest' \
    'gulp-rename@latest' \
    'plugin-error@latest' \
    'replace-ext@latest' \
    'through2@latest'
