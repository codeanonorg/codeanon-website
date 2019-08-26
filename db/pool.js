const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'catest',
    password: 'dev',
    port: 5555,
})


module.exports = {
    /*
    query: async (text, params, callback) => {
        const start = Date.now()
        return pool.query(text, params, (err, res) => {
            const duration = Date.now() - start
            console.log('executed query', { text, duration, rows: res.rowCount })
            callback(err, res)
        })
    }*/
    query: (text, params) => pool.query(text, params)
}