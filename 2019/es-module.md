# webpack 模块化原理（ES 的）

写了一个最简单的 demo，webpack 配置也是最简的，主要是弄清楚 webpack 如何实现模块的加载。

```javascript
// src/index.js
import print from './print';
console.log(print);

// src/print.js
const res = 1;
export default res;
```

接下来通过 webpack 打包，贴上打包的代码（对打包的代码稍微处理了下，去掉了一些分隔符，并且将 2 个模块中的代码格式化了下，打包的是通过 eval 来执行的）

```javascript
// 可以看到，一个IIFE函数，接收一个参数modules

// 这里的modules就是最下面自执行传入的一个对象，对象中包含了index.js 和 print.js通过webpack加工后的的具体实现代码。
(function (modules) {
  // webpackBootstrap
  // The module cache
  // 官方注释：模块的缓存对象，主要是希望加载过的模块不在执行第二遍。
  var installedModules = {};

  // The require function
  // 模块的加载函数，核心部分，实现了模块的加载。
  // 接收一个参数模块id，这里其实就是'./src/index.js'和'./print/index.js'。
  function __webpack_require__(moduleId) {
    // Check if module is in cache
    // 第一步，检查模块缓存对象是否已经有过了，如果有了，就是返回出去。
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    // Create a new module (and put it into the cache)
    // 如果没有，就把模块创建出来，并且也挂到缓存模块对象installedModules上。
    // 这里利用了=的返回值的技巧。既将模块对象{i: xx, l: xx, exports: xx}赋值给了缓存模块上对应的模块key上，也赋值给了module变量
    var module = (installedModules[moduleId] = {
      // 就是标记模块的ID，这里也就是'./src/index.js'，'./src/main.js'
      i: moduleId,
      // 模块是否加载过，一个标志符。
      l: false,
      // 模块的具体实现，会有defaults和其他未挂载到defaults上的方法，比如exports function hello() {}
      // 那么exports对象就会被填充为exports: {defaults: xxx, hello: xxx}
      // 至于这里exports对象的填充，是在最下面的自执行函数传参的参数中写的。
      exports: {},
    });

    // Execute the module function
    // 执行模块函数，可以注意到我们打包后的代码（每个模块）都被处理为了函数
    // 正事开始了，执行我们写的代码。使用call方法，将this指向模块的exports，因为exports里才是真正的代码实现。
    // 然后传递3个参数，模块整体，模块的exports，还有模块加载函数。
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );

    // Flag the module as loaded
    // 函数执行完后，将上面最开始创建新模块所声明的l，也就是模块加载标志符设为true，因为是对象，引用关系，缓存模块对象中对应的那个模块的加载标志也已经是true了
    module.l = true;

    // Return the exports of the module
    // 这步也很关键。
    // 浏览器目前不认识es6和cjs的模块加载，所以想要实现模块的加载，肯定是通过函数来实现。
    // 每个模块需要暴露出自己的值或API等，而上面一直在说模块代码的具体实现，是写在exports里的，所以，暴露它，让其他模块能使用被暴露模块的值。
    // 在下面的'./src/index.js'中可以看到，使用webpack模块加载函数引入了'./src/print/js'，并且使用了print.js中的值，这个值就是这里return暴露出去的。
    return module.exports;
  }

  // expose the modules object (__webpack_modules__)
  // 模块都挂到模块加载函数的属性m上。具体作用没看出来。
  __webpack_require__.m = modules;

  // expose the module cache
  // 缓存模块对象也挂到模块加载函数的c属性上。
  __webpack_require__.c = installedModules;

  // define getter function for harmony exports
  // 实现了一个方法。看着像是定义对象的某个属性，并将该属性配置为可枚举，且给他了一个getter实现。
  __webpack_require__.d = function (exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter });
    }
  };

  // define __esModule on exports
  // 比较重要的一个函数，实现了对模块的一个类型定义，是不是es模块。
  __webpack_require__.r = function (exports) {
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    }
    Object.defineProperty(exports, '__esModule', { value: true });
  };

  // create a fake namespace object
  // mode & 1: value is a module id, require it
  // mode & 2: merge all properties of value into the ns
  // mode & 4: return value when already ns object
  // mode & 8|1: behave like require
  // 这个函数没看出来有什么作用。
  __webpack_require__.t = function (value, mode) {
    if (mode & 1) value = __webpack_require__(value);
    if (mode & 8) return value;
    if (mode & 4 && typeof value === 'object' && value && value.__esModule)
      return value;
    var ns = Object.create(null);
    __webpack_require__.r(ns);
    Object.defineProperty(ns, 'default', { enumerable: true, value: value });
    if (mode & 2 && typeof value != 'string')
      for (var key in value)
        __webpack_require__.d(
          ns,
          key,
          function (key) {
            return value[key];
          }.bind(null, key)
        );
    return ns;
  };

  // getDefaultExport function for compatibility with non-harmony modules
  // 获取默认导出的函数，好像是针对于哪些不协调的模块。
  __webpack_require__.n = function (module) {
    var getter =
      module && module.__esModule
        ? function getDefault() {
            return module['default'];
          }
        : function getModuleExports() {
            return module;
          };
    __webpack_require__.d(getter, 'a', getter);
    return getter;
  };

  // Object.prototype.hasOwnProperty.call
  // 对象原型上一个函数的复用而已。
  __webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };

  // __webpack_public_path__
  __webpack_require__.p = '';

  // Load entry module and return exports
  // 加载入口函数，比较重要，前面的一些辅助函数等都已经声明完了。
  // 这里开始从入口函数加载，开始执行我们的代码了。
  // 模块加载函数，这里也用了=的返回的技巧。
  // 我们将'./src/index.js'代入到上面的模块加载函数中去，逻辑解释如下：
  // 1. 检查缓存模块对象是否已经有了'./src/index.js'这个键名对应的模块，有则返回它的具体实现，也就是exports对象。
  // 2. 入口函数首次并没有被加载过，所以开始执行生成新模块的动作。var module = {moduleId: './src/index.js', l: false, exports: {}}
  // 3. 开始执行这个模块也就是'./src/index.js'对应的函数。用call的方式来调用，传递了3个参数。在下面的index.js具体实现中可以看到。我们来解读。
  return __webpack_require__((__webpack_require__.s = './src/index.js'));
})({
  './src/index.js':
    /*! no exports provided */
    function (module, __webpack_exports__, __webpack_require__) {
      'use strict';
      eval(
        '__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _print__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./print */ "./src/print.js");\n\nconsole.log(_print__WEBPACK_IMPORTED_MODULE_0__["default"]);\n\n//# sourceURL=webpack:///./src/index.js?'
      );
      // 4. 首先调用定义模块是否是es的函数，将我们的'./src/index.js'这个模块对象{moduleId: xx, l: false, exports: {}}在添加一个__esModule: true的属性。的确我们在写代码时也就是用的es模块。
      // __webpack_require__.r(__webpack_exports__);
      // 5. 我们在index.js中引入了print.js，这里使用了模块加载器函数来加载print。加载的逻辑解析，【如上面的1，2，3步骤】。我们认为是6,7,8（开始执行print.js中的具体实现）吧，方便逻辑的继续。
      // var _print__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/print.js");
      // 13. 啦啦啦，上面这一行，__webpack_require__加载的print.js，接上了第12步扔出来的对象{default: 1, __esModule: true}
      // 14. 打印了对象的default，也就是1。大工告成。
      // console.log(_print__WEBPACK_IMPORTED_MODULE_0__["default"]);
      // 这里因为我们在源码没有在index模块暴露任何东西，可以看到这里转换后的实现，webpack也并没有对index模块的exports做过多的改造。
      // 好了index也执行完了，终于也把index模块的{l: false} 设为 true了。可以看到，print先设为true的，index是最后，因为print的调用和执行都在index中做的，属于index函数的一部分哦！
    },

  './src/print.js':
    /*! exports provided: default */
    function (module, __webpack_exports__, __webpack_require__) {
      'use strict';
      eval(
        '__webpack_require__.r(__webpack_exports__);\nvar res = 1;\n/* harmony default export */ __webpack_exports__["default"] = (res);\n\n//# sourceURL=webpack:///./src/print.js?'
      );
      // 9. 将print.js这个模块对象{moduleId: './src/print.js', l: false, exports: {}}也加一个__esModule: true的属性标记。
      // __webpack_require__.r(__webpack_exports__);
      // 10. 我们print.js源码里写的，可以看最上面的2个文件源码。
      // var res = 1;
      // 11. 源码里我们是export default形式暴露的res。所以这里帮我们将这种暴露挂到了exports.default上。
      // __webpack_exports__["default"] = (res);
      // 12. 这步实际上就是__webpack_require__函数最后的return，将exports对象扔了出去。{default: 1, __esModule: true}
      // 这里要注意，模块函数执行完了，此时print模块的 {l: false} 已经变为true了。（模块加载函数中写的module.l = true，别忘了。）
    },
});
```
