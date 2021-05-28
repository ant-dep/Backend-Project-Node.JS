const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// user schema with email that cannot be used twice to singin
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

// link to controllers/user.js
module.exports = mongoose.model('User', userSchema);