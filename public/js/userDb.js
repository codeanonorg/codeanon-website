async function register(usernamePara, emailPara, passwordPara) {
    const client = await mongo.connect(databaseUrl, { useNewUrlParser: true });
    const userCollection = await client.db('CodeAnonDatabase').collection('users');

    const findWithUsername = await userCollection.findOne({ 'username' : usernamePara});
    const findWithEmail = await userCollection.findOne({ 'email' : emailPara});

    if (findWithUsername === null && findWithEmail === null)
    {
        await userCollection.insertOne({ 'username': usernamePara, 'email': emailPara, 'hashedPassword': passwordPara })
        await client.close()
        return true
    } else
    {
        await client.close()
        return false
    }
}

/////////////////////////////////////
function register(usernamePara, emailPara, passwordPara) {
    mongo.connect(url, { useNewUrlParser: true }, (err, client) => {
        if (err) {
            console.log(err)
            return
        }

        const db = client.db('CodeAnonDatabase')
        const userCol = db.collection('users')

        let alreadyExist = 0 // test if username or email already exist

        userCol.findOne({ username: usernamePara }, (err, item) => {
            if (err) {
                console.log(err)
                return
            }
            if (item !== null) {
                alreadyExist = 1
            }
        })

        userCol.findOne({ email: emailPara }, (err, item) => {
            if (err) {
                console.log(err)
                return
            }
            if (item !== null) {
                alreadyExist = 2
            }
        })
        console.log(alreadyExist)
        console.log(` already exists ${alreadyExist}`)
        if (alreadyExist === 0) {
            userCol.insertOne({ 
                'username': usernamePara,
                'email': emailPara,
                'hashedPassword': passwordPara
            })
        }
        client.close()
        return alreadyExist
    })
}

/////////////////////////////////////
function auth(username, password) { // auth function
    let ok = false;
    for (let u of users) {
        // CHANGE WITH USERNAME
        if (u.username === username && u.password === password) {  // simplifie to remove let ok = ...
            ok = true
            break;
        }
    }
    return ok
}

////////////////////////////
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

    hashedPassword: {
        type: String,
        required: true,
      }

})

let User = mongoose.model('User', UserSchema);
module.exports = userDb;
*/