CREATE TABLE Author (
    AuthorId INT NOT NULL AUTO_INCREMENT,
    FirstName VARCHAR(255),
    LastName VARCHAR(255) NOT NULL,
    PRIMARY KEY (AuthorId)
);

CREATE TABLE Comic (
    ComicId INT NOT NULL AUTO_INCREMENT,
    ComicTitle VARCHAR(255) NOT NULL,
    ComicPosterPath VARCHAR(255) NOT NULL,
    Synopsis TEXT NOT NULL,
    ComicViews INT NOT NULL, 
    AuthorId INT,
    PRIMARY KEY (ComicId),
    FOREIGN KEY (AuthorId) REFERENCES Author(AuthorId)
);

CREATE TABLE Chapter (
    ChapterId INT NOT NULL AUTO_INCREMENT,
    ChapterTitle VARCHAR(255) NOT NULL,
    ChapterViews INT NOT NULL,
    ComicId INT,
    PRIMARY KEY (ChapterId),
    FOREIGN KEY (ComicId) REFERENCES Comic(ComicId)
);

CREATE TABLE ComicPage (
    pageNumber INT NOT NULL,
    pagePath VARCHAR(255) NOT NULL,
    pageViews INT NOT NULL,
    ChapterId INT,
    FOREIGN KEY (ChapterId) REFERENCES Chapter(ChapterId),
    PRIMARY KEY (ChapterId, pageNumber)
);