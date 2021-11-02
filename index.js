const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

let genres = ['Horror', 'RomCom', 'Romance', 'Comedy'];

app.get('/api/genres', (req, res) => {
    res.send(genres);
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));