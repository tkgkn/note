const http = require('http')
const fs = require('fs')

const app = http.createServer((req, res) => {
  const html = fs.readFileSync('index.html', 'utf8')
  const img = fs.readFileSync('./test.jpg')
  if(req.url === '/') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
      'Connection': 'close',
      'Link': '</test.jpg>; as=image; rel=preload' // http2中，定义推送的是什么。路径是绝对路径。rel-preload代表服务端推送
    })
    res.end(html)
  } else {
    res.writeHead(200, {
      'Content-Type': 'image/jpg',
      'Connection': 'close'
    })
    res.end(img)
  }
})

app.listen(3333)
