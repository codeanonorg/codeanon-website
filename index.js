
const express = require('express')
const https = require('https')

let app = express()

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index.html')
})

app.get('/login/:name', (req, res) => {
  res.render('index.ejs', {msg: req.params.name})
})

app.listen(8080, () => {
  console.log('Listening on port 8080')
})
