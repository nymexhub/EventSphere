'use strict';

module.exports = function(models) {
    const City = models.City,
        Country = models.Country,
        dataUtils = require('./utils/data-utils'),
        mapper = require('../utils/mapper');

    return {
        createCity(cityData) {
            dataUtils.loadType(Country, cityData.country)
            .then((dbCountry) => {
                cityData.country = mapper.map(dbCountry, '_id', 'name');
                
                let city = new City(cityData);
                return new Promise((resolve, reject) => {
                    city.save((error) => {
                        if (error) {
                            return reject(error);
                        }
                        return resolve(city);
                    });
                });         
            });
        },
        getCityById(id) {
            return new Promise((resolve, reject) => {
                City.findOne({ _id: id }, (err, city) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(city);
                });
            });
        },
        getAllCities() {
            return new Promise((resolve, reject) => {
                City.find((err, cities) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(cities);
                });
            });
        },
    };
};