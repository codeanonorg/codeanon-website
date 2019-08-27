
const MarkdownIt = require('markdown-it')

module.exports = {
    submitProject: function (req) {

        let {
            project_content,
            project_title,
            project_tags,
            project_description,
        } = req.body

        //let tags = article_tags.split(" ")

        let md = new MarkdownIt()
        let htmlProject = md.render(project_content)

        let msecDate = parseInt(time.newTime(), 10)

        const sqlQuery = 'INSERT INTO articles(title, user_id, timestamp, description, content) VALUES ($1, $2, $3, $4, $5) RETURNING *'
        const params = [project_title, req.session.user.user_id, msecDate, project_description, htmlProject]

        return db.query(sqlQuery, params)


    },
}