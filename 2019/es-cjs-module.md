# webpack 模块化原理（ES+CJS）

接着上一篇**webpack 模块化原理(es)**。这篇我们看下 es+cjs，2 种模块混合书写，webpack 是如何处理的。demo 和之前差不多。

```javascript
// src/index.js
import print from './print';
console.log(print); // 应该是{res: 1}

// src/print.js cjs写法
const res = 1;
exports.res = res;
```

通过 webpack 编译后，代码如下（同样，做了一些处理，去除分隔符，将模块的内部函数格式化下）<br />大部分跟上一篇中解释的一样，我们看下如下几个东西，在这个编译后的 `bundle`  中有使用到。

```javascript
(function (modules) {
  // webpackBootstrap
  // The module cache
  var installedModules = {};

  // The require function
  function __webpack_require__(moduleId) {
    // Check if module is in cache
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    // Create a new module (and put it into the cache)
    var module = (installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {},
    });

    // Execute the module function
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );

    // Flag the module as loaded
    module.l = true;

    // Return the exports of the module
    return module.exports;
  }

  // expose the modules object (__webpack_modules__)
  __webpack_require__.m = modules;

  // expose the module cache
  __webpack_require__.c = installedModules;

  // define getter function for harmony exports
  // 处理cjs模块的辅助函数。通过给具体实现exports对象新增一个getter属性。
  __webpack_require__.d = function (exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter });
    }
  };

  // define __esModule on exports
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
  // 针对es和cjs的默认导出，做一些处理。让大家都统一。
  // 比如如果模块源码是es的，那么模块的exports.__esModule就会为true，在上一篇有解释过。
  // 该函数通过判断module.exports上有没有__esModule，来区分暴露默认导出应该怎么暴露。
  // 如果是cjs，它是没有默认导出这个概念的实际上暴露的都是往module.exports = exports，也就是exports身上挂属性。这也就是模块本身，也就是我们这里函数接收的参数module，直接暴露就好了。
  // 如果是es，它有默认导出，还有部分导出，默认导出挂在了module.exports.default属性上，其他的挂载modulex.exports[xx]上。所以暴露的时候要暴露defaults这个属性值（这个函数接的参数变量，实际上就是{moduleId: xx, l: false, exports: {}}中的exports，因为模块加载函数已经在底部返回了啊, return module.exports）。
  // 这里稍后（先去看1，2两步骤，在下面）让我们我们结合print.js来讲解
  // 3. module参数就是{res: 1}。因为print模块源码是cjs写的，所以它没有被打上__esModule=true的标记。
  // 因此，getter就是第二个函数getModuleExports，这个函数实际上就直接返回了{res: 1}
  // 接着，调用了d方法，给getModuleExports这个函数，赋了一个a的getter属性，当你访问这个a时，就是调用getModuleExports这个函数，然后又拿到了{res: 1}。可以看出来就是这样a: {res: 1}
  // d方法返回的就是getModuleExports这个函数。
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
  // 借用了hasOwnProperty方法而已。
  __webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };

  // __webpack_public_path__
  __webpack_require__.p = '';

  // Load entry module and return exports
  // 开始加载入口函数
  return __webpack_require__((__webpack_require__.s = './src/index.js'));
})({
  './src/index.js':
    /*! no exports provided */
    function (module, __webpack_exports__, __webpack_require__) {
      'use strict';
      eval(
        '__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _print__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./print */ "./src/print.js");\n/* harmony import */ var _print__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_print__WEBPACK_IMPORTED_MODULE_0__);\n\nconsole.log(_print__WEBPACK_IMPORTED_MODULE_0___default.a);\n\n//# sourceURL=webpack:///./src/index.js?'
      );
      //   __webpack_require__.r(__webpack_exports__)
      //   1、这里先用webpack自己的模块加载函数来加载print.js，这里函数还是会返回module.exports，只不过我们看print.js模块函数实现可以看到exports.res = res。所以我们这里拿到的就是{res: 1}这个对象而已。
      //   var _print__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      //     './src/print.js'
      //   )
      //   2. 所以这里__webpack_require__.n({res: 1})，让我们看看上面这个n函数干了些啥？
      //   var _print__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(
      //     _print__WEBPACK_IMPORTED_MODULE_0__
      //   )
      //   4. 上面的n函数调用完了，返回的是getModuleExports这个函数，且这个函数还有个a属性的getter
      //   5. 赋值给_print__WEBPACK_IMPORTED_MODULE_0___default后，我们去调用这个函数的a属性，不言而喻，就是{res: 1}。至此大功告成！。
      //   console.log(_print__WEBPACK_IMPORTED_MODULE_0___default.a)
    },

  './src/print.js':
    /*! no static exports found */
    function (module, exports) {
      eval(
        'var res = 1;\nexports.res = res;\n\n//# sourceURL=webpack:///./src/print.js?'
      );
      // var res = 1
      // 因为源码是cjs模块，非es模块，所以没有给exports配__esModule=true的属性（这个配置是通过__webpack_exports__.r函数实现的）
      // exports.res = res
    },
});
```
