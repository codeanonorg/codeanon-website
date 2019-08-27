const db = require('./pool')

const bcrypt = require('bcrypt');
const saltRounds = 10; // increase the number to make the brutforcing harder



module.exports = {
    login: function (usernamePara) {
        
        const username = [usernamePara] 
        const sqlQuery = 'SELECT * FROM users WHERE username LIKE $1'

        return db.query(sqlQuery, username)
    },

    register:  function (usernamePara, realName, emailPara, passwordPara, timestamp, role, status) {

        const parameters = [usernamePara, realName, emailPara, passwordPara, timestamp, role, status]
        const sqlQuery = 'INSERT INTO users(username, real_name, email, password, timestamp, role_id, status_id) VALUES ($1, $2, $3, $4, $5, $6, $7)'
        return db.query(sqlQuery, parameters)        
    },

    testIfUserInDb: function (usernamePara) {       

        const username = [usernamePara] 
        const sqlQuery = 'SELECT username FROM users WHERE username LIKE $1'
        const { rows } = db.query(sqlQuery, username)

        return rows
    },

    testIfEmailInDb: function (emailPara) {
        
        const email = [emailPara] 
        const sqlQuery = 'SELECT email FROM users WHERE username LIKE $1'
        const { rows } = db.query(sqlQuery, email)

        return rows
    },
    
    updateUser: function (username, newUsername, newEmail, newPassword) {
        //{ username: newUsername, email: newEmail, hashedPassword: bcrypt.hashSync(newPassword, saltRounds) } 
        
        // sql query
        /*
        get user Object for id
        use id to identify user and perform update 
        */
    },
    getUserId: function (username) {
        const username = [username]
        const sqlQuery = 'SELECT user_id FROM users WHERE username = $1'
        return db.query(sqlQuery, username)
    }

}