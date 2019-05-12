
function login(usernamePara, passwordPara) {
  // if in database login, else NO 
  mongo.connect(url, { useNewUrlParser: true }, (err, client) => {
    if(err)
    {
      console.log(err)
      return
    }
    const db = client.db('db')
    const userCol = db.collection('users')

    let dbUser = userCol.findOne({ username: usernamePara }, (err, item) => {
      if(item===null)
      {
        return false
      } else if(item.username === usernamePara && item.hashedPassword === passwordPara)
      {
        return true
      } else
      { 
        return false
      }
    })
    client.close()
    return dbUser
  })
}

function register(usernamePara, emailPara, passwordPara) {
  mongo.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err) {
      console.log(err)
      return
    }

    const db = client.db('db')
    const userCol = db.collection('users')

    let alreadyExist = 0 // test if username or email already exist

    userCol.findOne({username: usernamePara}, (err, item) => {
      if(err)
      {
        console.log(err)
        return
      }
      if(item !== null)
      {
        alreadyExist = 1
      }
    })

    userCol.findOne({email: emailPara}, (err, item) => {
      if(err)
      {
        console.log(err)
        return
      }
      if(item !== null)
      {
        alreadyExist = 2
      }
    })

    if (alreadyExist === 0)
    {
      userCol.insertOne({username: usernamePara, email: emailPara, hashedPassword: passwordPara})
    }
    client.close()
    return alreadyExist
  })
}


/*
const mongo = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'//db' //27017 default port

mongo.connect(url, { useNewUrlParser: true }, (err, client) => {
	if (err) {
		console.log(err)
		return
	}
	const db = client.db('db')
	const userCol = db.collection('users')

	// add admin below and create database and collection
	userCol.insertOne({username: 'admin', email: 'admin@admin.com', hashedPassword: 'admin'})

	// delete admin
	//userCol.deleteOne({username: 'admin'})

	// show all items (documents)
	/*
	userCol.find().toArray((err, items) => {
	  console.log(items)
	})
	// * /
	// close connection
	client.close()
})

console.log("succesfully accessed db")
//////////
*/

/*
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
      },

    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
      },

    password: {
        type: String,
        required: true,
      }

}) 

let User = mongoose.model('User', UserSchema);
module.exports = userDb;
*/