/* globals require describe it beforeEach afterEach*/

'use strict';

const chai = require('chai');
const sinonModule = require('sinon');

let expect = chai.expect;

describe('Test cities data', () => {
    let sinon;
    beforeEach(() => {
        sinon = sinonModule.sandbox.create();
    });

    let City = require('./mocks/mockedCity');
    let data = require('../../data/city-data')({ City });

    describe('Test getCityById(id)', () => {
        //arrange
        let existingCityId = 1;
        let cities = [{
            _id: existingCityId,
            name: 'Lovech',
            country: 'Bulgaria'
        }];

        beforeEach(() => {
            sinon.stub(City, 'findOne', (query, cb) => {
                let id = query._id;
                let city = cities.find(c => c._id === id);
                cb(null, city);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('Expect to return 1 city', done => {
            //act
            data.getCityById(existingCityId)
                .then(resultCity => {
                    //assert
                    expect(resultCity).to.equal(cities[0]);
                    done();
                });
        });
        it('Expect to return when no city with such id', done => {
            //act
            data.getCityById(5)
                .then(resultCity => {
                    //assert
                    expect(resultCity).to.equal(undefined);
                    done();
                });
        });
    });
    describe('Test getAllCities()', () => {
        it('Expect to return 2 cities', done => {
            //arrange
            let cities = ['Lovech', 'Plovdiv'];
            sinon.stub(City, 'find', cb => {
                cb(null, cities);
            });

            //act
            data.getAllCities()
                .then(resultCities => {
                    //assert
                    expect(resultCities).to.equal(cities);
                    done();
                });
        });
    });
});