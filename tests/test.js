const request = require("supertest");
const express = require("express");
const server = require("../server");
const session = require('express-session');
const secret = require('../secret');

describe("GET /loginAdmin", function () {
    
    it("Login as an admin", async function () {
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
      
        request(mockApp)
        .get('/logoutAdmin')
        .expect(200)
        .end(function(err, res) {
            if (err) throw err;
            console.log(res.body.message);
        });
    });
});

