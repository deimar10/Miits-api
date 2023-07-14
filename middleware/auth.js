const jwt = require('jsonwebtoken');
const db = require('../models/db');

function authenticate(req, res, next) {
    try {
        if (req.headers.authorization) {
            let token = req.headers.authorization.split(" ")[1];
            let privateKey = process.env.PR_KEY;

            jwt.verify(token, privateKey, {algorithm: 'HS256'}, (err) => {
                if (err) {
                    return res.status(401).json({error: "Not authorized"});
                }
                return next();
            });
        } else {
            throw new Error();
        }

    } catch (error) {
        return res.status(401).json({error: "Please include a token in the request header"});
    }
}

async function authorize(req, res, next) {
    try {
        const offerId = req.params.id;

        let token = req.headers.authorization.split(" ")[1];
        let privateKey = process.env.PR_KEY;

        const decodedToken = jwt.verify(token, privateKey);

        const enterpriseName = await db.query('SELECT enterprise FROM pakkumised WHERE id = ?', [offerId]);

        if (decodedToken.user_id === enterpriseName[0].enterprise) {
            return next();
        } else {
            throw new Error();
        }

    } catch (error) {
        return res.status(403).json({message: "Unauthorized"});
    }
}

module.exports = {authenticate, authorize};