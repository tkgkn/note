# Content-Security-Policy（内容安全策略）

全局性的限制： *default-src*

如：

`Content-Security-Policy: default-src http: https:`，先启动了其他配置项的默认配置。然后只允许通过http或https加载资源。

`Content-Security-Policy: default-src \'self\'`，只能加载同域的外链脚本。

`Content-Security-Policy: default-src \'self\' https://cdn.bootcss.com/` 只能加载同域脚本，但是允许*https://cdn.bootcss.com/*的脚本。

`Content-Security-Policy: form-action \'self\'`，只能像同域发起form表单请求。

单独限制脚本的话： *script-src*

`Content-Security-Policy: report-uri /report`，可以主动发起请求，发起地址就这里就是/report ，发起一个csp的报告，查看下安全策略。

`Content-Security-Policy-Report-Only: default-src; report-uri /report`，限制依旧有，但是仅仅用来发送报告查看，不会真正在浏览器端限制。

`Content-Security-Policy-Report-Only: connect-src \'self\'`，不能使用ajax请求其他域

## 另一种写法meta标签
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self' https://cdn.bootcss.com/; report-uri /report">
```