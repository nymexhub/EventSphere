'use strict';

module.exports = function(models) {
    const User = models.User;

    return {
        createUser(userData) {
            let user = new User(userData);

            return new Promise((resolve, reject) => {
                user.save((error) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(user);
                });
            });
        },
        getUserById(id) {
            return new Promise((resolve, reject) => {
                User.findOne({ _id: id }, (err, user) => {
                    if (err) {
                        return reject(err);
                    }

                    if (!user) {
                        return reject(user);
                    }

                    return resolve(user);
                });
            });
        },
        getUserByFacebookId(id) {
            return new Promise((resolve, reject) => {
                User.findOne({ 'socialLogins.facebook.id': id }, (err, user) => {
                    if (err) {
                        return reject(err);
                    }

                    if (!user) {
                        resolve(null, false);
                    }

                    return resolve(user);
                });
            });
        },
        getUserByGoogleplusId(id) {
            return new Promise((resolve, reject) => {
                User.findOne({ 'socialLogins.googlePlus.id': id }, (err, user) => {
                    if (err) {
                        return reject(err);
                    }

                    if (!user) {
                        resolve(null, false);
                    }

                    return resolve(user);
                });
            });
        },
        getUserByTwitterId(id) {
            return new Promise((resolve, reject) => {
                User.findOne({ 'socialLogins.twitter.id': id }, (err, user) => {
                    if (err) {
                        return reject(err);
                    }

                    if (!user) {
                        resolve(null, false);
                    }

                    return resolve(user);
                });
            });
        },
        findUserByIdAndUpdate(id, update) {
            return new Promise((resolve, reject) => {
                User.findOneAndUpdate({ _id: id }, update, { new: true }, (err, user) => {
                    if (err) {
                        return reject(err);
                    }

                    if (!user) {
                        return reject(user);
                    }

                    return resolve(user);
                });
            });
        },
        getUserByName(name) {
            return new Promise((resolve, reject) => {
                User.findOne({ username: name }, (err, user) => {
                    if (err) {
                        return reject(err);
                    }

                    if (!user) {
                        return reject(user);
                    }

                    return resolve(user);
                });
            });
        },
        getUserByEmail(email) {
            return new Promise((resolve, reject) => {
                User.findOne({ email: email }, (err, user) => {
                    if (err) {
                        return reject(err);
                    }

                    if (!user) {
                        return reject(user);
                    }

                    return resolve(user);
                });
            });
        },
        getUsersByNames(User, ...names) {
            return new Promise((resolve, reject) => {
                User.find({
                    name: { $in: names }
                }, (err, users) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(users);
                });
            });
        },
        getAllUsers() {
            return new Promise((resolve, reject) => {
                User.find((err, users) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(users);
                });
            });
        },
        getAllUserEvents() {
            return new Promise((resolve, reject) => {

            });
        }
    };
};