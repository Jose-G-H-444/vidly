const express = require('express');
const router = express.Router();
const debug = require('debug')('app:base');
const Joi = require('joi');
const mongoose = require('mongoose');
const helmet = require('helmet');
const Genre = require('../models/genres');

// Required middleware
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(helmet());

router.get('/', async (req, res) => {
    const genres = await Genre.find()
    .select({ name: 1, datefounded: 1 }).sort('name');
    res.status(200).json(genres);
});

router.get('/:id', async (req, res) => {
    try {
        const genre = await Genre.findById(req.params.id);
        if (!genre) {
            return res.status(404).send(`ID: ${req.params.id} does not exist.`);
        }
        res.status(200).json(genre);
    } 
    catch (err) {
        res.status(404).send('ID provided was invalid.');
    }
});

router.post('/', async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        let genre = await Genre.findOne({ name: req.body.name.toLowerCase() }).exec();
        if (!genre) {
            genre = new Genre({
                name: req.body.name,
                datefounded: req.body.datefounded
            });
            // genre = { name: req.body.name };
            // genres.push(genre);
            await genre.save();
            return res.status(200).json(genre);
        }
        res.status(400).send(`${req.body.name} already exists.`);
    } 
    catch (err) {
        res.status(400).send('Invalid entry.');
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { error } = validateGenre(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!genre) 
            return res.status(404).send(`ID: ${req.params.id} does not exist.`);    

        res.status(200).json(genre);
    } 
    catch (err) {
        res.status(400).send('ID provided was invalid.');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const genre = await Genre.findByIdAndDelete(req.params.id);
        if (!genre) 
            return res.status(404).send(`ID: ${req.params.id} does not exist.`);
        
        res.status(200).json(genre);
    } 
    catch (err) {
        res.status(400).send('ID provided was invalid.');
    }
});

module.exports = router;

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(20).required(),
        datefounded: Joi.date()
    });

    return schema.validate(genre);
}