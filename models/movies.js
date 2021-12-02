const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genres');

const movieSchema = new mongoose.Schema({
    title: { 
        type: String,
        required: true,
        minlength: 5,
        trim: true,
        maxlength: 20,
        lowercase: true
    },
    genre: { 
        type: genreSchema,
        required: true
    },
    numberInStock: { 
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: { 
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
});

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(genre) {
    const schema = Joi.object({
        title: Joi.string().min(5).max(20).required(),
        genreId: Joi.string().required(),
        numberInStock: Joi.number().integer().min(0).required(),
        dailyRentalRate: Joi.number().integer().min(0).required()
    });

    return schema.validate(genre);
}

module.exports.Movie = Movie;
module.exports.validateMovie = validateMovie;
module.exports.movieSchema = movieSchema;