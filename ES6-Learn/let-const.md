# let和const
> 简单阐述用法和常见坑躲避

## let和const
let可以看成平时用的var即定义变量，const定义的是常量。ES6之前，常用大写字母定义一个常量（非真正常量，只是写法规范，常量通常是大写字母）
简单来说，变量值不会更改，就用const，例如**π**，一个国际通用值3.14，我们可以`const PI = 3.14`。反之，用let。
```js
  let a = 1;
  a = 5;
```
```js
  const PI = 3.14;
  PI = 5; // Uncaught TypeError: Assignment to constant variable.
```

## let,const和var的区别

### 劫持作用域(创建作用域)
>也可以理解为let，const创建块作用域

在ES6之前，只有函数才有作用域，即外部无法访问到函数内声明的变量或者方法。
```js
  function run() {
    var a = 1;
  }
  run();
  console.log(a); // a is not defined
```
但诸如`if(){}`这种，则不具备作用域，也就是说`{}`内声明的变量，外部可以访问
```js
  var flag = true;
  if (flag) {
    var a = 1;
  }
  console.log(a); // 1
```
到了ES6，let和const则具备劫持作用域的能力，`{}`内使用`let`和`const`声明的函数和变量，均不能在`{}`访问。
```js
  let flag = true;
  if (flag) {
    let a = 1;
  }
  console.log(a); // a is not defined
```
一个经典到不能在经典的例子
```js
  for(var i = 1; i < 6; i ++) {
    window['fn' + i] = function(){
      console.log(i)
    }
  }
  window.fn1(); // 6
  window.fn2(); // 6
  window.fn5(); // 5
```
原因很简单，for循环同步创建5个全局函数`fn1`...`fn6`，5个函数中`console.log(i)`，这里的`i`指向的都是同一个`i`即for中声明的那个i，因为for循环不存在作用域，因此6个函数访问的都是for中的声明的i。for循环结束后，i值是6。

ES6之前解决方法即通过在for循环中创建闭包，然后将每次循环的i传递到闭包中，闭包中打印i。原理就是，函数的参数传递都是值传递，因此i的一个副本传递进闭包中，访问从当前作用域开始查找i，即传递进来的i的副本，传进来时是多时少，就是多少，与for中不断增加的i没有关系。
```js
  for (var i = 1; i < 6; i++) {
    (function(i) {
      window['fn' + i] = function() {
        console.log(i)
      }
    })(i)
  }
```

ES6中，利用`let`劫持作用域的原理。我们可以这样弄。
```js
  for(let i = 1; i < 6; i ++) {
    window['fn' + i] = function(){
      console.log(i)
    }
  }
  window.fn1(); // 1
  window.fn2(); // 2
  window.fn5(); // 5
```
用let创建i的时候，每次循环都针对当前这个作用域进行了劫持。第一次劫持时，`i=1`，我们可以认为在`for(...){这里}`**这里**执行了`let i = 1`，所以这个作用域中的函数访问，只能访问`{let i = 1}`这个值。第二次劫持时，`i=2`，在`for(...){这里}`执行了`let i = 2`，所以这个作用域中的函数访问，只能访问`{let i = 2}`这个值，以此类推。
这块解释参考这篇文章[我用了两个月的时间才理解let](https://juejin.im/entry/59798540f265da3e3e2eda99)

### 无变量提升(标题不准确)
在ES6之前的时代，可以先使用变量，后声明。原理就是变量提升。关于变量提升，可以看我的另一篇总结[执行上下文中的变量对象](https://github.com/c690554125/Javascript-deep-series/blob/master/%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87%E4%B8%AD%E7%9A%84%E5%8F%98%E9%87%8F%E5%AF%B9%E8%B1%A1.html)
```js
console.log(a); // 打印undefined
var a = 1;
```
到了ES6里，大家必须遵循**先声明，后使用**的原则。不然就报错！
```js
console.log(a); // Uncaught ReferenceError: a is not defined  提示，如果这里使用了例如Parcel等构建工具，会将ES6转换为ES5，使用var，看不到报错。
let a = 1;
```
标题并不准确，在[我用了两个月的时间才理解let](https://juejin.im/entry/59798540f265da3e3e2eda99)一文中作者多方考证，明确了有提升，但无初始化。ES5中变量提升的过程是，进入当前执行上下文，查找所有var声明的变量，声明变量，并初始化为undefined，执行代码。而let的变量提升过程少了初始化为undefined，没有初始化的话，访问被阻止直到到达实际声明，因此会报错。

***注意***
let的初始化，是在代码执行阶段。如下
```js
  let a;
  let b = 1;
```
以上2种声明过程，查找let变量，声明变量， 执行代码，首次进行变量初始化=undefined，赋值操作则在执行b = 1。
在**《你不知道的Javascript》**一书中有提到，`var a = 1`这类声明，实际上是分为2个步骤的，提升变量声明，赋值则不提升。相似的理解`let = 1`，初始化undefined和赋值1。

### 暂时性死区
暂时性死区，简单理解就是一切在变量声明之前就是用该变量，就会出现该变量的暂时性死区，无法访问，报错。
```js
console.log(a); // 未先声明a变量，就使用a变量，出现a的暂时性死区
let a = 1;
```
即便在全局中有声明过该变量，也不行！`(注意，该例因使用babel，将Let转成ES5的var，执行正常，可不通过转换直接执行则可以看到暂时性死区的效果)`
```js
var a = 1;
var b = 2;
{
  console.log(b)
  console.log(a)
  let a = 1;
}
```
let劫持了当前作用域，切在块作用域中声明了a，那就必须尊崇先声明，后使用的原则。因为console.log(a)访问的a是`{}`块级作用域中的a，而非外面的`var a = 1`。但是访问未通过let声明过的b，则没有b的暂时性死区，正常访问外层的`var b = 2`

### 不能重复声明
ES6之前，这种重复声明的方式已经很常见了。
```js
  var a = 1;
  var a = 2;
  console.log(a); // 2
```
ES6中，明确let不可以重复声明
```js
  let a = 1;
  let a = 2; // Duplicate declaration "a"
  console.log(a)
```


### 良好的声明习惯
将所有变量声明放置当前作用域顶部。
```js
let a = 1;
let b = 2;
let c = 3;
let d;
d = a + b + c;
```
不要在`if(...){}`中进行声明。
```js
// 不要这么做
if(true) {
  let a = 1;
  var b = 2;
}
```
