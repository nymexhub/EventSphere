'use strict';

(() => {
    const $eventInfo = $('.event-info'),
        $subscribeBtn = $('#subscribe-button');

    $subscribeBtn.on('click', () => {
        return Promise.resolve()
            .then(() => {
                let subscribedEventId = $eventInfo.attr('id');
                return {
                    subscribedEventId: subscribedEventId,
                };
            })
            .then((subscribeData) => {
                $.ajax({
                    url: '/events/' + subscribeData.subscribedEventId + '/subscribe',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(subscribeData)
                })
                .done((res) => {
                    if(res.userHasSubscribed){
                        $subscribeBtn.html('Unsubscribe');
                        $subscribeBtn.removeClass('btn-default');
                        $subscribeBtn.addClass('btn-success');
                    }
                    else{
                        $subscribeBtn.html('Subscribe');
                        $subscribeBtn.removeClass('btn-default');
                        $subscribeBtn.addClass('btn-success');
                    }
                })
                .fail((err) => {
                    let errorObject = JSON.parse(err.responseText);
                    return errorObject;
                });
            })
            .catch((err)=>{
                console.log(err);
            });

    });
})();