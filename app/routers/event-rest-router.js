'use strict';

module.exports = function(app, express, data) {
    let eventRouter = new express.Router(),
        eventController = require('../controllers/event-rest-controller')(data);

    eventRouter
        .get('/', eventController.getEvents);

    app.use('/api/events', eventRouter);
};