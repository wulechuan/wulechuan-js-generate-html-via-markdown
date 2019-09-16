/**
 * TODO: `options.sourceGlobs.extraSourceGlobsToWatch`
 * members of above are not relative paths to `options.sourceGlobs.rootFolderPath`,
 * so as `gulp.src` (renamed as `gulpRead` within this js file) process
 * those memebers, I'm not sure what kind of output sub paths would be.
 */

const path = require('path')
const chalk = require('chalk')

const {
    src:    gulpRead,
    dest:   gulpWrite,
    series: gulpBuildTaskSeries,
} = require('gulp')

const gulpArrayPipe = require('gulp-pipe')
const rename = require('gulp-rename')
const del = require('del')

const createErrorMessageBuildersFor = require('@wulechuan/meaningful-error-messages')

const {
    // isNotAnValidNumber,
    isNotANonEmptyString,
    // isNotABoolean,
    isNotANonArrayObject,
    isNotAnArray,
    isNotAFunction,

    isAFunction,
} = require('./value-type-checkers')






const {
    buildErrorMessage,
    buildErrorMessageSaysThatSomethingMustBe,
} = createErrorMessageBuildersFor('@wulechuan/gulp-classical-task-cycle')

const joinPathPOSIX = path.posix.join






module.exports = function createATaskCycle(options) {
    const errorContext = 'createATaskCycle'

    if (isNotANonArrayObject(options)) {
        throw new TypeError(buildErrorMessageSaysThatSomethingMustBe(
            'object',
            options,
            'arguments.options',
            errorContext
        ))
    }

    const {
        sourceGlobs: sourceGlobsConfig, // [required] An object.
        outputFiles,                    // [required] An object.
        sourceContentFirstProcessor,    // [optional] A function, e.g. stylus, less, sass, etc.
    } = options


    if (isNotANonArrayObject(sourceGlobsConfig)) {
        throw new TypeError(buildErrorMessageSaysThatSomethingMustBe(
            'object',
            sourceGlobsConfig,
            'options.sourceGlobs',
            errorContext
        ))
    }

    if (isNotANonArrayObject(outputFiles)) {
        throw new TypeError(buildErrorMessageSaysThatSomethingMustBe(
            'object',
            outputFiles,
            'options.outputFiles',
            errorContext
        ))
    }

    let sourceContentFirstProcessorIsProvided = false
    if (sourceContentFirstProcessor) {
        if (isNotAFunction(sourceContentFirstProcessor)) {
            throw new TypeError(buildErrorMessageSaysThatSomethingMustBe(
                'function',
                sourceContentFirstProcessor,
                'options.sourceContentFirstProcessor',
                errorContext
            ))
        }

        sourceContentFirstProcessorIsProvided = true
    }




    const {
        rootFolderPath: sourceGlobsRootFolderPath, // [required] A path string relative to `process.env.PWD`.

        relativeGlobsSharedWithOtherTaskSets,      // [optional] An array of path strings, each relative to rootFolderPath.
        relativeGlobsSpecificallyForThisTaskSet,   // [required] An array of path strings, each relative to rootFolderPath.

        extraSourceGlobsToWatch,                   // [optional] An array of path strings, each relative to `process.env.PWD`.
    } = sourceGlobsConfig

    if (isNotANonEmptyString(sourceGlobsRootFolderPath)) {
        throw new TypeError(buildErrorMessageSaysThatSomethingMustBe(
            'a non-empty string',
            sourceGlobsRootFolderPath,
            'options.sourceGlobs.rootFolderPath',
            errorContext
        ))
    }

    if (isNotAnArray(relativeGlobsSpecificallyForThisTaskSet)) {
        throw new TypeError(buildErrorMessageSaysThatSomethingMustBe(
            'array',
            relativeGlobsSpecificallyForThisTaskSet,
            'options.sourceGlobs.relativeGlobsSpecificallyForThisTaskSet',
            errorContext
        ))
    }

    if (relativeGlobsSharedWithOtherTaskSets && isNotAnArray(relativeGlobsSharedWithOtherTaskSets)) {
        throw new TypeError(buildErrorMessageSaysThatSomethingMustBe(
            'array',
            relativeGlobsSharedWithOtherTaskSets,
            'options.sourceGlobs.relativeGlobsSharedWithOtherTaskSets',
            errorContext
        ))
    }

    if (extraSourceGlobsToWatch && isNotAnArray(extraSourceGlobsToWatch)) {
        throw new TypeError(buildErrorMessageSaysThatSomethingMustBe(
            'array',
            extraSourceGlobsToWatch,
            'options.sourceGlobs.extraSourceGlobsToWatch',
            errorContext
        ))
    }





    const {
        rootFolderPath: outputFolderPath, // [required] A path string relative to `process.env.PWD`.
        forSingleOrTwoOutputFiles,        // [either optional] An object.
        forBatchOutputFiles,              // [either optional] An object.
    } = outputFiles

    if (isNotANonEmptyString(outputFolderPath)) {
        throw new TypeError(buildErrorMessageSaysThatSomethingMustBe(
            'a non-empty string',
            outputFolderPath,
            'options.outputFiles.rootFolderPath',
            errorContext
        ))
    }

    if (!forSingleOrTwoOutputFiles && !forBatchOutputFiles) {
        throw new TypeError(buildErrorMessage(
            [
                `Of the "${chalk.rgb(255, 255, 255)('options.outputFiles')}",`,

                `${
                    chalk.blue('neither')
                } "${
                    chalk.yellow('forSingleOrTwoOutputFiles')
                }" ${
                    chalk.blue('nor')
                } "${
                    chalk.yellow('forBatchOutputFiles')
                }" is provided.`,

                'Please do provide one but either one only.',
            ]
        ))
    } else if (forSingleOrTwoOutputFiles && forBatchOutputFiles) {
        throw new TypeError(buildErrorMessage(
            [
                `Of the "${chalk.rgb(255, 255, 255)('options.outputFiles')}",`,

                `${
                    chalk.yellow('both')
                } "${
                    chalk.yellow('forSingleOrTwoOutputFiles')
                }" and "${
                    chalk.yellow('forBatchOutputFiles')
                }" are provided.`,

                'Please do provide one but either one only.',
            ]
        ))
    }



    let outputFilesAreInABatch



    let outputFileBaseName
    let outputFileExtWithoutDot

    if (forSingleOrTwoOutputFiles) {
        if (isNotANonArrayObject(forSingleOrTwoOutputFiles)) {
            throw new TypeError(buildErrorMessageSaysThatSomethingMustBe(
                'object',
                forSingleOrTwoOutputFiles,
                'options.outputFiles.forSingleOrTwoOutputFiles',
                errorContext
            ))
        }

        outputFilesAreInABatch = false

        outputFileBaseName      = forSingleOrTwoOutputFiles.fileBaseName      // [required if forSingleOrTwoOutputFiles present] A string.
        outputFileExtWithoutDot = forSingleOrTwoOutputFiles.fileExtWithoutDot // [required if forSingleOrTwoOutputFiles present] A string.

        if (isNotANonEmptyString(outputFileBaseName)) {
            throw new TypeError(buildErrorMessageSaysThatSomethingMustBe(
                'non-empty string',
                outputFileBaseName,
                'options.outputFiles.forSingleOrTwoOutputFiles.outputFileBaseName',
                errorContext
            ))
        }

        if (isNotANonEmptyString(outputFileExtWithoutDot)) {
            throw new TypeError(buildErrorMessageSaysThatSomethingMustBe(
                'non-empty string',
                outputFileExtWithoutDot,
                'options.outputFiles.forSingleOrTwoOutputFiles.outputFileExtWithoutDot',
                errorContext
            ))
        }
    }



    let relativeGlobsOfAllPossibleOutputs

    if (forBatchOutputFiles) {
        if (isNotANonArrayObject(forBatchOutputFiles)) {
            throw new TypeError(buildErrorMessageSaysThatSomethingMustBe(
                'object',
                forBatchOutputFiles,
                'options.outputFiles.forBatchOutputFiles',
                errorContext
            ))
        }

        outputFilesAreInABatch = true

        relativeGlobsOfAllPossibleOutputs = forBatchOutputFiles.relativeGlobsOfAllPossibleOutputs // [required if forBatchOutputFiles present] An array.

        if (isNotAnArray(relativeGlobsOfAllPossibleOutputs)) {
            throw new TypeError(buildErrorMessageSaysThatSomethingMustBe(
                'array',
                relativeGlobsOfAllPossibleOutputs,
                'options.outputFiles.forBatchOutputFiles.relativeGlobsOfAllPossibleOutputs',
                errorContext
            ))
        }
    }



    let {
        descriptionOfCoreTask,       // [optional] Should be a string if provided.
        descriptionOfInputsOfCoreTask, // [optional] Should be a string if provided.

        compressions, /*
            [optional] Should be an object if provided.
            ---------------------------------------------
                Why does compressor1 exist?
                Well, even if we don't compress files,
                we might still want to operate the output
                file somehow.
                Think about postcss. We might need to get
                rid of most comments even if we don't
                compress css rules.
                -----------------------------------------
                Compressor2 always stands for producing
                a fully compressed output file.
            -------------------------------------------------

            Full example:
            -------------------------------------------------
            compressions: {
                shouldNotOutputUncompressedVersion, // [optional] A boolean. Default is false.
                shouldNotOutputCompressedVersion,   // [optional] A boolean. Default is false.

                compressor1IsEnabled,               // [optional] A boolean. Default is false.
                compressor1,                        // [optional] Should be a function if provided.
                compressorOptions1,                 // [optional] Any thing the corresponding compressor accepts.

                compressor2IsDisabled,              // [optional] A boolean. Default is false.
                compressor2,                        // [optional] Should be a function if provided.
                compressorOptions2,                 // [optional] Any thing the corresponding compressor accepts.
            },
        */


        taskBodies, /*
            [optional] Should be an object if provided.
            ---------------------------------------------

            Full example:
            ---------------------------------------------
            taskBodies: {
                cleanOldOutputs, // [optional] Should be a function if provided.
                buildNewOutputs, // [optional] Should be a function if provided.
            },
        */
    } = options





    let outputFileName1
    let outputFileName2

    let outputFilePath1
    let outputFilePath2

    let allPossibleOutputGlobs



    if (outputFilesAreInABatch) {
        allPossibleOutputGlobs = relativeGlobsOfAllPossibleOutputs.map(glob => {
            return joinPathPOSIX(outputFolderPath, glob)
        })
    } else {
        outputFileName1 = `${outputFileBaseName}.${    outputFileExtWithoutDot}`
        outputFileName2 = `${outputFileBaseName}.min.${outputFileExtWithoutDot}`

        outputFilePath1 = joinPathPOSIX(outputFolderPath, outputFileName1)
        outputFilePath2 = joinPathPOSIX(outputFolderPath, outputFileName2)

        allPossibleOutputGlobs = [
            outputFilePath1,
            outputFilePath2,
        ]
    }

    const _relativeGlobsSharedWithOtherTaskSets    = !Array.isArray(relativeGlobsSharedWithOtherTaskSets)    ? [] : relativeGlobsSharedWithOtherTaskSets
    const _relativeGlobsSpecificallyForThisTaskSet = !Array.isArray(relativeGlobsSpecificallyForThisTaskSet) ? [] : relativeGlobsSpecificallyForThisTaskSet
    const _extraSourceGlobsToWatch                 = !Array.isArray(extraSourceGlobsToWatch)                 ? [] : extraSourceGlobsToWatch

    const allSourceRelativeGlobs = [
        ..._relativeGlobsSharedWithOtherTaskSets,
        ..._relativeGlobsSpecificallyForThisTaskSet,
    ]

    const sourceGlobs = allSourceRelativeGlobs.map(
        glob => joinPathPOSIX(sourceGlobsRootFolderPath, glob)
    )

    const sourceGlobsToWatch = [
        ...sourceGlobs,
        ..._extraSourceGlobsToWatch,
    ]






    if (compressions === false) {
        compressions = {
            shouldNotOutputUncompressedVersion: false,
            shouldNotOutputCompressedVersion: true,
        }
    } else if (compressions === true || compressions === undefined || compressions === null) {
        compressions = {
            shouldNotOutputUncompressedVersion: false,
            shouldNotOutputCompressedVersion: false,
        }
    } else if (typeof compressions !== 'object' || Array.isArray(compressions)) {
        throw new TypeError(buildErrorMessageSaysThatSomethingMustBe(
            'a boolean, a non-array object, undefined or null',
            compressions,
            'options.compressions',
            errorContext
        ))
    }





    const {
        compressor1IsEnabled = false,
        compressor1 = null,
        compressorOptions1 = null,

        compressor2IsDisabled = false,
        compressor2 = null,
        compressorOptions2 = null,
    } = compressions

    let {
        shouldNotOutputUncompressedVersion,
        shouldNotOutputCompressedVersion,
    } = compressions


    const compressor1IsProvidedAndAllowed =   compressor1IsEnabled && isAFunction(compressor1)
    const compressor2IsProvidedAndAllowed = !compressor2IsDisabled && isAFunction(compressor2)

    shouldNotOutputUncompressedVersion = !!shouldNotOutputUncompressedVersion
    shouldNotOutputCompressedVersion   = !!shouldNotOutputCompressedVersion


    const willOutputTwoVersionsOfFiles = !shouldNotOutputUncompressedVersion && !shouldNotOutputCompressedVersion
    const willOutputMininfiedFilesOnly =  shouldNotOutputUncompressedVersion && !shouldNotOutputCompressedVersion

    if (!descriptionOfCoreTask) {
        descriptionOfCoreTask = ''

        descriptionOfInputsOfCoreTask = descriptionOfInputsOfCoreTask || ''

        if (descriptionOfInputsOfCoreTask) {
            descriptionOfCoreTask += `From    ${chalk.black.bgMagenta(descriptionOfInputsOfCoreTask)}\n`
        }

        if (outputFilesAreInABatch) {
            descriptionOfCoreTask += `Produce ${
                chalk.black.bgGreen(
                    `${
                        relativeGlobsOfAllPossibleOutputs.join(', ')
                    }${
                        chalk.black.bgRed(willOutputMininfiedFilesOnly ? '(all min)' : '')
                    }`
                )
            }`

            if (willOutputTwoVersionsOfFiles) {
                descriptionOfCoreTask += ' (+ all min)'
            }
        } else {
            descriptionOfCoreTask += `Produce ${
                chalk.black.bgGreen(
                    `${
                        outputFileBaseName
                    }${
                        chalk.black.bgRed(willOutputMininfiedFilesOnly ? '.min' : '')
                    }.${outputFileExtWithoutDot}`
                )
            }`

            if (willOutputTwoVersionsOfFiles) {
                descriptionOfCoreTask += ' (+ .min)'
            }
        }


        descriptionOfCoreTask += '\n'
    }


    if (taskBodies) {
        if (isNotANonArrayObject(taskBodies)) {
            throw new TypeError(buildErrorMessageSaysThatSomethingMustBe(
                'a non-array object, undefined or null',
                taskBodies,
                'options.taskBodies',
                errorContext
            ))
        }
    } else {
        taskBodies = {}
    }

    if (isNotAFunction(taskBodies.cleanOldOutputs)) {
        taskBodies.cleanOldOutputs = tocleanOldOutputsFilesTheDefaultWay
    }


    if (isNotAFunction(taskBodies.buildNewOutputs)) {
        taskBodies.buildNewOutputs = gulpBuildTaskSeries(
            taskBodies.cleanOldOutputs,
            toBuildSourceFilesTheDefaultWay
        )
    } else {
        const providedFunction = taskBodies.buildNewOutputs
        taskBodies.buildNewOutputs = gulpBuildTaskSeries(
            taskBodies.cleanOldOutputs,
            providedFunction
        )
    }


    const taskCycle = {
        descriptionOfCoreTask,
        descriptionOfInputsOfCoreTask, // Simply a backup, not likely to use.

        outputFolderPath,
        outputFilesAreInABatch,
        outputFileBaseName,       // It's undefined if outputFilesAreInABatch === true
        outputFileName1,          // It's undefined if outputFilesAreInABatch === true
        outputFileName2,          // It's undefined if outputFilesAreInABatch === true
        outputFilePath1,          // It's undefined if outputFilesAreInABatch === true
        outputFilePath2,          // It's undefined if outputFilesAreInABatch === true
        allPossibleOutputGlobs,

        sourceGlobsRootFolderPath, // Simply a backup, not likely to use.
        sourceGlobs,
        sourceGlobsToWatch,

        shouldNotOutputUncompressedVersion,
        shouldNotOutputCompressedVersion,

        compressor1IsEnabled,
        compressor1,
        compressorOptions1,

        compressor2IsDisabled,
        compressor2,
        compressorOptions2,

        taskBodies,
    }

    // console.log(taskCycle)

    return taskCycle





    function tocleanOldOutputsFilesTheDefaultWay() {
        console.log(`\n${chalk.red('Deleting these files if exist')}:`)
        allPossibleOutputGlobs.forEach(filePath => console.log('    ', chalk.yellow(filePath)))
        return del(allPossibleOutputGlobs)
    }

    function toBuildSourceFilesTheDefaultWay() {
        console.log(`\n${descriptionOfCoreTask}`)

        const pipe = [ gulpRead(sourceGlobs, {
            base: sourceGlobsRootFolderPath,
        }) ]

        if (sourceContentFirstProcessorIsProvided) {
            pipe.push(sourceContentFirstProcessor())
        }

        if (!shouldNotOutputUncompressedVersion) {
            if (compressor1IsProvidedAndAllowed) {
                pipe.push(compressor1(compressorOptions1))
            }

            if (!outputFilesAreInABatch) {
                pipe.push(rename(outputFileName1))
            }

            pipe.push(gulpWrite(outputFolderPath))
        }

        if (!shouldNotOutputCompressedVersion) {
            if (compressor2IsProvidedAndAllowed) {
                pipe.push(compressor2(compressorOptions2))
            }

            if (!outputFilesAreInABatch) {
                pipe.push(rename(outputFileName2))
            }

            pipe.push(gulpWrite(outputFolderPath))
        }

        return gulpArrayPipe(pipe)
    }
}
