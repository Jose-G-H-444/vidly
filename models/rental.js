const mongoose = require('mongoose');
const Joi = require('joi');
const { movieSchema } = require('./movies');
const { customerSchema } = require('./customers');

const Rental = mongoose.model('Rental', new mongoose.Schema({
    customer: { 
        type: customerSchema,
        required: true
    },
    movie: { 
        type: movieSchema,
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
}));

function validateRental(rental){
    const schema = {
        customerId: Joi.string().required(),
        movieId: Joi.string().required()
    }
    return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validateRental = validateRental;