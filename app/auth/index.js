'use strict';

const passport = require('passport');

module.exports = function(app, data) {
    passport.serializeUser((user, done) => {
        if (user) {
            done(null, user.id);
        }
    });

    passport.deserializeUser((userId, done) => {
        data.getUserById(userId)
            .then(user => done(null, user || false))
            .catch(error => done(error, false));
    });

    require('./local-strategy')(passport, data);
    require('./fb-strategy')(passport, data);
    require('./google-plus-strategy')(passport, data);
    require('./twitter-strategy')(passport, data);
};