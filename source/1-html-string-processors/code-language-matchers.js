module.exports = {
    codeLanguageIsOneOf,
    codeLanguageIsNotAnyOf,
}



function codeLanguageIsOneOf(codeLanguage, languageNames) {
    if (!codeLanguage) {
        return false
    }

    if (!codeLanguage || typeof codeLanguage !== 'string') {
        throw new TypeError('@wulechuan/hljs-plus: codeLanguage must be a non-empty string')
    }

    if (!Array.isArray(languageNames)) {
        throw new TypeError('@wulechuan/hljs-plus: languageNames must be an array')
    }

    let cl1
    // let cl2

    const matchingResult = codeLanguage.match(/^language-([\w_\d-]+)/)
    if (matchingResult) {
        cl1 = matchingResult[1]
        // cl2 = codeLanguage
    } else {
        cl1 = codeLanguage
        // cl2 = `language-${codeLanguage}`
    }

    for (let i = 0; i < languageNames.length; i++) {
        const provided = languageNames[i]

        if (!provided || typeof provided !== 'string') {
            throw new TypeError('@wulechuan/hljs-plus: languageName must be a non-empty string')
        }

        let l1
        // let l2

        const matchingResult = provided.match(/^language-([\w_\d-]+)/)
        if (matchingResult) {
            l1 = matchingResult[1]
            // l2 = provided
        } else {
            l1 = provided
            // l2 = `language-${provided}`
        }

        if (cl1 === l1) {
            return true
        }
    }

    return false
}

function codeLanguageIsNotAnyOf(codeLanguage, languageNames) { // eslint-disable-line no-unused-vars
    return !codeLanguageIsOneOf(codeLanguage, languageNames)
}