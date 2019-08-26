const bcrypt = require('bcrypt')
const saltRounds = 10;

const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'catest',
    password: 'dev',
    port: 5555,
})

const user_sql = 'INSERT INTO users(username, real_name, email, password, timestamp, role_id, status_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *' 
const pass = bcrypt.hashSync("admin", saltRounds)
const value_user = ['admin', 'realAdmin', 'admin@codeanon.org', pass,'123455', 1, '1']

pool
    .query(user_sql, value_user)
    .then(res => {
        console.log("admin created ")
    })
    .catch(e => console.error(e.stack))