const db = require("../models/db");

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

async function assignFeedbackToOffer(offers) {
    let feedback;

    for (let offer of offers) {
        feedback = await db.query('SELECT * FROM tagasiside WHERE pakkumised_fk = ?', [offer.pakkumised_id]);
        offer.feedback = feedback;
    }
    return offers;
}

module.exports = {sanitizeInput, checkDateFormat, assignFeedbackToOffer}