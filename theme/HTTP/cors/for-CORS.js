const http = require('http')

const app = http.createServer((req, res) => {
  console.log('req come ', req.url)
  res.writeHead(200, {
    'Access-Control-Allow-Origin': '*', // 所有人能访问
    'Access-Control-Allow-Headers': 'X-Test-Cors', // 跨域资源调用时允许的请求头
    'Access-Control-Allow-Methods': 'POST, PUT, Delete', // 跨域资源调用允许的请求方法
    'Access-Control-Max-Age': '1000' // 以上3个设置，1000秒以内都不需要再次预请求
    // 'Access-Control-Allow-Origin': 'http://www.baidu.com' // 这样就只让baidu.com来实现跨域资源共享
    // 'Access-Control-Allow-Origin': 'http://127.0.0.1:3333'
  })
  // res.end('cbFnName(123)') // 通过cbFnName实现JSONP调用
  res.end('123')
})

app.listen(3334)
