const mongo = require('mongodb').MongoClient
const databaseUrl = 'mongodb://localhost:27017'//db' //27017 default port

mongo.connect(databaseUrl, {useNewUrlParser: true}, (err, client) => {
    const db = client.db('CodeAnonDatabase')
    const userCol = db.collection('users')
    userCol.insertOne({username: "admin", email: "admin@admin.admin", hashedPassword: "admin"})
    client.close()
    console.log("admin created");
  })