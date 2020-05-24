# webpack 的各种注入插件

`webpack.DefinePlugin`  编译阶段，往 JS 注入定义的常量。实际上就是字符串的一个替换而已。所以我们在注入的时候，必须注入的是字符串，而非值本身。例如<br />

```javascript
plugins: [
  new webpack.DefinePlugin({
    BUILD_ENV: 'test',
    BUILD_ENV: JSON.stringify('test'),
    // 如果是布尔值
    IS_TRUE: 'true', // 不是 true哦！
    IS_TRUE: JSON.stringify(true),
  }),
];
```

<br />`HtmlWebpackPlugin`  插件，众所周知是方便创建一个配置好各种脚本注入的 HTML 文件的，可以自己提供一个 HTML 模板作为基础，然后在上面进行各种注入，插件支持 `EJS` ，所以，我们可以在 HTML 模板里使用 `<%= HELLO %>` 。插件本身支持了 `title`  字段，也就是 HTML 的 `title`  可以进行替换。我们也可以使用自定义的其他字段，在 HTML 模板里也可以使用。<br />

```javascript
plugins: [
  new HtmlWebpackPlugin({
    inject: true, // 注入JS
    title: '文章标题',
    // custom key
    myName: 'Jack',
    flag: true,
  }),
];
```

```html
<title><%= title %></title>
<% if(htmlWebpackPlugin.options.flag) {%>
<script>
  console.log('hello');
</script>
<% } %> ...

<div><%= myName%></div>
```

<br />CRA 脚手架提供了自带的 `InterpolateHtmlPlugin` ，提供类似上面的方法注入变量，只不过注入后的变量，这么用， `%PRO_ENV%` <br />

```html
<% if ('%PRO_ENV%' !== 'pro' || '%NODE_ENV%' !== 'development') {%>
<script src="%PUBLIC_URL%/libs/vconsole/vconsole.min.js"></script>
<script>
  if (window.engine.isAttached) {
    var vConsole = new VConsole();
  }
</script>
<% } %>
```
