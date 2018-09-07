'use strict';
class User {
    constructor(properties) {
        this.firstName = properties.firstName;
        this.lastName = properties.lastName;
        this.username = properties.username;
        this.age = properties.age;
        this.email = properties.email;
        this.avatarUrl = properties.avatarUrl;
        this.dateCreated = properties.dateCreated;
        this.role = properties.role;
        this.socialLogins = properties.socialLogins;
        this.subscribedEvents = [];
    }
    save() {}
    static find() {}
    static findOne() {}
    static findOneAndUpdate() {}
}

module.exports = User;