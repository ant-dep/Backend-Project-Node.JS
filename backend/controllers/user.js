const User = require('../models/users')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const maskData = require("maskdata");

// hide emails details for confidentiality
const emailMaskOptions = {
    maskWith: "*",
    unmaskedStartCharactersBeforeAt: 1,
    unmaskedEndCharactersAfterAt: 1,
    maskAtTheRate: false,
};

exports.signup = (req, res, next) => {
    // encrypt the password given by the user with 12 loops of encrypting (default recommended)
    bcrypt.hash(req.body.password, 12)
        .then(hash => {
            // Use the model to create a new User
            const user = new User({
                email: maskData.maskEmail2(req.body.email, emailMaskOptions),
                password: hash
            });
            // save the new User
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    // Looking for an existing User
    User.findOne({
            email: maskData.maskEmail2(req.body.email, emailMaskOptions)
        })
        .then(user => {
            // error message if it's not existing
            if (!user) {
                // 401 is for Unauthorized
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            // if it exists -> compare the hash with the one given by the user
            bcrypt.compare(req.body.password, user.password)
                // if not the same -> error message
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    // if it's the same hash -> return userId and a token
                    res.status(200).json({
                        userId: user._id,
                        // creates a token with the jwt method sign
                        token: jwt.sign({ userId: user._id },
                            // must be a long non specific and random characters
                            'RANDOM_TOKEN_SECRET',
                            // make the token expires after 24h
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// Both exports.signup and exports.login are links to app.js