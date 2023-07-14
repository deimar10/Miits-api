const db = require("../models/db");
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');

dotenv.config();

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

function generateJwt(enterpriseId) {
    const privateKey = process.env.PR_KEY;

    return jwt.sign({"user_id": `${enterpriseId}`}, privateKey, {algorithm: 'HS256'});
}

module.exports = {sanitizeInput, checkDateFormat, assignFeedbackToOffer, generateJwt}