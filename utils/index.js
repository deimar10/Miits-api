const db = require("../models/db");

function sanitizeInput(input) {
    const sanitizeInput = {...input};

    for (const propName in sanitizeInput) {
        if (typeof sanitizeInput[propName] === 'string') {
            sanitizeInput[propName] = sanitizeInput[propName].trim();
        }
    }

    return sanitizeInput;
}

function checkDateFormat(date) {
    return date.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
}

async function assignFeedbackToOffer(offers) {
    return await Promise.all(offers.map(async (offer) => {
        const feedback = await db.query('SELECT * FROM tagasiside WHERE pakkumised_fk = ?', [offer.id]);

        return {...offer, feedback: feedback};
    }));
}

module.exports = {sanitizeInput, checkDateFormat, assignFeedbackToOffer}