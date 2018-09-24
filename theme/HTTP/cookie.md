# cookie的生成
是服务端返回数据时，通过`Set-Cookie`响应头设置的。

# 作用
下次的请求，都会自动携带cookie，以确保服务器知道是哪个用户。

# 属性设置
`max-age`和`expires`设置过期时间。前者是一个有效期时间长度（秒），后者是一个有效期的时间点。

`Secure`只在https的时候发送

`HttpOnly`无法通过`document.cookie`访问，安全性考虑，如CSRF。

`domain` 设置可访问cookie的域，主域名下的二级域名，都可以访问到主域名下的cookie