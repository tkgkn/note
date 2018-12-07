# Nginx
是一个代理服务器，处理HTTP服务的。其实就是一个软件。

## 安装
MAC系统下，通过`brew`命令安装`brew install nginx`，安装目录默认是`/usr/local/etc/nginx`。

## 简单的使用命令
**启动**: `nginx`
**更新配置重启**: `nginx -s reload`
**停止**: `nginx -s stop`

## 代理
本地开启`nginx`服务后，监听`80`端口，访问到nginx上，然后nginx进行请求跳转到真正的资源上去。这里需要对nginx的`nginx.conf`文件进行配置，该文件位置在`/usr/local/etc/nginx/nginx.conf`。

这里我们测试访问`test.com`时，访问到另一个正在运行的`node`服务上。

首先，需要修改本地`host`文件，让浏览器访问本地的IP。`host`文件位置在`/private/etc/hosts`，增加一句`127.0.0.1 test.com`。

然后我们在nginx目录的`servers`下新建一个`test.conf`文件，因为`nginx.conf`会将`servers`所有配置`include`进来，这样利于维护。

```javascript

server {
  listen 80;
  server_name test.com;
  
  location / {
    proxy_pass http://127.0.0.1:8888;
    proxy_set_header Host $host;
  }
}

```
然后当我们访问`test.com`时，就会正常访问到`http://127.0.0.1:8888`上去。
