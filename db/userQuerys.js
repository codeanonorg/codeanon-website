const db = require('./pool')

const bcrypt = require('bcrypt');
const saltRounds = 10; // increase the number to make the brutforcing harder



module.exports = {
    getUserByUsername: function (usernamePara) {
        
        const username = [usernamePara] 
        const sqlQuery = 'SELECT * FROM users WHERE username = $1'

        return db.query(sqlQuery, username)
    },

    register:  function (usernamePara, realName, emailPara, passwordPara, timestamp, role, status) {

        const parameters = [usernamePara, realName, emailPara, passwordPara, timestamp, role, status]
        const sqlQuery = 'INSERT INTO users(username, real_name, email, password, timestamp, role_id, status_id) VALUES ($1, $2, $3, $4, $5, $6, $7)'
        return db.query(sqlQuery, parameters)        
    },

    testIfUserInDb: function (usernamePara) {       

        const username = [usernamePara] 
        const sqlQuery = 'SELECT username FROM users WHERE username = $1'
        return db.query(sqlQuery, username)
    },

    testIfEmailInDb: function (emailPara) {
        
        const email = [emailPara] 
        const sqlQuery = 'SELECT email FROM users WHERE username LIKE $1'
        return db.query(sqlQuery, email)
    },
    
    updateUser: function (newUsername, newRealName, newEmail, newPassword, updateTimestamp, username) {
        const sqlQuery =    `UPDATE users
                            SET username = $1,
                                real_name = $2,
                                email = $3,
                                password = $4,
                                update_timestamp = $5
                            WHERE username = $6
                            RETURNING *;`
        const parameters = [newUsername, newRealName, newEmail, newPassword, updateTimestamp, username]

        return db.query(sqlQuery, parameters)

    },
    
    getUserId: function (username) {
        const username = [username]
        const sqlQuery = 'SELECT user_id FROM users WHERE username = $1'
        return db.query(sqlQuery, username)
    }

}