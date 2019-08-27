const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'catest',
    password: 'dev',
    port: 5555,
})


let article = {
    title: `Titre de L'article`,
    user_id: 1,
    timestamp: 1560856149011,
    tags: ["tag1", "tag2"],
    description: `description de l'article (~200 caractères)`,
    content: `<h1>test article</h1><p>la paragraaphe</p>`
  }



const sqlQuery = 'INSERT INTO articles(title, user_id, timestamp, description, content) VALUES ($1, $2, $3, $4, $5) RETURNING *'
const params = [article.title, article.user_id, article.timestamp, article.description, article.content]


pool
  .query(sqlQuery, params)
  .then( res => {
    console.log('article, created')
    console.log(res.rows[0])
  }).catch(e => console.error(e.stack))