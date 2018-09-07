'use strict';

const mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema,
    LETTERS = /[A-Za-z]/;

let EventTypeSchema = new Schema({
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

EventTypeSchema.plugin(uniqueValidator);

mongoose.model('EventType', EventTypeSchema);
let EventType = mongoose.model('EventType');
module.exports = EventType;