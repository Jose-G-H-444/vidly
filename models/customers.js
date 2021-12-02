const mongoose = require('mongoose');
const { phone } = require('phone');
const Joi = require('joi');


const customerSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: phoneNumber => new Promise((resolve, reject) => resolve(phone(phoneNumber).isValid)),
            message: 'Invalid phone number.'
        }
    },
    isGold: {
        type: Boolean,
        default: false
    }
});
const Customer =  mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        phone: Joi.string().custom(( value, helper ) => {
            return phone(value).isValid ? value : helper.error('any.invalid');
        }),
        isGold: Boolean
    });

    return schema.validate(customer);
}

module.exports.Customer = Customer;
module.exports.customerSchema = customerSchema;
module.exports.validateCustomer = validateCustomer;