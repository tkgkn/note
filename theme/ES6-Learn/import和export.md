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

## ES6的模块和CommonJs模块的区别
>目前前端开发大量涉及到node，比如webpack，所以有必要区分下两者。
>需要明确，ES6的模块系统是静态编译阶段确立各个模块之间的关系，而AMD和CommonJs则是在代码运行时（动态）引入模块和确认模块关系。

### ES6的静态分析和CommonJs动态加载
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

// 所以只存在，要么引入其中一个，要么2个都引入，反正不能通过判断条件来引入，因为在代码运行前，静态分析就已经将模块的引入和模块之间的关系确立了！
import '1.js';
import '2.js';

// 当然，变量的方式也不行，因为依旧需要代码运行起来(动态)才能知道a的值到底是啥。曾经傻傻的试过
var a = name + 'conf';
import a

```

### 加载模块的行为
ES6是对模块的绑定，链接到模块内部的活动状态变化。CommonJs是对模块代码的复制，一次性使用，不在关联模块内部。
```js
  //ES6模块
  // test.js
  var a = 1;
  setTimeout(() => {
    a = a + 1;
  },100)
  export {a};
  
  // main.js
  import * as w from './test.js'
  console.log(w.a)
  setTimeout(() => {
    console.log(w.a)
  },1000)

  // 打印1
  // 打印2
```

```js
  //CommonJs模块
  // test.js
  var a = 1;
  setTimeout(() => {
    a = a + 1;
  },100)
  module.exports = {
    a: a
  }
  
  // main.js
  var w = require('./test.js');
  console.log(w.a)
  setTimeout(() => {
    console.log(w.a)
  },1000)

  // 打印1
  // 打印1
```

## ES6模块使用方法
### import
```js
// 常见的使用方式，直接模块名称，通常会加载node_modules内的第三方模块
import vue from 'vue'

// 引入模块中的某些接口
import {fn1, fn2} from './fn.js'
import {mapGetters} from 'vuex'

// 以重命名的方式引入模块。使用模块则用newName
import * as newName from 'name.js'
```

### export
>注意：导出的是接口（引用），而非固定的值

```js
// 常见的导出使用，导入单独的一个变量或者函数
export var a = 1;
export function name() {};

// 默认导出，一个模块只能导出一个默认。
export default {
  name: 'jack'
}

// 不能导出一个值，会报错
export 1;
// 这样跟导出值没区别
var a = 1;
export a;

// 可以这样导出a。即导出一个对象，对象中a引用的是模块内的变量a
export {a};
```

### import和export同时使用
```js
  // moduleA.js
  var a = 1;
  export function myName() {
    console.log('my name')
  }
  export {a};
  export default {
    age: 18
  }


  // main.js 
  import theDefault from './moduleA.js' // 只导入默认部分
  import {a, myName} from './moduleA.js' // 只导入单读导出的部分


  // 同时获取moduleA的默认导出接口和单独的a变量与myName方法
  import theDefault, {a, myName} from './moduleA.js'

  // 可以重命名单独导出部分（不能重命名默认）
  import theDefault, {a, myName as printName} from './moduleA.js'

  // 也可以这样全部导入
  import * as all from './test.js'
  console.log(all); // 一个对象，包含了a, myName, default对象
```


### import和export复合写法
```js
// moduleB.js
export {a, myName} from 'moduleA.js';
// 等价于
import {a, myName} from 'moduleA.js';
export {a, myName}

// 接口改名
export {myName as printName} from 'moduleA.js';
// 等价于
import {myName as printName} from 'moduleA.js';
export {printName}

// 整体输出
export * from 'moduleA.js'
```

### import()
ES6+，新提案中的，可以实现异步加载，运行时加载。目前需借助第三方编译使用，如webpack。该函数返回一个Promise。

```js
// 摘自阮老师ES6入门代码
button.addEventListener('click', event => {
  import('./moduleA.js')
    .then((moduleA) => {
      moduleA.myName();
    })
    .catch(error => {
      // error handle
    })
})
```