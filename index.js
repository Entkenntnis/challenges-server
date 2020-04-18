const express = require('express')

const app = express()

app.get('/', function(req, res){
  res.send('Hello World v2')
})

app.listen(3000)
console.log('Express started on port 3000')
