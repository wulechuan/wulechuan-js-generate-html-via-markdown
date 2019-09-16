module.exports = {
    isNotAnValidNumber,
    isNotABoolean,
    isNotANonEmptyString,
    isNotANonArrayObject,
    isNotAnArray,
    isNotAFunction,

    isAnValidNumber,
    isABoolean,
    isANonEmptyString,
    isANonArrayObject,
    isAnArray,
    isAFunction,
}




function isNotAnValidNumber(thing) {
    return typeof thing !== 'number' || thing !== thing
}

function isNotABoolean(thing) {
    return typeof thing !== 'boolean'
}

function isNotANonEmptyString(thing) {
    return !thing || typeof thing !== 'string'
}

function isNotANonArrayObject(thing) {
    return typeof thing !== 'object' || !thing || Array.isArray(thing)
}

function isNotAnArray(thing) {
    return !Array.isArray(thing)
}

function isNotAFunction(thing) {
    return typeof thing !== 'function'
}


function isAnValidNumber(thing) {
    return !isNotAnValidNumber(thing)
}

function isABoolean(thing) {
    return !isNotABoolean(thing)
}

function isANonEmptyString(thing) {
    return !isNotANonEmptyString(thing)
}

function isANonArrayObject(thing) {
    return !isNotANonArrayObject(thing)
}

function isAnArray(thing) {
    return !isNotAnArray(thing)
}

function isAFunction(thing) {
    return !isNotAFunction(thing)
}

