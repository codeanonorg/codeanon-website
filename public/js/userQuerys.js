const db = require('../../db/pool')

const bcrypt = require('bcrypt');
const saltRounds = 10; // increase the number to make the brutforcing harder



module.exports = {
    login: async function (usernamePara) {
        
        const username = [usernamePara] 
        const sqlQuery = 'SELECT * FROM users WHERE username LIKE $1'
        const result = await db.query(sqlQuery, username, (err, result) => {
            if (err) {
                return next(err)
            }
            console.log(result.rows[0])
        })

        return await result
    },

    testIfUserInDb: async function (usernamePara) {       

        const username = [usernamePara] 
        const sqlQuery = 'SELECT username FROM users WHERE username LIKE $1'
        const result = await db.query(sqlQuery, username, (err, result) => {
            if (err) {
                return next(err)
            }
            console.log(result.rows[0])
        })

        return result
    },

    testIfEmailInDb: async function (emailPara) {
        
        const email = [emailPara] 
        const sqlQuery = 'SELECT email FROM users WHERE username LIKE $1'
        const result = await db.query(sqlQuery, email, (err, result) => {
            if (err) {
                return next(err)
            }
            console.log(result.rows[0])
        })

        return result
    },

    register: async function (usernamePara, emailPara, passwordPara) {

        const parameters = [usernamePara, emailPara, passwordPara]
        const sqlQuery = 'INSERT INTO users(username, real_name, email, password, timestamp, role_id, status_id) VALUES ($1, $2, $3, $4, $5, $6, $7)'
        db.query(sqlQuery, parameters, (err, result) => {
            if (err) {
                return next(err)
            }
            console.log(result.rows[0])
        })
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