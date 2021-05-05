CREATE TABLE Comic (
    ComicId SERIAL,
    ComicTitle VARCHAR(255) NOT NULL,
    ComicPosterPath VARCHAR(255) NOT NULL,
    Synopsis TEXT NOT NULL,
    ComicViews INT NOT NULL, 
    PRIMARY KEY (ComicId)
);

CREATE TABLE Author (
    AuthorId INT,
    FirstName VARCHAR(255),
    LastName VARCHAR(255) NOT NULL,
    ComicId INT,
    PRIMARY KEY (AuthorId),
    FOREIGN KEY (ComicId) REFERENCES Comic(ComicId)
);

CREATE TABLE Chapter (
    ChapterId SERIAL,
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