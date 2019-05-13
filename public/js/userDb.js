function login(usernamePara, passwordPara) {
  let testLog = false
  // if in database login, else NO 
  mongo.connect(url, { useNewUrlParser: true }, (err, client) => {
    if(err)
    {
      console.log(err)
      return false
    }
    const db = client.db('db')
    const userCol = db.collection('users')

    userCol.findOne({ username: usernamePara }, (err, item) => {
      console.log("c'est déjà pas mal...")
      if(item === null)
      {
        testLog = false
      } else if(item.username === usernamePara && item.hashedPassword === passwordPara)
      {
        console.log("c bon conectéé normalement")
        testLog = true
      } else
      { 
        testLog = false
      }
    })
    client.close()
  })
  console.log("testlog !")
  console.log(testLog)
  return testLog
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
    console.log(alreadyExist)
    console.log(` already exists ${alreadyExist}`)
    if (alreadyExist === 0)
    {
      userCol.insertOne({username: usernamePara, email: emailPara, hashedPassword: passwordPara})
    }
    client.close()
    return alreadyExist
  })
}




function login(usernamePara, passwordPara) {
  let testLog = false
  // if in database login, else NO 
  mongo.connect(url, { useNewUrlParser: true }, (err, client) => {
    if(err)
    {
      console.log(err)
      return false
    }
    const db = client.db('db')
    const userCol = db.collection('users')

    userCol.findOne({ username: usernamePara })
    .then(item => {
      console.log("c'est déjà pas mal...")
      if(item === null)
      {
        testLog = false
      } else if(item.username === usernamePara && item.hashedPassword === passwordPara)
      {
        console.log("c bon conectéé normalement")
        testLog = true
      } else
      { 
        testLog = false
      }
    })
    .catch(err => {
      console.error(err)
    })
    client.close()
  })
  console.log("testlog !")
  console.log(testLog)
  return testLog
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