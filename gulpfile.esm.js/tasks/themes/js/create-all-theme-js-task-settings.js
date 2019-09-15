import jsTaskBuildingOptions
    from '../../../configs/peer-dependency-examples-illustrates'

import createOneTaskSettingsForCopyingJavascriptFiles
    from '../../../utils/create-one-task-settings-for-copying-javascript-files'

export default jsTaskBuildingOptions.map(createOneTaskSettingsForCopyingJavascriptFiles)
