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

## 代理缓存
Nginx的也是一个HTTP服务器，通常用作代理服务器，所以也可以缓存一些静态资源。

### 与浏览器缓存的区别
代理缓存是在Nginx上的缓存，所有请求都会先到nginx，如果nginx已经有了对应的缓存资源，且符合缓存使用条件，则可以直接返回给客户端，A先请求过，资源缓存在代理服务器了，B再请求，直接拿到缓存资源。

而浏览器缓存仅仅针对每个独立的客户端的，A和B都需要先请求一次资源才能缓存在浏览器内存或磁盘中。

**注意观察请求响应头**，浏览器缓存直接从客户端磁盘或内存中拿缓存数据，而代理缓存，客户单依旧会向代理服务器请求，只不过代理服务器这边返回了它自己的缓存数据，而不请求源服务器，因此也很快响应。

### proxy_cache_path
预先设置缓存的位置及空间名（必填）。也可以在此设置其他选项。格式如下：`proxy_cache_path  cache/nginx2 levels=1:2 keys_zone=my_cache:10m`

这里缓存路径是cache/nginx2（windows路径，mac下可设置/var/cache等自定义目录）。
**levels=1:2**是否设置多级缓存目录，`1:2`意思就是一级目录1个字符，二级目录2个字符，然后里面存元数据。如图
![代理缓存](./img/nginx-cache.jpg)

**keys_zone**缓存空间名称，我们会在匹配到的location中使用对应的名称。

**10m**存储空间大小10mb。

### proxy_cache
开启代理缓存，值是缓存空间名。如下：`proxy_cache: my_cache`


## 测试代理缓存

### 测试的内容
通过点击按钮发起请求，来进行第一次和后几次的数据获取。在服务端对数据获取做一个模拟的延迟。
<!-- 可以发现第一次会慢点，再次发起请求就会直接走代理缓存，很快就响应，换一个浏览器去访问，在缓存有效期内也会很快响应。 -->

**测试1（不加任何Cache-Control）**
每次都会从源服务器请求
![cache](./img/nginx-cache.gif)

**测试2（添加max-age:5）**
还记得`cache-control`那篇相关的文章里所说，这个值是给浏览器缓存使用。所以缓存时间内会看到`from disk cache`
![cache](./img/nginx-cache1.gify)

