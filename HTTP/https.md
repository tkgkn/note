# HTTPS

HTTPS 即`HTTP+SSL/TSL`。

## 为什么需要 HTTP+S

因为 HTTP 本身不具备加密，所以数据传输属于裸奔在互联网上，没有安全性可言。缺点：

1. 数据被窃听
2. 数据被篡改（最常见的如运营商劫持，增加自己的广告）
3. 身份被冒充（HTTP 被劫持后，黑客可以利用 cookie 等仿冒用户登录）

SSL/TSL 则提供了 HTTP 对应缺点的解决方案。`TLS`是从`SSL`演变而来，更安全，现使用广泛的是`TLS1.0`，其次是`SSL3.0`。两者有对应关系，可以认为`TLS1.0=SSL3.1`

1. 数据加密传播。无法窃听。
2. 具备校验机制，一旦篡改，通信双方可以发现。
3. 配备身份证书，防止身份被假冒。

## HTTP 到 HTTPS

看下 HTTP 是怎么进化到 HTTPS。

如图 HTTP 的握手过程：
我们可以看到内容部分完全裸奔。
![https](./img/https.png)

所以我们要开始加密，加密也分`对称加密`和`非对称加密`。

### 对称加密

对称即加密解密用的是相同的秘钥。
优点：加解密速度快。
缺点：只能保证客户端和服务端拥有秘钥，秘钥传输容易被盗。
![https](./img/https2.png)

### 非对称加密

优点：公钥是开放的，私钥只有服务器保存，安全性高。
缺点：加解密速度慢，开销大，用来频繁传输消息不适合。
![https](./img/https3.png)

### 对称+非对称

利用对称加密的速度快和非对称的安全性。

![https](./img/https4.png)

### 公钥和身份

采用对称加非对称后，有如下问题：

1. 即公钥如何安全传输给客户端？
2. 以及客户端如何确认服务端身份是否合法（真正的）？

这就需要引出`SSL证书`，这是具有全球少数具有公信力的组织颁发的证书，会内置在客户端（浏览器）。相当于一个第三方，验证服务端是否是合法正常的个人或组织，为其颁发一个证书（收费）。

然后我们来梳理下HTTPS请求的过程。

1. 客户端发起`ClientHello`请求，开始SSL通信。报文中告诉服务器客户端支持的SSL版本，加密套件。
2. 服务端以`Server Hello`响应。在报文中确认使用的SSL版本和加密组件用哪个。
3. 服务端在发送`Certificate`报文，报文中包含公开秘钥的证书。
4. 服务端发送`Server Hello Done`报文。SSL握手协商部分结束。
5. 客户端这里检验证书是否合法，如果不合法，则会抛出警告。如果合法，以`Client Key Exchange`报文作为回应，报文中包含通信加密使用的一种称为`Pre-master secret`的随机密码串。（该报文已使用步骤3中的公开秘钥加密）
6. 客户端发送`Change Cipher Spec`报文，提示服务器，后续采用`Pre-master secret`秘钥加密。
7. 客户端发送`Finished`报文，包含连接至今全部报文的整体校验值。
8. 服务端发送`Change Cipher Spec`报文。
9. 服务器发送`Finished`报文。
10. SSL连接建立完成，通信收到SSL保护，此刻之后发送`HTTP`响应。

![https](./img/https5.jpg)

## Nginx配置本地HTTPS开发环境
这里使用的是1.15.5版本的Nginx。配置方式不同于旧版本。
```js
// ssl的开启不再是ssl on，如下。
listen 443 ssl;
```

完整的配置如下：
这里我将生成的证书放在nginx目录中新建的`cert`中。
```js
server {
  listen 443 ssl;
  server_name test.com;

  ssl_certificate /usr/local/etc/nginx/cert/server.pem;
  ssl_certificate_key /usr/local/etc/nginx/cert/privkey.pem;
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;

  location / {
    proxy_cache my_cache;
    proxy_pass http://127.0.0.1:3333;
    proxy_set_header Host $host;
  }
}
```
访问`https://test.com`没有问题。 这里我在本地`HOST`文件添加了`127.0.0.1 test.com`。

另外，如果需要`HTTP`访问也指向`HTTPS`的话。
添加如下代码：
```js
server {
  listen 80 default_server;
  listen [::]:80 default_server;
  server_name test.com;
  return 302 https://$server_name$request_uri;
}
```