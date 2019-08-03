const mongo = require('mongodb').MongoClient
const databaseUrl = 'mongodb://localhost:27017'//db' //27017 default port
const bcrypt = require('bcrypt');
const saltRounds = 10; // increase the number to make the brutforcing harder


module.exports = {
    login: async function (usernamePara) {
        const client = await mongo.connect(databaseUrl, { useNewUrlParser: true });
        const user = await client.db('CodeAnonDatabase').collection('users').findOne({ 'username': usernamePara })
        await client.close()
        return user
    },

    testIfUserInDb: async function (usernamePara) {
        const client = await mongo.connect(databaseUrl, { useNewUrlParser: true });
        return await client.db('CodeAnonDatabase').collection('users').findOne({ 'username': usernamePara });
    },

    testIfEmailInDb: async function (emailPara) {
        const client = await mongo.connect(databaseUrl, { useNewUrlParser: true });
        return await client.db('ConeAnonDatabase').collection('users').findOne({ 'email': emailPara });
    },

    register: async function (usernamePara, emailPara, passwordPara) {
        const client = await mongo.connect(databaseUrl, { useNewUrlParser: true });
        const userCollection = await client.db('CodeAnonDatabase').collection('users');
        let user = { username: usernamePara, email: emailPara, hashedPassword: passwordPara }
        await userCollection.insertOne(user)
        await client.close()
    },

    updateUser: async function (username, newUsername, newEmail, newPassword) {
        const client = await mongo.connect(databaseUrl, { useNewUrlParser: true });
        const userCollection = await client.db('CodeAnonDatabase').collection('users');
        await userCollection.updateOne(
            { username: username }, { $set: { username: newUsername, email: newEmail, hashedPassword: bcrypt.hashSync(newPassword, saltRounds) } }
        )
        await client.close()
    },

}