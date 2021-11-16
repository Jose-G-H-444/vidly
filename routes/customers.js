const express = require('express');
const router = express.Router();
const debug = require('debug')('app:base');
const Joi = require('joi');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { phone } = require('phone');
const { Customer } = require('../model');

// Required middleware
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(helmet());

router.get('/', async (req, res) => {
    const customers = await Customer.model.find()
    .select({ name: 1, isGold: 1, phone: 1 }).sort('name');
    res.status(200).json(customers);
});

router.get('/:id', async (req, res) => {
    try {
        const customer = await Customer.model.findById(req.params.id);
        // const genre = genres.find( (genre) => genre.id === parseInt(req.params.id, 10));
        if (!customer) {
            debug(customer);
            return res.status(404).send(`ID: ${req.params.id} does not exist.`);
        }
        res.status(200).json(customer);
    } 
    catch (err) {
        debug(err.message);
        res.status(404).send('ID provided was invalid.');
    }
});

router.post('/', async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // if (!genres.find( (genre) => genre.name === req.body.name)) {
    try {
        let customer = await Customer.model.findOne({ name: req.body.name.toLowerCase() });
        if (!customer) {
            customer = new Customer.model({
                name: req.body.name,
                phone: req.body.phone,
                isGold: req.body.isGold
            });
            // genre = { name: req.body.name };
            // genres.push(genre);
            await customer.save();
            return res.status(200).json(customer);
        }
        res.status(400).send(`${req.body.name} already exists.`);
    } 
    catch (err) {
        res.status(400).send(err.message);
    }
});

router.put('/:id', async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const customer = await Customer.model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        // const genre = genres.find( (genre) => genre.id === parseInt(req.params.id, 10));
        if (!customer) 
            return res.status(404).send(`ID: ${req.params.id} does not exist.`);    

        res.status(200).json(customer);
    } 
    catch (err) {
        res.status(400).send(err.message);
    }
    // // genres[genres.indexOf(genre)].name = req.body.name;
    // res.send('working');
});

router.delete('/:id', async (req, res) => {
    // const genre = genres.find( (genre) => genre.id === parseInt(req.params.id, 10));
    try {
        const genre = await Customer.model.findByIdAndDelete(req.params.id);
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

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(Customer.MIN_LENGTH_NAME).max(Customer.MAX_LENGTH_NAME).required(),
        phone: Joi.string().custom(( value, helper ) => {
            return phone(value).isValid ? value : helper.error('any.invalid');
        }),
        isGold: Boolean
    });

    return schema.validate(customer);
}