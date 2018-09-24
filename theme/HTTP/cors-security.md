# 跨域
在**浏览器中**发送请求时（通常是AJAX）只要协议，域名，端口号中有一个不相同，就属于跨域。

# 为什么有跨域
为了安全，比如防止CSRF（跨站请求伪造）

# 如何跨域
**JSONP**方案：利用**script**标签等实现跨域资源调用。服务端返回一个方法调用（如`cbFnName(data)`），方法名是通过**script**标签带过来的`src="xxx.com?cb=cbFnName"`。

**CORS**方案：响应头中设置`Access-Control-Allow-Origin: *`，但这是允许所有人访问，所以为了安全，可以单独设置某个IP地址（如`Access-Control-Allow-Origin: http://www.baidu.com`），可以动态设置该响应头，根据业务需要。

# CORS预请求
预请求，简单理解就是在CORS时，有些方法，请求头，都是不被允许的，浏览器会报错（为了安全，因为跨域会引起一些攻击）。因此我们可以在服务端验证（比如设置允许的自定义请求头`Access-Control-Allow-Headers: "X-test-header"`），这样，浏览器就会先以`OPTIONS`方法获取服务端允许的验证，然后浏览器这边就会清楚这些限制已被服务端认可，浏览器就不会在报一些安全提示。利用`fetch`API可以自定义请求头进行测试。

__无需预请求的方法__: `GET`，`HEAD`，`POST`

__无需预请求的Content-Type__: `text/plain`，`multipart/form-data`，`application/x-www-form-urlencoded`

__请求头会限制__：不可以自定义请求头，需要服务端验证。

__常用的预请求可设置的__：
```js
'Access-Control-Allow-Origin': '*', // 所有人能访问
'Access-Control-Allow-Headers': 'X-Test-Cors', // 跨域资源调用时允许的自定义请求头
'Access-Control-Allow-Methods': 'POST, PUT, Delete', // 跨域资源调用允许的请求方法
'Access-Control-Max-Age': '1000' // 为上述3个设置的跨域资源调用预请求设置做1000秒的缓存，1000秒内，不会再次调用OPTIONS方法去发起预请求
```
_注意_：这里有个插曲，在设置了`Access-Control-Max-Age`的情况下，刷新接口，每次还会发起预请求，发现是因为chrome调试工具中开启了`disable cache`导致的，关闭即可。

