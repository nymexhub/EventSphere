'use strict';
class Event {
    constructor(properties) {
        this.name = properties.name;
        this.eventType = properties.eventType;
        this.user = properties.user;
        this.country = properties.country;
        this.city= properties.city;
        this.address = properties.address;
        this.description = properties.description;
        this.dateOfEvent = properties.dateOfEvent;
        this.endDateOfEvent = properties.endDateOfEvent;
        this.coverUrl = properties.coverUrl;
        this.capacity = properties.capacity;
        this.comments = [];
        this.isApproved = properties.isApproved,
        this.isDeleted = properties.isDeleted;
    }
    save() {}
    static find() {}
    static findOne() {}
    static findOneAndUpdate() {}
}

module.exports = Event;