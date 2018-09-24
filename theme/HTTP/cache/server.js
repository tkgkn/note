const http = require('http')
const fs = require('fs')

const app = http.createServer((req, res) => {
  if (req.url === '/') {
    fs.readFile('index.html', 'utf-8', (err, data) => {
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
  if (req.url === '/script.js') {
    res.writeHead(200, {
      'Content-Type': 'text/javascript',
      // 'Cache-Control': 'max-age=200, public' // 客户端200秒内使用缓存（在这200秒内修改返回内容，也只能看到之前的内容，因为资源地址并没有变化，会从缓存里面去读取。通常考虑使用资源hash值来让资源地址变化，这样就会重新获取资源）
      'Cache-Control': 'max-age=2000000, no-cache', // 虽然设置了很长的age，但是有no-cache，使用缓存前需到服务器验证
      'Last-Modified': '123',
      'Etag': '777'
    })
    const etag = req.headers['if-none-match']
    if (etag === '777') {
      res.writeHead(304, {
        'Content-Type': 'text/javascript',
        'Cache-Control': 'max-age=2000000, no-store', 
        'Last-Modified': '123',
        'Etag': '777'
      })
      res.end('你写内容也没用，304，压根不会用服务器内容')
    } else{
      res.writeHead(200, {
        'Content-Type': 'text/javascript',
        'Cache-Control': 'max-age=2000000, no-store',
        'Last-Modified': '123',
        'Etag': '777'
      })
      res.end('console.log("script loaded twice")')
    }
  }
})

app.listen(3333)
