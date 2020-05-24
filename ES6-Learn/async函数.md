# async

ES2017 引入了`async`函数，使异步操作更方便。是`Generate`函数的语法糖，毕竟`Generate`函数书写起来要麻烦。

## 含义

前文采用`Generate`函数书写的一个读取文件例子：

```js
  // 导入fs模块
  const fs = require('fs')
  // 使用promise封装readFile函数，使之返回一个promise
  const readFile = function(filename) {
    return new Promise(function(resolve, reject){
      fs.readFile(filename, function(error, data) {
        if(error) {
          return reject(error)
        }
        resolve(data)
      })
    })
  }

  // 使用Generate函数包装读取2个文件
  const gen = function* (){
    const f1 = yield readFile('/etc/fstab')
    const f2 = yield readFile('/etc/shells')
    console.log(f1.toString())
    console.log(f2.toString())
  }

  // 调用Generate函数生成一个Iterator遍历器对象，手动调用next
  // value是yiled返回的状态对象中的一个属性值，包含了yiled后跟随的表达式返回值，也就是一个封装过readFile的函数，该函数执行后返回一个Promise
  let g = gen()
  g.next().value.then(function(data) {
    g.next(data).value.then(function(data)) {
      g.next(data)
    }
  })
```

使用`async`函数重写，则会简明很多。

```js
const fs = require('fs')
const asyncReadFile = async function() {
  const f1 = await readFile('/etc/fstab')
  const f2 = await readFile('/etc/shells')
  console.log(f1.toString())
  console.log(f2.toString())
}
```

观察会发现`*`替换成了`async`，`yield`替换成了`await`。实际上`async`还对`Generate`函数做了如下的改进：

1.  `Generate`函数的执行，是依靠手动，先获取`Iterator`遍历器对象，在手动一步步调用 next。有了`thunk`思想的函数，甚至有了`co`模块，才能自动执行。而`async`自带这类自动执行的执行器。使用简单，跟普通函数调用一样。
2.  语义化更清晰，`async`代表这是个异步函数，`await`代表要等待后面的表达式返回结果（即一个暂停）
3.  适用性更广泛。`co`模块要求`yield`后只能跟`thunk`函数或`Promise`对象，而`async`可以跟`Promise`对象和原始类型的值（直接跟原始类型值，会直接返回，等同于同步操作）
4.  `async`本身返回`Promise`，可以使用`then`方法来进行下一步。

## 基本用法

声明`async`函数，一旦遇到内部的`await`就会先返回，等到异步操作完成，在接着执行函数内后面的函数。

```js
async function timeout(ms) {
  await new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

async function asyncPrint(value, ms) {
  await timeout(ms)
  console.log(value)
}

asyncPrint('hello world', 5000)

console.log('我先执行')

// 立即打印 '我先执行'， 5秒后打印 'hello world'
```

`async`函数有多种使用形式

1.  普通声明：`async function foo(){}`
2.  函数表达式：`const foo = async function() {}`
3.  对象的方法： `{async foo() {}}`
4.  Class 的方法

```js
class Cls {
  constructor() {
    // do some
  }

  async getName() {
    // do some
  }
}
```

5.  箭头函数：`const foo = async () => {}`

## 关于 async 的报错

因为`async`函数返回一个`Promise`对象，如果`async`函数内部抛出错误，会导致返回的`Promise`对象变为`reject`状态，抛出的错误对象会被`catch`或`reject`方法回调函数接收。

```js
async function f() {
  throw new Error('wrong')
}
f()
  .then(
    v => {
      console.log(v)
    },
    e => {
      console.log(e)
    }
  )
  .catch(err => {
    console.log(err)
  })
```

## async 返回的 Promise 的状态变化

`async`返回的`Promise`对象，等到内部所有的`await`命令后面的`Promise`对象执行完，才会发生状态改变，除非遇到`return`语句或者抛出错误。总结说，等函数内部的异步操作完，才会确定`Promise`状态，执行`then`

```js
async function getTitle(url) {
  let response = await fetch(url)
  let html = await response.text()
  return html.match(/<title>([\s\S]+)<\/title>/i)[1]
}
getTitle('https://tc39.github.io/ecma262/').then(console.log)
```

上述代码，当抓取网页，取出文本，匹配标题 3 个操作都完成，才会执行`then`方法中的`console.log`

## await 命令

通常后面是一个`Promise`对象，如果不是，则会转换为一个立即`resolve`的`Promise`对象。

```js
async function f() {
  return await 123
}
f().then(v => console.log(v))
console.log('g')

// 先打印g，在打印123
```

`await`命令后面的`Promise`对象如果变成`reject`状态，则`reject`的参数会被`catch`方法的回调接受，或者被`reject`的回调函数接受

只要一个`await`语句后面的`Promise`变为`reject`，整个`async`函数都会中断执行。如下

```js
async function f() {
  await Promise.reject('出错了')
  await Promise.resolve('hello world')
}
f().then(
  v => {
    console.log(v)
  },
  e => {
    console.log(e) // 出错了
  }
)
```

如果不想中断后面的异步操作，可以将`await`放在`try catch`结构里面。

```js
async function f() {
  try {
    await Promise.reject('出错了')
  } catch (e) {
    return await Promise.resolve('hello world')
  }
}
f().then(v => {
  console.log(v)
})
```

另一个方案，在`await`后面的`Promise`对象再跟一个`catch`方法.

```js
async function f() {
  await Promise.reject('出错了').catch(e => {
    console.log(e)
  })
  return await Promise.resolve('hello world')
}
f().then(v => {
  console.log(v)
})
// 出错了
// hello world
```

## 错误处理

若`await`后面的异步操作出错，等同于`async`函数返回的`Promise`对象`reject`。

```js
async function f() {
  await new Promise(function(resolve, reject) {
    throw new Error('出错了')
  })
}
f()
  .then(v => console.log(v))
  .catch(e => console.log(e)) // 同步报错被这里捕获 出错了
```

这里，因为`new Promise`代码部分是立即执行的，所以报错可以被`catch`到。我们可以放在`try catch`里。

```js
async function f() {
  try {
    await new Promise(function(resolve, reject) {
      throw new Error('出错')
    })
  } catch (e) {
    console.log(`e: ${e}`) // e: Error: 出错
    return await 'hello world'
  }
}
f().then(
  v => {
    console.log(`v: ${v}`) // v: hello world
  },
  err => {
    console.log(err)
  }
)
```

执行异步代码的那部分同步报错正常捕捉，进入`catch`，返回值作为`async`返回的`Promise`的`resolve`值。如果有多个`await`异步操作的话，都可以放到`try`里面，防止异步操作本身出错。

```js
function test1() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('err1')
    }, 3200)
  })
}
function test2() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('err2')
    }, 6200)
  })
}

async function myFn() {
  try {
    await test1() // 等待3.2s后reject，catch捕捉到错误。因test1函数返回的Promise变为reject，使得myFn返回的Promise状态也变为reject，函数运行终止了。
    await test2()
  } catch (err) {
    console.log(`catch到的${err}`) // err1
  }
}

myFn()
  .then(v => {
    console.log(v)
  })
  .catch(e => {
    console.log(`catch ${e}`)
  })
```

## 注意点或者说是技巧

1.  尽量把`await`包在`try catch`中，因为`await`命令后的`Promise`对象决议的可能是`reject`。上面的几个代码示例已经演示过。
2.  多个`await`命令后的*异步操作*如果没有继发关系（1 个结束后另 1 个跟上），最好是同时触发，节约时间。

```js
  // 这就是继发了，只能等到第一个await后执行完，才会去执行第二个await
  let foo = await getFoo()
  let bar = await getBar()
```
因此改为同时触发的话：
```js
  let [foo, bar] = await Promise.all([getFoo(), getBar()])
  // 或者以普通函数方式直接调用赋值给其他变量
  let fooPromise = getFoo()
  let barPromise = getBar()
  let foo = await fooPromise
  let bar = await barPromise
```
3. `awati`只能用在`async`函数中
```js
  // 错误
  async function test() {
    let arr = [, ,]
    arr.forEach(function(){
      await // do ...
    })
  }

  // 错误 这样可能不会正常工作，因为会并发执行数组中的每个元素。
  function test(){
    let arr = [, ,]
    arr.forEach(async function(){
      await // do ...
    })
  }
```
需要并发执行的话，考虑用`Promise.all`和先执行赋值给其他变量的方式
利用`esm加载器`，可以是`await`出现在`async`外。了解一下即可。

## async的原理
实际上就是返回一个`Promise`，生成一个`Generate`函数，自动执行`next`。
```js
  async function fn(){

  }
  // 等同于
  function fn(args) {
    return spawn(function* () {
      // ...
    })
  }

  // spawn的实现
  fuction spawn(generate) {
    return new Promise(function(resolve, reject) {
      const gen = generate()
      function auto(nextFn){
        let next;
        try {
          next = nextFn() // 调用next返回的yield后表达式的值和是否已完成所有步骤的布尔值
        } catch(e) {
          return reject(e)
        }
        if(next.done) {
          return resolve(next.value)
        }
        // 不断的执行gen.next()方法，直到done = false 或者 抛错停止gen内部所有步骤
        Promise.resolve(next.value).then(function(v) {
          auto(function() {
            return gen.next(v)
          })
        }, function(e) {
          auto(function(){
            return gen.throw(e)
          })
        })
      }
      auto(function() {
        return gen.next(undefined) // 首次next
      })
    })
  }
```
`async`的基本概念和使用就到这里。还有其他的深入的部分，看下ES6入门。