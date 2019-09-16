const chalk = require('chalk')

module.exports = function createErrorMessageBuildersFor(errorMessageCategory) {
    if (!errorMessageCategory || typeof errorMessageCategory !== 'string') {
        errorMessageCategory = '@wulechuan/build-error-messages'
        throw new TypeError(buildErrorMessage([
            `You must provide a string as the "${chalk.yellow('errorMessageCategory')}"`,
        ]))
    }


    return {
        buildErrorMessage,
        buildErrorMessageSaysThatSomethingMustBe,
    }

    function buildErrorMessage(messageLines) {
        if (!Array.isArray(messageLines)) {
            messageLines = [ messageLines ]
        }

        messageLines = [
            `${errorMessageCategory}:`,
            ...messageLines,
        ]

        return chalk.red(`${messageLines.join('\n    ')}\n`)
    }

    function buildErrorMessageSaysThatSomethingMustBe(expectedTypeOfTheThing, theThing, accessingPathOfTheThing, contextDescription) {
        let providedType = typeof theThing
        if (Array.isArray(theThing)) {
            providedType = 'array'
        } else if (theThing !== theThing) {
            providedType = 'NaN'
        }

        switch (providedType) {
            case 'undefined':
            case 'object':
            case 'array':
                providedType = `an ${providedType}`
                break
            default:
                providedType = `a ${providedType}`
        }

        switch (expectedTypeOfTheThing) {
            case 'object':
                expectedTypeOfTheThing = `a non-array ${expectedTypeOfTheThing}`
                break

            case 'array':
            case 'undefined':
                expectedTypeOfTheThing = `an ${expectedTypeOfTheThing}`
                break
        }


        const pathSegments = accessingPathOfTheThing.split('.')
        const nameOfTheThing = pathSegments.pop()
        const ownerOfTheThing = pathSegments.join('.')


        let ownerString = ''

        if (ownerOfTheThing) {
            ownerString = chalk.rgb(255, 255, 255)(ownerOfTheThing)

            if (contextDescription) {
                if (ownerOfTheThing.match(/^arguments?$/)) {
                    ownerString = `"${ownerString}" of function "${chalk.blue(contextDescription)}"`
                } else {
                    ownerString = `"${ownerString}" in context of "${chalk.blue(contextDescription)}"`
                }
            }

            ownerString = `Of the ${ownerString}:`
        }

        return buildErrorMessage([
            ownerString,
            `    the "${
                chalk.yellow(nameOfTheThing)
            }" must be "${
                chalk.green(expectedTypeOfTheThing)
            }" instead of "${
                chalk.gray(providedType)
            }".`,
        ])
    }
}
