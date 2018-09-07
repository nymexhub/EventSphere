'use strict';

const fs = require('fs'),
    path = require('path'),
    express = require('express');

const routerFileNamesPattern = '-router.js';

module.exports = function (app, data) {
    // requiring all router files
    fs.readdirSync('./app/routers')
        .filter(file => file.includes(routerFileNamesPattern))
        .forEach(file => require(path.join(__dirname, file))(app, express, data));
};