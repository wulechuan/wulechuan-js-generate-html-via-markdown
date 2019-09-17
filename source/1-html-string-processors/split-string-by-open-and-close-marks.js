module.exports = {
    splitStringIntoASTByOpenAndCloseMarks,
    parseASTIntoString,
}


function parseASTIntoString(input) {
    if (!input) {
        return ''
    }

    if (typeof input === 'string') {
        return input
    }

    if (typeof input === 'object') {

        if (Array.isArray(input)) {
            return input.map(parseASTIntoString).join('')
        }

        const {
            openMark,
            closeMark,
            content,
        } = input

        return `${openMark}${parseASTIntoString(content)}${closeMark}`
    }

    return ''
}


function splitStringIntoASTByOpenAndCloseMarks(string, openMark, closeMark, shouldLogSampleContentsForDevMode, slicingWidth) {
    if (typeof string !== 'string') {
        throw new TypeError('@wulechuan/generate-html-via-markdown: html must be an string!')
    }

    if (typeof openMark !== 'string') {
        throw new TypeError('@wulechuan/generate-html-via-markdown: openMark must be an string!')
    }

    if (!string) {
        return []
    }

    if (!openMark) {
        return [ string ]
    }

    const arrayOfStage1 = string.split(openMark)
    const firstSegOfStage1 = arrayOfStage1.shift()

    const initArrayOfStage2 = []

    if (firstSegOfStage1) { // might be an empty string
        initArrayOfStage2.push({
            isEnclosured: false,
            openMark: '',
            closeMark: '',
            content: firstSegOfStage1,
        })
    }

    const arrayOfStage2 = arrayOfStage1.reduce((a2, a1Item) => {
        const a2NewSegs = a1Item.split(closeMark)
        const firstNewSeg = a2NewSegs.shift()

        // hopefully only one member in a2NewSegs now,
        // as long as the open/close tags are html tag,
        // and the original html string is out of error structures.

        const lastNewSeg = a2NewSegs.pop()

        // hopefully zero members in a2NewSegs now.

        a2 = [
            ...a2,

            {
                isEnclosured: true,
                openMark,
                closeMark,
                content: firstNewSeg,
            },

            ...a2NewSegs.reduce((restNewASTs, newSeg) => {
                restNewASTs = [
                    ...restNewASTs,

                    {
                        isEnclosured: false,
                        openMark: '',
                        closeMark,
                        content: newSeg,
                    },
                ]

                return restNewASTs
            }, []),

            {
                isEnclosured: false,
                openMark: '',
                closeMark: '',
                content: lastNewSeg,
            },
        ]
        return a2
    }, initArrayOfStage2)


    if (shouldLogSampleContentsForDevMode) {
        if (!slicingWidth > 0) {
            slicingWidth = 100
        }


        let printedNodesCount = 0


        arrayOfStage2.forEach(astNode => {
            if (!astNode.isEnclosured) { return }

            printLine()

            printedNodesCount++

            const {
                openMark,
                closeMark,
                content,
            } = astNode


            const slicingWidth1 = Math.min(slicingWidth, Math.ceil(content.length / 2))
            const slicingWidth2 = Math.min(slicingWidth, content.length - slicingWidth1)


            console.log(`${
                openMark
            }${
                content.slice(0, slicingWidth1)
            }${
                content.length > (slicingWidth1 + slicingWidth2) ? '|||...|||' : ''
            }${
                content.slice(-slicingWidth2)
            }${
                closeMark
            }`)
        })

        if (printedNodesCount > 0) {
            printLine()
        }
    }

    return arrayOfStage2
}

function printLine() { console.log('='.repeat(79)) }

