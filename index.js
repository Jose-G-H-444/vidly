const express = require('express');
const app = express();
require('dotenv').config()
const debug = require('debug')('app:base');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const mongoose = require('mongoose');
const fs = require('fs');


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => debug('Connected to MongoDB...'))
    .catch(erro => debug('Could not connect to MongoDB'));

app.use('/api/genres', genres);
app.use('/api/customers', customers);


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));