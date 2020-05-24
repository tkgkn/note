# Promise

ES6 最重要的新功能之一，是一种异步编程的解决方案。

## 概念

封装了状态的容器，内部的状态有 3 种状态，分别是`pedding`，`fulfilled`，`rejected`，状态可以由`pedding`转为`fulfilled`或`rejected`，状态一旦转变后，不可逆，不可改，顾名思义，promise，是一种承诺。

## 基本使用

通过`new Promise(function(resolve, reject))`创建实例，接收一个函数作为参数，函数接收 2 个参数，分别是`resolve`和`reject`2 个函数，这 2 个函数由 JS 引擎布置。在状态确立后调用，可传入结果，`resolve`用来处理`pedding`->`fulfilled`成功状态，`reject`用来处理`pedding`->`rejected`失败或异常。
通过调用实例的`then`方法，传入 2 个函数，一个处理`resolve`，一个处理`reject`

```js
function timeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms, 'done')
  })
}

timeout(100)
  .then(value => {
    console.log(value)
  })
  .catch(error => {
    console.log(error)
  })
```

_注意_，创建`Promise`实例本身，是同步的代码。其构造调用时传递的函数参数中`resolve`和`reject`是也是同步的，而`then`函数中的对应的`resolve`和`reject`回调函数是异步的。

```js
let promise = new Promise(function(resolve, reject) {
  resolve()
  console.log('Promise') // 通常resolve和reject作为操作的最后一步，其他操作应放在then中执行。这里只是为了说明resolve或reject不会阻断其他同步代码
})

promise.then(function() {
  console.log('resolved.')
})

console.log('Hi!')
```

## Promise.prototype.then()

`Promise`实例可以调用`then`方法，因此该方法定义在原型中。

1.  接收 2 个参数，分别是`resolve`和`reject`的回调函数，通常第二个回调函数会省略。
2.  `then`本身返回一个新的`Promise`实例，因此可以链式调用`then`

## Promise.prototype.catch()

同样属于`Promise`实例的方法，挂载在原型中。用来捕获错误的回调函数。其实就相当于`.then(null, rejectFn)`。其返回的也是一个`Promise`，可以接着链式调用`then`。

```js
let promise = new Promise(function(resolve, reject) {
  reject(new Error('wrong'))
})
promise
  .then(
    res => {
      console.log(`resolve: ${res}`)
    },
    // 这里指定了reject函数，所以报错会被捕捉到这里
    err => {
      console.log(`reject: ${err}`)
    }
  )
  // 如果上面的reject函数没有指定，则会被catch这里拿到报错
  .catch(err => {
    console.log(`catch: ${err}`)
  })
```

_记住_，一旦`Promise`决议了，则不会在管其他的报错。

```js
  let promise = new Promise(function(resolve, reject)) {
    resolve('ok')
    throw new Error('wrong') // 徒劳无用的抛错。上面已经决议了。
  }
  promise.then(val => {
    console.log(val) // ok
  }).catch(err => {
    console.log(err) // 不会到这里
  })
```

`catch`比调用`reject`回调的好处在于，`catch`在最后，会捕捉之前所有`Promise`中的错误，而`reject`只能捕捉对应上一个`Promise`中产生的错误。更类似传统的`try catch`写法。建议采用`catch`，而不是`reject`。

好处就是不论如果都可以捕捉到之前的错误，但如果`catch`本身又抛出一个错误异常，则还需要再次`catch`。

## Promise.prototype.finally()

ES2018 引入的，不过`Promise`对象最后状态如果，都会执行。

```js
promise
  .then(result => {})
  .catch(err => {})
  .finally(what => {})
```

## Promise.all()

接收一个由多个`Promise`实例组成的数组，包装成一个新的`Promise`实例

```js
let p = Promise.all([p1, p2, p3])
```

这里假设 p1,p2,p3 都是 promise 实例。

1.  p 的状态由 p1 p2 p3 决定。全部都`fulfilled`，则 p 的状态才是`fulfilled`。如果有一个`rejected`，则 p 的状态变成`rejected`
2.  使用方法和`Promise`实例一样，也有`then`，`catch`

## Promise.race()

接收一个由多个`Promise`实例组成的数组，包装成一个新的`Promise`实例

```js
let p = Promise.all([p1, p2, p3])
```

只要有一个 promise 实例的状态率先改变，则 p 的状态跟着改变。类似于门栓的机制，谁先进门，就把门栓关了，其他都进不来。是一种竞态机制。

## Promise.resolve()

可以将现有的对象包装成一个`Promise`对象。

_情况一_：如果现有对象是一个普通类型的值或是不含`then`方法的对象，则包装这个值称为`Promise`，立即决议为`fulfilled`，执行`resolve`回调。

```js
Promise.resolve(1)
// 等价于
new Promise(resolve => resolve(1))
```

_情况二_：如果现有对象是一个`Promise`实例
则不做任何修改，返回这个`Promise`实例。

_情况三_：如果是一个`thenable`对象。
`thenable`即指具有 then 方法的对象，如下。

```js
let thenable = {
  then: function(resolve, reject) {
    resolve(42)
  }
}
```

将其转换为真正的`Promise`对象。然后立即执行其`then`方法。

```js
let thenable = {
  then: function(resolve, reject) {
    resolve(42)
  }
}
let p = Promise.resolve(thenable)
p.then(val => {
  console.log(val) // 42
})
```

_情况四_：不带任何参数的话。
得到一个`resolved`状态的`Promise`对象

## Promise.reject()

立即返回一个`rejected`状态的`Promise`实例。无论传递什么参数，都是`rejected`状态的，这点和`Promise.resolve()`不同。

```js
const thenable = {
  then(resolve, reject) {
    reject('出错了')
  }
}

Promise.reject(thenable).catch(e => {
  console.log(e === thenable) // true
})
```

上例代码有点不好理解，`catch`中捕捉到的 e，是 thenable 对象本身。这里怎么理解？
打印`Promise.reject(thenable)`，会发现，这是一个单纯的`rejected`状态的`Promise`实例，其值就是*thenable*对象本身，因此 catch 捕捉到的就是`Promise`实例拒绝状态中的值。

## Promise.try()

简而言之，将同步或异步函数，统一用`Promise.try`进行包装，为其提供了和`Promise`实例的统一接口`then`和`catch`。如果是同步函数，同步执行，如果是异步函数，异步执行，如果有报错，也可以使用`catch`捕获到。

```js
// 假设该函数返回promise，但也有可能在其中某个步骤返回同步的错误。则catch则捕获不到了。
function getUsername(userId) {
  return database.user.get({ id: userId }).then(function(user) {
    return user.name
  }).catch(err => {
    console.log(err)
  })
}

// 只能采用try catch来捕获同步的报错
try {
  database.users.get({id: userId})
  .then(...)
  .catch(..)
} catch (e) {
  console.log(e)
}
```

上述代码得为可能出现的同步或异步报错做处理，所以有了一个提案`Promise.try
这样，就是以`Promise`的方式来统一处理了。
```js
  Promise.try(database.users.get({
    id: userId
  })).then(...).catch(...)
```
