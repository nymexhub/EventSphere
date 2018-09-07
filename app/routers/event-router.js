'use strict';

module.exports = function(app, express, data) {
    let eventRouter = new express.Router(),
        eventController = require('../controllers/event-controller')(data);

    eventRouter
        .get('/', eventController.getEvents)
        .get('/search', eventController.search)
        .get('/create', eventController.getCreateEventForm)
        .post('/create', eventController.createEvent)
        .get('/:id', eventController.getEventDetails)
        .post('/:id', eventController.rateEvent)
        .post('/:id/comment', eventController.commentEvent)
        .post('/:id/subscribe', eventController.subscribeOrUnsubscribeForEvent)
        .post('/:id/images', eventController.uploadImage);

    app.use('/events', eventRouter);
};