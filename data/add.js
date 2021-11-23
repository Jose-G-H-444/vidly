const mongoose = require('mongoose');
const { Customer } = require('./model');
// Add docs to mongodb
async function addJSONDocs(path, model) {
    const docData = fs.readFileSync(path);
    let docs = JSON.parse(docData);
    docs = await model.insertMany(docs);
    debug(docs);
}
addJSONDocs('data/customers.json', Customer.model);

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
addDoc(Customer.model);