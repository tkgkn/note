const http = require('http')

const app = http.createServer((req, res) => {
  console.log('req come ', req.url)
  res.end('hello world')
})

app.listen(3333)