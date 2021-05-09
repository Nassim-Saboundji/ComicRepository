CREATE TABLE comic (
    comic_id SERIAL,
    comic_title VARCHAR(255) NOT NULL,
    comic_poster VARCHAR(255) NOT NULL,
    comic_info TEXT NOT NULL,
    PRIMARY KEY (comic_id)
);

CREATE TABLE chapter (
    chapter_number INT,
    chapter_title VARCHAR(255),
    comic_id INT,
    FOREIGN KEY (comic_id) REFERENCES comic(comic_id) ON DELETE CASCADE,
    PRIMARY KEY (comic_id, chapter_number)
);

CREATE TABLE comic_page (
    page_number INT NOT NULL,
    page_image VARCHAR(255) NOT NULL,
    chapter_number INT,
    comic_id INT,
    FOREIGN KEY (comic_id) REFERENCES comic(comic_id) ON DELETE CASCADE,
    PRIMARY KEY (comic_id, chapter_number, page_number)
);

CREATE TABLE admin_user (
    username VARCHAR(255) NOT NULL,
    user_password BYTEA NOT NULL,
    PRIMARY KEY (username)
);

INSERT INTO admin_user(username, user_password) VALUES ('admin', sha256('1234'));