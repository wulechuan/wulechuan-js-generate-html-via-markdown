#!/bin/sh

# -------------------------------------------------------
#           特定版本之【产品依赖包】
# -------------------------------------------------------

echo

echo  -e  "\e[0;31m===== npm i    \e[97;41m特定版本\e[0;31m之【产品依赖包】 ============================\e[0;0m"

echo

# chalk 不能更新至第 5 或更晚的版本。因为自第 5 版始， chalk 仅支持 ES Module 语法。

npm  i \
    'chalk@4'





# -------------------------------------------------------
#          最末版本之【产品依赖包】
# - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# 顺便提醒，虽然一般而言 latest 版本应恰为最高版本，但并不确保。
# -------------------------------------------------------

echo
echo
echo
echo
echo

echo  -e  "\e[0;31m===== npm i    最末版本之【产品依赖包】 ============================\e[0;0m"

echo

npm i \
    '@wulechuan/meaningful-error-messages@latest' \
    'fs-extra@latest' \
    'markdown-it@latest' \
    'markdown-it-anchor@latest' \
    'markdown-it-checkbox@latest' \
    'markdown-it-highlightjs@latest' \
    'markdown-it-toc-done-right@latest'





# -------------------------------------------------------
#           特定版本之【研发依赖包】
# -------------------------------------------------------

echo
echo
echo
echo
echo

echo  -e  "\e[32m===== npm i    \e[90;102m特定版本\e[0;32m之【研发依赖包】 ============================\e[0;0m"

echo

echo '暂无。'





# -------------------------------------------------------
#          最末版本之【研发依赖包】
# - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# 顺便提醒，虽然一般而言 latest 版本应恰为最高版本，但并不确保。
# -------------------------------------------------------

echo
echo
echo
echo
echo

echo  -e  "\e[32m===== npm i    最末版本之【研发依赖包】 ============================\e[0;0m"

echo

npm i -D \
    '@wulechuan/cli-scripts--git-push@latest' \
    '@wulechuan/css-stylus-markdown-themes@latest' \
    '@wulechuan/gulp-classical-task-cycle@latest' \
    'eslint@latest' \
    'gulp@latest' \
    'gulp-pipe@latest' \
    'gulp-rename@latest' \
    'plugin-error@latest' \
    'replace-ext@latest' \
    'through2@latest'





# -------------------------------------------------------
#           更新与研发相关的数据库
# - - - - - - - - - - - - - - - - - - - - - - - - - - - -
#     例如： Browserslist:caniuse-lite
# -------------------------------------------------------

echo
echo
echo
echo
echo

echo  -e  "\e[33m===== 更新与研发相关的数据库 =======================================\e[0;0m"

echo
echo

echo  '暂无。'





# -------------------------------------------------------
#           其他交代
# -------------------------------------------------------

echo
echo
echo
echo
echo

echo  -e  '\e[94m===== 其他交代 =====================================================\e[0;0m'

echo

echo  '暂无。'





# -------------------------------------------------------
#           结束
# -------------------------------------------------------

echo
echo
echo
echo
echo
