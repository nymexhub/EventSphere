'use strict';

module.exports = function(models) {
    const Country = models.Country;

    return {
        createCountry(name) {
            let country = new Country({
                name
            });

            return new Promise((resolve, reject) => {
                country.save((error) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(country);
                });
            });
        },
        getCountryBy(id) {
            return new Promise((resolve, reject) => {
                Country.findOne({ _id: id }, (err, country) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(country || null);
                });
            });
        },
        getAllCountries() {
            return new Promise((resolve, reject) => {
                Country.find((err, countries) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(countries);
                });
            });
        },
    };
};