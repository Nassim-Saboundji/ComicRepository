# comicRepo Backend REST API

A web app for hosting an online comic repository it supports the ability of uploading comics and reading them.
This is only the backend API.

# How To Run

First you should cd into the repo and run the command `npm install` to install
all the required dependencies. After this is done create an empty folder
called uploads. This is where the uploaded comic posters and pages will be put.

Now you must have postgreSQL installed on your machine (A quick google search will teach you how, the installation is different depending on your OS). You can use the default postgres user like so `psql postgres` once this is done create a database named comicrepo with `create database comicrepo;`.
Then connect yourself to that database with the command `\c comicrepo`. 
Then do `\i databaseDefinitions.sql` to load the tables relevant to the web app.
That's it! Exit postgres with the `exit` command.

Now you can start using the REST API by launching the server by using the command
`npx nodemon`

Here are the various routes that can be used: 

__ [GET] http://localhost:3000/comics __

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

__ [GET] http://localhost:3000/comic/:comicId __

Gives you relevant information about the comic with comicId provided in the route.
Example : http://localhost:3000/comic/8
```
[
  {
    "comic_id": 8,
    "comic_title": "Calvin and Hobbes",
    "comic_poster": "poster-1620750069541.jpeg",
    "comic_info": "Calvin and Hobbes is a daily American comic strip created by cartoonist Bill Watterson that was syndicated from November 18, 1985 to December 31, 1995"
  }
]
```

__ [GET] http://localhost:3000/comic/:comicId/chapters __

Give you relevant information for every chapter uploaded to the comic repository for the comic with the provided comicId.
Example : http://localhost:3000/comic/8/chapters
```
[
  {
    "chapter_number": 1,
    "chapter_title": "Beginning",
    "comic_id": 8
  },
  {
    "chapter_number": 2,
    "chapter_title": "Middle",
    "comic_id": 8
  },
  {
    "chapter_number": 3,
    "chapter_title": "End",
    "comic_id": 8
  }
]
```
__ [GET] http://localhost:3000/comic/:comicId/:chapterNumber __

To get all the pages of a given chapter of a given comic. Example : http://localhost:3000/comic/8/1
```
[
  {
    "page_image": "pages-1620918186057.jpeg"
  },
  {
    "page_image": "pages-1620918186061.jpeg"
  },
  {
    "page_image": "pages-1620918186052.jpeg"
  },
  {
    "page_image": "pages-1620918186063.jpeg"
  },
  {
    "page_image": "pages-1620918186065.jpeg"
  },
  {
    "page_image": "pages-1620918186071.png"
  },
  {
    "page_image": "pages-1620918186067.jpeg"
  }
]
```
Also you can access each images using the static route. Example: http://localhost:3000/static/pages-1620918186057.jpeg (This is the link you want to put inside an img tag to display the image pages-1620918186057.jpeg in the frontend) 

__ [GET] http://localhost:3000/loginAdmin __

This is used to login the user so one can use the [POST] routes below. By default there is only one admin account with username: admin and password: 1234 

As an example you can login with http://localhost:3000/loginAdmin?username=admin&password=1234

```
{
  "message": "Admin is logged in."
}

```

__ [GET] http://localhost:3000/logoutAdmin __

Allows an admin to logout.

```
{
  message: "Admin is now logged out."
}

```

__ [POST] http://localhost:3000/addComic __

Allows an admin to add a new comic to the repository. The required body parameters are title, info, file.

Example of an html form :
```
<form action="http://localhost:3000/addComic" method="post" enctype="multipart/form-data">
        title : <input type="text" name="title">
        info : <input type="text" name="info">
        <input type="file" name="poster" />
        <input type="submit">
</form>
```

The response will be a message confirming the operation was successful and the comic_id
of the newly added comic.

```
{
  "message": "Upload was successful.",
  "comic_id": 2
}

```

__ [POST] http://localhost:3000/addChapter

Allows an admin to add a chapter to an existing comic in the repository.
The body parameters are the comicId of the comic we want to add a chapter to, the chapterNumber,
chapterTitle and pages.

Example of a form that could be used to perform a request for that route
```
    <form action="http://localhost:3000/addChapter" method="post" enctype="multipart/form-data">
        comic_id : <input type="text" name="comicId">
        chapter_number : <input type="text" name="chapterNumber">
        chapter_title : <input type="text" name="chapterTitle">
        <input type="file" name="pages" multiple>
        <input type="submit">
    </form>
```

The response should be :
```
{
  message: "Upload was successful."
}

```

__ [POST] http://localhost:3000/removeComic __

The body parameter is the comicId of the comic you want to remove.

```
<form action="http://localhost:3000/removeComic" method="post">
        comic_id : <input type="text" name="comicId">
        <input type="submit">
</form>
```

The response should be : 
```
{
  message: "If the comic existed it was successfully deleted."
}
```

__ [POST] http://localhost:3000/removeChapter __

```
<form action="http://localhost:3000/removeChapter" method="post">
    comic_id : <input type="text" name="comicId">
    chapter_number : <input type="text" name="chapterNumber">
    <input type="submit">
</form>
```

The response should be :

```
{
  message: "Chapter successfully deleted."
}

```
