const mongoose = require('mongoose');
const Joi = require('joi');

const Genre = mongoose.model('Genre', new mongoose.Schema({
    name: { 
        type: String,
        required: true,
        minlength: 5,
        maxlength: 20,
        lowercase: true
    },
    datefounded: Date
}));

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(20).required(),
        datefounded: Joi.date()
    });

    return schema.validate(genre);
}

module.exports.Genre = Genre;
module.exports.validateGenre = validateGenre;