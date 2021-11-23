const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genres');

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: { 
        type: String,
        required: true,
        minlength: 5,
        maxlength: 20,
        lowercase: true
    },
    genre: genreSchema,
    numberInStock: Number,
    dailyRentalRate: Number
}));

function validateMovie(genre) {
    const schema = Joi.object({
        title: Joi.string().min(5).max(20).required(),
        genre: genreSchema,
        numberInStock: Joi.number().integer().min(0).required(),
        dailyRentalRate: Joi.number().integer().min(0).required()
    });

    return schema.validate(genre);
}

module.exports.Movie = Movie;
module.exports.validateMovie = validateMovie;