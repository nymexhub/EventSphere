'use strict';

const mongoose = require('mongoose'),
    crypto = require('crypto'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema;

const LETTERS = /^[A-Za-zА-Яа-я]+$/,
    ALPHA_PATTERN = /^[A-Za-zА-Яа-я0-9]+$/,
    EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

let UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minlength: [3, 'Name is too short!'],
        maxlength: [50, 'Name is too long!'],
        match: LETTERS
    },
    lastName: {
        type: String,
        required: true,
        minlength: [3, 'Name is too short!'],
        maxlength: [50, 'Name is too long!'],
        match: LETTERS
    },
    username: {
        type: String,
        required: true,
        unique: true,
        dropDups: true,
        minlength: [3, 'Name is too short!'],
        maxlength: [50, 'Name is too long!'],
        match: ALPHA_PATTERN
    },
    age: {
        type: Number,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        dropDups: true,
        match: EMAIL_PATTERN
    },
    avatarUrl: {
        type: String,
        default: '/static/uploads/users/avatar.jpg'
    },
    salt: String,
    passwordHash: {
        type: String
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean
    },
    role: {
        type: String,
        default: 'user'
    },
    socialLogins: {
        facebook: {
            id: String,
            token: String,
            name: String,
            email: String,
            picture: String
        },
        googlePlus: {
            id: String,
            token: String,
            name: String,
            email: String,
            picture: String
        },
        twitter: {
            id: String,
            token: String,
            name: String,
            email: String,
            picture: String
        }
    },
    subscribedEvents: [{}]
});

UserSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.passwordHash = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

UserSchema
    .virtual('fullName')
    .get(function() {
        return this.firstName + ' ' + this.lastName;
    });

UserSchema.plugin(uniqueValidator);

UserSchema.methods = {
    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },
    encryptPassword: function(password) {
        if (!password) {
            return '';
        }

        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    },
    authenticatePassword: function(password) {
        return this.encryptPassword(password) === this.passwordHash;
    }
};

mongoose.model('User', UserSchema);
let User = mongoose.model('User');
module.exports = User;