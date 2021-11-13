const express = require('express');
const app = express();
require('dotenv').config()
const debug = require('debug')('app:base');
const genres = require('./routes/genres');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => debug('Connected to MongoDB...'))
    .catch(erro => debug('Could not connect to MongoDB'));

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

app.use('/api/genres', genres);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));
