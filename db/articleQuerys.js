
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
        
        if (typeof article_tags !== Object) {
            article_tags = [article_tags]
        }

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
        //      SQL injection possible?? 
        //      shity driver did not give a better solution
        //      (or i did not find it until this day)
        const params = tag

        const sqlQuery =    `SELECT * FROM articles \
                            WHERE tags @> '{"${params}"}'`

        return db.query(sqlQuery)
        /**
         * add """AND tags @> '{"language"}';""" at the end for dynamic querys
         * for each tag separated by a coma "," add the string with the requested parameter
         */
        
    },

    getAllArticles: function () {
        const sqlQuery =    'SELECT articles.article_id, articles.title, users.username, articles.timestamp, articles.tags ,articles.description, articles.content \
                            FROM articles\
                            LEFT JOIN users \
                                ON articles.user_id = users.user_id \
                            ORDER BY timestamp DESC;'
        return db.query(sqlQuery)
    },

    getArticleById: function (artcleId) {
        const sqlQuery =    'SELECT articles.article_id, articles.title, users.username, articles.timestamp, articles.tags, articles.description, articles.content \
                            FROM articles \
                            LEFT JOIN users \
                                ON articles.user_id = users.user_id\
                            WHERE article_id = $1'
        const params = [artcleId]

        return db.query(sqlQuery, params)        
    },

    getArticlesByVerificationStatus: function (status) {
        const sqlQuery =    'SELECT articles.article_id, articles.title, users.username, articles.timestamp, articles.tags, articles.description, articles.content, articles.verified \
                            FROM articles \
                            LEFT JOIN users \
                                ON articles.user_id = users.user_id \
                            WHERE verified = $1 \
                            ORDER BY timestamp DESC;'
        const param = [status]

        return db.query(sqlQuery, param)
    },

    deleteArticleById: function (article_id) {
        console.log('id : ' + article_id)

        const sqlQuery =    'DELETE FROM articles \
                            WHERE articles.article_id = $1;'
        const param = [article_id]

        return  db.query(sqlQuery, param)
    }
}

