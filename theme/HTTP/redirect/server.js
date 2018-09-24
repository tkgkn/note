const http = require('http')
const fs = require('fs')

const app = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(302, {
      Location: '/new'
    })
    res.end()
  }
  if (req.url === '/new') {
    fs.readFile('index.html', (err, data) => {
      if (err) {
        console.log(err)
        return
      }
      res.writeHead(200, {
        'Content-Type': 'text/html'
      })
      res.end(data)
    })
  }
})

app.listen(3333)
