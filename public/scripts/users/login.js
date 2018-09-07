/* globals validator */
'use strict';

const ALPHA_PATTERN = /^[A-Za-zА-Яа-я1-9]+$/,
    MIN_NAME_LENGTH = 5,
    MAX_NAME_LENGTH = 30;

(() => {
    const $loginForm = $('#user-login-form'),
        $loginBtn = $('#login-button'),
        $loginFormErrorContainer = $('#error-container');

    $loginForm.find(':input').on('focus', function() {
        $(this).removeClass('input-error');
        $(this).next('span').text('');
    });

    $loginBtn.on('click', () => {
        resetErrorContainer();
        let isFormValid = validateRegistrationForm();

        if (isFormValid) {
            return Promise.resolve()
                .then(() => {
                    let dataArray = $loginForm.serializeArray(),
                        dataObj = {};

                    $(dataArray).each(function(i, field) {
                        dataObj[field.name] = field.value;
                    });

                    return dataObj;
                })
                .then((user) => {
                    $.ajax({
                        url: '/login',
                        method: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(user)
                    })
                        .done((res) => {
                            window.location = res.redirectRoute;
                        })
                        .fail((err) => {
                            let errorObj = JSON.parse(err.responseText);
                            displayValidationErrors(errorObj.message, $loginFormErrorContainer);
                        });
                })
                .catch((err) => {
                    let errorObj = JSON.parse(err.responseText);
                    displayValidationErrors(errorObj.message, $loginFormErrorContainer);
                });
        }
    });

    function resetErrorContainer() {
        $loginFormErrorContainer.find('ul').html('');
        $loginFormErrorContainer.hide();
    }

    function displayValidationErrors(message, container) {
        container.show();

        container.find('ul').append(
            $(document.createElement('li')).text(message)
        );
    }

    function validateRegistrationForm() {
        let isFormValid = false,
            isUsernameValid = false,
            isPasswordValid = false;

        $loginForm.find('input').each(function() {
            let input = $(this),
                inputName = input.attr('name');

            if (inputName === 'username') {
                isUsernameValid = validator.validateInputString(input, true, true, MIN_NAME_LENGTH, MAX_NAME_LENGTH, ALPHA_PATTERN);
            }

            if (inputName === 'password') {
                isPasswordValid = validator.validateInputString(input, true, true, MIN_NAME_LENGTH, MAX_NAME_LENGTH, ALPHA_PATTERN);
            }
        });

        if (isUsernameValid && isPasswordValid) {
            isFormValid = true;
        }

        return isFormValid;
    }
})();