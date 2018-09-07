'use strict';

const nodemailer = require('nodemailer');
const supportEmail = 'eventsys.sup@gmail.com';


const helpers = require('../helpers'),
    formidable = require('formidable'),
    path = require('path'),
    uploader = require('../helpers/uploader');

const settings = {
    host: 'smtp.sendgrid.net',
    service: 'Gmail',
    port: parseInt(587, 10),
    requiresAuth: true,
    auth: {
        user: 'eventsys.sup@gmail.com',
        pass: 'ninjas123456'
    }
};
const transporter = nodemailer.createTransport(settings);


module.exports = function(data) {
    return {
        getLogin(req, res) {
            return Promise.resolve()
                .then(() => {
                    if (!req.isAuthenticated()) {
                        res.render('user/login', {});
                    } else {
                        res.redirect('/home');
                    }
                });
        },
        getProfile(req, res) {
            return Promise.resolve()
                .then(() => {
                    if (!req.isAuthenticated()) {
                        res.status(401).redirect('/unauthorized');
                    } else {
                        if (req.user.role === 'admin') {
                            res.render('user/profile', { user: req.user, isAdmin: true });
                        } else {
                            res.render('user/profile', { user: req.user, isAdmin: false });
                        }
                    }
                });
        },
        getProfileAvatar(req, res) {
            return Promise.resolve()
                .then(() => {
                    if (!req.isAuthenticated()) {
                        res.status(401).redirect('/unauthorized');
                    } else {
                        if (req.user.role === 'admin') {
                            res.render('user/profile-avatar', { user: req.user, isAdmin: true });
                        } else {
                            res.render('user/profile-avatar', { user: req.user, isAdmin: false });
                        }
                    }
                });
        },
        uploadProfileAvatar(req, res) {
            return new Promise((resolve, reject) => {
                    if (!req.isAuthenticated()) {
                        res.status(401).redirect('/unauthorized');
                        reject();
                    } else {
                        let form = new formidable.IncomingForm();
                        form.maxFieldsSize = 2 * 1024 * 1024;

                        form.onPart = function(part) {
                            if (!part.filename || part.filename.match(/\.(jpg|jpeg|png)$/i)) {
                                form.on('end', function(fields, files) {
                                    if (this.openedFiles[0].size > form.maxFieldsSize) {
                                        return reject({ name: 'ValidationError', message: 'Maximum file size is 2MB.' });
                                    } else {
                                        res.status(200)
                                            .send({ redirectRoute: '/profile' });
                                    }

                                    let userFolder = req.user.id,
                                        pathToUploadFolder = path.join(__dirname, '../../public/uploads/users', userFolder),
                                        newFileName = 'avatar';

                                    uploader.uploadFile(this.openedFiles[0], pathToUploadFolder, newFileName)
                                        .then(uploadedFileName => {
                                            resolve(uploadedFileName);
                                        });
                                });
                                form.handlePart(part);
                            } else {
                                return reject({ name: 'ValidationError', message: 'File types allowed: jpg, jpeg, png.' });
                            }
                        };

                        form.on('error', function(err) {
                            reject(err);
                        });

                        form.parse(req);
                    }
                })
                .then((fileName) => {
                    if (typeof fileName !== 'string') {
                        return;
                    }

                    let avatarUrl = '/static/uploads/users/' + req.user.id + '/' + fileName;
                    data.findUserByIdAndUpdate(req.user.id, { avatarUrl });
                })
                .catch((err) => {
                    res.status(400)
                        .send(JSON.stringify({ validationErrors: [err.message] }));
                });
        },
        getUnauthorized(req, res) {
            return Promise.resolve()
                .then(() => {
                    if (!req.isAuthenticated()) {
                        res.render('unathorized', {});
                    } else {
                        res.redirect('/home');
                    }
                });
        },
        getRegister(req, res) {
            return Promise.resolve()
                .then(() => {
                    if (!req.isAuthenticated()) {
                        res.render('user/register', {});
                    } else {
                        res.redirect('/home');
                    }
                });
        },
        updateProfile(req, res) {
            const updatedUser = req.body;

            return Promise.resolve()
                .then(() => {
                    if (!req.isAuthenticated()) {
                        res.redirect('/home');
                    } else {
                        return data.findUserByIdAndUpdate(req.user._id, updatedUser);
                    }
                })
                .then(user => {
                    res.status(200)
                        .send({ redirectRoute: '/profile' });
                })
                .catch(err => {
                    res.status(400)
                        .send(JSON.stringify({ validationErrors: helpers.errorHelper(err) }));
                });
        },
        getAllEventsForApproval(req, res) {
            if (!req.isAuthenticated() || req.user.role !== 'admin') {
                res.status(401).redirect('/unauthorized');
            } else {
                return data.getAllAwaitingEvents()
                    .then(events => {
                        res.render('user/approve-events', { user: req.user, isAdmin: true, events: events });
                    });
            }
        },
        updateEvent(req, res) {
            if (!req.isAuthenticated() || req.user.role !== 'admin') {
                res.status(401).redirect('/unauthorized');
            } else {
                return data.getEventById(req.body.event)
                    .then(event => {
                        if (req.body.action === 'delete-event') {
                            event.isDeleted = true;
                            event.save();
                        } else if (req.body.action === 'approve-event') {
                            event.isApproved = true;
                            event.save();
                        }

                        res.status(200).send({ redirectRoute: '/approvals' });
                    })
                    .catch(err => {
                        res.status(400)
                            .send(JSON.stringify({ validationErrors: helpers.errorHelper(err) }));
                    });
            }
        },
        getCalendar(req, res) {
            return Promise.resolve()
                .then(() => {
                    if (!req.isAuthenticated()) {
                        res.redirect('/home');
                    } else {
                        res.render('user/calendar');
                    }
                });
        },
        getAllUserEvents(req, res) {
            return Promise.resolve()
                .then(() => {
                    if (!req.isAuthenticated()) {
                        res.redirect('/home');
                    } else {
                        return data.getUserByName(req.user.username)
                            .then(user => {
                                res.send(user.subscribedEvents);
                            });
                    }
                });
        },
        getContactForm(req, res) {
            return Promise.resolve()
                .then(() => {
                    if (!req.isAuthenticated()) {
                        res.render('user/contact-form', {});
                    } else if (req.user.role === 'admin') {
                        res.render('user/contact-form', { user: req.user, isAdmin: true });
                    } else {
                        res.render('user/contact-form', { user: req.user, isAdmin: false });
                    }
                });
        },
        sendEmail(req, res) {
            return Promise.resolve()
                .then(() => {
                    let userEmail = req.body.userEmail,
                        subject = req.body.subject,
                        message = req.body.inputMessage;

                    const mailOptions = {
                        to: supportEmail,
                        from: supportEmail,
                        subject: subject,
                        text: message,
                        html: `useremail: ${userEmail}, messages ${message}`
                    };

                    transporter.sendMail(mailOptions, (err) => {
                        if (err) {
                            console.log(err.message);
                            return res.redirect('/contact');
                        }

                        res.redirect('/contact');
                    });
                })
                .catch(err => {
                    res.status(400)
                        .send(JSON.stringify({ validationErrors: helpers.errorHelper(err) }));
                });
        }
    };
};