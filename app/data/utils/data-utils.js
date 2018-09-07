'use strict';

module.exports = {
    loadType(Type, name) {
        return new Promise((resolve, reject) => {
            Type.findOne({ name }, (err, dbType) => {
                let type = dbType;

                if (err) {
                    return reject(err);
                }

                if (type) {
                    return resolve(type);
                }
            });
        });
    },
    groupEvents(events) {
        let eventsByTypes = {};

        for (let i = 0, eventsCount = events.length; i < eventsCount; i++) {
            let current = events[i],
                typeName = current.eventType.name;
            if (!eventsByTypes[typeName]) {
                eventsByTypes[typeName] = { name: typeName, events: [] };
            }
            eventsByTypes[typeName].events.push(current);
        }
        return eventsByTypes;
    }

};