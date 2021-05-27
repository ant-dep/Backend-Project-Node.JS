const passSchema = require("../models/password");

// Logical user's model to validate the password
module.exports = (req, res, next) => {
    if (!passSchema.validate(req.body.password)) {
        return res.status(400).json({
            error: "Veuillez utiliser un mot de passe fort ! Au moins une minuscule et majuscule, entre 8 et 100 caractères dont au moins 2 chiffres" +
                passSchema.validate("retente ta chance", { list: true }),
        });
    } else {
        next();
    }
};