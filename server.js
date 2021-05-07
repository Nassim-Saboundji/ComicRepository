const db = require('./dummyDBCredentials');
const express = require('express');
const acm = require('./addComicManager')

const app = express();
const port = 3000;

//This required to access the body of post requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
This routes allows the user to add a comic to the comicRepo
The user must have submitted a title, information about the comic (synopsis, authors, etc...)
and an image file for the comic poster (which is a cover image 
that represents the comic as a whole).

This route will return a json object which will tell the client
if the operation was successful or not and why if he latter.
*/
app.post('/addComic', acm.addComicUpload.single('poster'), function (req, res, next) {
    if(acm.addComicData.message == "Upload was successful.") {
        db.client.connect();
        const query = {
            text: "INSERT INTO comic(comictitle, comicposter, comicinfo, comicviews) VALUES ($1::text,$2::text,$3::text,0)",
            values: [acm.addComicData.title, acm.addComicData.poster, acm.addComicData.info],
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
    
    res.json({message: acm.addComicData.message});
});

app.post('/addChapter', function (req, res, next) {
    console.log(req.body.comicId);
    res.json({test: "test"});
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});