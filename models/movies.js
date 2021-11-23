const mongoose = require('mongoose');
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

module.exports.Movie = Movie;