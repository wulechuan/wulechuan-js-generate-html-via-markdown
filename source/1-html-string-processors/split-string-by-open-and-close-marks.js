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


function splitStringIntoASTByOpenAndCloseMarks(string, openMark, closeMark, options) {
    if (typeof string !== 'string') {
        throw new TypeError('@wulechuan/generate-html-via-markdown: arguments[0] must be an string!')
    }

    if (typeof openMark !== 'string') {
        throw new TypeError('@wulechuan/generate-html-via-markdown: arguments[1] must be an string!')
    }

    if (typeof closeMark !== 'string') {
        throw new TypeError('@wulechuan/generate-html-via-markdown: arguments[2] must be an string!')
    }

    if (!string) {
        return []
    }

    if (!openMark) {
        return [{
            isEnclosured: false,
            openMark: '',
            closeMark: '',
            content: string,
        }]
    }

    if (!closeMark) {
        throw new TypeError('@wulechuan/generate-html-via-markdown: arguments[3] must be a non empty string!')
    }

    if (!options) {
        options = {
            shouldLogSampleContentsForDevMode: false,
            logContentSlicingWidth: 515,
        }
    } else if (typeof options === 'number') {
        options = {
            shouldLogSampleContentsForDevMode: true,
            logContentSlicingWidth: options,
        }
    } else if (typeof options !== 'object') {
        options = {
            shouldLogSampleContentsForDevMode: true,
            logContentSlicingWidth: 515,
        }
    } else if (Array.isArray(options)) {
        options = {
            shouldLogSampleContentsForDevMode: options[0],
            logContentSlicingWidth: options[1],
        }
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

        a2 = [
            ...a2,

            {
                isEnclosured: true,
                openMark,
                closeMark,
                content: firstNewSeg,
            },

            {
                isEnclosured: false,
                openMark: '',
                closeMark: '',
                content: a2NewSegs.join(closeMark),
            },
        ]
        return a2
    }, initArrayOfStage2)


    const {
        shouldLogSampleContentsForDevMode,
        logContentSlicingWidth,
    } = options

    if (shouldLogSampleContentsForDevMode) {
        printASTContentsForDebugging(arrayOfStage2, logContentSlicingWidth)
    }


    return arrayOfStage2
}




function printLine() { console.log('='.repeat(79)) }

function printASTContentsForDebugging(arrayOfStage2, logContentSlicingWidth) {
    if (!logContentSlicingWidth > 0) {
        logContentSlicingWidth = 319
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


        const slicingWidth1 = Math.min(logContentSlicingWidth, Math.ceil(content.length / 2))
        const slicingWidth2 = Math.min(logContentSlicingWidth, content.length - slicingWidth1)


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

