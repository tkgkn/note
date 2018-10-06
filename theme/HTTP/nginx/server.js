const http = require('http')
const fs = require('fs')

const wait = seconds => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, seconds * 1000)
  })
}

const app = http.createServer((req, res) => {
  if (req.url === '/') {
    fs.readFile('index.html', { encoding: 'utf-8' }, (err, data) => {
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

  if (req.url === '/data') {
    res.writeHead(200, {
      // 'Cache-Control': 'max-age=2, s-maxage=20' // s-max-age代理的缓存时间，因为通过nginx了，所以会先到代理，查到代理服务器有资源，返回，会比直接请求服务器快。

      // 'Cache-Control': 'max-age=5 s-maxage=20, private' // 这里设置了private，只允许浏览器缓存资源，不允许代理缓存，则设置的s-maxage失效。

      // 'Cache-Control': 'max-age=20, s-maxage=20, no-store' // 因为设置了no-store，则所有的都不让缓存，所以max-age和s-maxage都失效了

      'Cache-Control': 's-maxage=200',
      'Vary': 'X-Test-Cache' // 只有具备X-Test-Cache才会匹配到代理缓存，但是X-Test-Cache只是个请求头，其对应的值，只有相同时，才会使用缓存。引用场景，根据传入的头和参数来确定获取的页面是移动还是PC，或者是中文还是英文。
    })
    wait(2).then(() => {
      res.end('success')
    })
  }
})

app.listen(3333)
