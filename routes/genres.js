const express = require('express');
const router = express.Router();
const debug = require('debug')('app:base');
const Joi = require('joi');
const mongoose = require('mongoose');
const fs = require('fs');
const helmet = require('helmet');

// Required middleware
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(helmet());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => debug('Connected to MongoDB...'))
    .catch(erro => debug('Could not connect to MongoDB'));

const genreSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
        minlength: 5,
        maxlength: 20,
        lowercase: true
    },
    datefounded: Date
});
const Genre = mongoose.model('Genre', genreSchema);

// Add genres to database
// async function addGenres() {
//     const genreData = fs.readFileSync('routes/genres.json');
//     let genres = JSON.parse(genreData);
//     courses = await Genre.insertMany(genres);
//     debug(genres);
// }
// addGenres();

// let genres = [
//     { id: 1, name: 'Horror'},
//     { id: 2, name: 'RomCom'},
//     { id: 3, name: 'Comedy'}
// ];

router.get('/', async (req, res) => {
    const genres = await Genre.find()
    .select({ name: 1, datefounded: 1 });
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
        res.status(400).send('Invalid update.');
    }
});

router.put('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    // const genre = genres.find( (genre) => genre.id === parseInt(req.params.id, 10));
    if (!genre) 
        return res.status(404).send(`ID: ${req.params.id} does not exist.`);
    
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    for (field in req.body) {
        genre[field] = req.body[field];
    }

    await genre.save();
    res.status(200).json(genre);
    // // genres[genres.indexOf(genre)].name = req.body.name;
    // res.send('working');
});

router.delete('/:id', (req, res) => {
    const genre = genres.find( (genre) => genre.id === parseInt(req.params.id, 10));
    if (!genre) 
        return res.status(404).send(`ID: ${req.params.id} does not exist.`);

    genres.splice(genres.indexOf(genre), 1);
    res.send(genre);
});

module.exports = router;

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(20).required(),
        datefounded: Joi.date()
    });

    return schema.validate(genre);
}