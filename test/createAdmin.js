const bcrypt = require('bcrypt')
const saltRounds = 10;

const { Pool, Client } = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'catest',
    password: '',
    port: 5432,
})

pool.query('SELECT NOW()', (err, res) => {
    console.log(err, res)
    pool.end()
})

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'catest',
    password: '',
    port: 5432,
})

client.connect()

const user_sql = 'INSERT INTO users(username, real_name, email, password, timestamp, role_id, status_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *' 
const pass = bcrypt.hashSync("admin", saltRounds)
const value_user = ['admin', 'realAdmin', 'admin@codeanon.org', pass,'123455', '3', '1']

client
    .query(user_sql, value_user)
    .then(res => {
        console.log(res.rows[0])
    })
    .catch(e => console.error(e.stack))