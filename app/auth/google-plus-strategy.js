'use strict';

const GooglePlusStrategy = require('passport-google-oauth').OAuth2Strategy;

const GOOGLEPLUS = {
    GOOGLE_APP_ID: '42643689062-kmm89boegmnl0bhe4td16fdctlgbl77b.apps.googleusercontent.com',
    GOOGLE_APP_SECRET: 'n_KJIx9wlxyDwlFPIiGt837x',
    callbackURL: 'https://events-management-system.herokuapp.com/auth/google/callback'
};

module.exports = function(passport, data) {
    const GoogleAuthStrategy = new GooglePlusStrategy({
        clientID: GOOGLEPLUS.GOOGLE_APP_ID,
        clientSecret: GOOGLEPLUS.GOOGLE_APP_SECRET,
        callbackURL: GOOGLEPLUS.callbackURL,
        passReqToCallback: true
    }, (req, accessToken, refreshToken, profile, done) => {
        process.nextTick(function() {
            data
                .getUserByGoogleplusId(profile.id)
                .then(user => {
                    if (user) {
                        return done(null, user);
                    } else {
                        data.createUser({
                            firstName: profile.name.givenName || '',
                            lastName: profile.name.familyName || '',
                            email: profile.emails[0].value,
                            username: profile.name.givenName + '' + profile.name.familyName + '' + profile.id,
                            avatarUrl: profile.photos[0].value,
                            socialLogins: {
                                googlePlus: {
                                    email: profile.emails[0].value,
                                    id: profile.id,
                                    token: accessToken,
                                    name: profile.name.givenName + ' ' + profile.name.familyName,
                                    picture: profile.photos[0].value
                                }
                            }
                        }).then(user => {
                            return done(null, user);
                        });
                    }
                });
        });
    });
    passport.use(GoogleAuthStrategy);
};