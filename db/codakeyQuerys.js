const db = require('../db/pool')

const time = require('../public/js/timeHandling')

module.exports = {
    testIfKeyInDb: function(key) {

        const sqlQuery =    'SELECT * \
                            FROM codakeys \
                            WHERE key_text = $1';
        const param = [key]

        return db.query(sqlQuery, param)
    },

    createCodaKey: function (key) {
        
        const sqlQuery =    'INSERT INTO codakeys(key_text) \
                            VALUES ($1)' 
        const param = [key]

        return db.query(sqlQuery, param)        
    },

    updateCodaKey: function (key, user_id) {
        
        const sqlQuery =    `UPDATE codakeys \
                            SET user_id = $2 \
                            WHERE key_text = $1;`
        const params = [key, user_id]
        
        return db.query(sqlQuery, params)
    }
}