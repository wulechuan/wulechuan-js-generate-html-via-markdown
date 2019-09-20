module.exports = {
    splitOneASTNodeByOpenAndCloseMarks,
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


function splitOneASTNodeByOpenAndCloseMarks(string, openMark, closeMark, options) {
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


    const logContentSlicingDefaultWidth = 515

    if (!options) {
        options = {
            shouldNotForcePairing: false,
            shouldLogSampleContentsForDevMode: false,
            logContentSlicingWidth: logContentSlicingDefaultWidth,
        }
    } else if (typeof options === 'number') {
        options = {
            shouldNotForcePairing: false,
            shouldLogSampleContentsForDevMode: true,
            logContentSlicingWidth: options,
        }
    } else if (typeof options !== 'object') {
        options = {
            shouldNotForcePairing: true,
            shouldLogSampleContentsForDevMode: false,
            logContentSlicingWidth: logContentSlicingDefaultWidth,
        }
    } else if (Array.isArray(options)) {
        options = {
            shouldNotForcePairing: !!options[0],
            shouldLogSampleContentsForDevMode: !!options[1],
            logContentSlicingWidth: options[2],
        }
    }

    const {
        shouldNotForcePairing,
        splittingResultValidator,
    } = options



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

    let decidedEnclosuredContent = ''

    const arrayOfStage2 = arrayOfStage1.reduce((a2, a1Item) => {
        if (!a1Item) { // two or more openMarks side by side during stage1
            a2.push({
                isEnclosured: false,
                openMark,
                closeMark: '',
                content: '',
            })

        } else {

            const a2NewSegs = a1Item.split(closeMark)
            const firstNewSeg = a2NewSegs.shift()

            decidedEnclosuredContent = firstNewSeg

            a2.push({
                isEnclosured: true,
                openMark,
                closeMark,
                content: firstNewSeg,
            })

            if (a2NewSegs.length > 0) { // might not exist at all.
                if (!shouldNotForcePairing) {

                    const restContent = a2NewSegs.join(closeMark)
                    if (restContent) {
                        a2.push({
                            isEnclosured: false,
                            openMark: '',
                            closeMark: '',
                            content: restContent,
                        })
                    }

                } else {

                    /*
                        Let's don't prevent a closeMark to be an openMark.
                        So we have to deal with the last segments, as it
                        might have no closeMark.
                    */

                    const lastNewSeg = a2NewSegs.pop()

                    a2 = [
                        ...a2,

                        ...a2NewSegs.map(seg => {
                            return {
                                isEnclosured: false,
                                openMark: '',
                                closeMark,
                                content: seg,
                            }
                        }),
                    ]

                    if (lastNewSeg) {
                        a2.push({
                            isEnclosured: false,
                            openMark: '',
                            closeMark: '',
                            content: lastNewSeg,
                        })
                    }

                }
            }
        }


        return a2
    }, initArrayOfStage2)


    let enclosuredContentIsValid = true

    if (decidedEnclosuredContent && typeof splittingResultValidator === 'function') {
        enclosuredContentIsValid = splittingResultValidator(decidedEnclosuredContent)
    }

    if (enclosuredContentIsValid) {
        // TODO: afoaldjwoihfsdl'
        // return {

        // }
    }

    const {
        shouldLogSampleContentsForDevMode,
        logContentSlicingWidth,
    } = options

    if (shouldLogSampleContentsForDevMode) {
        printASTContentsForDebugging(arrayOfStage2, logContentSlicingWidth)
    }


    return {
        allNodesInOriginalOrder: arrayOfStage2,
        nodesEnclosured:    arrayOfStage2.filter(n =>  n.isEnclosured),
        nodesNotEnclosured: arrayOfStage2.filter(n => !n.isEnclosured),
    }
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

