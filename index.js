const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

let genres = ['Horror', 'RomCom', 'Romance', 'Comedy'];

app.get('/api/genres', (req, res) => {
    res.send(genres);
});

app.post('/api/genres', (req, res) => {
    if (!genres.find( (genre) => genre === req.body.genre ))
        genres.push(req.body.genre)
    res.send(req.body.genre);
});

app.put('/api/genres/:genre', (req, res) => {
    const genre = genres.find( (genre) => genre.toLowerCase() === req.params.genre.toLowerCase());
    if (!genre) 
        return res.status(404).send(`${req.params.genre} is not one of the current genres.`);
    genres[genres.indexOf(genre)] = req.body.genre;
    res.send(req.body.genre);
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));