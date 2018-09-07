'use strict';

const FacebookStrategy = require('passport-facebook');

const FACEBOOK = {
    FACEBOOK_APP_ID: '1378891302134747',
    FACEBOOK_APP_SECRET: '04bed716742c12ed3b994952507323bf',
    callbackURL: 'https://events-management-system.herokuapp.com/auth/facebook/callback'
};

module.exports = function(passport, data) {
    const FacebookAuthStrategy = new FacebookStrategy({
        clientID: FACEBOOK.FACEBOOK_APP_ID,
        clientSecret: FACEBOOK.FACEBOOK_APP_SECRET,
        callbackURL: FACEBOOK.callbackURL,
        profileFields: ['name', 'email', 'link', 'locale', 'timezone'],
        passReqToCallback: true
    }, (req, accessToken, refreshToken, profile, done) => {
        process.nextTick(function() {
            data
                .getUserByFacebookId(profile.id)
                .then(user => {
                    if (user) {
                        return done(null, user);
                    } else {
                        data.createUser({
                            firstName: profile.name.givenName,
                            lastName: profile.name.familyName,
                            email: profile.emails[0].value,
                            username: profile.name.givenName + '' + profile.name.familyName,
                            avatarUrl: `https://graph.facebook.com/${profile.id}/picture?type=large`,
                            socialLogins: {
                                facebook: {
                                    email: profile.emails[0].value,
                                    id: profile.id,
                                    token: accessToken,
                                    name: profile.name.givenName + ' ' + profile.name.familyName,
                                    picture: `https://graph.facebook.com/${profile.id}/picture?type=large`
                                }
                            }
                        }).then(user => {
                            return done(null, user);
                        });
                    }
                });
        });
    });

    passport.use(FacebookAuthStrategy);
};