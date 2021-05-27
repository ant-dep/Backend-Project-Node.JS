const emailSchema = require("validator");

// logical validation email module
module.exports = (req, res, next) => {
    if (!emailSchema.isEmail(req.body.email)) {
        return res.status(400).json({
            error: "veuillez rentrer un format valide ! ex : piquante@sopekocko.com",
        });
    } else {
        next();
    }
};