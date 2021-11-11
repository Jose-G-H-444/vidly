const express = require('express');
const router = express.Router();
const debug = require('debug')('app:base');
const Joi = require('joi');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

let genres = [
    { id: 1, name: 'Horror'},
    { id: 2, name: 'RomCom'},
    { id: 3, name: 'Comedy'}
];

router.get('/', (req, res) => {
    res.send(genres);
});

router.get('/:id', (req, res) => {
    const genre = genres.find( (genre) => genre.id === parseInt(req.params.id, 10));
    if (!genre) 
        return res.status(404).send(`ID: ${req.params.id} does not exist.`);
    res.status(200).send(genre);
});

router.post('/', (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (!genres.find( (genre) => genre.name === req.body.name)) {
        genre = { id: genres.length + 1, name: req.body.name };
        genres.push(genre);
        return res.send(genre);
    }
    res.status(400).send(`${req.body.name} already exists.`);
});

router.put('/:id', (req, res) => {
    const genre = genres.find( (genre) => genre.id === parseInt(req.params.id, 10));
    if (!genre) 
        return res.status(404).send(`ID: ${req.params.id} does not exist.`);
    
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    genres[genres.indexOf(genre)].name = req.body.name;
    res.send(genre);
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
        name: Joi.string().min(5).required()
    });

    return schema.validate(genre);
}