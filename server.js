const db = require('./dummyDBCredentials');
const express = require('express');
const validator = require('validator');
const multer = require('multer');


const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
This routes allows the user to add a comic to the comicRepo
The user must have submitted a title, synopsis, author(s) name(s)
and an image file for the comic poster (which is a cover image 
that represents the comic as a whole).

This route will return a json object which will tell the client
if the operation was successful or not.
*/




var message = "";
function addComicFilter(req, file, cb) {
    let title = req.body.title;
    let synopsis = req.body.synopsis;

    if (!validator.isAlphanumeric(title)) {
        cb(null, false);
        message = "Title is invalid";
        return;
    }

    if (!validator.isAlphanumeric(synopsis)) {
        cb(null, false);
        message = "Synopsis is invalid";
        return;
    }

    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        message = "Upload was successful";
        cb(null, true);
    } else {
        cb(null, false);
        message = "Only png, jpg, jpeg are accepted";
        return;
    }
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});


var addComicUpload = multer({
    storage: storage,
    fileFilter : (req, file, cb) => { addComicFilter(req, file, cb) },
});



app.post('/profile', addComicUpload.single('poster'), function (req, res, next) {
    res.json({message: message});
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});