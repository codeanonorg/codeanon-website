
const MarkdownIt = require('markdown-it')

const Article = require('../models/article.model')

const time = require('../public/js/timeHandling')

module.exports = {
    submitArticle: function (req, username) {

        let md = new MarkdownIt()
        let {
            article_content,
            article_title,
            article_tags,
            article_description,
        } = req.body

        let tags = article_tags.split(" ")

        let htmlArticle = md.render(article_content)
        
        
        let msecDate = time.newTime()

        console.log("date en msec" + msecDate)
        //  DATE

        // Mongoose
        let article = new Article(
            {
                title: article_title,
                author: username,
                date: msecDate,
                tags: tags,
                description: article_description,
                content: htmlArticle,
            }
        )

        article.save(function (err) {
            if (err) {
                return next(err);
            }
            console.log("Article created successfully")
        })

        // end of mongoose

        /*
        mongo.connect(databaseUrl, 
            { useNewUrlParser: true },
            { useUnifiedTopology: true },
             (err, client) => {
            const db = client.db('CodeAnonDatabase')
            const articlesCol = db.collection('articles')
            articlesCol.insertOne({
                article_title: article_title,
                article_author: username,
                article_date: msecDate,
                article_tags: tags,
                article_description: article_description,
                article_content: htmlArticle,
            }, (err, res) => {
                if (err) {
                    // on fail
                    console.error(err)
                } else {
                    // pretty print informations (for debug)
                    console.log("=== Article created ===")
                    console.log("title  : ", article_title)
                    console.log("author : ", username)
                    console.log("link   : ")
                    console.log("localhost:8080/article/" + String(res.insertedId))
                }
                // close the connection with MongoDB
                //  client.close()
            })
        })
        */
    },

    getTenMostRecentArticles: function (callback) {
        // mongoose start
        return Article.find()
            .limit(9)
            .sort({ date: -1 })
            .exec( function (err, blogs) {
                callback(err, blogs)
            })
            //.lean()

        // mongoose end
        /*
        const client = await mongo.connect(databaseUrl,
            { useNewUrlParser: true },
            { useUnifiedTopology: true });
        const articles = await client.db('CodeAnonDatabase').collection('articles')
        */

        //  await client.close()


        //return await articles;
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

        return Article.findOne( { _id: ObjectId(id)} );
    }
}