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

之前提到过，模拟 ES5+的环境。也会少量的在原型链如 String 上添加一些方法，如`includes`。官方推荐使用`@babel/preset-env`，并且设置该`presets`选项的配置`useBuildIns`使用。这样可以达到的效果，我们只需要引入我们用到的`polyfill`代码。

如果你需要所有的ES5+的静态方法，实例方法已经新的API，那你就需要手动在入口文件顶部导入`@babel-polyfill`，缺点是，这样子是会污染全局环境的。

## 使用位置

不管是`CommonJS`还是`ES6 Modules`，我们都需要在应用的入口文件的顶部，加载`@babel/polyfill`。

和`webpack`构建工具一起使用的话，我们有 3 种方式引入`polyfill`。在`.babelrc`中对`presets`里的`env`进行配置项设置，设置`useBuildIns`。

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

这个插件，可以重用`Babel`注入的辅助代码，目的是为了减少代码体积。

```js
// 开发依赖
`yarn add @babel/plugin-transform-runtime -D`

// 生产依赖
`yarn add @babel/runtime`
```
前者主要是将`helper`代码自动从`babel-runtime/core-js`中引入，不需要我们手动去写。后者相当于一个独立出来的模拟ES5+的环境包，是在打包的时候需要用到的，但为了不污染全局，一些实例属性不能使用。所以这两者是搭配使用的。

## 常用实践

希望达到，复用代码，缩小代码体积，功能还能很全的目标。

**复用代码**，我们需要使用`transform-runtime-plugin`，在开发阶段，自动重写我们的导入代码，全部从`babel/runtime`中导入。

**缩小代码体积**，我们需要按需加载，`transform-runtime-plugin`和`babel/runtime`结合使用就可以达到按需加载，插件会分析我们用到了哪些新的API，如`promise`，则从`import promise2 from '@babel/runtime/core-js/promise`，注意到这里使用的是promise2，所以避免了全局污染。

**功能全**，光有`@babel/runtime`，还不够，它只能帮我们模拟出大部分ES5+环境，但是如`'hello'.includes('h')`等实例方法，是没有的，原因就是不污染全局环境。所以我们还需要`babel-polyfill`，但是`babel-polyfill`包含了完整的ES5+环境，包很大，且数据全局环境引入，会导致污染。所以我们需要一个`babel-preset-env`，这个预置其实就是包含了很多`plugins`，需要哪个，我们用哪个，可以根据开发环境来选择，已达到最小使用`babel-polyfill`，需要设置`useBuildIns`为`usage`，意为不直接引入`babel-polyfill`，而只单独加载用到的。
