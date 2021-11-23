const mongoose = require('mongoose');
const { phone } = require('phone');
const Joi = require('joi');

const Customer = { 
    MAX_LENGTH_NAME: 50,
    MIN_LENGTH_NAME: 3,
    model: mongoose.model('Customer', new mongoose.Schema({
        name: { 
            type: String,
            required: true,
            minlength: this.MIN_LENGTH_CUST_NAME,
            maxlength: this.MAX_LENGTH_CUST_NAME,
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
    }))
}

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(Customer.MIN_LENGTH_NAME).max(Customer.MAX_LENGTH_NAME).required(),
        phone: Joi.string().custom(( value, helper ) => {
            return phone(value).isValid ? value : helper.error('any.invalid');
        }),
        isGold: Boolean
    });

    return schema.validate(customer);
}

module.exports.Customer = Customer;
module.exports.validateCustomer = validateCustomer;