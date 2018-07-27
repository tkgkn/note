# 函数扩展

函数这块涉及到一些新的语法，开发更便捷。但要理解透彻，比如=>函数

## 函数参数默认值

支持参数阶段设置默认值，遵循一个规则，有默认参数的，都放在后面。默认参数后面不要出现没有默认值的参数。虽然现阶段已经不会报错，浏览器已经解决了这个 BUG。

**注意：** 函数参数本身就是声明，因此特别注意函数体内切勿出现 let 重复声明。

```js
function test(a = 1, b = 2) {
  console.log(a, b)
}
```

配合解构赋值默认值使用

```js
// 这里的解构，只用到了对象解构，传入参数是一个对象，对象中属性具有默认值
function foo({ x, y = 5 }) {
  console.log(x, y)
}

foo({}) // 正常不会报错 undefined 5
foo() // 会报错，并没有正常解构，没有传入跟{x, y = 5} 对应的结构。而上面一个调用传入
```

```js
function foo({ x, y = 5 } = {}) {
  console.log(x, y)
}
foo() // 这里传入空值可以，因为默认参数是空对象，而且x,y也进行了声明，且y有默认值。对比上面的函数，同时用到了对象解构和对象默认值。
```

### 默认参数怎样影响 arguments（补）

ES5 中，非严格模式下`arguments`实时反映具名参数的变化。如：

```js
function mixArgs(first, second) {
  console.log(first === arguments[0]) // true
  console.log(second === arguments[1]) // true
  first = 'c'
  second = 'd'
  console.log(first === arguments[0]) // true
  console.log(second === arguments[1]) // true
}
mixArgs('a', 'b')
```

然而在严格模式下，`arguments`不在反映具名参数的更改

```js
'use strict'
function mixArgs(first, second) {
  console.log(first === arguments[0]) // true
  console.log(second === arguments[1]) // true
  first = 'c'
  second = 'd'
  console.log(first === arguments[0]) // false arguments[0]依旧是a
  console.log(second === arguments[1]) // false arguments[1]依旧是b
}
mixArgs('a', 'b')
```

ES6 中传入默认参数的话：

```js
function mixArgs(first, second = 'b') {
  console.log(arguments.length) // 1 函数调用只传了1个参数
  console.log(first === arguments[0]) // true first = 'a'  arguments[0] = 'a'
  console.log(second === arguments[1]) // false second = 'b' arguments[1] = undefined
  first = 'c'
  second = 'd'
  console.log(first === arguments[0]) // false
  console.log(second === arguments[1]) // false
}
mixArgs('a')
```

## 函数默认参数形成作用域

```js
let x = 1
function f(y = x) {
  let x = 2
  console.log(y)
}
f()
```

咋一看结果好像是`2`。运行发现结果是`1`。
分析一下，`y=x`取到的是上面声明的 x，有默认参数的时候，函数调用时，其参数会形成一个作用域。可以拆成这样看：

```js
// 伪代码，仅解释函数参数形成作用域造成的影响
let x = 1
{
  y = x // 这里访问外层的let x = 1。因此 y = 1
  {
    let x = 2
    console.log(y) // 1
  }
}
```

```js
// 如果上述代码中注释第一句声明，则会报错。
function f(y = x) {
  // 这里函数调用时就会报错，x is not defined
  let x = 2
  console.log(y)
}
f()
```

## 不经意的暂时性死区

如下代码也会报错。因为`(x = x)`形成了一个块作用域，参数也属于声明所以可以看成`{let x = x}`，因为 let 劫持了当前块作用域，因此在此块作用域中必须尊崇先声明后使用的原则，否则就会出现暂时性死区。很显然`{let x = x}`中，右侧 x 并未赋值就使用。

```js
var x = 1
function foo(x = x) {
  console.log(x)
}
foo() // ReferenceError: x is not defined
```

## 函数不定参用 rest 参数

ES5，我们有`arguments`，可以取到函数的参数集合（并不是数组），虽然 arguments 已被废弃，建议不再使用。
ES6 中，我们可以使用`...restVal`

```js
function test(a, b, ...c) {
  console.log(a, b) // 1, 2
  console.log(c) // [3,4,5,6]
}

test(1, 2, 3, 4, 5, 6)
```

_注意_，不能在`setter`属性中使用`剩余参数`，`setter`被限定只能使用单个参数了！

```js
  let obj = {
    // 会导致报错
    set name(...value) {

    }
  }
```

## 展开运算符

用于展开数组，也使用`...`三个点来表示。

```js
let a = [1, 2, 3]
console.log(...a) // 1, 2, 3
```

## 函数的 name 属性

ES5 就有，ES6 写入规范，函数的`name`就返回函数名。
注意下匿名函数的`name`属性值。

```js
let a = function() {}
a.name(
  // 'a'。ES5中则返回''

  function() {}
).name // ''
```

而`getter`和`setter`函数，则需要调用`getOwnPropertyDescriptor`先获取到某个对应属性的属性描述符，再访问其`get`和`set`

```js
var person = {
  get firstName() {
    return 'Nicholas'
  },
  sayName: function() {
    console.log(this.name)
  }
}
var descriptor = Object.getOwnPropertyDescriptor(person, 'firstName')
console.log(descriptor.get.name) // get firstName
```

_注意_：函数表达式的方式和具名函数表达式的方式

```js
var dosomething = function doSomethingElse() {
  //
}
dosomething.name // doSomethingElse

var dosomething = function() {}
dosomething.name // dosomething
```

_注意_：通过`bind`创建的函数，会待用`bound`前缀

```js
var doSomething = function() {}
console.log(doSomething.bind().name) // bound doSomething
```

## 箭头函数=>

函数表示的新方法，当然，this 的指向也不同于 ES5 中定义的。箭头函数的 this 指向`书写代码时所在的作用域，非调用时的this`

### 基本使用

```js
// 有参数
var f = val => val
// 等同于
function f(val) {
  return val
}
```

### 无参或多参使用()

```js
var f = () => 1
// 等同于
function f() {
  return 1
}

var f = (a, b) => a + b
function f(a, b) {
  return a + b
}
```

### 返回一个对象

```js
// 你以为是这样？想返回{a: 1}，可惜{}被解析为代码块，只执行里面的a: 1，解释为语句的标签。
var f = () => {
  a: 1
}

// 所以想要返回对象，用()包裹。
var f = () => ({ a: 1 })
```

### 关于 this
箭头函数没有自己的`this`，它使用的`this`是通过作用域链查找到上层的`this`来使用的，也就是词法作用域（静态作用域，书写代码时确定的）下的父函数的`this`。而通过`call`，`apply`，`bind`改变`this`都是无效的。

```js
function f() {
  setTimetout(() => {
    console.log(this.id)
  }, 100)
}
var id = 1
f.call({ id: 100 }) // 100
```

上例函数中，因 setTimeout 中传入一个箭头函数，函数中的 this 指向定义时，外层的 this，而非 window`(因setTimeout调用等于window.setTimeout)`。`f.call({id: 100})`使得`this`指向了`{id: 100}`，所以结果是 100。  
如果不使用箭头函数，严格模式下，会报错，因为此时的`this`是调用时的那个 this，但`this`指向是`undefined`，而非严格模式下，`this`指向`window`，会输出 1。  
`注意：` ES6 默认开启严格模式。  
一个极端点的例子

```js
function foo() {
  return () => {
    return () => {
      return () => {
        console.log('id:', this.id)
      }
    }
  }
}

var f = foo.call({ id: 1 })

var t1 = f.call({ id: 2 })()() // id: 1 无效的this绑定手段
var t2 = f().call({ id: 3 })() // id: 1 无效的this绑定手段
var t3 = f()().call({ id: 4 }) // id: 1 无效的this绑定手段

// 上述结果全部打印1
```
最开始的`foo`函数已经绑定了`this`指向，也就是`{id: 1}`，之后每次的调用，都是返回一个箭头函数，箭头函数本身没有`this`，根据作用域链向上查找，使用包裹它的函数的`this`，而强制绑定`this`的手段对箭头函数来说也是无效的，所以，不管怎么调用，`f`函数的`this`都是定下过的了。

### 关于arguments
箭头函数没有自己的`arguments`对象，但是可以访问，访问到的是包含它的函数的`arguments`对象。
```js
function test(n) {
  return () => arguments[0] + 1
}
test(5)() // 6
```

## new.target 元属性

在 ES6 之前，判断函数的调用方式是普通调用还是构造调用（即 new），我们都是通过`instanceof`来检查。

```js
function Person(name) {
  if (this instanceof Person) {
    this.name = name
  } else {
    throw new Error('普通调用')
  }
}
var person = new Person('Jack')
var person = Person('Jack') // 普通调用
```

但是上述方法并不是一定准确，如果是通过`call`，`apply`之类的绑定`this`指向了，则判断不准。

```js
var notNewPerson = Person.call(person, 'Mike') // 不会提示 普通调用
```

所以 ES6 中，提供饿了一个 new.target 属性来判断，该属性会返回构造调用时的构造器（也就是`new`后的函数）。

```js
function Person(name) {
  console.log(new.target) // 打印出构造函数本身
  if(typeof new.target !== 'undefined') {
    this.name = name
  } else {
    throw new Error('普通调用')
  }
}
var p = new Person()
var p2 = Person.call(p, 'Jack') // 正常报错
```

## 尾调用

函数的最后一步是返回调用另一个函数就是尾调用。  
主要用来优化代码，减少调用栈，使得调用栈永远只有最后一个函数，节约内存。代码举个例子。

```js
function addOne(a) {
  var one = 1
  function inner(b) {
    return b
  }
  return inner(one) + a // 不算尾调用。尾调用后进行了+a的运算。
}

function addOne(a) {
  var one = 1
  function inner(b) {
    return b
  }
  return inner(a) // 函数最后一步是返回inner函数的调用，且需要用到的变量都已经传入inner，addOne函数不需要在保留其所有用的变量one。算尾调用。
}

function addOne(a) {
  var one = 1
  function inner(b) {
    return b + one
  }
  return inner(a) // 看似函数最后一步返回inner函数的调用，但因inner函数内部引用了外部的one变量，导致inner函数一直保存在addOne的变量对象。算尾调用，但是没有做到尾调用优化。
}
```

## 尾调用和递归

递归就是函数调用函数自身，会同时保存很多调用栈，容易出现内存溢出。  
结合尾调用的优点，即函数最后一步返回另一函数的调用（无任何其他操作），保证调用栈永远只保存一个，这样就不会出现内存溢出。

```js
// 这种就是需要优化的递归。
function factorial(n) {
  if (n === 1) return 1
  return n * factorial(n - 1) // 120 不算尾调用，因为有做*运算。
}

// 优化为
function factorial(n, total) {
  if (n === 1) return total
  return factorial(n - 1, n * total) // 120 尾调用+递归，尾递归。调用栈只保留最后一次运行的函数。
}
```
