function sanitizeInput(input) {
    for (const propName in input) {
        if (typeof input[propName] === 'string') {
            input[propName] = input[propName].replace(/^\s+|\s+$/g, '');
        }
    }
    return input;
}

function checkDateFormat(date) {
    return date.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
}

module.exports = { sanitizeInput, checkDateFormat }