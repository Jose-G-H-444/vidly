const mongoose = require('mongoose');
const { Movie } = require('../models/movies');
const fs = require('fs');
const debug = require('debug')('app:base');
// Add docs to mongodb
async function addJSONDocs(path, model) {
    const docData = fs.readFileSync(path);
    let docs = JSON.parse(docData);
    docs = await model.insertMany(docs);
    debug(docs);
}
addJSONDocs('data/movies.json', Movie);

async function addDoc(model) {
    try {
        const doctData = new model({
            name: 'phone test',
            phone: 9494393038,
            isGold: true
        });
        const doc = await doctData.save();
    } 
    catch (err) {
        debug(err.message);
    }
}
// addDoc(Customer.model);