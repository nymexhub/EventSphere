/* globals Buffer */
'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const ALPHA_PATTERN = /[A-Za-z1-9]/;

let EventSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: [3, 'Name is too short!'],
        maxlength: [50, 'Name is too long!'],
        match: ALPHA_PATTERN
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
    eventType: {},
    user: {},
    city: {},
    country: {},
    address: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        minlength: [50, 'Description is too short!']
    },
    dateOfEvent: {  
        type: Date,
        required: true
    },
    endDateOfEvent:{
        type: Date
    },
    coverUrl: {
        type: String
    },
    coverUrls: [],
    capacity: {
        type: Number
    },
    minAge: {
        type: Number,
    },
    rating: {
        type: Number,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    comments: [{}],
    usersWhoLikeThis: [],
    usersWhoDislikeThis: []
});

mongoose.model('Event', EventSchema);
let Event = mongoose.model('Event');
module.exports = Event;