const express = require('express');
const app = express();
require('dotenv').config()
const debug = require('debug')('app:base');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const mongoose = require('mongoose');
const fs = require('fs');
const { Customer } = require('./model');


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => debug('Connected to MongoDB...'))
    .catch(erro => debug('Could not connect to MongoDB'));

// Add genres to mongodb
// async function addJSONDocs(path, model) {
//     const docData = fs.readFileSync(path);
//     let docs = JSON.parse(docData);
//     docs = await model.insertMany(docs);
//     debug(docs);
// }
// addJSONDocs('data/customers.json', Customer);

// async function addDoc(model) {
//     try {
//         const doctData = new model({
//             name: 'phone test',
//             phone: 9494393038,
//             isGold: true
//         });
//         const doc = await doctData.save();
//     } 
//     catch (err) {
//         debug(err.message);
//     }
// }
// addDoc(Customer);

// let genres = [
//     { id: 1, name: 'Horror'},
//     { id: 2, name: 'RomCom'},
//     { id: 3, name: 'Comedy'}
// ];

app.use('/api/genres', genres);
app.use('/api/customers', customers);


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));

module.exports.Customer = Customer;