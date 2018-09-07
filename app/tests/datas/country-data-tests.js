/* globals require describe it beforeEach afterEach*/

'use strict';

const chai = require('chai');
const sinonModule = require('sinon');

let expect = chai.expect;

describe('Test countries data', () => {
    let sinon;
    beforeEach(() => {
        sinon = sinonModule.sandbox.create();
    });

    let Country = require('./mocks/mockedCountry');
    let data = require('../../data/country-data')({ Country });

    describe('Test createCountry(name)', () => {
        //arrange
        beforeEach(() => {
            sinon.stub(Country.prototype, 'save', cb => {
                cb(null);
            });
        });
        afterEach(() => {
            sinon.restore();
        });

        it('Expect to create and save country', done => {
            //act
            let name = 'BG';
            data.createCountry(name)
                .then(country => {
                    //assert
                    expect(country.name).to.equal(name);
                    done();
                });
        });
    });
    describe('Test getCountryBy(id)', () => {
        //arrange
        let existingCountryId = 1;
        let countries = [{
            _id: existingCountryId,
            name: 'Bulgaria'
        }];

        beforeEach(() => {
            sinon.stub(Country, 'findOne', (query, cb) => {
                let id = query._id;
                let country = countries.find(c => c._id === id);
                cb(null, country);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('Expect to return 1 country', done => {
            //act
            data.getCountryBy(existingCountryId)
                .then(resutlCountry => {
                    //assert
                    expect(resutlCountry).to.equal(countries[0]);
                    done();
                });
        });
        it('Expect to return when no country with such id', done => {
            //act
            data.getCountryBy(5)
                .then(resutlCountry => {
                    //assert
                    expect(resutlCountry).to.equal(null);
                    done();
                });
        });
    });
    describe('Test getAllCountries()', () => {
        it('Expect to return 2 countries', done => {
            //arrange
            let countries = ['Bulgaria', 'Germany'];
            sinon.stub(Country, 'find', cb => {
                cb(null, countries);
            });

            //act
            data.getAllCountries()
                .then(resultCountries => {
                    //assert
                    expect(resultCountries).to.equal(countries);
                    done();
                });
        });
    });
});