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



//this variable contains all the data require to handle the
//addComic POST route.
var addComicData = {
    message: "",
    path: "",
    title: "",
    synopsis: ""
}
function addComicFilter(req, file, cb) {
    addComicData.title = req.body.title;
    addComicData.synopsis = req.body.synopsis;

    if (validator.isEmpty(addComicData.title)) {
        cb(null, false);
        addComicData.message = "Title is invalid.";
        return;
    }

    if (validator.isEmpty(addComicData.synopsis)) {
        cb(null, false);
        addComicData.message = "Synopsis is invalid.";
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
        addComicData.path = file.fieldname + '-' + Date.now() + '.' + fileType[1];
        cb(null, addComicData.path);
    }
});


var addComicUpload = multer({
    storage: storage,
    fileFilter : (req, file, cb) => { addComicFilter(req, file, cb) },
});



app.post('/profile', addComicUpload.single('poster'), function (req, res, next) {
    if(addComicData.message == "Upload was successful.") {
        db.client.connect();
        const query = {
            text: "INSERT INTO comic(comictitle, comicposterpath, synopsis, comicviews) VALUES ($1::text,$2::text,$3::text,0)",
            values: [addComicData.title, addComicData.path, addComicData.synopsis],
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
    
    res.json({message: addComicData.message});
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});