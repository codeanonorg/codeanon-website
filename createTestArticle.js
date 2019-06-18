const mongo = require('mongodb').MongoClient
const databaseUrl = 'mongodb://localhost:27017'//db' //27017 default port

mongo.connect(databaseUrl, {useNewUrlParser: true}, (err, client) => {
    const db = client.db('CodeAnonDatabase')
    const articlesCol = db.collection('articles')
    articlesCol.insertOne({article_title: "Titre de L'article",article_author: "Author", article_date: "16/06/2019", article_tags: ["tag1", "tag2"], article_description: "description de l'article (~200 caractères)",article_content: "<h1>test article</h1>"})
    client.close()
    console.log("article created");
  })