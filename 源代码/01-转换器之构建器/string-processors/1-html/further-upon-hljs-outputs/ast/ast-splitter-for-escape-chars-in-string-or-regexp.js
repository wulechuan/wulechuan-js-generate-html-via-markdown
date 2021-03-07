const createErrorMessageBuildersFor = require('@wulechuan/meaningful-error-messages')

const {
    buildErrorMessage,
    // buildErrorMessageSaysThatSomethingMustBe,
} = createErrorMessageBuildersFor('@wulechuan/hljs-plus')


module.exports = function splitASTForEscapeChars(astNode) {
    const { content } = astNode

    const segs = content.split('\\')
    const subASTs = []

    const seg1 = segs.shift()

    if (seg1) {
        subASTs.push({
            isEnclosured: false,
            openMark: '',
            closeMark: '',
            content: seg1,
        })
    }

    let lastSegWasEmpty = false
    let lastSegWasEmptyAndWasTreatedAsAnEscapedChar = false
    let continuousEmptySegmentsCount = 0

    for (let i = 0; i < segs.length; i++) {
        const seg = segs[i]

        if (!seg) { // continuous '\\' presents
            continuousEmptySegmentsCount++

            if (continuousEmptySegmentsCount > 2) {
                console.log(buildErrorMessage([
                    ' WARNING: more than 3 continouse backward slash signs("\\").',
                ]))
            }

            if (lastSegWasEmpty) {
                lastSegWasEmptyAndWasTreatedAsAnEscapedChar = !lastSegWasEmptyAndWasTreatedAsAnEscapedChar
            } else {
                lastSegWasEmptyAndWasTreatedAsAnEscapedChar = true // this char is an escaped '\\'.
            }

            lastSegWasEmpty = true

            continue
        }

        continuousEmptySegmentsCount = 0

        let escapedChar
        let restContent

        if (lastSegWasEmpty && lastSegWasEmptyAndWasTreatedAsAnEscapedChar) {
            escapedChar = '\\'
            restContent = seg
        } else {
            const matchingHTMLEntityChars = seg.match(/^(&[a-z]{2,};|&#x\d{1,};)/)
            if (matchingHTMLEntityChars) {
                const [ , escapedHTMLEntityChar ] = matchingHTMLEntityChars
                escapedChar = seg.slice(0, escapedHTMLEntityChar.length)
                restContent = seg.slice(escapedHTMLEntityChar.length)
            } else {
                escapedChar = seg.slice(0, 1)
                restContent = seg.slice(1)
            }
        }

        subASTs.push({
            isEnclosured: true,
            openMark: '\\',
            closeMark: '',
            content: escapedChar,
        })

        if (restContent) {
            subASTs.push({
                isEnclosured: false,
                openMark: '',
                closeMark: '',
                content: restContent,
            })
        }

        lastSegWasEmpty = false
        lastSegWasEmptyAndWasTreatedAsAnEscapedChar = false
    }

    astNode.content = subASTs


    return {
        nodesEnclosured:    subASTs.filter(n =>  n.isEnclosured),
        nodesNotEnclosured: subASTs.filter(n => !n.isEnclosured),
    }
}
