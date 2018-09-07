'use strict';

const fs = require('fs-extra'),
    path = require('path');

module.exports = {
    uploadFile(file, pathToUploadFolder, uploadedFileName) {
        return new Promise((resolve, reject) => {
            let tempPath = file.path,
                openedFileName = file.name,
                fileExtension = openedFileName.substring(openedFileName.lastIndexOf('.'), openedFileName.length);
            uploadedFileName += fileExtension;

            if (!fs.existsSync(pathToUploadFolder)){
                fs.mkdirSync(pathToUploadFolder);
            }

            let pathToNewFile = path.join(pathToUploadFolder, uploadedFileName);

            fs.copy(tempPath, pathToNewFile, function (err) {
                if (err) {
                    reject(err);
                }

                fs.remove(tempPath, (err) => {
                    if (err) {
                        resolve(err);
                    }
                });

                resolve(uploadedFileName);
            });
        });
    }
};