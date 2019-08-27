
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

        //let tags = article_tags.split(" ")

        let md = new MarkdownIt()
        let htmlArticle = md.render(article_content)

        let msecDate = parseInt(time.newTime(), 10)

        const sqlQuery = 'INSERT INTO articles(title, user_id, timestamp, description, content) VALUES ($1, $2, $3, $4, $5) RETURNING *'
        const params = [article_title, req.session.user.user_id, msecDate, article_description, htmlArticle]

        return db.query(sqlQuery, params)


    },

    getTenMostRecentArticles: function () {
        
        const sqlQuery =    'SELECT articles. article_id, articles.title, users.username, articles.timestamp, articles.description, articles.content \
                            FROM articles\
                            LEFT JOIN users \
                            ON articles.user_id = users.user_id \
                            ORDER BY timestamp DESC \
                            LIMIT 10;'
        return db.query(sqlQuery)


    },

    getArticlByTag: function (tag) {
        /*
        const client = await mongo.connect(databaseUrl,
            { useNewUrlParser: true },
            { useUnifiedTopology: true });
        const articles_by_tag = await client.db('CodeAnonDatabase').collection('articles')
            .find({ article_tags: tag })
            .sort({ article_date: -1 })
            .toArray();
        //  await client.close()
            */
        let articlesByTag = Article.find({ article_tags: tag })
            .sort({ article_date: -1 })
            .toArray();

        return articlesByTag;
    },

    getAllArticles: function () {
        /*
        const client = await mongo.connect(databaseUrl,
            { useNewUrlParser: true },
            { useUnifiedTopology: true });
        const articles = await client.db('CodeAnonDatabase').collection('articles')
            .find()
            .sort({ article_date: -1 })
            .toArray();

        //  await client.close();
        */
        let allArticles = Article.find()
            .sort({ article_date: -1 })
            .toArray();

        return allArticles;
    },

    getArticleById: function (id) {
        /*
        const client = await mongo.connect(databaseUrl,
            { useNewUrlParser: true },
            { useUnifiedTopology: true });
        const articleCollection = await client.db('CodeAnonDatabase').collection('articles');
        */

        return Article.findOne({ _id: ObjectId(id) });
    }
}