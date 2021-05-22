const request = require("supertest");
const express = require("express");
const server = require("../server");
const session = require('express-session');
const secret = require('../secret');
const expect = require('chai').expect;
const db = require('../dummyDBCredentials');

describe("GET /loginAdmin", function () {

    it("Should login user as admin.", async function () {
        var mockApp = express();
        mockApp.use(session({ 
            secret: secret.mySecret,
            cookie: { maxAge: 3600000 }, //A user session expires after 60 minutes
            resave: true,
            saveUninitialized: true
        }));
        mockApp.all('*', function(req, res, next) {
            req.session.logged = false;
            next();
        });
        mockApp.use(server.app);

        const response = await request(mockApp).get('/loginAdmin?username=admin&password=1234');
        expect(response.body.message).to.eql("Admin is logged in.");
    });


    it("Should notify admin that he's already logged in.", async function () {
        var mockApp = express();
        mockApp.use(session({ 
            secret: secret.mySecret,
            cookie: { maxAge: 3600000 }, //A user session expires after 60 minutes
            resave: true,
            saveUninitialized: true
        }));
        mockApp.all('*', function(req, res, next) {
            req.session.logged = true; //we are already logged in.
            next();
        });
        mockApp.use(server.app);

        const response = await request(mockApp).get('/loginAdmin?username=admin&password=1234');
        expect(response.body.message).to.eql("Admin is already logged in.");
    });
});


describe("GET /logoutAdmin", function () {    
    it("Should logout the admin.", async function () {
        var mockApp = express();
        mockApp.use(session({ 
            secret: secret.mySecret,
            cookie: { maxAge: 3600000 }, //A user session expires after 60 minutes
            resave: true,
            saveUninitialized: true
        }));
        mockApp.all('*', function(req, res, next) {
            //authenticated(req, res, next);
            //OR
            req.session.logged = true;
            next();
        });
        mockApp.use(server.app);
      
        const response = await request(mockApp).get('/logoutAdmin');
        expect(response.body.message).to.eql("Admin is now logged out.");
        
    });
});

describe("POST /addComic", function () {

    it("Should add a comic to the comic repository.", async function () {
        var mockApp = express();
        mockApp.use(session({ 
            secret: secret.mySecret,
            cookie: { maxAge: 3600000 }, //A user session expires after 60 minutes
            resave: true,
            saveUninitialized: true
        }));
        mockApp.all('*', function(req, res, next) {
            req.session.logged = true;
            next();
        });
        mockApp.use(server.app);

        const response = await request(mockApp)
        .post('/addComic')
        .set({
            'Content-Type': 'application/json',
        })
        .field('title', 'Calvin and Hobbes')
        .field('info', 'This is a comic about a little boy and his tiger plushy.')
        .attach('poster', './calvinAndHobbes.png');
        
        expect(response.body.message).to.eql("Upload was successful.");
        expect(response.body.comicId).to.be.a("number");
    });

    it("Trying to add a second time the same comic should fail.", async function () {
        var mockApp = express();
        mockApp.use(session({ 
            secret: secret.mySecret,
            cookie: { maxAge: 3600000 }, //A user session expires after 60 minutes
            resave: true,
            saveUninitialized: true
        }));
        mockApp.all('*', function(req, res, next) {
            req.session.logged = true;
            next();
        });
        mockApp.use(server.app);

        const response = await request(mockApp)
        .post('/addComic')
        .set({
            'Content-Type': 'application/json',
        })
        .field('title', 'Calvin and Hobbes')
        .field('info', 'This is a comic about a little boy and his tiger plushy.')
        .attach('poster', './calvinAndHobbes.png');
        expect(response.body.message).to.eql("Adding this comic failed because it already exists.");
    });
});

describe("POST /addChapter", function () {
    it("Should add a chapter to an existing comic.", async function () {
        const comicId = await db.pool.query(
            "SELECT comic_id FROM comic WHERE comic_title='Calvin and Hobbes'"
        );

        const id = await comicId.rows[0]["comic_id"] + "";
        const data = {
            comicId: id,
            chapterNumber: "1",
            chapterTitle: "First Chapter"
        };
        
        var mockApp = express();
        mockApp.use(session({ 
            secret: secret.mySecret,
            cookie: { maxAge: 3600000 }, //A user session expires after 60 minutes
            resave: true,
            saveUninitialized: true
        }));
        mockApp.all('*', function(req, res, next) {
            req.session.logged = true;
            next();
        });

        mockApp.use(server.app);
        
        const response = await request(mockApp)
        .post('/addChapter')
        .set({
            'Content-Type': 'application/json',
        })
        .field(data)
        .attach('pages', 'ch1-1.jpg')
        .attach('pages', 'ch1-2.jpg')
        .attach('pages', 'ch1-3.jpeg')
        .attach('pages', 'ch1-4.jpg');

        expect(response.body.message).to.eql('Upload was successful.');
    });
});


describe("POST /removeChapter", function () {
    it("Should remove the chapter added in the previous test.", async function () {
        this.timeout(3000);

        const comicId = await db.pool.query(
            "SELECT comic_id FROM comic WHERE comic_title='Calvin and Hobbes'"
        );

        const id = await comicId.rows[0]["comic_id"] + "";
        const data = {
            comicId: id,
            chapterNumber: "1"
        };
        
        var mockApp = express();
        mockApp.use(session({ 
            secret: secret.mySecret,
            cookie: { maxAge: 3600000 }, //A user session expires after 60 minutes
            resave: true,
            saveUninitialized: true
        }));
        mockApp.all('*', function(req, res, next) {
            req.session.logged = true;
            next();
        });

        mockApp.use(server.app);
        
        const response = await request(mockApp)
        .post('/removeChapter')
        .set({
            'Content-Type': 'application/json',
        })
        .send(data);

        expect(response.body.message).to.eql('Chapter successfully deleted.');
    });
});

describe("POST /removeComic" , function () {
    it("Should remove the comic that was added in the previous test.", async function () {
        const comicIdToRemove = await db.pool.query(
            "SELECT comic_id FROM comic WHERE comic_title='Calvin and Hobbes'"
        );

        const id = await comicIdToRemove.rows[0]["comic_id"] + "";
        const data = {comicId: id};

        var mockApp = express();
        mockApp.use(session({ 
            secret: secret.mySecret,
            cookie: { maxAge: 3600000 }, //A user session expires after 60 minutes
            resave: true,
            saveUninitialized: true
        }));
        mockApp.all('*', function(req, res, next) {
            req.session.logged = true;
            next();
        });

        mockApp.use(server.app);
      
        const response = await request(mockApp)
        .post('/removeComic')
        .set({
            'Content-Type': 'application/json',
        })
        .send(data);
        expect(response.body.message).to.eql("If the comic existed it was successfully deleted.")
      
        
    });
});


