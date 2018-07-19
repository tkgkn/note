# Generator 函数

首先，这是一种异步编程解决方案。该函数相当于一个状态机，内部封装了多个状态，执行函数，返回一个遍历器对象`Iterator`，可以遍历内部的每一个状态。

_关于形式_，在函数名和`function`关键字之间有一个`*`号，函数内部使用`yield`表达式定义不同的内部状态。如下

```js
function* createGenerator() {
  yield 1
  yield 2
  return 'ending'
}
let generator = createGenerator() // 返回的是Iterator遍历器对象。
generator.next() // {value: 1, done: false}
generator.next() // {value: 2, done: false}
generator.next() // {value: undefined, done: true}
```

通过调用遍历器对象的 next 方法，使得指针移动到下一个状态，每一个`yield`即一个状态，每次调用`next`，都会从上一次停下的地方继续执行，直到下一个`yield`或`return`停止。

## yield 表达式

`yield`表达式是暂停的标志，是阶段性质的，会返回跟在其后的表达式的值，通过`next`函数的调用返回对象中`value`获取。
`return`的话，是最终性质的返回，返回跟在其后的表达式的值。

<span style="color: #f44336; font-size: 14px; font-weight: bold;">插播（！！！重要，影响理解）</span>：上面两句的描述是一开始写的，有一个地方缺少准确描述，导致后面的一个`next`函数传参的例子无法理解。这里为了加深印象，不做修改。仅在这里指出：`yield`返回跟在其后的表达式的值（仅仅是将该值放入`next`函数调用返回的对象中的 value 里，而不是原地返回，如`var a = yield 2`，并不是原地返回给变量`a`哦！这里`console.log(a)`的话，打印的是`undefined`。如果想打印`2`，是需要`next(2)`，这么做相当于让`yield`表达式本身有返回值了，伪代码表示下：`var 2 = (yield 2 => 2)`）

<p style="border-bottom: 1px solid #d4d4d4;"></p>

**如果没有 return**，返回的对象的`value`值为`undefined`。

**惰性求值**：`yield`后的表达式，不会立即求值，是惰性的，只有调用`next`方法才会移动到这句表达式并求值，停在下一个`yield`前。

**暂缓执行**：即便没有一个`yiled`，但如果是`Generator`函数，就回暂缓执行。如下

```js
function* f() {
  console.log('执行')
}
let generator = f() // 如果是普通函数，这步就会打印执行。但并没有，这仅仅返回一个Iterator遍历器对象
setTimeout(() => {
  generator.next() // 这里才会打印
}, 2000)
```

**只适用`Generator`函数**：用在普通函数中，会产生语法错误。即便如下：

```js
  var arr = [1, 2, 3]
  var flat = function* (a) {
    a.forEach(function(item) { // 这里forEach传入的参数函数是一个普通函数，里面不能使用yield
      if(typeof item !== 'number') {
        yield* flat(item)
      } else {
        yield item
      }
    })
  }
```

**表达式中需`()`包裹**

```js
  function* demo() {
    console.log('hello' + yield 123); // 语法错误
    console.log('hello' + (yield 123)) // 正常
  }
```

## Generator 和 Iterator 的关系

`Generator`函数生成一个遍历器对象，所以：

```js
function* gen() {}
let g = gen() // 调用返回遍历器对象
g[Symbol.iterator]() === g // true
```

## next 方法的参数

`next`方法用于将遍历器指针移动到下一个状态，接收一个参数，该参数会被当做上一次`yield`表达式的返回值。`yield`表达式没有返回值（即默认返回 undefined），会把跟在其后面的表达式的值放入调用`next()`函数返回的对象中的`value`里。利用`next`传参，我们就可以改变`yield`表达式的返回值（而不是放入`next()`函数返回值对象中的`value`）。
如下：

```js
function* f() {
  for (let i = 0; true; i++) {
    let result = yield i
    if (result) {
      i = -2
    }
  }
}
let g = f()
g.next() // {value: 0, done: false}
g.next() // {value: 1, done: false}
g.next() // {value: 2, done: false}
g.next(true) // {value: -1, done: false}
g.next() // {value: 0, done: false}
```

**注意**：
`next(true)`传的参数是覆盖掉*上一次*`yield`表达式的返回值（即`yield i`返回的`undefined`）。因此上一次的`yield`表达式相当于`let result = ((yield i) => true)`，也就执行了后面的`if`语句，`i = -2`了。这个功能能让我们在外部随时更改`Generator`函数内部的状态返回值，从而动态调整函数内部行为。

<p style="font-weight: bold; size: 14px; color: #f44336;">我就是上面提到的无法理解的例子</p>

```js
function* foo(x) {
  var y = 2 * (yield x + 1) // 原本理解不了，为什么这里会是NaN，2 * (yiedl x + 1)不是返回了12赋值给y了吗？
  console.log(`第二次调用next打印${y}`) // 第二次调用next时，会打印这里，不是12而是NaN
  var z = yield y / 3
  console.log(z) // z也是NaN
  return x + y + z
}

var a = foo(5)
a.next() // {value:6, done:false}
a.next() // {value:NaN, done:false}
a.next() // {value:NaN, done:true}
```

上面的代码理解的点在于`yield`默认返回`undefined`，前文有提到过。所以`var y = 2 * (yield x + 1)` 就不足为奇了，`y = undefined`。调用`next`的时候，遍历器对象指针移动到下一个`yield`开始执行，而`next`函数会返回一个状态对象，里面的`value`就是跟在`yield`之后的表达式的值，也就是`x + 1`。
如果要达到理想中的结果应该这样使用

```js
function* foo(x) {
  var y = 2 * (yield x + 1)
  var z = yield y / 3
  return x + y + z
}
var a = foo(5)
var res
res = a.next()
res = a.next(res.value) // 将上一个yield后跟随返回值的值传递到next中，以此来改变yield原本默认返回的undefined
res = a.next(res.value)
console.log(res) // {value: 21, done: true}
```

## Generator 函数和 for of

`for...of`会去找`Iterator`遍历器对象，而`Generator`函数会返回一个`Iterator`遍历器对象，因此我们可以这样用：

```js
function* foo() {
  yield 1
  yield 2
  yield 3
  return 6
}
for (let v of foo()) {
  console.log(v) // 1 2 3
}
```

_注意_：不会打印 6.遍历器对象指针移动到每个 yield，不包括 return

## Generator.prototype.throw

属于`Genertor`调用生成的遍历器的异常抛错函数，可以在`Generator`函数内部进行捕获。

```js
var g = function*() {
  try {
    yield
  } catch (e) {
    console.log(`内部捕获${e}`)
  }
  yield console.log('throw附赠一次yield执行') // throw附赠一次yield执行
}
var i = g()
i.next()
try {
  i.throw('a')
  i.throw('b')
} catch (e) {
  console.log(`外部捕获${e}`)
}

// 内部捕获 a
// 外部捕获 b
```

这个例子总结下：

1.  `Generator`函数生成的遍历器对象可以用自己的`throw`函数抛出异常，跟全局的`throw`并不是同一个。
2.  至少调用一次`next`，才能捕获到异常，否则，异常直接全局抛出报错。第一次`next`相当于启动`Generator`函数。
3.  `Generator`自己抛出的异常，如果函数内部有做捕获，则会自己捕获，捕获到第一个异常后，其后面所有代码都不会在执行。如果内部没有做捕获，若全局有`try catch`则将进行捕获。如果都没有，则脚本报错。
4.  `Generator`已经捕获到第一个异常后，则不会在执行`try`块之后的代码。
5.  `throw`会自动进行一次`yield`。
6.  已经捕获异常后，再调用`next`会返回`{value: undefined, done: false}`。

## Generator.prototype.return()

遍历器对象调用`return`，可以直接终结遍历，并直接返回`return(1)`函数参数的状态对象`{value: 1, done: true}`，如果不提供参数，则`{value: undefined, done: true}`

_注意_，如果有`try finally`的话，`return(1)`相当于一次`next()`，`return`会延迟到执行完`finally`之后再执行，相当于一次`next`，并会代入`return`中传入的参数。如下

```js
function* numbers() {
  yield 1
  try {
    yield 2
    yield 3
  } finally {
    yield 4
    yield 5
  }
  yield 6
}
var g = numbers()
console.log(g.next()) // { value: 1, done: false }
console.log(g.next()) // { value: 2, done: false }
console.log(g.return(7)) // { value: 4, done: false }
console.log(g.next()) // { value: 5, done: false }
console.log(g.next()) // {value: 7, done: true}
```

## yield\* 表达式

总结下就是`Generator`函数内部调用另一个`Generator`函数使用。
简单的在`Generator`函数内调用的话，是没有效果的。

```js
function* foo() {
  yield 'a'
  yield 'b'
}

function* bar() {
  yield 'x'
  foo()
  yield 'y'
}

for (let v of bar()) {
  console.log(v) // x y
}
```

这就要用到`yield*`

```js
function* foo() {
  yield 'a'
  yield 'b'
}

function* bar() {
  yield 'x'
  yield* foo()
  yield 'y'
}

// 等同于
function* bar() {
  yield 'x'
  yield 'a'
  yield 'b'
  yield 'y'
}

// 也等同于
function* bar() {
  yield 'x'
  for (let v of foo()) {
    yield v
  }
  yield 'y'
}

for (let v of bar()) {
  console.log(v) // x a b y
}
```

_注意_，如果只是`yield foo()`，看下区别：

```js
function* inner() {
  yield 'hello!'
}

function* outer1() {
  yield 'open'
  yield inner()
  yield 'close'
}

var gen = outer1()
gen.next().value // open
gen.next().value // 返回一个遍历器对象，即调用inner函数返回的遍历器对象
gen.next().value // close

function* outer2() {
  yield 'open'
  yield* innter()
  yield 'close'
}

var gen = outer2()
gen.next().value // open
gen.next().value // hello
gen.next().value // close
```

_仔细看_：`yield*`后面实际上跟的是一个`iterator`遍历器对象，这样的话，我们就可以很灵活的使用，只要具有`iterator`，都可以跟在后面。

```js
function* gen() {
  yield* ['a', 'b', 'c']
}
gen().next() // {value: a, done: false}
```

连字符串都可以跟在后面

```js
let read = (function*() {
  yield 'hello'
  yield* 'hello'
})()

read.next().value // hello
read.next().value // h
read.next().value // e
```

## 作为对象属性的 Generator 函数

可以简写为：

```js
  let obj = {
    * genMethod() {
      // ...
    }

    // 相当于
    genMethod: function* () {
      // ...
    }

    // 原本其实是[Symbol.iterator]属性对应的一个Iterator生成函数，而Generator调用后也是生成Iterator遍历器对象，所以就可以简写成上面的模样了。
    [Symbol.iterator]: function() {

    }
  }
```

## Generator 函数的 this

调用`Generator`只是简单的函数调用，而不是构造调用，但 ES6 规定`Generator`函数返回的遍历器对象，就是`Generator`函数的实例，继承`prototype`对象的方法。
如下：

```js
function* g() {}
g.prototype.hello = function() {
  return `hi!`
}
let obj = g()
obj instanceof g // true
obj.hello() // hi
```

但是`this`并不会跟普通构造函数调用一样，指向创建出的实例。

```js
function* g() {
  this.a = 11 // 这里会报错chrome
}
let obj = g()
obj.next()
obj.a // undefined
```

切记，不能使用`new`调用`Generator`，会报错。如果想要通过`new`的方式，且正确绑定`this`的话，可以这么改：

```js
function* gen() {
  this.a = 1
  yield (this.b = 2)
  yield (this.c = 3)
}
var obj = Object.create(null)
// 为了使用new
function F() {
  return gen.call(gen.prototype) // this绑定到f上去
}

var f = new F()

f.next() // {value: 2, done: false}
f.next() // {value: 3, done: false}
f.next() // {value: undefined, done: true}

f.a // 1
f.b // 2
f.c // 3
```

## Generator和上下文
JS代码运行时，会先创建一个全局上下文环境，执行函数的时候，又会在全局上下文环境中创建一个函数运行上下文，类似一个数组堆栈，如
```js
  function fn1() {
    // ...
  }
  fn1() // 创建函数上下文

  // 此时的执行上下文栈： [global, fn1-context，...]
  // fn1执行完，退出上下文栈。
  // 这是一种 后进先出的数据结构。
```
而`Generator`函数并不是这样，遇到`yield`时，退出当前堆栈，控制权返回给调用方，调用`next()`时，又进去调用栈。
