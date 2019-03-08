# Babel7 常见配置和概念。

## 安装

我这里就用`yarn`了，`npm`一样

```js
  yarn add @babel/core @babel/cli @babel/preset-env -D
  yarn add @babel/polyfill
```

大致先说下装了些啥，`core`核心，`cli`工具，可以让我们使用命令行来运行`babel`命令。

`preset-env`主角之一，env 是已经在浏览器标准中的意思，Babel 官方的一个新 API 插件集合，可以将一些 ES6+的新 API 转换成 ES5。搭配`polyfill`主角之一，模拟一个 ES6+的环境，让我们可以使用新的特性。如`promise`等。

## 怎么配置 Babel

官方推荐用`babel.config.js`，我们可以在里面写 JS，比如对环境`ENV`不同，做一些不同的配置。也支持`.babelrc`文件，这是个独立的文件，通常跟放在项目的根目录。当然你也可以写在`package.json`中，以`babel`为`key`来写配置。

大抵最终导出的其实就两样东西，`plugins`和`presets`:

```js
  {
    presets: [],
    plugins: []
  }
```

## Plugins 配置

数组格式，可以省略`babel-plugin-`

```js
  {
    "plugins": [
      "myPlugin", // 同等
      "babel-plugin-myPlugin"
    ]
  }
```

对域的写法同样适合

```js
  {
    "plugins": [
      "@babel/babel-plugin-name", // 同等
      "@babel/name"
    ]
  }
```

如果单独某个插件需要配置项，则在数组第二个位置写个配置对象。每个插件即一个数组：

```js
{
  "plugins": [
    ["transform-async-to-module-method", {
      "module": "bluebired"
    }]
  ]
}
```

同理，`presets`也是这样对单独项写配置。

**注意加载顺序**

1. `plugins`是从第一个到最后一个。
2. `presets`是从最后一个到第一个。原因官方说是大部分用户会喜欢`es2015`写在前面，
3. 插件在`presets`之前开始。

## Presets

顾名思义，预设。官方提供的`@babel/preset-env`等其实本质就是一个插件数组而已，无非是用了哪些插件。支持包含带选项的`plugin`或其他`presets`

```js
module.exports = function() {
  return {
    plugins: [
      'pluginA',
      'pluginB',
      [
        'pluginC',
        {
          opt: 1
        }
      ]
    ],
    presets: [require('@babel/preset-env')]
  };
};
```

关于路径这块，可以绝对，相对路径，也可以全名（从`node_modules`上找）。

至于配置的写法，在`Plugins`中已经说过。这里再提醒下，`presets`是倒序的。

## 关于配置文件

这里注意下有个`Monorepo`的目录模式。大致意思就是多个 repo，在同一个 package 中管理。

## Polyfill

之前提到过，模拟 ES5+的环境。也会少量的在原型链如 String 上添加一些方法，如`includes`。官方推荐使用`@babel/preset-env`，并且设置该`presets`选项的配置`useBuildIns`使用。这样可以达到的效果，我们只需要引入我们用到的`polyfill`代码。如果你全要，那你就手动导入`polyfill`好了。

## 使用位置

不管是`CommonJS`还是`ES6 Modules`，我们都需要在应用的入口文件的顶部，加载`@babel/polyfill`。

和`webpack`构建工具一起使用的话，我们有 3 种方式引入`polyfill`。通过设置`useBuildIns`。

1. 默认是`false`，相当于着在`webpack.config.js`的`entry`数组头部直接加入。

```js
module.exports = {
  entry: ['@babel/polyfill', './app.js']
};
```

2. 设为`usage`，不会在任何地方导入`@babel/polyfill`，而是用到哪些导哪些，但依旧需安装`@babel/polyfill`
3. 设为`entry`，在入口文件的头部加载。

**注意**
在`Babel6.x`中，`useBuildIns`只有`true`和`false`。

## plugin-transform-runtime

这个插件，可以重用`Babel`注入的`helper`代码，目的是为了减少代码体积。

```js
// 开发依赖
`yarn add @babel/plugin-transform-runtime -D`

// 生产依赖
`yarn add @babel/runtime`
```

