'use strict';

const util = require('util');

let helpers = {};

helpers.errorHelper = function (err) {
    let errors = [],
        messages = {
            'required': '%s is required.',
            'min': '%s below minimum.',
            'max': '%s above maximum.',
            'enum': '%s not an allowed value.',
            'unique': 'already exists a user with the same %s.'
        };

    // MongoError message for unique validation
    //"E11000 duplicate key error collection: events-db.users index: email_1 dup key: { : \"asd@asd.asd\" }"
    if (err.name === 'MongoError' && err.message.indexOf('duplicate key') !== -1) {
        // extracting the field that caused the error
        let msg = err.message,
            findWrongFieldNamePattern = 'index: ',
            indexOfFieldName = msg.indexOf(findWrongFieldNamePattern),
            secondPartMsg = msg.substring(indexOfFieldName + findWrongFieldNamePattern.length, msg.length - 1),
            fieldName = secondPartMsg.substring(0, secondPartMsg.indexOf('_'));

        errors.push(util.format(
            messages['unique'],
            fieldName)
        );

        return errors;
    }

    if (err.name !== 'ValidationError') {
        return err;
    }

    Object.keys(err.errors).forEach(function (field) {
        let eObj = err.errors[field];

        if (!messages.hasOwnProperty(eObj.properties.type)) {
            errors.push(eObj.properties.type);
        } else {
            errors.push(util.format(
                messages[eObj.properties.type],
                eObj.properties.path)
            );
        }
    });

    return errors;
};

module.exports = helpers;
