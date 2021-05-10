const db = require('./dummyDBCredentials');
const validator = require('validator');
const multer = require('multer'); //this is what is responsible for file uploads.


var addChapterData = {
    message: "",
    comicId: null,
    chapterNumber: null,
    chapterTitle: "",
    chapterPages: []
}

/*
Makes sure that the comicId refer to an id that is in the database.
It returns a boolean.
We want to do this here because we don't want to upload a chapter to
a non existent comic.
*/
async function checkComicId(id) {
    let results =  await db.pool.query(
        "SELECT EXISTS(SELECT 1 FROM comic WHERE comic_id=$1)",
        [parseInt(addChapterData.comicId)]
    );
    return results.rows[0].exists;
}


async function addChapterFilter(req, file, cb) {
    
    //cancel upload if user not logged in
    if (req.session.logged != true) {
        cb(null, false);
        addChapterData.message = "Operation failed. You must login.";
        return;
    }

    addChapterData.comicId = req.body.comicId;
    addChapterData.chapterNumber = req.body.chapterNumber;
    addChapterData.chapterTitle = req.body.chapterTitle;

    if (validator.isEmpty(addChapterData.chapterTitle)) {
        cb(null, false);
        addChapterData.message = "Chapter title is invalid.";
        return;
    }

    if (!validator.isInt(addChapterData.chapterNumber)) {
        cb(null, false);
        addChapterData.message = "Chapter Number is invalid.";
        return;
    }

    if (!validator.isInt(addChapterData.comicId)) {
        cb(null, false);
        addChapterData.message = "Comic Id you provided is invalid.";
        return;
    }
    
    //Here we check if the comicId exists in our database
    let result = await checkComicId(addChapterData.comicId);
    if (result != true) {
        cb(null, false)
        addChapterData.message = "The comic you want to add a chapter to does not exist.";
        return;
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