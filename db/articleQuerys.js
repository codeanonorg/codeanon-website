
const MarkdownIt = require('markdown-it')

const db = require('../db/pool')

const time = require('../public/js/timeHandling')

module.exports = {
    submitArticle: function (req) {

        let {
            article_content,
            article_title,
            article_tags,
            article_description,
        } = req.body

        //  tags
        // 'on'
        // 'undefined'


        //let tags = article_tags.split(" ")

        let md = new MarkdownIt()
        let htmlArticle = md.render(article_content)

        let msecDate = parseInt(time.newTime(), 10)

        const sqlQuery = 'INSERT INTO articles(title, user_id, timestamp, tags, description, content) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'
        const params = [article_title, req.session.user.user_id, msecDate,article_tags, article_description, htmlArticle]

        return db.query(sqlQuery, params)


    },

    getTenMostRecentArticles: function () {
        
        const sqlQuery =    'SELECT articles.article_id, articles.title, users.username, articles.timestamp, articles.tags ,articles.description, articles.content \
                            FROM articles\
                            LEFT JOIN users \
                                ON articles.user_id = users.user_id \
                            ORDER BY timestamp DESC \
                            LIMIT 10;'
        return db.query(sqlQuery)


    },

    getArticlByTag: function (tag) {
        
    },

    getAllArticles: function () {
        
    },

    getArticleById: function (artcleId) {
        const sqlQuery =    'SELECT articles.article_id, articles.title, users.username, articles.timestamp, articles.tags, articles.description, articles.content \
                            FROM articles \
                            LEFT JOIN users \
                                ON articles.user_id = users.user_id\
                            WHERE article_id = $1'
        const params = [artcleId]

        return db.query(sqlQuery, params)        
    }
}