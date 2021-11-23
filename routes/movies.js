const express = require('express');
const router = express.Router();
const debug = require('debug')('app:base');
const mongoose = require('mongoose');
const { Genre } = require('../models/genres');
const { Movie, validateMovie } = require('../models/movies');

router.get('/', async (req, res) => {
    const movies = await Movie.find().lean()
    .select('title genre numberInStock dailyRentalRate').sort('title');
    res.status(200).json(movies);
});

router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
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

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');

    try {
        let movie = await Movie.findOne({ title: req.body.title.toLowerCase() });
        if (!movie) {
            movie = new Movie({
                title: req.body.title,
                genre: genre,
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
    // const { error } = validateMovie(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    // if (req.body.genreId)
    // const genre = await Genre.findById(req.body.genreId);
    // if (!genre) return res.status(400).send('Invalid genre.');

    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!movie) 
            return res.status(404).send(`ID: ${req.params.id} does not exist.`);    

        res.status(200).json(movie);
    } 
    catch (err) {
        res.status(400).send(err.message);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) 
            return res.status(404).send(`ID: ${req.params.id} does not exist.`);
        
        res.status(200).json(movie);
    } 
    catch (err) {
        res.status(400).send('ID provided was invalid.');
    }
});

module.exports = router;