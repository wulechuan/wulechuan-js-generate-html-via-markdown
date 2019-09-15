import {
    jsDistFolderRelativePath,
} from '../../../../global-config'

import createOneTaskSettingsForCopyingJavascriptFiles
    from '../../../utils/create-one-task-settings-for-copying-javascript-files'

export default createOneTaskSettingsForCopyingJavascriptFiles({
    descriptionOfInputsOfCoreTask: 'source/themes/js/.eslint.js',

    sourceGlobs: {
        rootFolderPath: './source/themes/js',

        relativeGlobsSpecificallyForThisTaskSet: [
            '.eslintrc.js',
        ],
    },

    outputFiles: {
        rootFolderPath: jsDistFolderRelativePath,
        fileBaseName: '.eslintrc',
        fileExtWithoutDot: 'js',
    },

    compressions: {
        shouldNotOutputCompressedVersion: true,
    },
})
