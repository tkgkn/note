# CSS工程化
工程化涉及到的，代码的组织，优化，构建以及后期维护。通过工程化，实现CSS的最优解。

## PostCSS
工程化中必用的CSS工具。CSS->PostCSS->CSS(增强)。这里的增强，比如css模块化，自动加一些浏览器前缀`-webkit-,-moz-,-opera-`，还有兼容性等等。
PostCSS本身不对CSS做这些增加，只是解析CSS，类似AST语法树，描述这段CSS做了什么，弄清楚本质后，交给PostCSS的插件来处理。

## 插件
这里介绍一些常见的。

### import模块合并
在编译构建阶段合并CSS，减少HTTP请求。

### autoprefixier
自动添加前缀。

### cssnano
压缩CSS代码。不仅仅只做压缩，会做一些优化。

### cssnext
使用新的CSS特性。

### precss
实现变量，循环，mixin，类似`less`之类的预处理器。

## 使用
需要通过`npm`或`yarn`安装`PostCSS`和`autoprefixer`之类的插件。配置`postcss.config.js`文件。
```js
  const autoprefixer = require('autoprefixer');
  const psImport = require('postcss-import');
  const cssnano = require('cssnano')

  module.exports = {
    plugins: [
      psImport,
      autoprefixer({
        // browsers: ['>0%']
        browsers: ['Firefox > 30']
      }),
      cssnano // 压缩动作放在最后。
    ]
  };
```
