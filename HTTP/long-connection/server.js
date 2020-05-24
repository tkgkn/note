const http = require('http')
const fs = require('fs')

const app = http.createServer((req, res) => {
  const img = fs.readFileSync('1.jpg')
  if (req.url === '/') {
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
  } else {
    res.writeHead(200, {
      'Content-Type': 'image/jpg'
    })
    res.end(img)
  }
})

app.listen(3333)
