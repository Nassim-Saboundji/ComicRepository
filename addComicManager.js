const validator = require('validator');
const multer = require('multer');

var addComicData = {
    message: "",
    poster: "",
    title: "",
    info: ""
}

function addComicFilter(req, file, cb) {
    addComicData.title = req.body.title;
    addComicData.info = req.body.info;

    if (validator.isEmpty(addComicData.title)) {
        cb(null, false);
        addComicData.message = "Title is invalid.";
        return;
    }

    if (validator.isEmpty(addComicData.info)) {
        cb(null, false);
        addComicData.message = "Information is invalid.";
        return;
    }

    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        addComicData.message = "Upload was successful.";
        cb(null, true);
    } else {
        cb(null, false);
        addComicData.message = "Only png, jpg, jpeg are accepted.";
        return;
    }
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        let fileType = file.mimetype.split('/');
        addComicData.poster = file.fieldname + '-' + Date.now() + '.' + fileType[1];
        cb(null, addComicData.poster);
    }
});


var addComicUpload = multer({
    storage: storage,
    fileFilter : (req, file, cb) => { addComicFilter(req, file, cb) },
});

module.exports = {
    addComicData,
    addComicUpload
};


