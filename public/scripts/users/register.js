/* globals validator */
'use strict';

const MIN_NAME_LENGTH = 3,
    MIN_USERNAME_LENGTH = 5,
    MAX_NAME_LENGTH = 30,
    NAME_PATTERN = /^[A-Za-zА-Яа-я]+$/,
    ALPHA_PATTERN = /^[A-Za-zА-Яа-я0-9]+$/,
    EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

(() => {
    const $registerForm = $('#user-registration-form'),
        $registerBtn = $('#register-button'),
        $registerFormErrorContainer = $('#error-container');

    $registerForm.find(':input').on('focus', function() {
        $(this).removeClass('input-error');
        $(this).next('span').text('');
    });

    $registerBtn.on('click', () => {
        resetErrorContainer();
        let isFormValid = validateRegistrationForm();

        if (isFormValid) {
            return Promise.resolve()
                .then(() => {
                    let dataArray = $registerForm.serializeArray(),
                        dataObj = {};

                    $(dataArray).each(function(i, field) {
                        dataObj[field.name] = field.value;
                    });

                    return dataObj;
                })
                .then((user) => {
                    $.ajax({
                            url: '/register',
                            method: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify(user)
                        })
                        .done((res) => {
                            window.location = res.redirectRoute;
                        })
                        .fail((err) => {
                            let errorObj = JSON.parse(err.responseText);
                            displayValidationErrors(errorObj, $registerFormErrorContainer);
                        });
                })
                .catch((err) => {
                    let errorObj = JSON.parse(err.responseText);
                    displayValidationErrors(errorObj, $registerFormErrorContainer);
                });
        }
    });

    function resetErrorContainer() {
        $registerFormErrorContainer.find('ul').html('');
        $registerFormErrorContainer.hide();
    }

    function displayValidationErrors(jsonObject, container) {
        container.show();

        $(jsonObject.validationErrors).each(function(index, item) {
            container.find('ul').append(
                $(document.createElement('li')).text(item)
            );
        });
    }

    function validateRegistrationForm() {
        let isFormValid = false,
            isUsernameValid = false,
            isPasswordValid = false,
            isEmailValid = false,
            isFirstNameValid = false,
            isLastNameValid = false,
            isAgeValid = false;

        $registerForm.find('input').each(function() {
            let input = $(this),
                inputName = input.attr('name');

            if (inputName === 'username') {
                isUsernameValid = validator.validateInputString(input, true, true, MIN_USERNAME_LENGTH, MAX_NAME_LENGTH, ALPHA_PATTERN);
            }

            if (inputName === 'password') {
                isPasswordValid = validator.validateInputString(input, true, true, MIN_USERNAME_LENGTH, MAX_NAME_LENGTH, ALPHA_PATTERN);
            }

            if (inputName === 'email') {
                isEmailValid = validator.validateInputString(input, true, true, MIN_NAME_LENGTH, MAX_NAME_LENGTH, EMAIL_PATTERN);
            }

            if (inputName === 'firstName') {
                isFirstNameValid = validator.validateInputString(input, true, true, MIN_NAME_LENGTH, MAX_NAME_LENGTH, NAME_PATTERN);
            }

            if (inputName === 'lastName') {
                isLastNameValid = validator.validateInputString(input, true, true, MIN_NAME_LENGTH, MAX_NAME_LENGTH, NAME_PATTERN);
            }

            if (inputName === 'age') {
                isAgeValid = validator.validateInputNumber(input, 12, 100);
            }
        });

        if (isUsernameValid && isEmailValid && isPasswordValid && isFirstNameValid && isLastNameValid && isAgeValid) {
            isFormValid = true;
        }

        return isFormValid;
    }
})();