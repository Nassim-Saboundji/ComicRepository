const validator = require('validator');
const multer = require('multer'); //this is what is responsible for file uploads.


var addChapterData = {
    message: "",
    comicId: null,
    chapterTitle: "",
    chapterPages: []
}

function addChapterFilter(req, file, cb) {
    addChapterData.comicId = req.body.comicId;
    addChapterData.chapterTitle = req.body.chapterTitle;

    if (validator.isEmpty(addChapterData.chapterTitle)) {
        cb(null, false);
        addChapterData.message = "Chapter title is invalid.";
        return;
    }


    if (!validator.isInt(addChapterData.comicId)) {
        cb(null, false);
        addChapterData.message = "Comic Id is invalid.";
    }

    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        addChapterData.message = "Upload was successful.";
        cb(null, true);
    } else {
        cb(null, false);
        addChapterData.message = "Only png, jpg, jpeg are accepted.";
        return;
    }
}


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        let fileType = file.mimetype.split('/');
        let fileNameOnDisk = file.fieldname + '-' + Date.now() + '.' + fileType[1];
        addChapterData.chapterPages.push(fileNameOnDisk);
        cb(null, fileNameOnDisk);
    }
});


var addChapterUpload = multer({
    storage: storage,
    fileFilter : (req, file, cb) => { addChapterFilter(req, file, cb) },
});

module.exports = {
    addChapterData,
    addChapterUpload
};