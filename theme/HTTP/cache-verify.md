# 缓存验证Last-Modified

资源上次修改时间，可以通过对比这个，看看资源是否有更新，如果没有更新，就可以使用缓存。

# Etag
根据资源内容生成的一个签名，类似content hash。服务端会发送到客户端上，下次客户端发起请求，就会带上`if-Match或者if-Non-Match`，值就是上次服务端发送到客户端上的`Etag`。此时根据客户端传递的和服务端上的那个资源的`Etag`做对比，如果相同就可以使用缓存

# 跟no-cache
如果不设置no-cache的话，`Cache-Control`只设置了`max-age`，则客户端请求头也不会带上`If-None-Match`（对应首次加载资源服务器返回的Etag值）和`If-Modified-Since`（对应首次加载资源服务器返回的Last-Modiied值）

# 跟no-store
如果`Cache-Control`有设置了`no-store`，那么跟缓存相关的（客户端请求不会再携带`If-None-Match`和`If-Modified-Since`）都会失效，每次请求资源都是从源服务器那里获取。