/* globals require describe it beforeEach afterEach*/

'use strict';

const chai = require('chai');
const sinonModule = require('sinon');

let expect = chai.expect;

describe('Test event data', () => {
    let sinon;
    beforeEach(() => {
        sinon = sinonModule.sandbox.create();
    });

    let Event = require('./mocks/mockedEvent');
    let EventType = require('./mocks/mockedEventType');
    let Country = require('./mocks/mockedCountry');
    let City = require('./mocks/mockedCity');
    let User = require('./mocks/mockedUser');
    let data = require('../../data/event-data')({ Event });
    let eventTypeData = require('../../data/eventType-data')({ EventType });
    let countryData = require('../../data/country-data')({ Country });
    let cityData = require('../../data/city-data')({ City });
    let userData = require('../../data/user-data')({ User });


    describe('getEvents', () => {
    // arrange
        let firstEventId = 1;
        let secondEventId = 2;
        let events = [{
            _id: firstEventId,
            name : 'Conference',
            isApproved: true,
            isDeleted: false
        }, {
            _id: secondEventId,
            name : 'Concert',
            isApproved: false,
            isDeleted: false,
        }];
        beforeEach(() =>     
            sinon.stub(Event, 'find', (query, cb) => {
                let isApproved = query.isApproved;
                let isDeleted = query.isDeleted;
                let event = events.find(e => e.isApproved === isApproved && e.isDeleted === isDeleted);
                cb(null, event);
            })
        );

        afterEach(() => {
            sinon.restore();
        });
        it('Expect to return 1 event when calling getAllApprovedEvents()', done => {
            // act
            data.getAllApprovedEvents()
                .then(actualEvents => {
                    // assert
                    expect(actualEvents).to.eql(events[0]);
                    done();
                });
        });
        it('Expect to return 1 event when calling getAllAwaitingEvents()', done => {
            // act
            data.getAllAwaitingEvents()
                .then(actualEvents => {
                    // assert
                    expect(actualEvents).to.eql(events[1]);
                    done();
                });
        });
    });

    describe('getEventById(id)', () => {       
        // arrange
        let eventId = 1;
        let events = [{
            _id: eventId,
            name : 'Conference',
            isApproved: true,
            isDeleted: false
        }];   
        beforeEach(() =>  
            sinon.stub(Event, 'findOne', (query, cb) => {
                let id = query._id;
                let event = events.find(e => e._id === id);
                cb(null, event);
            })
        );

        afterEach(() => {
            sinon.restore();
        });

        it('Expect to return the event', done => {
             //act
            data.getEventById(eventId)
                .then((actualEvent => {
                    //assert
                    expect(actualEvent).to.equal(events[0]);
                    done();
                }));
        });
    });
});