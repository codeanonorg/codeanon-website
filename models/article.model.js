
CREATE TABLE IF NOT EXISTS articles (
    article_id      SERIAL PRIMARY KEY NOT NULL,
    title           text        NOT NULL,
    user_id         integer     NOT NULL, -- FK
    timestamp       integer     NOT NULL,
    description     text        NOT NULL,
    content         text        NOT NULL,
    CONSTRAINT fk_articles_user_id FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE IF NOT EXISTS tags (
    tag_id          SERIAL PRIMARY KEY  NOT NULL,
    name            text    NOT NULL
);

CREATE TABLE IF NOT EXISTS article_tags (
    article_id      integer NOT NULL,   --FK
    tag_id          integer NOT NULL,   --FK
    CONSTRAINT fk_articles_tags_article_id FOREIGN KEY (article_id) REFERENCES articles (article_id),
    CONSTRAINT fk_articles_tags_tag_id FOREIGN KEY (tag_id) REFERENCES tags (tag_id),
    PRIMARY KEY (article_id, tag_id)
);

CREATE TABLE IF NOT EXISTS liked_articles (
    article_id      integer NOT NULL, --FK
    user_id         integer NOT NULL, --FK
    CONSTRAINT fk_liked_articles FOREIGN KEY (article_id) REFERENCES articles (article_id),
    CONSTRAINT fk_liked_projects_user_id FOREIGN KEY (user_id) REFERENCES users (user_id),
    PRIMARY KEY (article_id, user_id)
);