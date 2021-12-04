const express = require('express');
const router = express.Router();
const debug = require('debug')('app:base');
const mongoose = require('mongoose');
const { Rental, validateRental } = require('../models/rental');
const { Movie } = require('../models/movies');
const { Customer, validateCustomer } = require('../models/customers');

router.get('/', async (req, res) => {
    const rentals = await Rental.find().lean()
    .select('customer movie dateOut dateReturned rentalFee')
    .sort('customer');
    
    return res.status(200).json(rentals);
});

router.get('/:id', async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id).lean()
        .select('customer movie dateOut dateReturned rentalFee')
        .sort('customer');

        if (!rental) return res.status(404).send(`${req.params.id} rental does not exist.`);

        return res.status(200).json(rental);
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
});

router.post('/', async (req, res) => {
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try { 
        const movie = await Movie.findById(req.body.movieId);
        if (!movie) return res.status(404).send(`${req.body.movieId} movie does not exist.`);

        const customer = await Customer.findById(req.body.customerId);
        if (!customer) return res.status(404).send(`${req.body.customerId} customer does not exist.`);

        const rental = new Rental({
            customer,
            movie,
            dateOut: Date.now(),
            rentalFee: req.body.rentalFee
        });

        await rental.save();
        return res.status(200).json(rental);
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const rental = await Rental.findByIdAndUpdate(req.params.id, {
            // movie: async function() {
            //     if (req.body.movieId) {
            //         const movie = await Movie.findById(req.body.movieId).lean();
            //         if (!movie) return res.status(404).send(`${req.body.movieId} movie does not exist.`);
            //         return movie;
            //     } 
            //     else {
            //         return this.movie;
            //     }
            // },
            rentalFee: function() {
                if (req.body.rentalFee) {
                    debug(`hello: ${req.body.rentalFee}`);
                    return req.body.rentalFee;
                }
                else {
                    debug(this.rentalFee);
                    return this.rentalFee;
                }
            }
        }, {new: true}).lean();
        // if (!rental) return res.status(404).send(`${req.params.id} rental does not exist.`);

        // let movie;
        // if (req.body.movieId) {
        //     movie = Movie.findById(req.body.movieId);
        //     if (!movie) return res.status(404).send(`${req.body.movieId} movie does not exist.`);
        //     rental.updateOne({movie});
        // }

        // if (req.body.rentalFee) rental.updateOne({rentalFee: req.body.rentalFee});

        return res.status(200).json(rental);
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const rental = await Rental.findByIdAndDelete(req.params.id);
        if (!rental) return res.status(404).send(`${req.params.id} rental does not exist.`);

        return res.status(200).json(rental);
    } 
    catch (err) {
        return res.status(400).send(err.message);
    }
});

module.exports = router;