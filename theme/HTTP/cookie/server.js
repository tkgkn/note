const http = require('http');
const fs = require('fs');

const app = http.createServer((req, res) => {
  const host = req.headers.host;
  if (req.url === '/') {
    fs.readFile('index.html', (err, data) => {
      if (err) {
        return;
      }
      res.setHeader('Set-Cookie', ['sex=boy; expires=Wed, 28 Nov 2018 11:03:10 GMT']);
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.end(data);
    });
  }
  if (req.url === '/test') {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({ a: 1 }));
  }
});

app.listen(3333);
