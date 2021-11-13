const express = require('express');
const app = express();
require('dotenv').config()
const debug = require('debug')('app:base');
const genres = require('./routes/genres');
const mongoose = require('mongoose');
const fs = require('fs');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => debug('Connected to MongoDB...'))
    .catch(erro => debug('Could not connect to MongoDB'));

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
        required: true
    },
    isGold: Boolean
}));

// Add genres to mongodb
async function addJSONDocs(path, model) {
    const docData = fs.readFileSync(path);
    let docs = JSON.parse(docData);
    docs = await model.insertMany(docs);
    debug(docs);
}
addJSONDocs('data/customers.json', Customer);

// let genres = [
//     { id: 1, name: 'Horror'},
//     { id: 2, name: 'RomCom'},
//     { id: 3, name: 'Comedy'}
// ];

app.use('/api/genres', genres);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));
