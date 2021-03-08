const createErrorMessageBuildersFor = require('@wulechuan/meaningful-error-messages')

const {
    buildErrorMessage,
    // buildErrorMessageSaysThatSomethingMustBe,
} = createErrorMessageBuildersFor('@wulechuan/regexp-to-html')


module.exports = {
    splitRegExpASTByBraketPairs,
}

function splitRegExpASTByBraketPairs(astNodeForRegExpBody) {
    const { content } = astNodeForRegExpBody

    const segs = content.split('[')
    const subASTs = []

    const seg1 = segs.shift()

    let lastSegEndsWithBackwardSlash = seg1.slice(-1) === '\\'
    let openMarksCountInsideOneBraketPair = 0
    let closeMarksCountInsideOneBraketPair = 0
    let currentMergedSeg = seg1

    let braketsPairHasOpened = false
    let closeMarksCountBeforeBraketsPairStart = 0

    for (let i = 0; i < segs.length; i++) {
        /*
            A new '[' presents at begininig of each loop pass,
            because the segs array was splitted by '[', plus
            the first member of the array has already been `shift()`
            before hand, outside this `for` loop block.
        */

        if (!braketsPairHasOpened) {

            if (lastSegEndsWithBackwardSlash) {

                // A literal '[' is meet, because it is escaped.
                currentMergedSeg += '[' // A literal '['
                openMarksCountInsideOneBraketPair++

            } else {

                braketsPairHasOpened = true
                openMarksCountInsideOneBraketPair = 0
                closeMarksCountInsideOneBraketPair = 0

                if (currentMergedSeg) { // We have things outside the just opening brakets pair.
                    subASTs.push({
                        isEnclosured: false,
                        openMark: '',
                        closeMark: '',
                        content: currentMergedSeg,
                    })

                    currentMergedSeg = ''
                }

            }

        } else {

            // braketsPair already opened in previous loop pass
            // A literal '[' is meet, no matter it is escaped or not
            currentMergedSeg += '[' // A literal '['
            openMarksCountInsideOneBraketPair++

        }


        if (openMarksCountInsideOneBraketPair > 1) {
            throw new Error(buildErrorMessage([
                '"[" and "]" not pairing well.',
                'Too many literal "[" chars within one pair of "[]".',
                'Found: ' + openMarksCountInsideOneBraketPair,
            ]))
        }


        const currentSeg = segs[i]
        lastSegEndsWithBackwardSlash = currentSeg.slice(-1) === '\\'

        const segParts = currentSeg.split(']')


        if (!braketsPairHasOpened) {
            const unescapedCloseMarksCount = segParts.slice(0, -1).reduce((c, s) => {
                if (s.slice(-1) !== '\\') {
                    c++
                }
                return c
            }, 0)

            closeMarksCountBeforeBraketsPairStart += unescapedCloseMarksCount
            if (closeMarksCountBeforeBraketsPairStart > 0) {
                throw new Error(buildErrorMessage([
                    '"[" and "]" not pairing well.',
                    'Closing braket presents before opening braket.',
                ]))
            }

            currentMergedSeg += currentSeg

            continue
        }


        const firstSegPart = segParts.shift()

        currentMergedSeg += firstSegPart

        let lastSegPartEndsWithBackwardSlash = firstSegPart.slice(-1) === '\\'

        for (let j = 0; j < segParts.length; j++) {
            const segPart = segParts[j]

            if (lastSegPartEndsWithBackwardSlash) {
                // a literal `]`, that is a '\]'
                currentMergedSeg += ']'
                closeMarksCountInsideOneBraketPair++

                if (closeMarksCountInsideOneBraketPair > 2) {
                    throw new Error(buildErrorMessage([
                        '"[" and "]" not pairing well.',
                        'Too many literal "]" chars within one pair of "[]".',
                        'Found: ' + closeMarksCountInsideOneBraketPair,
                    ]))
                }

                currentMergedSeg += segPart

                continue
            }


            // A valid closing braket, aka a ']', presents

            if (braketsPairHasOpened) {
                subASTs.push({
                    isEnclosured: true,
                    openMark:  '[',
                    closeMark: ']',
                    content: currentMergedSeg,
                })

                currentMergedSeg = ''
                braketsPairHasOpened = false
            } else {
                // Brackets pare already closed,
                // but another non escaped `]` presents
                closeMarksCountBeforeBraketsPairStart++
            }

            currentMergedSeg += segPart

            lastSegPartEndsWithBackwardSlash = segPart.slice(-1) === '\\'
        }
    }

    if (currentMergedSeg) {
        subASTs.push({
            isEnclosured: false,
            openMark: '',
            closeMark: '',
            content: currentMergedSeg,
        })

        currentMergedSeg = ''
    }

    astNodeForRegExpBody.content = subASTs

    return {
        nodesEnclosured:    subASTs.filter(n =>  n.isEnclosured),
        nodesNotEnclosured: subASTs.filter(n => !n.isEnclosured),
    }
}
