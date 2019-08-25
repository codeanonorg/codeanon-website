/*

const mongo = require('mongodb').MongoClient
const databaseUrl = 'mongodb://localhost:27017'//db' //27017 default port

mongo.connect(databaseUrl, {useNewUrlParser: true}, (err, client) => {
    const db = client.db('CodeAnonDatabase')
    const articlesCol = db.collection('articles')
    articlesCol.insertOne({article_title: "Titre de L'article",article_author: "Author", article_date: 1560856149011, article_tags: ["tag1", "tag2"], article_description: "description de l'article (~200 caractères)",article_content: "<h1>test article</h1>"})
    client.close()
    console.log("article created");
  })






*/

const mongoose = require('mongoose')
const dbUrl = 'mongodb://localhost:27017/CodeAnonDatabase'
const mongoDB = process.env.MONGODB_URI || dbUrl;

const Article = require('../models/article.model')

mongoose.connect(mongoDB, {useNewUrlParser: true});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let article = new Article(
  {
    title: "Titre de L'article",
    author: "Author",
    date: 1560856149011,
    tags: ["tag1", "tag2"],
    description: "description de l'article (~200 caractères)",
    content: "<h1>test article</h1>"
  }
)

article.save(function (err) {
  if (err) {
    return next(err)
  }
  console.log("PRIMAAAAAAAAAAA")
})