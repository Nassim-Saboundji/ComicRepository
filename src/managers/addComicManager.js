const db = require('../database/dummyDBCredentials');
const validator = require('validator');
const multer = require('multer'); //this is what is responsible for file uploads.


// Contains all the data needed for adding a comic to table
// comic in the database.
var addComicData = {
    message: "",
    poster: "",
    title: "",
    info: ""
}

async function checkComicExistence(title) {
    let results =  await db.pool.query(
        "SELECT EXISTS(SELECT 1 FROM comic WHERE comic_title=$1::text)",
        [title]
    );
    return results.rows[0].exists;
}


/*
This function will validate all the data posted by the user including the image
file before proceeding with the image upload. 
The reason that we validated the other post data here instead of just the file being uploaded is because its the only place where 
we can access the content req.body.title and req.body.info and not receive undefined for both.
This function is passed to the addComicUpload multer object through the fileFilter record.

Express can't access req.body when the form has an enctype="multipart/form-data".
However Multer requires this enctype to make file uploads. This means that
The route addComic won't be able to access req.body and it will be undefined.
This is the rational behind accessing them through addComicFilter and doing the
validation here. This is also why we send the data to addComicData because we can't get it
elsewhere.
*/
async function addComicFilter(req, file, cb) {
    
    //cancel upload if user not logged in
    if (req.session.logged != true) {
        cb(null, false);
        addComicData.message = "Operation failed. You must login.";
        return;
    }

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

    const result = await checkComicExistence(addComicData.title);
    if (result == true) {
        cb(null, false);
        addComicData.message = "Adding this comic failed because it already exists.";
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
        cb(null, './uploads');
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


