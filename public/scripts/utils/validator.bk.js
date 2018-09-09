'use strict';

const validator = (() => {
    function validateInputString(input, wantLengthValidation, wantCharacterValidation, min = 0, max = 100, pattern = '') {
        let isValid = false;

        if (input.val() === '') {
            input.addClass('input-error');
            input.next('span').text('Field is required');
        }
        else if (wantLengthValidation && !validateInputLength(input.val(), min, max)) {
            input.addClass('input-error');
            input.next('span').text('Invalid length: must be between ' + min + ' and ' + max);
        }
        else if (wantCharacterValidation && validateInputCharacters(input.val(), pattern)) {
            input.addClass('input-error');
            input.next('span').text('Invalid characters!');
        }
        else {
            input.removeClass('input-error');
            input.next('span').text('');
            isValid = true;
        }

        return isValid;
    }

    function validateInputLength(value, min, max) {
        let hasValidLength = true;

        if ((value.length < min || value.length > max)) {
            hasValidLength = false;
        }

        return hasValidLength;
    }

    function validateInputCharacters(value, pattern) {
        let hasErrors = false;

        if (!pattern.test(value)) {
            hasErrors = true;
        }

        return hasErrors;
    }

    function validateInputNumber(input, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
        let isValid = false;

        if (input.val() === '') {
            input.addClass('input-error');
            input.next('span').text('Field is required');
        }
        else if (isNaN(input.val()) || +input.val() < min || +input.val() > max) {
            input.addClass('input-error');
            input.next('span').text('Invalid ' + input.attr('name') + ': must be between ' + min + ' and ' + max);
        }
        else {
            input.removeClass('input-error');
            input.next('span').text('');
            isValid = true;
        }

        return isValid;
    }

    return {
        validateInputString,
        validateInputNumber,
        validateInputLength
    };
})();