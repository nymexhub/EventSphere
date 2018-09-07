'use strict';

const COUNT_OF_EVENTS = 5;

const helpers = require('../helpers');

module.exports = function (data) {
    return {
        getEvents(req, res) {
            data.getAllApprovedEvents()
                .then((events => {
                    res.status(200)
                        .json(events);
                }))
                .catch(err => {
                    res.status(400)
                        .json({ validationErrors: helpers.errorHelper(err) });
                });
        }
    };
};