# 知识点

## source map
可以追溯代码出错的具体位置，而不是将错误指向到打包后的`bundle`里。
不同环境用不同形式的map。
```js
// webpack.config.js中配置
{
  mode: 'development',
  devtool: 'inline-source-map',
}
```

## 代码变动监测
可以监控代码的变动，实现自动打包。

### watch
webpack-cli本身提供了`watch`方式。只需要在`package.json`中配置一个脚本，如下。
```js
{
  scripts: {
    watch: 'webpack --watch'
  }
}
```
配置后，改动任何模块，都会触发更新，但是浏览器是需要自己手动去刷新的。

### webpack-dev-server
这个插件提供了一个简单的服务器，并且可以实时监听bundle的变化，达到自动刷新的目的。

#### 部分常用options
改插件的配置写在`devServer`对象中。
- **contentBase**: 该配置的作用是告诉服务器，将哪个目录作为服务器的根目录，当我们有静态资源需要展示时用这个配置项。当我们打开`localhost:8080`时，默认就会进入该配置填写的目录（默认是`./`，也就是看你`webpack.config.js`所在目录）。当配置的这个目录下有`index.html`时，就会直接打开这个静态页面。
- **publicPath**: 该配置如果不写，会使用`output`配置中的`publicPath`。如果填写了，则使用。该配置是更改`bundle`资源的引用路径的前缀。需要以`/`开头和结尾。如果你填写了`/assets/`，则打开的页面引用的资源路径前缀会加上`assets`。
  > 需要注意的是：引用的资源路径是`publicPath+filename`的拼接，这里的`filename`是`output`配置项中的配置，即打包的文件名（具体打包的文件目录结构）

### webpack-dev-middleware
`webpack-dev-server`实际上也是用的该中间件，封装好了给我们使用。直接使用middleware的话，可以操作的地方更多。可以结合`express`来实现（注意该插件是express中间件的实现，不能直接用于Koa，因为中间件的写法不一样，参考[这篇文章来实现koa的webpack-dev-middleware中间件](https://segmentfault.com/a/1190000004883199)）

### 例子
关于publicPath的使用，这里有个例子，配置如下
```js
{
  output: {
    filename: 'assets/[name].bundle.js'
  },
  devServer:{
    contentBase: '/', // 这个目录下有放index.html
    publicPath: '/assets/'
  }
}
```

```html
<!-- 这里配置的资源引用路径如下 -->
<body>
  <script src="assets/app.bundle.js"></script>
</body>
```
然后`yarn dev`后，打开的页面，发现资源`app.bundle.js`404了。原因是最终的引用路径是`publicPath+filename`，所以引用的路径应该写成`assets/assets/app.bundle.js`。

重新跑起来，发现资源引用正常。