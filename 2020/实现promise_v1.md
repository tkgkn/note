# 实现 Promise

实现一个`Promise`。

原生的语法如下

```js
var p = new Promise(function (resolve) {
  resolve(1);
});
p.then(function (val) {
  console.log(val);
});
```

看起来很简单，就是函数有个`then`方法呗。

```js
function miniPromise() {
  return {
    then: (callback) => {
      var value = 1;
      callback(value);
    },
  };
}

miniPromise().then(function (v) {
  console.log(v); // 1
});
```

实现了一个完全只是语法糖的`promise` 😁，并没有什么用。

## 简单实现

1. promise 接收一个函数 fn，创建 promise 时，fn 自动执行，且 fn 接收`resolve`。
2. 函数有个`then`方法，接收一个回调函数，回调函数接收终值。

```js
function MyPromise(fn) {
  var callback = null;
  this.then = function (cb) {
    callback = cb;
  };

  function resolve(value) {
    callback(value);
  }

  fn(resolve);
}

MyPromise(function (resolve) {
  resolve(1);
}).then((value) => {
  console.log(1);
});
```

上面代码执行会报错，`callback`不是一个函数。分析看出`MyPromise`执行时调用了`resolve`方法，里面通过`callback`得到值，但是此时`then`还未调用呢，`callback`是 `null`

所以 我们需要等到`then`注册完`callback`后在调用，可以将`callback`异步执行（下一个事件循环），保证同步注册的`then`函数先触发去注册`callback`。

```js
function MyPromise(fn) {
  var callback = null;
  this.then = function (cb) {
    callback = cb;
  };

  function resolve(value) {
    setTimeout(() => {
      callback(value);
    }, 1);
  }

  fn(resolve);
}

MyPromise(function (resolve) {
  resolve(1);
}).then((value) => {
  console.log(1);
});
```

看起来可以正常跑，只是当`then`异步调用时，发现又不管用了。

## 加入状态机制

我们来引入`promise`的状态机来解决异步注册的问题。

```js
function MyPromise(fn) {
  var state = 'pedding';
  var value;
  var deferred = null;

  // resolve的工作是将状态切换为resolved
  function resolve(newV) {
    state = 'resolved';
    value = newV;
    // 如果resolve时，已经有注册过函数，则执行
    if (deferred) {
      deferred(value);
    }
  }

  // then 注册一个onResolved方法，接收终值
  this.then = function (onResolved) {
    if (state === 'pedding') {
      deferred = onResolved;
    } else {
      onResolved(value);
    }
  };

  fn(resolve);
}
```

上面代码的`deferred`和`onResolved`其实是同一个东西，只不过如果`state`还是`pedding`状态，则`onResolved`需要延迟到`resolve`调用后执行。所以我们可以统一调度调用`deferred`（或者说是`onResolved`）

```js
function MyPromise(fn) {
  var state = 'pedding';
  var value;
  var deferred = null;

  // resolve的工作是将状态切换为resolved
  function resolve(newV) {
    state = 'resolved';
    value = newV;
    // 如果resolve时，已经有注册过函数，则执行
    if (deferred) {
      deferred(value);
    }
  }

  // 统一调度调用onResolved
  function handle(onResolved) {
    if (state === 'pedding') {
      deferred = onResolved;
      return;
    }
    onResolved(value);
  }

  // then 注册一个onResolved方法，接收终值
  this.then = function (onResolved) {
    handle(onResolved);
  };

  fn(resolve);
}
```

这段代码已经实现了`promise`的基本功能。即便是异步`resolve`也可以获取到终值。

```js
var promise = new MyPromise((resolve) => {
  setTimeout(() => {
    resolve(1);
  }, 1000);
});

promise.then((v) => {
  console.log(v);
});
```

## then 返回新的 promise

- `then`方法返回一个`promise`，并接受前一个上一个的`then`返回值作为入参。
- 如果上一个`then`没有注册`resolved`方法，则透传之前的终值。
- 如果上一个`then`有注册`resolved`方法，执行，并将执行结果传递给下一个`then`

我们先看下原生的效果

```js
var p = new Promise((resolve) => {
  setTimeout(() => {
    resolve(1);
  }, 1000);
});

// then 返回新的promise。因为可以链式调用then。
// 链式的then并非之前的promise，而是新的promise
p.then()
  .then()
  .then((v) => {
    console.log(v); // 前2个then没有获取到终值，透传终值1
  });

p.then((v) => {
  return v + 1;
}).then((v) => {
  console.log(v); // 2
});
```

> **注意**：上面 2 个调用有个很有意思的地方，透传的有 3 个 then，非直接透传的有 2 个 then，打印结果，先 2，后 1。因为透传的多了一层 then

现在我们来改造`MyPromise`

1. `then`可能注册了`onResolved`，也可能没有，没有则需要透传终值，要改状态

```js
function MyPromise(fn) {
  var state = 'pedding';
  var value;
  var deferred = null;

  // resolve的工作是将状态切换为resolved
  function resolve(newV) {
    state = 'resolved';
    value = newV;
    // 改造4：deferred在改造3中已经是个对象了，这个对象就交给handle来处理就行了
    if (deferred) {
      handle(deferred);
    }
  }

  // 统一调度调用onResolved
  // 改造3：接收的是个对象了，所以要改
  function handle(handler) {
    if (state === 'pedding') {
      deferred = handler;
      return;
    }
    var handledValue = value;
    // 如果有上个then注册的onResolved方法，则调用，获取到处理后的终值
    if (handler.onResolved) {
      handledValue = handler.onResolved(handledValue);
    }
    // 将处理过或默认的终值传递给能够确定终值和状态的resolve
    handler.resolve(handledValue);
  }

  // then 注册一个onResolved方法，接收终值
  this.then = function (onResolved) {
    // 改造1： 返回一个promise，promise接收resolve函数，用于改变这个返回的新promise的状态，并更改其终值。
    return new MyPromise((resolve) => {
      // 改造2：如果onResolved（前一个promise.then注册的处理终值的方法）存在，需要调用，获取到处理后的终值给到这个新的promise。如果onResolved没有，需要透传，透传则调用resolve这个方法（就是function resolve）方法啦！
      // 因为我们有个handle方法统一调度onResolved或deferred。我们还是交给它来调度。要改造下handle了。
      handle({
        onResolved,
        resolve,
      });
    });
  };

  fn(resolve);
}
```

我们来调用试试。

```js
var p1 = new MyPromise((resolve) => {
  setTimeout(() => {
    resolve(1);
  }, 1000);
});

p1.then()
  .then()
  .then()
  .then((v) => {
    console.log(v); // 1
  });

var p2 = new MyPromise((resolve) => {
  setTimeout(() => {
    resolve(1);
  }, 1000);
});

p2.then((v) => {
  return v + 1;
}).then((v) => {
  console.log(v); // 2
});
```

> **注意**打印顺序是 1，2，并非原生的 2，1。因为我们模拟的函数里并没有让 then 异步处理，而是同步的。

## 如果 then 返回的是 promise

上面的链式调用，只处理了普通的终值，如果终值本身就是`promise`的话，我们就需要在`then`中对终值在进行`then`的写法，嵌套会越来越深。如：

```js
p.then(promise1 => {
  promise1.then(promise2 => {
    promise2.then(promise3 => {
      promise3.then(...)
    })
  })
})
```

看看原生是怎么处理的。

```js
var time = [];
var p = new Promise((resolve) => {
  time.push(Date.now());
  setTimeout(() => {
    resolve(1);
  }, 1000);
});

p.then(
  () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(2);
      }, 2000);
    })
).then((v) => {
  time.push(Date.now());
  console.log(v, time[1] - time[0]); // 2 3000
});
```

原生的 `promise.then`返回的如果是新的`promise`，则后续的链都是以这个新的`promise`的`resolved`后的终值来传递了，跟最开始的旧`promise`无关了。
所以我们要对`then`返回的是`promise`做个判断处理，如果`then`返回的是一个`promise`，等待其`resolved`后，传递它的终值。

因为无论有没有上一个`promise`注册的`onResolved`方法，最终都会走`resolve`来确定新`promise`的状态和终值，我们就在`resolve`做判断处理就好了。

```js
function MyPromise(fn) {
  var state = 'pedding';
  var value;
  var deferred = null;

  // resolve的工作是将状态切换为resolved
  function resolve(newV) {
    // 改造5：如果接收到的终值是一个promise，则调用其then方法，终止旧的promise，开启基于返回的新的promise进行传递
    if (newV && typeof newV.then === 'function') {
      newV.then(resolve);
      return;
    }

    state = 'resolved';
    value = newV;
    // 改造4：deferred在改造3中已经是个对象了，这个对象就交给handle来处理就行了
    if (deferred) {
      handle(deferred);
    }
  }

  // 统一调度调用onResolved
  // 改造3：接收的是个对象了，所以要改
  function handle(handler) {
    if (state === 'pedding') {
      deferred = handler;
      return;
    }
    var handledValue = value;
    // 如果有上个then注册的onResolved方法，则调用，获取到处理后的终值
    if (handler.onResolved) {
      handledValue = handler.onResolved(handledValue);
    }
    // 将处理过或默认的终值传递给能够确定终值和状态的resolve
    handler.resolve(handledValue);
  }

  // then 注册一个onResolved方法，接收终值
  this.then = function (onResolved) {
    // 改造1： 返回一个promise，promise接收resolve函数，用于改变这个返回的新promise的状态，并更改其终值。
    return new MyPromise((resolve) => {
      // 改造2：如果onResolved（前一个promise.then注册的处理终值的方法）存在，需要调用，获取到处理后的终值给到这个新的promise。如果onResolved没有，需要透传，透传则调用resolve这个方法（就是function resolve）方法啦！
      // 因为我们有个handle方法统一调度onResolved或deferred。我们还是交给它来调度。要改造下handle了。
      handle({
        onResolved,
        resolve,
      });
    });
  };

  fn(resolve);
}
```

测试看看

```js
var time = [];
var p = new MyPromise((resolve) => {
  time.push(Date.now());
  setTimeout(() => {
    resolve(1);
  }, 1000);
});

p.then(
  () =>
    new MyPromise((resolve) => {
      setTimeout(() => {
        resolve(2);
      }, 2000);
    })
).then((v) => {
  time.push(Date.now());
  console.log(v, time[1] - time[0]); // 2 3009
});
```

## 处理错误

`promise`的异常处理`rejected`，我们来加上。

先看原生的用法

```js
var p = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(new Error('is a error'));
  });
});

p.then(
  (v) => {},
  (err) => {
    console.log(err); // 捕获异常打印
  }
);
```

我们看到，初始化时加入了`reject`函数，接收一个`Error`类型的值。在`then`中第二个参数，来接收该错误，处理。

```js
function MyPromise(fn) {
  var state = 'pedding';
  var value;
  var deferred = null;

  function resolve(newV) {
    if (newV && typeof newV.then === 'function') {
      newV.then(resolve);
      return;
    }

    state = 'resolved';
    value = newV;
    if (deferred) {
      handle(deferred);
    }
  }

  // 改造1：增加reject函数，将状态变为 rejected。
  function reject(err) {
    state = 'rejected';
    value = err;

    if (deferred) {
      handle(deferred);
    }
  }

  function handle(handler) {
    if (state === 'pedding') {
      deferred = handler;
      return;
    }

    var handledValue = value;

    // 改造6：handler比之前多了onRejected和reject，根据state状态调用对应的then处理函数
    var handleCallback;

    if (state === 'resolved') {
      handleCallback = handler.onResolved;
    } else if (state === 'rejected') {
      handleCallback = handler.onRejected;
    }

    if (handleCallback) {
      handledValue = handleCallback(handledValue);
    }

    handler.resolve(handledValue);
  }

  // 改造4：then方法接收第二个参数处理error
  this.then = function (onResolved, onRejected) {
    return new MyPromise((resolve) => {
      handle({
        onResolved,
        resolve,
        // 改造5：将上一个处理异常的onRejected和当前reject交给handle来统一调度
        onRejected,
        reject,
      });
    });
  };
  //改造3：接收第二个参数reject
  fn(resolve, reject);
}
```

测试下

```js
var p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    reject(new Error('hello'));
  }, 1000);
});

p.then(
  (v) => {
    console.log('succ', v);
  },
  (err) => {
    console.log('fail', err); // fail Error: hello
  }
);
```

## promise.catch

平时捕获异常用的最多的应该还是`promise.catch`。

我们来看下原生的用法

```js
// 已知错误
var p = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('123');
  }, 1000);
});

p.then().catch((err) => {
  console.log(err); // 123
});

// 未知错误，通常在resolve执行中，或then的onResolved出错，我们也应该捕获。

var p2 = new Promise((resolve) => {
  resolve(a);
});
```

尝试实现下

```js
function MyPromise(fn) {
  var state = 'pedding';
  var value;
  // 改造5：标志符，用来控制实例化promise时有无注册catch来控制抛错还是用catch(实际上就是then中的onResovled)处理
  var catcher = null;
  var deferred = null;

  function resolve(newV) {
    // 改造1：捕获resolve可能出现的问题
    try {
      if (newV && typeof newV.then === 'function') {
        newV.then(resolve);
        return;
      }

      state = 'resolved';
      value = newV;
      if (deferred) {
        handle(deferred);
      }
    } catch (err) {
      reject(err);
    }
  }

  function reject(err) {
    state = 'rejected';
    value = err;

    if (deferred) {
      handle(deferred);
    } else {
      setTimeout(() => {
        if (!catcher) {
          throw value;
        }
      }, 0);
    }
  }

  function handle(handler) {
    if (state === 'pedding') {
      deferred = handler;
      return;
    }

    // 改造3：因为promise是异步的，所有操作需要异步处理
    var handledValue = value;

    var handleCallback;
    // 改造2：捕获handle传入的处理函数时可能出现的问题
    try {
      if (state === 'resolved') {
        handleCallback = handler.onResolved;
      } else if (state === 'rejected') {
        handleCallback = handler.onRejected;
      }
      if (handleCallback) {
        handledValue = handleCallback(handledValue);
      }
    } catch (err) {
      handler.reject(err);
    }

    handler.resolve(handledValue);
  }

  this.then = function (onResolved, onRejected) {
    return new MyPromise((resolve) => {
      handle({
        onResolved,
        resolve,
        onRejected,
        reject,
      });
    });
  };

  // catch方法也会返回一个promise，实际上就等于then方法第一个参数不传，第二个参数处理err
  this.catch = function (fn) {
    // 如果注册了catch，则异常交给catch来做
    catcher = true;
    // 注册catch
    this.then(null, fn);
  };

  // 改造4：初始化promise时也可能出错，若出错，直接调用reject
  try {
    fn(resolve, reject);
  } catch (err) {
    reject(err);
  }
}
```

## promise 需要异步

PromiseA+规范要求解决程序，也就是 resolve 和 reject 的执行都是异步的。

所以我们需要对`handle`函数做异步调用，我们使用`setTimeout`模拟。

```js
function MyPromise(fn) {
  var state = 'pedding';
  var value;
  var catcher = null;
  var deferred = null;

  function resolve(newV) {
    try {
      if (newV && typeof newV.then === 'function') {
        newV.then(resolve);
        return;
      }

      state = 'resolved';
      value = newV;
      if (deferred) {
        handle(deferred);
      }
    } catch (err) {
      reject(err);
    }
  }

  function reject(err) {
    state = 'rejected';
    value = err;

    if (deferred) {
      handle(deferred);
    } else {
      setTimeout(() => {
        if (!catcher) {
          throw value;
        }
      }, 0);
    }
  }

  function handle(handler) {
    if (state === 'pedding') {
      deferred = handler;
      return;
    }

    // 改造：因为promise是异步的，所有操作需要异步处理
    setTimeout(() => {
      var handledValue = value;

      var handleCallback;
      try {
        if (state === 'resolved') {
          handleCallback = handler.onResolved;
        } else if (state === 'rejected') {
          handleCallback = handler.onRejected;
        }
        if (handleCallback) {
          handledValue = handleCallback(handledValue);
        }
      } catch (err) {
        handler.reject(err);
      }
      handler.resolve(handledValue);
    }, 0);
  }

  this.then = function (onResolved, onRejected) {
    return new MyPromise((resolve) => {
      handle({
        onResolved,
        resolve,
        onRejected,
        reject,
      });
    });
  };

  this.catch = function (fn) {
    catcher = true;
    this.then(null, fn);
  };

  try {
    fn(resolve, reject);
  } catch (err) {
    reject(err);
  }
}
```

## Promise.all 方法

- 接收一个数组，数组成员都是`promise`。
- 数组中所有的`promise`都`resolved`，整体才能`resolve`，否则`reject`掉第一个出错的数组成员`promise`。
- 该函数返回一个新的`promise`，终值是所有数组成员的终值构成的数组。

```js
MyPromise.all = function (arr) {
  var resArr = [];
  return new MyPromise((resolve, reject) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i]
        .then((r) => {
          resArr.push(r);
        })
        .catch((err) => {
          reject(err);
        });
    }
    resolve(resArr);
  });
};
```

# 总结

这个版本的实现虽然可以达到`promise`基本的功能，但是思路有点绕。

而且有个`bug`，未实现`catch`和`onRejected`函数的话，不会抛错，内部逻辑里`handle`函数判断已经`reject`了，不在会设置`deferred`，导致静默报错了。
