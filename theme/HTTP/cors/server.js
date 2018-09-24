const http = require('http')
const fs = require('fs')

const app = http.createServer((req, res) => {
  fs.readFile('cors.html', 'utf-8', (err, data) => {
    if (err) {
      console.log(err)
      return
    }
    // 这个响应头的设置，是针对客户端请求3333端口，获取cors.html，对客户端请求返回设置的
    res.writeHead(200, {
      'Content-Type': 'text/html'
    })
    res.end(data)
  })
})

app.listen(3333)
