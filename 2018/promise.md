# 概念

> promise 作为 es6 中的重点核心内容，除了只会用之外，还要弄明白其中的原理和规范。本文结合参阅的其他 Promise 实现的文章，还有 PromiseA+的规范，结合自己的理解，记录下如何实现 Promise。

```js
import 'babel-polyfill'

// 简单实用promise的例子。
// var promiseA = new Promise(function(resolve, reject) {
//   setTimeout(() => {
//     resolve(1)
//   }, 2000)
// })

// then方法可以无限调用，返回一个新的Promise，如果then中没有传递任何参数，则应该将上一个Promise的值传递到后面去
// promiseA.then().then().then().then(r => {
//   console.log(r)
// })

// then方法接受另一个promise，则等待接收的promise决议，其链式调用的then是接收的promise的回调
// promiseA.then(function(r) {
//   return new Promise(function(resolve, reject){
//     setTimeout(() => {
//       resolve(r + 1)
//     },2000)
//   })
// }).then(r => {
//   console.log(r)
// })

function MyPromise(fn) {
  let callbackFn = []
  let result = null
  let status = 'pedding'
  this.then = function(fullfilledFn) { // 前一个promise的then
    return new MyPromise(function(resolve) { // 后一个新返回的promise
      handle({
        fullfilledFn: fullfilledFn || null,
        resolve: resolve
      })
    })
  }

  function handle(callback) {
    // 如果未决议，塞入回调中
    if (status === 'pedding') {
      callbackFn.push(callback)
      return
    }

    // 根据PromiseA+的规范，如果fullfilled不是一个函数，且promise1执行成功，Promise2必须成功执行并返回相同的值。

    // 让Promise2成功执行，就是调用返回的新promise中的resolve方法，并传递相同的值，这里即result（在promise1的resolve阶段，已经执行了result = asyncReturnValue）
    // 如果已经决议，且then中未注册fullfilled函数，应该将值，带入返回的那个新promise的resovle中，继续传递下去
    if (!callback.fullfilledFn) {
      callback.resolve(result)
      return
    }
    // 如果已经决议，且then中有注册fullfilled函数，执行前一个promise.then中的fullfilled。
    var ret = callback.fullfilledFn(result)
    // 处理的结果，应该传递给新返回的promise的resolve中。
    callback.resolve(ret)
  }

  function resolve(asyncReturnValue) {
    setTimeout(() => {
      result = asyncReturnValue
      status = 'fullfilled'
      callbackFn.forEach(item => {
        item(asyncReturnValue)
      })
    }, 0)
  }
  fn(resolve)
}

window.a = new MyPromise(function(resolve) {
  setTimeout(() => {
    resolve(1)
  }, 2000)
})

window.a
  .then(value => {
    console.log(value)
  })
  .then(value => {
    console.log(value + 1)
  })
```
