const passValidator = require("password-validator");

const passSchema = new passValidator();

// Schema and password declaration
passSchema
    .is()
    .min(8)
    .has()
    .uppercase()
    .has()
    .lowercase()
    .has()
    .digits(2)
    .has()
    .not()
    .spaces()
    .is()
    .not()
    .oneOf(["Passw0rd", "Password123"]);

// Links to middleware/pass.js
module.exports = passSchema;