/* globals validator */
'use strict';

const MIN_COMMENT_LENGTH = 5,
    MAX_COMMENT_LENGTH = 300;

(() => {
    const $eventInfo = $('.event-info'),
        $commentBtn = $('#comment-button'),
        $commentInput = $('#comment-textarea');

    $commentInput.on('focus', function() {
        $(this).removeClass('input-error');
        $(this).next('span').text('');
    });

    $commentBtn.on('click', () => {
        let isFormValid = validator.validateInputString($commentInput, true, false, MIN_COMMENT_LENGTH, MAX_COMMENT_LENGTH);
        if(isFormValid){
            return Promise.resolve()
                .then(() => {
                    let commentedEventId = $eventInfo.attr('id');
                    return {
                        commentedEventId: commentedEventId,
                        commentText: $commentInput.val(),
                    };
                })
                .then((commentData) => {
                    $.ajax({
                        url: '/events/' + commentData.commentedEventId + '/comment',
                        method: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(commentData)
                    })
                    .done((res) => {
                        let $commentDetails = $('<div>', { class: 'comment-det' } );
                        let $commentAdds = $('<div>', { class: 'comment-adds' } );
                        let $comment = $('<p>', { id: 'comment' } );
                        let $commentAuthor = $('<span>', { class: 'author' } );
                        let $commentDateTime = $('<span>', { class: 'dateTime' } );
                        $comment.html(' ' + commentData.commentText);
                        $commentAuthor.html('From: ' + res.commentData.commentAuthor);
                        $commentDateTime.html('On: ' + res.commentData.dateOfComment + ' ' + 'Time:' + res.commentData.timeOfComment);
                        $commentAdds.append($commentAuthor);
                        $commentAdds.append($commentDateTime);
                        $commentDetails.append($comment);
                        $commentDetails.append($commentAdds);
                        $('#comments').append($commentDetails);        
                    })
                    .fail((err) => {
                        let errorObject = JSON.parse(err.responseText);
                        return errorObject;
                    });
                });
        }
    });
})();