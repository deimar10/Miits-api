const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
    if (req.headers.authorization) {
        let token = req.headers.authorization.split(" ")[1];
        let privateKey = process.env.PR_KEY;

        jwt.verify(token, privateKey, {algorithm: 'HS256'}, (err) => {
            if (err) {
                return res.status(401).json({error: "Not authorized"});
            }
            return next();
        })
    } else {
        return res.status(401).json({error: "Please include a token in the request header"});
    }
}

module.exports = authenticate;