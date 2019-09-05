const { Pool } = require('pg')

const pool = new Pool({
    /*
    user: 'postgres',
    host: 'localhost',
    database: 'catest',
    password: 'dev',
    port: 5432,
    
    */
    
    
    connectionString: process.env.DATABASE_URL,
    ssl: true,
    
})


module.exports = {
    query: (text, params) => pool.query(text, params)
}