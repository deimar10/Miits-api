function sanitizeInput(input) {
    for (const propName in input) {
        if (typeof input[propName] === 'string') {
            input[propName] = input[propName].replace(/^\s+|\s+$/g, '');
        }
    }
    return input;
}

module.exports = sanitizeInput;