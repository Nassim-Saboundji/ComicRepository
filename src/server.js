const db = require('./database/dummyDBCredentials');
const express = require('express');
const acm = require('./managers/addComicManager');
const achm = require('./managers/addChapterManager');
const session = require('express-session');
const secret = require('./secrets/secret');
const { default: validator } = require('validator');
const fs = require('fs');
const rateLimit = require("express-rate-limit");
const app = express();
const port =  3000;
const cors = require('cors');

//This required to access the body of post requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//allow CORS
app.use(cors({
    credentials: true,
    origin: "http://localhost:3001" //specifiy the adress of your frontend
}));

//For preventing DDoS attacks
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100 // limit each IP to 100 requests per windowMs
});
  
//the rate limiting applies to all requests
app.use(limiter);

//For loading uploaded images we make the uploads folder accessible
// through the static route
// so we can get an image with ex: http://.../static/imageName.png
app.use('/static', express.static('src/uploads'));


app.use(session({ 
    secret: secret.mySecret,
    cookie: { 
        maxAge: 3600000,
    }, //A user session expires after 60 minutes
    resave: false,
    saveUninitialized: true,
    withCredentials: true 
}));


/*
This route allows a user to authenticate oneself as an Admin which grants the ability
of using post routes. The query parameters are username and password.
Returns a json object which contains a message propriety which indicates if the user has
successfully logged as an Admin.
*/
app.get('/loginAdmin', (req, res, next) => {  
    if (!validator.isAlphanumeric(req.query.username)) {
        res.json({message: "Admin username is invalid."});
        return;
    }

    if (!validator.isAlphanumeric(req.query.password)) {
        res.json({message: "Admin password is invalid."});
        return;
    }


    if (req.session.logged == undefined || req.session.logged == false) {
        db.pool.query(
            "SELECT EXISTS(SELECT 1 FROM admin_user WHERE username=$1::text AND user_password=sha256($2))",
            [req.query.username, req.query.password],
            (error, results) => {
                if (error) {
                    throw error;
                }
                if(results.rows[0].exists) {
                    req.session.logged = true;
                    res.json({message: "Admin is logged in."});
                } else {
                    req.session.logged = false;
                    res.json({message: "Admin was not able to login."});
                }
            }
        );
    }

    if (req.session.logged == true) {
        res.json({message: "Admin is already logged in."});
    }
});

/*
Route that allows an admin to logout.
Returns a json object that indicates if the admin has successfully logged out.
*/
app.get('/logoutAdmin', (req, res, next) => {
    if (req.session.logged == true) {
        req.session.logged == false;
        res.json({message: "Admin is now logged out."});
    } else {
        res.json({message: "Admin is already logged out."});
    }
});

/*
An admin can add a comic to the web app using this route.
The required body parameters are title, info and file. 
Returns a json object containing a message propriety and if the comic was added
successfully a comic_id propriety which contains the id of the comic in the database.

Note : Look at addComicManager to see how the body parameters are handled. It was required
to do them there because of some limitations of the Multer library which is what I used
to make uploads.
*/ 
app.post('/addComic', acm.addComicUpload.single('poster'), async function (req, res, next) {
    if(acm.addComicData.message == "Upload was successful.") {
        
        await db.pool.query(
            "INSERT INTO comic(comic_title, comic_poster, comic_info) VALUES ($1::text,$2::text,$3::text)",
            [acm.addComicData.title, acm.addComicData.poster, acm.addComicData.info]
        );
        
        const response = await db.pool.query(
            "SELECT comic_id FROM comic WHERE comic_title=$1::text",
            [acm.addComicData.title]
        );

        res.json({
            message: acm.addComicData.message,
            comicId: response.rows[0]["comic_id"]
        });
    } else {
        res.json({message: acm.addComicData.message}); 
    }
});


/*
An admin can use this route to add a chapter and the related comic pages to the web app.
The body parameters are comicId, chapterNumber and chapterTitle. Like with the addComic route
the body parameters are handled and validated by its own manager the addChapterManager. This
is once again due to some limitations with how the Multer library which takes care of file uploads
works. 

Returns a json object with a message propriety which indicates whenever or not the operation
was successful.
*/
app.post('/addChapter', achm.addChapterUpload.array('pages', 100), function (req, res, next) {
    if (achm.addChapterData.message == "Upload was successful.") {
        db.pool.query(
            "INSERT INTO chapter(chapter_number, chapter_title, comic_id) VALUES ($1,$2::text,$3)",
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
    //reset the content of chapterPages so that we don't reupload
    //the same images twice when the user decides to make another request
    //to this route.
    achm.addChapterData.chapterPages = [];
    res.json({message: achm.addChapterData.message});
});

/*
Allows an admin to remove a comic from the web app.
Returns a json object with a message propriety which indicates whenever the
operation was successful.

This is a post method instead of a delete method simply because I was not able to figure
out how to pass parameters for a delete route in express.
*/
app.post('/removeComic', function (req, res, next) {
    
    if (!validator.isInt(req.body.comicId)) {
        res.json({message: "No comic id was provided. Please enter a valid comic id."});
        return;
    }

    if (req.session.logged == true) {
        
        //Delete the poster image for that comic
        db.pool.query(
            "SELECT comic_poster FROM comic WHERE comic_id=$1",
            [req.body.comicId],
            (error, results) => {
                if (error) {
                    throw error;
                }
                let posterPath = "./uploads/" + results.rows[0].comic_poster;
                try {
                    fs.unlinkSync(posterPath);
                } catch(err) {
                    console.error(err);
                }
            }
        );

        db.pool.query(
            "SELECT page_image FROM comic_page WHERE comic_id=$1",
            [req.body.comicId],
            (error, results) => {
                if (error) {
                   throw error; 
                } 
                if (results.rows.length != 0) {
                    for (let i = 0; i < results.rows.length; i++) {
                        let posterPath = "./uploads/" + results.rows[i].page_image;
                        try {
                            fs.unlinkSync(posterPath);
                        } catch(err) {
                            console.error(err);
                        }
                    }
                }
            }
        );

        db.pool.query(
            "DELETE FROM comic WHERE comic_id=$1",
            [req.body.comicId],
            (error, results) => {
                if (error) {
                    throw error;
                }
                res.json({message: "If the comic existed it was successfully deleted."});
            }
        );
    } else {
        res.json({message: "Operation failed. You must login."});
    }
});

/*
Same thing as with the removeComic route but for a specific chapter.
*/
app.post('/removeChapter', async function (req, res, next) {
    
    if (!validator.isInt(req.body.comicId)) {
        res.json({message: "No comic id was provided. Please enter a valid comic id."});
        return;
    }
    
    if (!validator.isInt(req.body.chapterNumber)) {
        res.json({message: "No chapter number was provided. Please enter a valid chapter number."});
    }

    if (req.session.logged == true) {
        
        //we first delete the images on disk before deleting rows in the database
        const response = await db.pool.query(
            "SELECT page_image FROM comic_page where comic_id=$1 AND chapter_number=$2",
            [req.body.comicId, req.body.chapterNumber]
        );
        
        if (response.rows.length != 0) {
            for (let i = 0; i < response.rows.length; i++) {
                let posterPath = "./uploads/" + response.rows[i].page_image;
                try {
                    fs.unlinkSync(posterPath);
                } catch(err) {
                    console.error(err);
                }
            }
        }
        
        db.pool.query(
            "DELETE FROM chapter WHERE comic_id=$1 AND chapter_number=$2",
            [req.body.comicId, req.body.chapterNumber],
            (error, results) => {
                if (error) {
                    throw error;
                }
            }
        );

        //we delete the individual pages in the comic_page table as well.
        db.pool.query(
            "DELETE FROM comic_page WHERE comic_id=$1 AND chapter_number=$2",
            [req.body.comicId, req.body.chapterNumber],
            (error, results) => {
                if (error) {
                    throw error;
                }
                res.json({message: "Chapter successfully deleted."});
            }
        );
        
    } else {
        res.json({message: "Operation failed. You must login."})
    }
});





/*
Route for getting the ids, title, posters and views for all comics in the comicRepo
in a json object.
*/
app.get('/comics', function (req, res, next) {
    db.pool.query(
        `SELECT comic_id "comicId", comic_title "comicTitle", comic_poster "comicPoster" FROM comic`,
        (error, results) => {
            if (error) {
                throw error;
            }
            res.json(results.rows);
        }
    );
});



/*
Same as the /comics route but for one specific comic. Requires the comicId parameter.
*/
app.get('/comic/:comicId', function (req, res, next) {
    let comicId = req.params.comicId;
    db.pool.query(
        `SELECT comic_title "comicTitle", comic_poster "comicPoster", comic_info "comicInfo" FROM comic WHERE comic_id=$1`,
        [comicId],
        (error, results) => {
            if (error) {
                throw error;
            }
            res.json(results.rows);
        }
    );
});


/*
Route for getting a list of chapters for a given comic by providing its comicId.
*/
app.get('/comic/:comicId/chapters', function (req, res, next) {
    let comicId = req.params.comicId;
    db.pool.query(
        `SELECT chapter_number "chapterNumber", chapter_title "chapterTitle" FROM chapter where comic_id=$1`,
        [comicId],
        (error, results) => {
            if (error) {
                throw error;
            }
            res.json(results.rows);
        }
    );
});


/*
Route for getting all the pages of a given chapter of a given comic. Requires a comicId
and a chapterNumber.
*/
app.get('/comic/:comicId/:chapterNumber', function (req, res, next) {
    let comicId = req.params.comicId;
    let chapterNumber = req.params.chapterNumber;
    db.pool.query(
        `SELECT page_image "pageImage" FROM comic_page WHERE comic_id=$1 AND chapter_number=$2`,
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


//we export the app variable so we can use it for our tests.
module.exports = {
    app
};