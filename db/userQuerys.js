const db = require('./pool')

const bcrypt = require('bcrypt');
const saltRounds = 10; // increase the number to make the brutforcing harder



module.exports = {
    getUserByUsername: function (usernamePara) {
        
        const username_ = [usernamePara] 
        const sqlQuery = 'SELECT * FROM users WHERE username = $1'

        return db.query(sqlQuery, username_)
    },

    register:  function (usernamePara, realName, emailPara, passwordPara, timestamp, role, status) {

        const parameters = [usernamePara, realName, emailPara, bcrypt.hashSync(passwordPara, saltRounds), timestamp, role, status]
        const sqlQuery = 'INSERT INTO users(username, real_name, email, password, timestamp, role_id, status_id) VALUES ($1, $2, $3, $4, $5, $6, $7)'
        return db.query(sqlQuery, parameters)        
    },

    testIfUserInDb: function (usernamePara) {       

        const username_ = [usernamePara] 
        const sqlQuery = 'SELECT username FROM users WHERE username = $1'
        return new Promise((resolve, reject) => {
            db.query(sqlQuery, username_)
            .then( result => {
                if (result.rows.length > 0) {
                    // USERNAME already taken
                    reject('invalid_username')
                } else {
                    // USERNAME availiable
                    resolve()
                }
            })
            // Query Error 
            .catch( error => {
                console.error('Unable to test Username because : ' + error)
            })
        })
    },

    testIfEmailInDb: function (emailPara) {
        
        const email = [emailPara] 
        const sqlQuery = 'SELECT email FROM users WHERE username LIKE $1'
        return new Promise( (resolve, reject) => {
            db.query(sqlQuery, email)
            .then( result => {
                if (result.rows.length > 0) {
                    // EMAIL already taken
                    reject('invalid_email')
                } else {
                    // EMAIL availiable
                    resolve()
                }
            })
            // Query Error 
            .catch( error => {
                console.error('Unable to test Email because : ' + error)
            })
        })
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
        const parameters = [newUsername, newRealName, newEmail, bcrypt.hashSync(newPassword, saltRounds), updateTimestamp, username]

        return db.query(sqlQuery, parameters)

    },
    
    getUserId: function (usernamePara) {
        const username_ = [usernamePara]
        const sqlQuery = 'SELECT user_id FROM users WHERE username = $1'
        
        return db.query(sqlQuery, username_)
    }

}