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



//updating this variable is not a problem because NodeJS is sequential
//and we check it's value almost immediately after the value is changed.
var addComicStatus = "";
var fileNameOnDisk = "";
function addComicFilter(req, file, cb) {
    let title = req.body.title;
    let synopsis = req.body.synopsis;

    if (!validator.isAlphanumeric(title)) {
        cb(null, false);
        addComicStatus = "Title is invalid.";
        return;
    }

    if (!validator.isAlphanumeric(synopsis)) {
        cb(null, false);
        addComicStatus = "Synopsis is invalid.";
        return;
    }

    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        addComicStatus = "Upload was successful.";
        cb(null, true);
    } else {
        cb(null, false);
        addComicStatus = "Only png, jpg, jpeg are accepted.";
        return;
    }
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        let fileType = file.mimetype.split('/');
        cb(null, file.fieldname + '-' + Date.now() + '.' + fileType[1]);
    }
});


var addComicUpload = multer({
    storage: storage,
    fileFilter : (req, file, cb) => { addComicFilter(req, file, cb) },
});



app.post('/profile', addComicUpload.single('poster'), function (req, res, next) {
    if(addComicStatus == "Upload was successful.") {
        db.client.connect();
        const query = {
            text: "INSERT INTO comic(comictitle, comicposterpath, synopsis, comicviews) VALUES ($1::text,$2::text,$3::text,0)",
            values: ['Titre', 'nom.jpg', 'Synopsis'],
            rowMode: 'array'
        }

        db.client.query(query, (err, res) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('Data insert successful');
            db.client.end();

        });
    }
    
    res.json({message: addComicStatus});
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});