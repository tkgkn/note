const http = require('http')
const fs = require('fs')
const zlib = require('zlib')

const app = http.createServer((req, res) => {
  fs.readFile('index.html', (err, data) => {
    if (err) {
      console.log(err)
      return
    }
    res.writeHead(200, {
      'Content-Type': 'text/html',
      'Content-Encoding': 'gzip'
    })
    res.end(zlib.gzipSync(data))
    // res.end(data)
  })
})

app.listen(3333)
