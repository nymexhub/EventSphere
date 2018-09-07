'use strict';

const mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema,
    LETTERS = /[A-Za-z]/;

let CountrySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        dropDups: true,
        minlength: [3, 'Name is too short!'],
        maxlength: [30, 'Name is too long!'],
        match: LETTERS
    }
});

CountrySchema.plugin(uniqueValidator);

mongoose.model('Country', CountrySchema);
let Country = mongoose.model('Country');
module.exports = Country;