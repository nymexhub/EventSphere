'use strict';
class City {
    constructor(properties) {
        this.name = properties.name;
        this.country = properties.country;
    }

    save() {}
    loadType() {}
    static find() {}
    static findOne() {}
}

module.exports = City;