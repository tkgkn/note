# 跨域

在**浏览器中**发送请求时（通常是 AJAX）只要协议，域名，端口号中有一个不相同，就属于跨域。

## 为什么有跨域

为了安全，比如防止 CSRF（跨站请求伪造）

## 如何跨域

**JSONP**方案：利用**script**标签等实现跨域资源调用。服务端返回一个方法调用（如`cbFnName(data)`），方法名是通过**script**标签带过来的`src="xxx.com?cb=cbFnName"`。

**CORS**方案：响应头中设置`Access-Control-Allow-Origin: *`，但这是允许所有人访问，所以为了安全，可以单独设置某个 IP 地址（如`Access-Control-Allow-Origin: http://www.baidu.com`），可以动态设置该响应头，根据业务需要。如下：

```js
'Access-Control-Allow-Origin': '*', // 所有人能访问。
```

**注意**：这里有个小插曲，因为是本地开发环境，所以是 127 的地址，尝试使用 localhost，并不能跨域。所以域名请保持一致。

# CORS 预请求

现如今`RESTFUL`风格的 API 越来越多，其明显的一点就是请求资源时，恰当的使用了 HTTP 方法。一些平时不怎么注意的方法如`PUT DELETE`都开始使用，而使用这些方法如果跨域了，就需要设置预请求方法和预请求方法有效时间。

预请求，简单理解就是在 CORS 时，有些方法，请求头，都是不被允许的，浏览器会报错（为了安全，因为跨域会引起一些攻击）。因此我们可以在服务端验证（比如设置允许的自定义请求头`Access-Control-Allow-Headers: "X-test-header"`），这样，浏览器就会先以`OPTIONS`方法获取服务端允许的验证，然后浏览器这边就会清楚这些限制已被服务端认可，就不会在报一些安全提示。利用`fetch`API可以自定义请求头进行测试。

## 预请求的限制

**无需预请求的方法**: `GET`，`HEAD`，`POST`

**无需预请求的 Content-Type**: `text/plain`，`multipart/form-data`，`application/x-www-form-urlencoded`

**自定义请求头会限制**：不可以自定义请求头，需要服务端验证。

## 解决预请求的限制

**常用的预请求可设置的**：

```js
'Access-Control-Allow-Headers': 'X-Test-Cors', // 跨域资源调用时允许的自定义请求头
```

```js
'Access-Control-Allow-Methods': 'POST, PUT, DELETE', // 跨域资源调用允许的请求方法
```

**注意**，前后端的方法名保持一致大写。因为测试的时候，前端发起的是delete，后端配置的是Delete，会报方法不允许。

```js
'Access-Control-Max-Age': '1000' // 为上述3个设置的跨域资源调用预请求设置做1000秒的缓存，1000秒内，不会再次调用OPTIONS方法去发起预请求
```

**注意**：值是秒！这里有个插曲，在设置了`Access-Control-Max-Age`的情况下，刷新接口，每次还会发起预请求，发现是因为 chrome 调试工具中开启了`disable cache`导致的，关闭即可。
