const db = require('./dummyDBCredentials');
const express = require('express');
const validator = require('validator');

const app = express();
const port = process.env.PORT || 8080;

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
app.post('/addComic', (req, res) => {
    let title = req.body.title;
    let synopsis = req.body.synopsis;
    let posterImage = req.body.posterImage;

    if (!validator.isAlphanumeric(title)) {
        res.json({
            "error" : "Invalide title" 
        });
    }

    if (!validator.isAlphanumeric(synopsis)) {
        res.json({
            "error": "Invalide synopsis"
        });
    }

    
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})