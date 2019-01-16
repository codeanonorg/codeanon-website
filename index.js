
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

let app = express()

app.use(express.static('public'))
app.use(express.static('bower_components'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname + '/public/login.html'));
})


app.post('/', (req, res) => {
  app.render('index.ejs', {msg: "test"})
})

app.listen(8080, () => {
  console.log('Listening on port 8080')
})
