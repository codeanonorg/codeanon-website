const db = require('../../db/pool')

const bcrypt = require('bcrypt');
const saltRounds = 10; // increase the number to make the brutforcing harder



module.exports = {
    login: function (usernamePara) {
        
        const username = [usernamePara] 
        const sqlQuery = 'SELECT * FROM users WHERE username LIKE $1'

        return db.query(sqlQuery, username)
    },

    testIfUserInDb: async function (usernamePara) {       

        const username = [usernamePara] 
        const sqlQuery = 'SELECT username FROM users WHERE username LIKE $1'
        const { rows } = await db.query(sqlQuery, username)

        return rows
    },

    testIfEmailInDb: async function (emailPara) {
        
        const email = [emailPara] 
        const sqlQuery = 'SELECT email FROM users WHERE username LIKE $1'
        const { rows } = await db.query(sqlQuery, email)

        return rows
    },

    register: async function (usernamePara, emailPara, passwordPara) {

        const parameters = [usernamePara, emailPara, passwordPara]
        const sqlQuery = 'INSERT INTO users(username, real_name, email, password, timestamp, role_id, status_id) VALUES ($1, $2, $3, $4, $5, $6, $7)'
        const { rows } = db.query(sqlQuery, parameters)
        
    },

    updateUser: async function (username, newUsername, newEmail, newPassword) {
        //{ username: newUsername, email: newEmail, hashedPassword: bcrypt.hashSync(newPassword, saltRounds) } 
        
        // sql query
        /*
        get user Object for id
        use id to identify user and perform update 
        */
    },

}