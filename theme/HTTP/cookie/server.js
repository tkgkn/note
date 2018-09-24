const http = require('http')
const fs = require('fs')

const app = http.createServer((req, res) => {
  const host = req.headers.host
  console.log(req.headers)
  console.log(host)

  if (req.url === '/') {
    fs.readFile('index.html', (err, data) => {
      if (err) {
        console.log(err)
        return
      }
      if (host === 'a.test.com') {
        res.writeHead(200, {
          'Content-Type': 'text/html',
          'Set-Cookie': ['id=123; max-age=2', 'name=jack; HttpOnly']
        })
      }
      res.end(data)
    })
  }
})

app.listen(3333)
