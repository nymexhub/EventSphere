'use strict';

(() => {
    const $sendBtn = $('#send-email-button'),
        $contactForm = $('#contact-form'),
        $response = $($contactForm.find('#response-message')[0]);

    $sendBtn.one('click', function() {
        return Promise.resolve()
            .then(() => {
                let dataArray = $contactForm.serializeArray(),
                    dataObj = {};

                $(dataArray).each(function(i, field) {
                    dataObj[field.name] = field.value;
                });

                return dataObj;
            })
            .then((data) => {
                $.ajax({
                        method: 'POST',
                        url: '/contact',
                        contentType: 'application/json',
                        data: JSON.stringify(data)
                    })
                    .done((res) => {
                        $('.form-group.input').addClass('hidden');
                        $sendBtn.addClass('hidden');
                        $response.removeClass('sr-only');
                        $response.html('Thank you for your message. We will reach out to you as soon as we can.');
                    })
                    .fail((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    });
})();