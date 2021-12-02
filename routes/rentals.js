const express = require('express');
const router = express.Router();
const debug = require('debug')('app:base');
const mongoose = require('mongoose');
const { Rental, validateRental } = require('../models/rental');
const { Movie } = require('../models/movies');
const { Customer } = require('../models/customers');

router.get('/', async (req, res) => {
    const rentals = await Rental.find().lean()
    .select('customer movie dateOut dateReturned rentalFee')
    .sort('dateOut');
    
    res.status(200).json(rentals);
});

module.exports = router;