const express = require('express');
const router = express.Router();
const debug = require('debug')('app:base');
const Joi = require('joi');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { phone } = require('phone');

// Required middleware
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(helmet());

const MAX_LENGTH_CUST_NAME = 50;
const MIN_LENGTH_CUST_NAME = 5;

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: { 
        type: String,
        required: true,
        minlength: MIN_LENGTH_CUST_NAME,
        maxlength: MAX_LENGTH_CUST_NAME,
        lowercase: true
    },
    phone: {
        type: Number,
        required: true,
        validator: {
            validate: phoneNumber => phone(phoneNumber).isValid,
            message: 'Please enter a valid phone number.'
        }
    },
    isGold: Boolean
}));

router.get('/', async (req, res) => {
    const genres = await Genre.find()
    .select({ name: 1, datefounded: 1 }).sort('name');
    res.status(200).json(genres);
});

router.get('/:id', async (req, res) => {
    try {
        const genre = await Genre.findById(req.params.id);
        // const genre = genres.find( (genre) => genre.id === parseInt(req.params.id, 10));
        if (!genre) {
            debug(genre);
            return res.status(404).send(`ID: ${req.params.id} does not exist.`);
        }
        res.status(200).json(genre);
    } 
    catch (err) {
        debug(err.message);
        res.status(404).send('ID provided was invalid.');
    }
});

router.post('/', async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // if (!genres.find( (genre) => genre.name === req.body.name)) {
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
        // const genre = genres.find( (genre) => genre.id === parseInt(req.params.id, 10));
        if (!genre) 
            return res.status(404).send(`ID: ${req.params.id} does not exist.`);    

        res.status(200).json(genre);
    } 
    catch (err) {
        res.status(400).send('ID provided was invalid.');
    }
    // // genres[genres.indexOf(genre)].name = req.body.name;
    // res.send('working');
});

router.delete('/:id', async (req, res) => {
    // const genre = genres.find( (genre) => genre.id === parseInt(req.params.id, 10));
    try {
        const genre = await Genre.findByIdAndDelete(req.params.id);
        // const genre = genres.find( (genre) => genre.id === parseInt(req.params.id, 10));
        if (!genre) 
            return res.status(404).send(`ID: ${req.params.id} does not exist.`);
        
        res.status(200).json(genre);
    } 
    catch (err) {
        res.status(400).send('ID provided was invalid.');
    }
    // if (!genre) 
    //     return res.status(404).send(`ID: ${req.params.id} does not exist.`);

    // genres.splice(genres.indexOf(genre), 1);
    // res.send(genre);
});

module.exports = router;

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(MIN_LENGTH_CUST_NAME).max(MAX_LENGTH_CUST_NAME).required(),
        datefounded: Joi.date(),
        isGold: Boolean
    });

    return schema.validate(genre);
}