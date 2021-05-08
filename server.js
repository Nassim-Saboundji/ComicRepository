const db = require('./dummyDBCredentials');
const express = require('express');
const acm = require('./addComicManager')
const achm = require('./addChapterManager');
const app = express();
const port = 3000;

//This required to access the body of post requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//For loading uploaded images we make the uploads folder accessible
app.use('/static',express.static('uploads'));


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
        db.pool.query(
            "INSERT INTO comic(comic_title, comic_poster, comic_info, comic_views) VALUES ($1::text,$2::text,$3::text,0)",
            [acm.addComicData.title, acm.addComicData.poster, acm.addComicData.info],
            (error, results) => {
                if (error) {
                  throw error;
                }
            }

        );
    }
    
    res.json({message: acm.addComicData.message});
});

app.post('/addChapter', achm.addChapterUpload.array('pages', 100), function (req, res, next) {
    if (achm.addChapterData.message == "Upload was successful.") {
        db.pool.query(
            "INSERT INTO chapter(chapter_number, chapter_title, chapter_views, comic_id) VALUES ($1,$2::text,0,$3)",
            [
             achm.addChapterData.chapterNumber,
             achm.addChapterData.chapterTitle,
             achm.addChapterData.comicId
            ],
            (error, results) => {
                if (error) {
                    throw error;
                }
            }
        );

        for (let i = 0; i < achm.addChapterData.chapterPages.length; i++) {
            db.pool.query(
                "INSERT INTO comic_page(page_number, page_image, chapter_number, comic_id)" +
                " VALUES ($1,$2::text,$3,$4)",
                [
                 (i+1),
                 achm.addChapterData.chapterPages[i],
                 achm.addChapterData.chapterNumber,
                 achm.addChapterData.comicId
                ],
                (error, results) => {
                    if (error) {
                        throw error;
                    }
                }
            );
        }
    }
    
    res.json({message: achm.addChapterData.message});
});

//get general information about a comic
app.get('/comic/:comicId', function (req, res, next) {
    let comicId = req.params.comicId;
    db.pool.query(
        "SELECT comic_title, comic_poster, comic_info, comic_views FROM comic WHERE comic_id=$1",
        [comicId],
        (error, results) => {
            if (error) {
                throw error;
            }
            res.json(results.rows);
        }
    );
});

//get all the pages of a given chapter of a given comic
app.get('/comic/:comicId/:chapterNumber', function (req, res, next) {
    let comicId = req.params.comicId;
    let chapterNumber = req.params.chapterNumber;
    db.pool.query(
        "SELECT page_image FROM comic_page WHERE comic_id=$1 AND chapter_number=$2",
        [comicId, chapterNumber],
        (error, results) => {
            if (error) {
                throw error;
            }
            res.json(results.rows);
        }
    );
});



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});