# Promise 模拟实现版本 2

上一次实现的`Promise`思路比较绕，不容易理解。参考市面上大部分的实现方式，自己实现了一把。

## 原生

```js
// 接收一个函数，函数接受2个回调函数，resolve 和 reject
var p = new Promise((resolve, reject) => {
  // ...
  // promise初始状态为pending
  // 两种结果只能选其一，修改状态，并传递值或错误
  // resolve(value) 状态 -> resolved
  // or
  // reject(error) 状态 -> rejected
});

// 异步或同步注册then函数，函数接受2个回调，一个是resolved的value，一个是rejected的err
p.then(onResolved, onRejected);

// then可以多次调用，也就是多次注册2个回调，一旦promise决议，状态不在改变
p.then();
```

## 先搭架子

```js
// 常量定义状态
const PENDING = 'pending';
const RESOLVED = 'resolved';
const REJECTED = 'rejected';

// promise构造函数，接收一个函数fn，fn接收resolve 和 reject
function MyPromise(fn) {
  // 初始状态
  var state = 'pending';
  // 终值
  var finalValue = null;
  // 收集then中注册的第一个函数，fullfilled
  var onFulfilledCallback = [];
  // 收集then中注册的第二个函数，rejected
  var onRejectedCallback = [];

  // 内部实现的resolve
  function resolve(value) {}

  // 内部实现的reject
  function reject(err) {}

  // 实现then方法
  // 因为调用方式是 obj.then，属于实例属性
  // 接收2个参数onFulfilled, onRejected
  this.then = function (onFulfilled, onRejected) {};

  fn(resolve, reject);
}
```

## 填充基本的 promise 功能

实现`resolve`,`reject`,`then`方法。

```js
// 常量定义状态
const PENDING = 'pending';
const RESOLVED = 'resolved';
const REJECTED = 'rejected';

// promise构造函数，接收一个函数fn，fn接收resolve 和 reject
function MyPromise(fn) {
  // 初始状态
  var state = 'pending';
  // 终值
  var finalValue = null;
  // 收集then中注册的第一个函数，fullfilled
  var onFulfilledCallback = [];
  // 收集then中注册的第二个函数，rejected
  var onRejectedCallback = [];

  // 内部实现的resolve
  function resolve(value) {
    // 只有状态为pending时，可以触发
    if (state === PENDING) {
      // 修改状态为 resolved
      state = RESOLVED;
      // 修改该promise终值为调用时传递的值
      finalValue = value;
      // 将收集到的then注册的方法，全部执行一遍
      onFulfilledCallback.forEach((cb) => {
        cb(value);
      });
    }
  }

  // 内部实现的reject
  function reject(err) {
    // 只有状态为pending时，可以触发
    if (state === PENDING) {
      // 修改状态为 rejected
      state = RESOLVED;
      // 修改该promise终值为调用时传递的值
      finalValue = err;
      // 将收集到的then注册的方法，全部执行一遍
      onRejectedCallback.forEach((cb) => {
        cb(err);
      });
    }
  }

  // 实现then方法
  // 因为调用方式是 obj.then，属于实例属性
  // 接收2个参数onFulfilled, onRejected
  this.then = function (onFulfilled, onRejected) {
    // 调用then的时候，如果该promise已经决议了，则执行其注册的回调
    if (state === RESOLVED) {
      onResolved(value);
    }

    if (state === REJECTED) {
      onRejected(value);
    }

    // 继续注册then的参数到各自回调中
    if (state === PENDING) {
      onFulfilledCallback.push(onFulfilled);
      onRejectedCallback.push(onRejected);
    }
  };

  // 执行new promise(fn)中的fn，有可能出错，所以try catch包裹
  try {
    fn(resolve, reject);
  } catch (err) {
    // 出错就就决议这个promise为reject，调用其reject方法
    reject(err);
  }
}
```

## 完善 then

1. `then`方法返回一个新的`promise2`，而`promise2`的终值，取决于上一个`promise`的`then`的返回值，我们来改造`then`
2. `then`方法接收 2 个回调函数，非必传，未传时需要有默认的，因为空`then`可以透传结果。如下

```js
var p = new Promise((resolve) => resolve(1));
p.then()
  .then()
  .then((r) => console.log(r)); // 1
```

```js
this.then = function (onResolved, onRejected) {
  // 判断then注册的是否是函数，否则要提供默认函数，透传结果
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (v) => v;
  onRejected =
    typeof onRejected === 'function'
      ? onRejected
      : (err) => {
          throw err;
        };

  let promise2 = null;
  if (state === RESOLVED) {
    promise2 = new MyPromise((resolve, reject) => {
      // 因为执行onResolved的函数可能会出错，所以try包裹
      try {
        // 拿到前一个promise的then中第一个参数（onResolved）执行后的结果，这里用x表示。
        const x = onResolved(value);
        // 如果x是一个x-promise，则我们需要用这个x-promise的终值作为promise2的终值
        if (x instanceof MyPromise) {
          // 这里传递给x.then的 onFulfilled函数，是 promise2的 resolve，如果x-promise决议了，就会去调用promise2的resolve，从而决定了promise2的终值。
          x.then(resolve, reject);
        } else {
          // 如果x不是我们的MyPromise实例，则直接调用promise2的resolve，决议即可。
          resolve(x);
        }
      } catch (err) {
        reject(err);
      }
    });
    // 返回promise2
    return promise2;
  }

  if (state === REJECTED) {
    promise2 = new MyPromise((resolve, reject) => {
      // 这里解析的道理与上面一样。
      try {
        const x = onRejected(value);
        if (x instanceof MyPromise) {
          x.then(resolve, reject);
        }
      } catch (err) {
        reject(err);
      }
    });
    return promise2;
  }

  // 继续注册then的参数到各自回调中
  if (state === PENDING) {
    // promise1还未决议，不清楚是执行resolve还是reject，所以，将回调函数插入对应数组
    promise2 = new MyPromise((resolve, reject) => {
      // 将promise1的then方法注册的函数插入
      // then的第一个参数：(res) => {}
      onFulfilledCallback.push(function (value) {
        try {
          var x = onResolved(value);
          if (x instanceof Promise) {
            x.then(resolve, reject);
          } else {
            // 如果x不是我们的MyPromise实例，则直接调用promise2的resolve，决议即可。
            resolve(x);
          }
        } catch (err) {
          reject(err);
        }
      });
      // then的第二个参数 (err) => {}
      onRejectedCallback.push(function (reason) {
        try {
          var x = onRejected(reason);
          if (x instanceof Promise) {
            x.then(resolve, reject);
          }
        } catch (err) {
          reject(err);
        }
      });
    });
    return promise2;
  }
};
```

## 实现 catch

实现了`then`后，再实现`catch`会很简单，`catch`实际上就是`then(null, onRejected)`，第一个参数不处理。

看看原生的实现方式

```js
var p = new Promise((resolve, reject) => {
  reject(new Error('this is error'));
});

p.catch((err) => {
  console.log(err); // 打印Error
});
```

```js
// 接收一个处理错误的方法，方法接收一个reason
this.catch = function (fn) {
  this.then(null, fn);
};
```

## 实现 Promise.all

看看原生的实现

```js
var p1 = new Promise((resolve) => resolve(1));
var p2 = new Promise((resolve) => resolve(2));

Promise.all([p1, p2]).then((res) => {
  console.log(res); // [1,2]
});

// 如果有rejected掉的，则整个promise rejected掉
var p3 = new Promise((resolve, reject) => {
  reject(new Error('this is error'));
});

Promise.all([p1, p2, p3])
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err); // Error: this is error
  });
```

从原生的实现我们得知，`Promise.all`做的事有这些：

- 返回一个 `promise`
- 接收一个数组，数组成员都是`promise`
- 如果全部成员`resolved`，则返回一个数组，数组中每一项是每个成员的`resolved`的终值
- 如果有一个成员`rejected`，则整个`promise`被`rejected`掉。

```js
MyPromise.all = function (promises) {
  // 返回一个promise
  return new MyPromise((resolve, reject) => {
    // 存放每个成员的终值
    const res = [];
    // 循环执行每个成员
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(
        (r) => {
          // 如果成功resolved了，就往终值数组里塞入终值
          res.push(r);
          // 当终值数组长度和传入的promise长度相等，则可以resolved整个大promise，终值就是终值数组
          if (res.length === promises.length) {
            resolve(res);
          }
        },
        (err) => {
          reject(err);
        }
      );
      // 原本尝试用catch来捕获错误，不行
      // 原因：catch通过then模拟的，比then中的第二个参数执行，慢。因为setTimeout插入macro的时机关系。
    }
    // 原本将resolve放到这里执行，不行。
    // 原因：因为所有异步通过setTimeout来实现，for循环结束了，立马就执行resolve了，在reject之前执行，导致整个promise是resolved的状态
    // resolve(res)
  });
};
```

# 总结

该版本的 promise 整体较为容易理解，真正的模拟实现，还应该根据`PromiseA+`规范约定的，处理各个`promise`实现的兼容，这里就不做分析了，网上有很多。

至于`race`等方法，其实跟`all`差不多了，只要有一个`resolved`或`rejected`了，整体就决议了，感兴趣的读者，自己尝试下。
