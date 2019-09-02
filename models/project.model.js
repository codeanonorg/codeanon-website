/*
CREATE TABLE IF NOT EXISTS projects (
    project_id      SERIAL PRIMARY KEY NOT NULL,
    title           text    NOT NULL,
    user_id         integer     NOT NULL, --  FK
    timestamp       integer     NOT NULL,
    description     text,
    content         text    NOT NULL,
    CONSTRAINT fk_projects_user_id FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE IF NOT EXISTS project_tags (
    project_id      integer NOT NULL, --FK
    tag_id          integer NOT NULL, --FK
    CONSTRAINT fk_project_tags_project_id FOREIGN KEY (project_id) REFERENCES projects (project_id),
    CONSTRAINT fk_project_tags_tag_id FOREIGN KEY (tag_id) REFERENCES tags (tag_id),
    PRIMARY KEY (project_id, tag_id)
);

CREATE TABLE IF NOT EXISTS project_participants (
    project_id      integer NOT NULL, --FK
    user_id         integer NOT NULL, --FK
    CONSTRAINT fk_project_participants_project_id FOREIGN KEY (project_id) REFERENCES projects (project_id),
    CONSTRAINT fk_project_participants_user_id FOREIGN KEY (user_id) REFERENCES users (user_id),
    PRIMARY KEY (project_id, user_id)
);

CREATE TABLE IF NOT EXISTS liked_projects (
    project_id      integer NOT NULL, --FK
    user_id         integer NOT NULL, --FK
    CONSTRAINT fk_liked_projects_project_id FOREIGN KEY (project_id) REFERENCES projects (project_id),
    CONSTRAINT fk_liked_projects_user_id FOREIGN KEY (user_id) REFERENCES users (user_id),
    PRIMARY KEY (project_id, user_id)
);
*/