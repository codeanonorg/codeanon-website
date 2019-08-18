const mongo = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId;
const databaseUrl = 'mongodb://localhost:27017'//db' //27017 default port
const MarkdownIt = require('markdown-it')

module.exports = {
    submitArticle: async function (req, username) {
        let md = new MarkdownIt()
        let {
            article_content,
            article_title,
            article_tags,
            article_description,
        } = req.body
        let tags = article_tags.split(" ")
        let htmlArticle = md.render(article_content)
        //  DATE
        let date = new Date();
        let msecDate = date.getTime();
        //let fullDate = date.getDate() + "/" +(date.getMonth() + 1)+ "/"+date.getFullYear();
        console.log(msecDate)
        //  DATE
        mongo.connect(databaseUrl, { useNewUrlParser: true }, (err, client) => {
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
    },

    getTenMostRecentArticles: async function () {
        const client = await mongo.connect(databaseUrl, { useNewUrlParser: true });
        const articles = await client.db('CodeAnonDatabase').collection('articles')
            .find()
            .limit(9)
            .sort({ article_date: -1 })
            .toArray();

        //  await client.close()
        return await articles;
    },

    getArticlByTag: async function (tag) {
        const client = await mongo.connect(databaseUrl, { useNewUrlParser: true });
        const articles_by_tag = await client.db('CodeAnonDatabase').collection('articles')
            .find({ article_tags: tag })
            .sort({ article_date: -1 })
            .toArray();

        //  await client.close()
        return await articles_by_tag;
    },

    getAllArticles: async function () {
        const client = await mongo.connect(databaseUrl, { useNewUrlParser: true });
        const articles = await client.db('CodeAnonDatabase').collection('articles')
            .find()
            .sort({ article_date: -1 })
            .toArray();

        //  await client.close();
        return await articles;
    },

    getArticleById: async function (id) {
        const client = await mongo.connect(databaseUrl, { useNewUrlParser: true });
        const articleCollection = await client.db('CodeAnonDatabase').collection('articles');
        await client.close();
        return await articleCollection.findOne({ _id: ObjectId(id) });
    }
}