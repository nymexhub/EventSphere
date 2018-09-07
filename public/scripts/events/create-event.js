/* globals validator */
'use strict';

const MIN_NAME_LENGTH = 3,
    MAX_NAME_LENGTH = 30,
    DATE_LENGTH = 16,
    MIN_DESCRIPTION_LENGTH = 50,
    MAX_DESCRIPTION_LENGTH = 1000,
    MAX_FILE_SIZE = 2 * 1024 * 1024;

(() => {
    const $createForm = $('#user-create-form'),
        $createBtn = $('#create-button'),
        $createFormErrorContainer = $('#error-container'),
        $countryDropDown = $('#country-drop-down'),
        $cityDropDownOptions = $('#city-drop-down > option'),
        $inputFile = $('#form-file'),
        $descriptionInput = $('#event-description');

    $cityDropDownOptions.each(function() {
        $(this).hide();
    });

    $(function() {
        $('.datepicker').each(function () {
            $(this).datetimepicker({
                dateFormat: 'yy-mm-dd',
                constrainInput: false
            });
        });
    });

    $createForm.find(':input').on('focus', function() {
        $(this).removeClass('input-error');
        $(this).next('span').text('');
    });

    $countryDropDown.change(function(){
        let country = $(this).val();
        $cityDropDownOptions.each(function() {
            if (country !== $(this).attr('country')){
                $(this).hide();
            }
            else{
                $(this).show();
            }
        });
    });

    $createBtn.on('click', () => {
        resetErrorContainer();
        let isFormValid = validateCreateForm(),
            isImageFileProvided = !!$createForm.find('#form-file')[0].files[0];

        if(isFormValid){
            return Promise.resolve()
                .then(() => {
                    let dataArray = $createForm.serializeArray(),
                        dataObj = {};

                    $(dataArray).each(function(i, field){
                        dataObj[field.name] = field.value;
                    });

                    return dataObj;
                })
                .then((event) => {
                    $.ajax({
                        url: '/events/create',
                        method: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(event)
                    })
                    .done(res => {
                        let formData = new FormData();
                        formData.append('file', $inputFile[0].files[0]);

                        if (isImageFileProvided) {
                            $.ajax({
                                url: '/events/' + res.eventId + '/images',
                                method: 'POST',
                                contentType: false,
                                data: formData,
                                processData: false
                            })
                            .fail((err) => {
                                let errorObj = JSON.parse(err.responseText);
                                displayValidationErrors(errorObj, $createFormErrorContainer);
                            });
                        }

                        window.location = res.redirectRoute;
                    })
                    .fail((err) => {
                        let errorObj = JSON.parse(err.responseText);
                        displayValidationErrors(errorObj, $createFormErrorContainer);
                    });
                })
                .catch((err) => {
                    let errorObj = JSON.parse(err.responseText);
                    displayValidationErrors(errorObj, $createFormErrorContainer);
                });
        }
    });

    function resetErrorContainer(){
        $createFormErrorContainer.find('ul').html('');
        $createFormErrorContainer.hide();
    }

    function displayValidationErrors(jsonObject, container){
        container.show();

        $(jsonObject.validationErrors).each(function(index, item) {
            container.find('ul').append(
                $(document.createElement('li')).text(item)
            );
        });
    }

    function validateCreateForm(){
        let isFormValid = false,
            isNameValid = false,
            isCategoryValid = false,
            isCountryValid = false,
            isCityValid = false,
            isDateValid = false,
            isEndDateValid = false,
            isAddressValid = false,
            isDescriptionValid = false,
            isCoverUrlValid = false,
            isFileExtensionValid = false,
            isFileSizeValid = false,
            isImageFileProvided = !!$createForm.find('#form-file')[0].files[0];

        $createForm.find('select').each(function (){
            let select = $(this),
                selectName = select[0].name;

            if (selectName === 'eventType') {
                if(select[0].value !== 'Choose category') {
                    isCategoryValid = true;
                } else {
                    select.addClass('input-error');
                    select.next('span').text('Field is required.');
                }
            }

            if (selectName === 'country') {
                if (select[0].value !== 'Choose country') {
                    isCountryValid = true;
                } else {
                    select.addClass('input-error');
                    select.next('span').text('Field is required.');
                }
            }

            if (selectName === 'city') {
                if (select[0].value !== 'Choose city') {
                    isCityValid = true;
                } else {
                    select.addClass('input-error');
                    select.next('span').text('Field is required.');
                }
            }
        });

        $createForm.find('input').each(function(){
            let input = $(this),
                inputName = input.attr('name');

            if (inputName === 'file' && !isCoverUrlValid) {
                let file = input[0].files[0];

                if (!file) {
                    input.addClass('input-error');
                    input.next('span').text('Choose file to upload.');
                    return;
                }

                if (file.name.match(/\.(jpg|jpeg|png)$/i)) {
                    isFileExtensionValid = true;
                } else {
                    input.addClass('input-error');
                    input.next('span').text('File types allowed: jpg, jpeg, png.');
                }

                if (file.size <= MAX_FILE_SIZE) {
                    isFileSizeValid = true;
                } else {
                    input.addClass('input-error');
                    input.next('span').text('Maximum file size is 2MB!');
                }
            }

            if(inputName === 'name'){
                isNameValid = validator.validateInputString(input, true, false, MIN_NAME_LENGTH, MAX_NAME_LENGTH);
            }

            if(inputName === 'dateOfEvent'){
                isDateValid = validator.validateInputString(input, true, false, DATE_LENGTH, DATE_LENGTH);
            }

            if(inputName === 'endDateOfEvent'){
                isEndDateValid = validator.validateInputString(input, true, false, DATE_LENGTH, DATE_LENGTH);
            }

            if(inputName === 'coverUrl' && !isImageFileProvided){
                isCoverUrlValid = validator.validateInputString(input, false, false);
            }

            if(inputName === 'address'){
                isAddressValid = validator.validateInputString(input, true, false, MIN_NAME_LENGTH, MAX_NAME_LENGTH);
            }

            isDescriptionValid = validator.validateInputString($descriptionInput, true, false, MIN_DESCRIPTION_LENGTH, MAX_DESCRIPTION_LENGTH);
        });

        if (isNameValid && isDateValid && isEndDateValid && isAddressValid && isDescriptionValid &&
                isCategoryValid && isCountryValid && isCityValid &&
                (isCoverUrlValid || (isFileExtensionValid && isFileSizeValid)) ) {
            isFormValid = true;
        }

        return isFormValid;
    }
})();