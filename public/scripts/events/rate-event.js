'use strict';

(() => {
    const $eventInfo = $('.event-info'),
        $likeBtn = $('.like-btn'),
        $dislikeBtn = $('.dislike-btn'),
        $countOfLikes = $('.likes'),
        $countOfDislikes = $('.dislikes');

    $likeBtn.on('click', function(event) {
        $dislikeBtn.removeClass('btn-primary');
        $likeBtn.addClass('btn-primary');

        return Promise.resolve()
            .then(() => {
                let ratedEventId = $eventInfo.attr('id');
                return {
                    ratedEventId: ratedEventId,
                    rate: 'like'
                };
            })
            .then((ratedEvent) => {
                $.ajax({
                    url: '/events/' + ratedEvent.ratedEventId,
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(ratedEvent)
                })
                .done((res) => {
                    $countOfLikes.html(res.likesCount);
                    $countOfDislikes.html(res.dislikesCount);
                })
                .fail((err) => {
                    let errorObject = JSON.parse(err.responseText);
                    return errorObject;
                });
            });
    });

    $dislikeBtn.on('click', function(event) {
        $dislikeBtn.addClass('btn-primary');
        $likeBtn.removeClass('btn-primary');

        return Promise.resolve()
            .then(() => {
                let ratedEventId = $eventInfo.attr('id');
                return {
                    ratedEventId: ratedEventId,
                    rate: 'dislike'
                };
            })
            .then((ratedEvent) => {
                $.ajax({
                    url: '/events/' + ratedEvent.ratedEventId,
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(ratedEvent)
                })
                .done((res) => {
                    $countOfLikes.html(res.likesCount);
                    $countOfDislikes.html(res.dislikesCount);
                })
                .fail((err) => {
                    let errorObject = JSON.parse(err.responseText);
                    return errorObject;
                });
            });
    });
})();