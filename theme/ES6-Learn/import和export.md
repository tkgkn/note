# 关于Javascript模块
>模块一直是Javascript的一个软肋，直到出现了AMD，CMD，Node(CommonJs)情况才有所好转，现如今的ES6，明确将模块化划入标准，实现了import和export。（关于更早期的闭包，作用域的方式实现模块化这里就不多说了。）

现如今JS项目越来越大，模块化能很好的将代码按功能，逻辑分割成多块，且能够正确处理各个模块之间的依赖关系。

简单介绍下AMD和CommonJs的使用

## AMD
浏览器端的实现，运行时加载模块。参考require.js，使用还是比较简单的。
```html
<!-- 引入require.js，配置主入口 -->
<script src="scripts/require.js" data-main="scripts/main.js"></script>
```

```js
  // 模块配置
  require.config({
    baseUrl: 'js/lib',
    paths: {
      $: 'jquery',
    }
  })

  // main.js 
  require(['$'], function($) {
    // 主入口依赖模块jquery，可以使用jquery
  })
```

## CMD
国内大神玉伯写的。没用过，这里就不献丑了。

## CommonJs
主要是服务端，也就是Node开发环境下使用。
```js
  // 引入模块
  var fs = require('fs');

  function whatFn(){
    // ...
  }

  // 导出模块
  module.exports = {
    whatFn: whatFn
  }

  // 当然也可以
  exports.whatFn = whatFn;

  // 因为关系如下
  exports = module.exports = {};
```

## ES6的import和export
>需要明确，ES6的模块系统是静态编译阶段确立各个模块之间的关系，而AMD和CommonJs则是在代码运行时（动态）引入模块和确认模块关系。

简单区分下动态和静态。动态即代码运行时
```js
// CommonJs下。可以根据代码运行的结果，动态引入需要加载的模块
if( 1 > 2) {
  require('1.js')
}else {
  require('2.js')
}

// ES6下，不好意思，完全做不到如下你期待的结果
if (1 > 2) {
  import '1.js';
}else{
  import '2.js'
}

// 所以只存在，要么引入其中一个，要么2个都引入，反正你不能通过判断条件来引入，因为在代码运行前，静态分析就已经将模块的引入和模块之间的关系确立了！
import '1.js';
import '2.js';

// 当然，变量的方式也不行，因为依旧需要代码运行起来(动态)才能知道a的值到底是啥。曾经傻傻的试过
var a = name + 'conf';
import a

```

### import和export
```js
// 常见的使用方式
import vue from 'vue'

// 引入模块中的某些接口，相对路径
import {fn1, fn2} from './fn.js'
```
