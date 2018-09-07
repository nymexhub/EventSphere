'use strict';

const config = require('./config');
const app = require('./config/application')(config);
const data = require('./data')();

require('./config/database')(config.connectionString);
require('./auth')(app, data);
require('./routers')(app, data);

// let event = {
//     name: 'HackConf', eventType: 'Education', city: 'Sofia', country: 'Bulgaria', address: 'Al. Malinov', description: 'IT Conferencerhierhyieuryieuryeiuryieyrieryeiuryeiuyrieuyrieuyrieuyrieuyrieuryeiuyreiryeiuryeiuryieyrieyre',
//     dateOfEvent: new Date('2016-12-18 10:00:00'), endDateOfEvent: new Date('2016-12-18 12:00:00'), coverUrl: 'http://radorado.me/wp-content/uploads/2015/01/hackbulgaria.png', capacity: 500, minAge: 10, rating: 5,
//     isDeleted: false, isApproved: true
// };

// data.getUserById('5844b33e8f78b1248ca833ae')
//     .then(user => { data.createEvent(event, user); });

// let user = {
//     firstName: 'admin',
//     lastName: 'adminski',
//     username: 'admin',
//     password: 'admin123456',
//     email: 'email@email.com',
//     age: 20,
//     role: 'admin'
// };
// data.createUser(user);

app.start();