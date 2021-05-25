const jwt = require('jsonwebtoken');

// link to app.js
module.exports = (req, res, next) => {
    try {
        // Check the 2 second items (token) in the authorization part within headers of the request
        const token = req.headers.authorization.split(' ')[1];
        // check if the token is the same as required
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // keep the userId given in the token
        const userId = decodedToken.userId;
        // if the userId is not the same as the one saved -> error
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            // if it's the same then keep going -> just a middleware
            next();
        }
    } catch {
        // for any issues withing the process -> return error
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};