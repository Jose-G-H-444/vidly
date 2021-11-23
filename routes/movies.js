const express = require('express');
const router = express.Router();
const debug = require('debug')('app:base');
const mongoose = require('mongoose');
const { Movie, validateMovie } = require('../models/customers');

router.get('/', async (req, res) => {
    const movies = await Movie.model.find()
    .select('title genre numberInStock dailyRentalRate').sort('title');
    res.status(200).json(movies);
});

router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.model.findById(req.params.id);
        if (!movie) {
            return res.status(404).send(`ID: ${req.params.id} does not exist.`);
        }
        res.status(200).json(movie);
    } 
    catch (err) {
        res.status(404).send('ID provided was invalid.');
    }
});

router.post('/', async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        let movie = await Movie.model.findOne({ name: req.body.title.toLowerCase() });
        if (!movie) {
            movie = new Movie.model({
                title: req.body.title,
                genre: req.body.genre,
                numberInStock: req.body.numberInStock,
                dailyRentalRate: req.body.dailyRentalRate
            });
            await movie.save();
            return res.status(200).json(movie);
        }
        res.status(400).send(`${req.body.title} already exists.`);
    } 
    catch (err) {
        res.status(400).send(err.message);
    }
});

router.put('/:id', async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const customer = await Movie.model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!customer) 
            return res.status(404).send(`ID: ${req.params.id} does not exist.`);    

        res.status(200).json(customer);
    } 
    catch (err) {
        res.status(400).send(err.message);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const customer = await Movie.model.findByIdAndDelete(req.params.id);
        if (!customer) 
            return res.status(404).send(`ID: ${req.params.id} does not exist.`);
        
        res.status(200).json(customer);
    } 
    catch (err) {
        res.status(400).send('ID provided was invalid.');
    }
});

module.exports = router;