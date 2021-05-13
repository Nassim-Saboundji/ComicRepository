# comicRepo Backend REST API

A web app for hosting an online comic repository it supports the ability of uploading comics and reading them.
This is only the backend API. For the Frontend look at this repository : ___(WORK IN PROGRESS)___

# How To Run

First you should cd into the repo and run the commande npm install to install
all the required dependencies. After this is done create an empty folder
called uploads. This is where the uploaded comic posters and pages will be put.

Now you must have postgreSQL installed on your machine (A quick google search will teach you how, the installation is different depending on your OS). You can use the default postgres user like so `psql postgres` once this is done create a table named comicrepo with `create table comicrepo;`. That's it! Exit postgres with the `exit` command.

Now you can start using the REST API by launching the server by using the command
`npx nodemon`

Here are the various routes that can be used: 

__Get /comics__

will display all the comics that are currently uploaded to the comic repository. you'll get as an example :
```
[
  {
    "comic_id": 8,
    "comic_title": "Calvin and Hobbes",
    "comic_poster": "poster-1620750069541.jpeg"
  },
  {
    "comic_id": 9,
    "comic_title": "Dragon Ball",
    "comic_poster": "poster-1620750143402.jpeg"
  },
  {
    "comic_id": 10,
    "comic_title": "whatever",
    "comic_poster": "poster-1620757319627.png"
  },
  {
    "comic_id": 11,
    "comic_title": "Star Wars",
    "comic_poster": "poster-1620757524405.png"
  },
  {
    "comic_id": 12,
    "comic_title": "My Hero Academia",
    "comic_poster": "poster-1620916175660.jpeg"
  }
]

```
