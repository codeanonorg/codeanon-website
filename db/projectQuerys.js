
const MarkdownIt = require('markdown-it')

const db = require('../db/pool')

const time = require('../public/js/timeHandling')

module.exports = {
    submitProject: function (req) {

        let {
            project_content,
            project_title,
            project_tags,
            project_description,
        } = req.body

        let md = new MarkdownIt()
        let htmlProject = md.render(project_content)

        let msecDate = parseInt(time.newTime(), 10)

        const sqlQuery = 'INSERT INTO projects(title, user_id, timestamp, tags, description, content) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'
        const params = [project_title, req.session.user.user_id, msecDate, project_tags, project_description, htmlProject]

        return db.query(sqlQuery, params)
    },

    getTenMostRecentProjects: function () {
        
        const sqlQuery =    'SELECT projects.project_id, projects.title, users.username, projects.timestamp, projects.tags ,projects.description, projects.content \
                            FROM projects\
                            LEFT JOIN users \
                                ON projects.user_id = users.user_id \
                            ORDER BY timestamp DESC \
                            LIMIT 10;'
        return db.query(sqlQuery)
    },

    getProjectById: function (projctId) {
        const sqlQuery =    'SELECT projects.project_id, projects.title, users.username, projects.timestamp, projects.tags ,projects.description, projects.content \
                            FROM projects \
                            LEFT JOIN users \
                                ON projects.user_id = users.user_id\
                            WHERE project_id = $1'
        const params = [projctId]

        return db.query(sqlQuery, params)        
    },
}