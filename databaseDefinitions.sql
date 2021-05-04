CREATE TABLE Authors (
    AuthorsId INT NOT NULL AUTO_INCREMENT,
    FirstName VARCHAR(255),  -- This could be null if the authors uses a pen name
    LastName VARCHAR(255) NOT NULL,
    PRIMARY KEY (AuthorsId)
);

CREATE TABLE Comic (
    ComicId INT NOT NULL AUTO_INCREMENT,
    ComicTitle VARCHAR(255) NOT NULL,
    ComicPosterPath VARCHAR(255) NOT NULL,
    Synopsis TEXT NOT NULL,
    ComicViews INT NOT NULL, 
    PRIMARY KEY (ComicId),
    FOREIGN KEY (AuthorsId) REFERENCES Authors(AuthorsId)
);

CREATE TABLE Chapter (
    ChapterId INT NOT NULL AUTO_INCREMENT,
    ChapterTitle VARCHAR(255) NOT NULL,
    ChapterViews INT NOT NULL,
    PRIMARY KEY (ChapterId),
    FOREIGN KEY (ComicId) REFERENCES Comic(ComicId),
);

CREATE TABLE ComicPage (
    pageNumber INT NOT NULL,
    pagePath VARCHAR(255) NOT NULL,
    pageViews INT NOT NULL,
    FOREIGN KEY (ChapterId) REFERENCES Chapter(ChapterId),
    PRIMARY KEY (ChapterId, pageNumber)
)