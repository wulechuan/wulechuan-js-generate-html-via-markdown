module.exports = {
    getKeywordOfCodeLanguage,
    codeLanguageIsOneOf,
    codeLanguageIsNotAnyOf,
}


function getKeywordOfCodeLanguage(codeLanguage) {
    if (!codeLanguage || typeof codeLanguage !== 'string') {
        throw new TypeError('@wulechuan/hljs-plus: codeLanguage must be a non-empty string')
    }

    let keywordOfCodeLanguage

    const matchingResult = codeLanguage.match(/^language-([\w_\d-]+)/)
    if (matchingResult) {
        keywordOfCodeLanguage = matchingResult[1]
    } else {
        keywordOfCodeLanguage = codeLanguage
    }

    return keywordOfCodeLanguage
}


function codeLanguageIsOneOf(codeLanguage, languageNames) {
    if (!codeLanguage) {
        return false
    }

    if (!Array.isArray(languageNames)) {
        throw new TypeError('@wulechuan/hljs-plus: languageNames must be an array')
    }

    const keywordOfCodeLanguage = getKeywordOfCodeLanguage(codeLanguage)

    for (let i = 0; i < languageNames.length; i++) {
        if (keywordOfCodeLanguage === getKeywordOfCodeLanguage(languageNames[i])) {
            return true
        }
    }

    return false
}


function codeLanguageIsNotAnyOf(codeLanguage, languageNames) {
    return !codeLanguageIsOneOf(codeLanguage, languageNames)
}
