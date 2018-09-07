'use strict';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

(() => {
    const $profileForm = $('#user-profile-form'),
        $inputFile = $('#form-file'),
        $uploadBtn = $('#upload-button'),
        $profileFormErrorContainer = $('#error-container');

    $profileForm.find(':input').on('focus', function() {
        $(this).removeClass('input-error');
        $(this).next('span').text('');
    });

    $uploadBtn.on('click', () => {
        resetErrorContainer();
        let isFormValid = validateProfileForm();

        if (isFormValid) {
            return Promise.resolve()
                .then(() => {
                    let formData = new FormData();
                    formData.append('file', $inputFile[0].files[0] );

                    return formData;
                })
                .then((formData) => {
                    $.ajax({
                        url: '/profile/avatar',
                        method: 'POST',
                        contentType: false,
                        data: formData,
                        processData: false
                    })
                    .done((res) => {
                        setTimeout(() => {
                            window.location = res.redirectRoute;
                        }, 500);
                    })
                    .fail((err) => {
                        let errorObj = JSON.parse(err.responseText);
                        displayValidationErrors(errorObj, $profileFormErrorContainer);
                    });
                })
                .catch((err) => {
                    let errorObj = JSON.parse(err.responseText);
                    displayValidationErrors(errorObj, $profileFormErrorContainer);
                });
        }
    });

    function resetErrorContainer(){
        $profileFormErrorContainer.find('ul').html('');
        $profileFormErrorContainer.hide();
    }

    function displayValidationErrors(jsonObject, container){
        container.show();

        $(jsonObject.validationErrors).each(function(index, item) {
            container.find('ul').append(
                $(document.createElement('li')).text(item)
            );
        });
    }

    function validateProfileForm() {
        let isFormValid = false,
            isFileExtensionValid = false,
            isFileSizeValid = false;

        $profileForm.find('#form-file').each(function () {
            let input = $(this),
                inputName = input.attr('name');

            if (inputName === 'file') {
                let file = input[0].files[0];

                if (!file) {
                    input.addClass('input-error');
                    input.next('span').text('Choose file to upload.');
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
        });

        if (isFileExtensionValid && isFileSizeValid) {
            isFormValid = true;
        }

        return isFormValid;
    }
})();