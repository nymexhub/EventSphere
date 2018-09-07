'use strict';

(() => {
    const $allEvents = $('#filter-events');

    $allEvents.on('click', (event) => {
        return Promise.resolve()
            .then(() => {
                let $eventToBeEdited = event.target.getAttribute('event-target');
                let action = event.target.id;

                return {
                    event: $eventToBeEdited,
                    action: action
                };
            })
            .then((processCommand) => {
                $.ajax({
                    url: '/approvals',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(processCommand)
                })
                    .done((res) => {
                        window.location = res.redirectRoute;
                    })
                    .fail((err) => {
                        let errorObj = JSON.parse(err.responseText);
                        console.log(errorObj);
                    });
            })
            .catch(err => {
                console.log(err);
            });
    });
})();