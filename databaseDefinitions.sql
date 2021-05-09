CREATE TABLE comic (
    comic_id SERIAL,
    comic_title VARCHAR(255) NOT NULL,
    comic_poster VARCHAR(255) NOT NULL,
    comic_info TEXT NOT NULL,
    comic_views INT NOT NULL, 
    PRIMARY KEY (comic_id)
);

CREATE TABLE chapter (
    chapter_number INT,
    chapter_title VARCHAR(255),
    chapter_views INT NOT NULL,
    comic_id INT,
    FOREIGN KEY (comic_id) REFERENCES comic(comic_id),
    PRIMARY KEY (comic_id, chapter_number)
);

CREATE TABLE comic_page (
    page_number INT NOT NULL,
    page_image VARCHAR(255) NOT NULL,
    chapter_number INT,
    comic_id INT,
    PRIMARY KEY (comic_id, chapter_number, page_number)
);