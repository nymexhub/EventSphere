/* globals require describe it beforeEach afterEach*/

'use strict';

const chai = require('chai');
const sinonModule = require('sinon');

let expect = chai.expect;

describe('Test users data', () => {
    let sinon;
    beforeEach(() => {
        sinon = sinonModule.sandbox.create();
    });

    let User = require('./mocks/mockedUser');
    let data = require('../../data/user-data')({ User });

    describe('Test createUser(userData)', () => {
        //arrange
        const userdata = {
            firstName: 'Ivan',
            lastName: 'Ivanov',
            username: 'BigBoss',
            email: 'asda@abv.bg',
        };

        beforeEach(() => {
            sinon.stub(User.prototype, 'save', cb => {
                cb(null);
            });
        });
        afterEach(() => {
            sinon.restore();
        });

        it('Expect to create and save country', done => {
            //act
            data.createUser(userdata)
                .then(user => {
                    //assert
                    expect(user.firstName).to.equal(userdata.firstName);
                    done();
                });
        });
    });
    describe('Test getUserBy(id)', () => {
        //arrange
        let existingUserId = 1;
        let users = [{
            _id: existingUserId,
            firstName: 'Ivan',
            lastName: 'Ivanov',
            username: 'BigBoss',
            email: 'asda@abv.bg',
        }];

        beforeEach(() => {
            sinon.stub(User, 'findOne', (query, cb) => {
                let id = query._id;
                let user = users.find(c => c._id === id);
                cb(null, user);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('Expect to return 1 user', done => {
            //act
            data.getUserById(existingUserId)
                .then(resultUser => {
                    //assert
                    expect(resultUser).to.equal(users[0]);
                    done();
                });
        });
    });
    describe('Test getUserByEmail(email)', () => {
        //arrange
        let existingEmail = 'asda@abv.bg';
        let users = [{
            firstName: 'Ivan',
            lastName: 'Ivanov',
            username: 'BigBoss',
            email: existingEmail,
        }];

        beforeEach(() => {
            sinon.stub(User, 'findOne', (query, cb) => {
                let email = query.email;
                let user = users.find(c => c.email === email);
                cb(null, user);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('Expect to return 1 user', done => {
            //act
            data.getUserByEmail(existingEmail)
                .then(resultUser => {
                    //assert
                    expect(resultUser).to.equal(users[0]);
                    done();
                });
        });
    });
    describe('Test getAllUsers()', () => {
        it('Expect to return 2 users', done => {
            //arrange
            let users = [{
                firstName: 'Ivan',
                lastName: 'Ivanov',
                username: 'BigBoss',
                email: 'asda@abv.bg',
            }, {
                firstName: 'Petko',
                lastName: 'Petkov',
                username: 'NotTheBigBoss',
                email: 'aassssssssssssssssss@abv.bg',
            }];

            sinon.stub(User, 'find', cb => {
                cb(null, users);
            });

            //act
            data.getAllUsers()
                .then(resultUsers => {
                    //assert
                    expect(resultUsers).to.equal(users);
                    done();
                });
        });
    });
});