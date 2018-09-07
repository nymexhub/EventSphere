'use strict';

const mongoose = require('mongoose');

module.exports = function(connectionString) {
    mongoose.Promise = global.Promise;
    mongoose.connect(connectionString);
};

