#

# ------------------------------------------------------
# ---------- 【产品依赖包】 ------------------------------
# ------------------------------------------------------

# 以下均为须采用特定版本的【产品依赖包】。
Write-Host
Write-Host
Write-Host
Write-Host  -NoNewline  -F 'DarkRed'                '===== npm i    '
Write-Host  -NoNewline  -F 'White'    -B 'DarkRed'  '特定版本'
Write-Host              -F 'DarkRed'                '的【产品依赖包】 ============================'
Write-Host
npm  i `
    'chalk@4' # 不能更新至第 5 过更晚的版本。因为自第 5 版始， chalk 仅支持 ES Module 语法。



# 以下均为可采用 latest 版本的【产品依赖包】。顺便提醒，虽然一般而言 latest 版本应恰为最高版本，但并不确保。
Write-Host
Write-Host
Write-Host
Write-Host  -NoNewline  -F 'DarkRed'                '===== npm i    '
Write-Host  -NoNewline  -F 'DarkRed'                '最末版本'
Write-Host              -F 'DarkRed'                '的【产品依赖包】 ============================'
Write-Host
npm i `
    '@wulechuan/meaningful-error-messages@latest' `
    'fs-extra@latest' `
    'markdown-it@latest' `
    'markdown-it-anchor@latest' `
    'markdown-it-checkbox@latest' `
    'markdown-it-highlightjs@latest' `
    'markdown-it-toc-done-right@latest'





# ------------------------------------------------------
# ---------- 【研发依赖包】 ------------------------------
# ------------------------------------------------------
# 以下均为须采用特定版本的【研发依赖包】。
# Write-Host
# Write-Host
# Write-Host
# Write-Host  -NoNewline  -F 'DarkGreen'              '===== npm i -D '
# Write-Host  -NoNewline  -F 'Black'      -B 'Green'  '特定版本'
# Write-Host              -F 'DarkGreen'              '的【研发依赖包】 ============================'
# Write-Host
# 暂无。



# 以下均为可采用 latest 版本的【研发依赖包】。顺便提醒，虽然一般而言 latest 版本应恰为最高版本，但并不确保。
Write-Host
Write-Host
Write-Host
Write-Host  -NoNewline  -F 'DarkGreen'              '===== npm i -D '
Write-Host  -NoNewline  -F 'DarkGreen'              '最末版本'
Write-Host              -F 'DarkGreen'              '的【研发依赖包】 ============================'
Write-Host
npm i -D `
    '@wulechuan/cli-scripts--git-push@latest' `
    '@wulechuan/css-stylus-markdown-themes@latest' `
    '@wulechuan/gulp-classical-task-cycle@latest' `
    'eslint@latest' `
    'gulp@latest' `
    'gulp-pipe@latest' `
    'gulp-rename@latest' `
    'plugin-error@latest' `
    'replace-ext@latest' `
    'through2@latest'
