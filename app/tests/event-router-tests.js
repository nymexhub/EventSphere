/* globals require describe it beforeEach afterEach*/

'use strict';

const chai = require('chai');
const sinonModule = require('sinon');
const chaiHttp = require('chai-http');
const express = require('express');
const config = require('../config');

chai.use(chaiHttp);

let expect = chai.expect;

describe('Test event router', () => {
    let sinon;

    let controller = {
        getEvents: (req, res) => {},
        getEventDetails: (req, res) => {},
        commentEvent: (req, res) => {},
        createEvent: (req, res) => {}
    };

    let events = [{
        _id: 1,
        name: 'HackConf',
        eventType: 'Education',
        city: 'Sofia',
        country: 'Bulgaria',
        address: 'Al. Malinov',
        description: 'IT Conferencerhierhyieuryieuryeiuryieyrieryeiuryeiuyrieuyrieuyrieuyrieuyrieuryeiuyreiryeiuryeiuryieyrieyre',
        dateOfEvent: new Date('2016-12-20 10:00:00'),
        endDateOfEvent: new Date('2016-12-20 18:00:00'),
        coverUrl: 'http://radorado.me/wp-content/uploads/2015/01/hackbulgaria.png',
        capacity: 500,
        minAge: 10,
        rating: 5,
        isDeleted: false,
        isApproved: true
    }];

    beforeEach(() => {
        sinon = sinonModule.sandbox.create();

        sinon.stub(controller, 'getEvents', (req, res) => {
            res.render('event/event-list', {
                model: events
            });
        });
        sinon.stub(controller, 'getEventDetails', (req, res) => {
            let event = events.find(ev => ev._id === +req.params.id);

            res.render('event/event-details', {
                model: event || null
            });
        });
        sinon.stub(controller, 'createEvent', (req, res) => {
            res.render('event/event-list', {
                model: events
            });
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('GET /events/create', () => {
        it('Expects to return 1 event', done => {
            let data = {};
            let app = require('../config/application')(config);            
            require('../routers/event-router')(app, express, data);

            chai.request(app)
                .get('/events/')
                .end((req, res) => {
                    expect(res.status).equals(200);
                    done();
                });
        });
    });

    describe('GET /events/:id', () => {
        it('Valid ID', done => {
            let data = {};
            let app = require('../config/application')(config);
            
            require('../routers/event-router')(app, express, data);

            chai.request(app)
                .get('/events/1')
                .end((req, res) => {
                    expect(res.status).equals(200);
                    done();
                });
        });
    });
});
