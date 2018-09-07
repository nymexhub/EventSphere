'use strict';

const express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    passport = require('passport'),
    path = require('path');

/* Setup App */
module.exports = function(config){
    let app = express();

    app.set('view engine', 'pug');
    app.set('views', path.join(__dirname, '../views'));
    app.use('/static', express.static(path.join(__dirname, '../../public')));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(session({
        secret: config.sessionSecret,
        resave: true,
        saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    app.start = function(){
        const port = config.port;
        app.listen(port, () => console.log(`App running at: http://localhost:${port}`));
    };

    return app;
};
